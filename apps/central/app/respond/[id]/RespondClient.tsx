"use client";

import { useForm } from "@/hooks/api/form";
import { useCurrentOrganization } from "@/hooks/use-current-org";
import { Loader2, KeyRound, AlertTriangle, HouseIcon, ArrowLeft, ArrowRight, Check } from "lucide-react";
import { FormEditor } from "@/components/form/editor";
import { useFormData } from "@/hooks/api/form-data";
import { Button } from "@/components/ui/button";
import { useEffect, useMemo, useCallback, useRef } from "react";
import { FormData } from "@/types/form-data";
import { FormPartial } from "@/types/forms";
import { Organization } from "better-auth/plugins/organization";
import type { SerializedEditorState, SerializedLexicalNode } from 'lexical';
import { FormResponseStoreProvider, useFormResponseStore } from "@/components/provider/form-response-store";
import { useSubmitForm } from "@/hooks/use-sumbit-form";
import { toast } from "sonner";
import { FIELD_TYPES } from "@/constants/lexical/shared";
import { BaseSerializedFieldNode } from "@/components/form/editor/plugins/types";
import { Response } from "@/types/response";
import useKeybind from "@/hooks/use-keybind";
import Logo from "@/components/logo";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Utility to split Lexical state into pages
// (copied from preview page)
type SerializedPageBreakNode = SerializedLexicalNode & { type: 'page-break'; name?: string };

function isPageBreakNode(node: SerializedLexicalNode): node is SerializedPageBreakNode {
    return !!node && node.type === 'page-break';
}

function splitLexicalStateIntoPages(lexicalState: SerializedEditorState<SerializedLexicalNode>): { name: string; nodes: SerializedLexicalNode[] }[] {
    if (!lexicalState || !lexicalState.root || !Array.isArray(lexicalState.root.children)) return [];
    const pages: { name: string; nodes: SerializedLexicalNode[] }[] = [];
    let currentPage = { name: "About", nodes: [] as SerializedLexicalNode[] };
    for (const node of lexicalState.root.children) {
        if (isPageBreakNode(node)) {
            pages.push(currentPage);
            currentPage = { name: node.name || `Page ${pages.length + 1}`, nodes: [] };
        } else {
            currentPage.nodes.push(node);
        }
    }
    pages.push(currentPage);
    return pages;
}

function isNodeWithChildren(node: SerializedLexicalNode): node is SerializedLexicalNode & { children: SerializedLexicalNode[] } {
    return Array.isArray((node as { children?: unknown }).children);
}

function flattenNodes(nodes: SerializedLexicalNode[]): SerializedLexicalNode[] {
    let result: SerializedLexicalNode[] = [];
    for (const node of nodes) {
        result.push(node);
        if (isNodeWithChildren(node)) {
            result = result.concat(flattenNodes(node.children));
        }
    }
    return result;
}

interface FormPageRespondWithButtonsProps {
    formData: FormData;
    form: FormPartial;
    organization: Organization | null;
}

function FormPageRespondWithButtons({ formData, form, organization }: FormPageRespondWithButtonsProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const pages = useMemo(() => splitLexicalStateIntoPages(formData.questions), [formData]);
    const { isSubmitting, submitForm } = useSubmitForm();
    const clearRequired = useFormResponseStore((state) => state.clearRequired);
    const markRequired = useFormResponseStore((state) => state.markRequired);
    const requiredQuestions = useFormResponseStore((state) => state.requiredQuestions);
    const response = useFormResponseStore((state) => state.response);
    const selectedPage = useFormResponseStore((state) => state.selectedPage);
    const setSelectedPage = useFormResponseStore((state) => state.setSelectedPage);
    const router = useRouter();

    useEffect(() => {
        clearRequired();
        pages.forEach((page, pageIndex) => {
            flattenNodes(page.nodes).forEach((node) => {
                if (FIELD_TYPES.includes(node.type) && node.type !== 'hidden-field') {
                    const typedNode = node as (SerializedLexicalNode & BaseSerializedFieldNode);
                    markRequired(typedNode.questionId, pageIndex, typedNode.required === true);
                }
            });
        });
    }, [pages, clearRequired, markRequired]);

    const handleSubmit = useCallback(async () => {
        const completeReqs = requiredQuestions.filter((q) => q.value);
        const reqs = completeReqs.map((q) => q.questionId);
        const answeredReqs = reqs.filter((r) => response.some((ar) => ar.questionId === r));
        const unansweredReqs = reqs.filter((r) => !answeredReqs.includes(r));

        if (unansweredReqs.length > 0) {
            const id = unansweredReqs[0];
            const r = completeReqs.find((q) => q.questionId === id);
            setSelectedPage(r?.pageIndex ?? 0);
            toast.error(`There are still required questions that need to be answered.`);
            return;
        }

        const schema = Response.safeParse(response);
        if (!schema.success) {
            toast.error(schema.error.issues[0].message + "!");
            return;
        }

        const res = await submitForm(form.id);
        if (res.error) {
            toast.error(res.error.message);
        }
        if (res.data) {
            // Use organization.slug if available, else fallback to "public"
            const orgSlug = organization?.slug || "public";
            router.push(`/forms/${form.id}/complete?org_slug=${orgSlug}&ref=submit&response_id=${res.data.id}&form_id=${form.id}`);
        }
    }, [requiredQuestions, response, submitForm, form.id, setSelectedPage, router, organization]);

    useKeybind('Enter', () => {
        if (selectedPage === pages.length - 1) {
            handleSubmit();
        } else {
            setSelectedPage((prev) => Math.min(prev + 1, pages.length - 1));
        }
    });

    useKeybind('shift+Enter', () => {
        setSelectedPage((prev) => Math.max(prev - 1, 0));
    });

    const pageState = useMemo(() => {
        if (!pages[selectedPage]) return null;
        return {
            root: {
                ...formData.questions.root,
                children: pages[selectedPage].nodes,
            },
        };
    }, [pages, selectedPage, formData]);

    const scrollToTop = useCallback(() => {
        if (containerRef.current) {
            containerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, []);

    useEffect(() => {
        scrollToTop();
    }, [scrollToTop, selectedPage]);

    return (
        <div className="flex flex-col min-h-screen w-full items-center justify-center bg-background p-6">
            <div className="flex-1 h-auto flex flex-col items-center justify-center w-full">
                <div ref={containerRef} className="h-fit w-full flex-1">
                    <FormEditor
                        formData={{ ...formData, questions: pageState }}
                        form={form}
                        organization={organization}
                        editable={false}
                    />
                </div>
            </div>
            <div className="flex flex-row w-full justify-between items-center gap-2">
                <Button
                    onClick={() => {
                        scrollToTop();
                        setSelectedPage((prev) => Math.max(prev - 1, 0));
                    }}
                    disabled={selectedPage === 0 || isSubmitting}
                    className="transition-colors"
                >
                    <ArrowLeft className="size-4 mr-2" />
                    Previous
                </Button>
                <div className="flex flex-1 flex-row items-center gap-2 w-full md:w-auto justify-center text-muted-foreground text-sm">
                    <div>
                        <span className="sr-only">Made with</span>
                        <Logo className="h-4 inline-block" />
                    </div>
                    <Button variant="link" className="text-muted-foreground text-sm" asChild>
                        <Link href={`/report-abuse?id=${form.id}`}>Report Abuse</Link>
                    </Button>
                </div>
                <Button
                    disabled={isSubmitting}
                    onClick={async () => {
                        if (selectedPage === pages.length - 1) {
                            handleSubmit();
                        } else {
                            scrollToTop();
                            setSelectedPage((prev) => Math.min(prev + 1, pages.length - 1));
                        }
                    }}
                    className="transition-colors"
                >
                    {selectedPage === pages.length - 1 ? <Check className="size-4 mr-2" /> : <ArrowRight className="size-4 mr-2" />}
                    {selectedPage === pages.length - 1 ? 'Submit' : 'Next'}
                </Button>
            </div>
        </div>
    );
}

function InactiveErrorState({ message }: { message: string }) {
    return (
        <div className="w-screen h-screen flex items-end md:items-center justify-center bg-gradient-to-b from-gray-50 to-gray-200 dark:from-gray-900 dark:to-gray-800">
            <div className="flex flex-col items-center justify-center gap-4 p-8 bg-white dark:bg-zinc-900 rounded-t-xl md:rounded-xl shadow-2xl max-w-md w-full h-[90%] md:h-auto relative">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-muted">
                    <KeyRound className="text-primary size-10" />
                </div>
                <h1 className="text-2xl font-bold text-primary text-center">This form is not accepting responses</h1>
                <p className="text-sm text-muted-foreground text-center">{message || "The form owner has disabled responses for this form. Please contact them if you think this is a mistake."}</p>
                <Button asChild className="w-full mt-2">
                    <Link href="/">
                        <HouseIcon className="size-4" />
                        Go Home
                    </Link>
                </Button>
                <Separator className="w-full" />
                <p className="text-xs text-muted-foreground text-center font-medium">
                    Created with <Link href="/" target="_blank" rel="noopener noreferrer"><Logo className="h-[0.875rem] inline-block" /></Link>
                </p>
            </div>
        </div>
    );
}

function GenericErrorState({ code, title, message }: { code?: string; title?: string; message?: string }) {
    return (
        <div className="w-screen h-screen flex items-end md:items-center justify-center bg-gradient-to-b from-gray-50 to-gray-200 dark:from-gray-900 dark:to-gray-800">
            <div className="flex flex-col items-center justify-center gap-4 p-8 bg-white dark:bg-zinc-900 rounded-t-xl md:rounded-xl shadow-2xl max-w-md w-full h-[90%] md:h-auto relative">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10">
                    <AlertTriangle className="text-destructive size-10" />
                </div>
                <h1 className="text-2xl font-bold text-destructive text-center">{title || "Something went wrong"}</h1>
                {code && <p className="text-xs font-mono text-muted-foreground">Error code: {code}</p>}
                <p className="text-sm text-muted-foreground text-center">{message || "An unexpected error occurred. Please try again later."}</p>
                <Button asChild className="w-full mt-2">
                    <Link href="/">
                        <HouseIcon className="size-4" />
                        Go Home
                    </Link>
                </Button>
                <Separator className="w-full" />
                <p className="text-xs text-muted-foreground text-center font-medium">
                    Created with <Link href="/" target="_blank" rel="noopener noreferrer"><Logo className="h-[0.875rem] inline-block" /></Link>
                </p>
            </div>
        </div>
    );
}

// Type guard for RestErrorSchema
function isRestErrorSchema(err: unknown): err is { code: string; title: string; message: string } {
    if (typeof err !== 'object' || err === null) return false;
    const obj = err as Record<string, unknown>;
    return (
        typeof obj.code === 'string' &&
        typeof obj.title === 'string' &&
        typeof obj.message === 'string'
    );
}

export default function RespondClient({ id }: { id: string }) {
    const org = useCurrentOrganization();
    const { data: form, isLoading, error } = useForm(org.data?.id || null, id);
    const { data: formData, isLoading: formDataLoading, error: formDataError } = useFormData(org.data?.id || null, id);

    if (isLoading || formDataLoading) {
        return (
            <div className="w-screen h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-200 dark:from-gray-900 dark:to-gray-800">
                <Loader2 className="size-12 text-primary animate-spin mb-6" />
                <span className="text-lg text-muted-foreground font-medium">Loading form…</span>
            </div>
        );
    }

    const err = formDataError || error;
    if (err) {
        if (isRestErrorSchema(err)) {
            if (err.code === 'inactive') {
                return <InactiveErrorState message={err.message} />;
            }
            return <GenericErrorState code={err.code} title={err.title} message={err.message} />;
        }
        // fallback for generic Error
        return <GenericErrorState message={err instanceof Error ? err.message : String(err)} />;
    }

    if (!form || !formData) {
        return (
            <GenericErrorState title="Form not found" message="The form you are looking for does not exist or could not be loaded." />
        );
    }

    return (
        <FormResponseStoreProvider>
            <FormPageRespondWithButtons formData={formData} form={form} organization={org.data ?? null} />
        </FormResponseStoreProvider>
    );
} 