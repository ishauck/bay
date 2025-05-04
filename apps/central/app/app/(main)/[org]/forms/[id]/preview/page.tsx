'use client'

import { useForm } from "@/hooks/api/form"
import { useCurrentOrganization } from "@/hooks/use-current-org"
import { useParams, useRouter } from "next/navigation"
import { AlertCircle } from "lucide-react"
import Tilt from "react-parallax-tilt"
import { FormEditor } from "@/components/form/editor"
import { useFormData } from "@/hooks/api/form-data"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, Check } from "lucide-react"
import { useAppStore } from "@/components/provider/app-store"
import { useEffect, useMemo, useCallback, useRef } from "react"
import { FormData } from "@/types/form-data"
import { FormPartial } from "@/types/forms"
import { Organization } from "better-auth/plugins/organization"
import type { SerializedEditorState, SerializedLexicalNode } from 'lexical'
import { cn } from "@/lib/utils"
import { FormResponseStoreProvider, useFormResponseStore } from "@/components/provider/form-response-store"
import { useSubmitForm } from "@/hooks/use-sumbit-form"
import { toast } from "sonner"
import { atom, useAtom } from "jotai"
import { FIELD_TYPES } from "@/constants/lexical/shared"
import { BaseSerializedFieldNode } from "@/components/form/editor/plugins/types"
// Utility to split Lexical state into pages
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
            // Start a new page
            pages.push(currentPage);
            currentPage = { name: node.name || `Page ${pages.length + 1}`, nodes: [] };
        } else {
            currentPage.nodes.push(node);
        }
    }
    pages.push(currentPage); // push last page
    return pages;
}

// Utility to recursively flatten all nodes in a tree
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

interface FormPagePreviewWithButtonsProps {
    formData: FormData;
    form: FormPartial;
    organization: Organization;
}

export const selectedPageAtom = atom(0);

function FormPagePreviewWithButtons({ formData, form, organization }: FormPagePreviewWithButtonsProps) {
    const [selectedPage, setSelectedPage] = useAtom(selectedPageAtom);
    const containerRef = useRef<HTMLDivElement>(null);
    const pages = useMemo(() => splitLexicalStateIntoPages(formData.questions), [formData]);
    const { isSubmitting, submitForm } = useSubmitForm();
    const clearRequired = useFormResponseStore((state) => state.clearRequired);
    const markRequired = useFormResponseStore((state) => state.markRequired);
    const requiredQuestions = useFormResponseStore((state) => state.requiredQuestions);
    const response = useFormResponseStore((state) => state.response);
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

    // Create a Lexical state for the selected page
    const pageState = useMemo(() => {
        if (!pages[selectedPage]) return null;
        return {
            root: {
                ...formData.questions.root,
                children: pages[selectedPage].nodes,
            },
        };
    }, [pages, selectedPage, formData]);

    // Scroll to top helper
    const scrollToTop = useCallback(() => {
        if (containerRef.current) {
            containerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, []);

    useEffect(() => {
        scrollToTop();
    }, [scrollToTop, selectedPage]);

    return (
        <div ref={containerRef} className="flex flex-col h-full w-full overflow-y-auto overscroll-contain">
            <FormEditor
                customHeader={(
                    <div className="flex flex-col w-full">
                        <h1 className="text-3xl md:text-4xl font-bold">{form.name}</h1>
                        <h2 className="text-lg md:text-xl font-medium">{pages[selectedPage].name}</h2>
                        {/* <CopyResponse key="copy-response" /> */}
                    </div>
                )}
                formData={{ ...formData, questions: pageState }}
                form={form}
                organization={organization}
                editable={false}
            />
            <div className="flex flex-row w-full justify-between items-center p-4">
                <Button
                    onClick={() => {
                        scrollToTop();
                        setSelectedPage((prev) => Math.max(prev - 1, 0));
                    }}
                    disabled={selectedPage === 0 || isSubmitting}
                >
                    <ArrowLeft className="size-4 mr-2" />
                    Previous Page
                </Button>
                <div className="hidden md:flex flex-row items-center gap-2">
                    {pages.map((page, index) => (
                        <div key={index} className="flex flex-row items-center gap-2">
                            <Button
                                variant="custom"
                                size="iconXs"
                                data-selected={selectedPage === index}
                                disabled={isSubmitting}
                                className={cn(
                                    "rounded-full size-3 bg-muted text-muted-foreground cursor-pointer hover:bg-muted-foreground hover:text-background transition-all duration-200",
                                    "data-[selected=true]:bg-primary data-[selected=true]:text-primary-foreground disabled:opacity-50"
                                )}
                                onClick={() => {
                                    scrollToTop();
                                    setSelectedPage(index);
                                }}
                            >
                                <span className="sr-only">{page.name}</span>
                            </Button>
                        </div>
                    ))}
                </div>
                <Button
                    disabled={isSubmitting}
                    onClick={async () => {
                        if (selectedPage === pages.length - 1) {
                            const completeReqs = requiredQuestions.filter((q) => q.value);
                            // required question ids
                            const reqs = completeReqs.map((q) => q.questionId)
                            // all reqs where responses contain an answer
                            const answeredReqs = reqs.filter((r) => response.some((ar) => ar.questionId === r))
                            const unansweredReqs = reqs.filter((r) => !answeredReqs.includes(r))

                            if (unansweredReqs.length > 0) {
                                const id = unansweredReqs[0];
                                const r = completeReqs.find((q) => q.questionId === id);
                                setSelectedPage(r?.pageIndex ?? 0);
                                toast.error(`There are still required questions that need to be answered.`);
                                return;
                            }

                            const res = await submitForm(form.id);
                            if (res.error) {
                                toast.error(res.error.message);
                            }
                            if (res.data) {
                                router.push(`/forms/${form.id}/complete?org_slug=${organization.slug}&ref=preview&response_id=${res.data.id}&form_id=${form.id}`);
                            }
                        } else {
                            scrollToTop();
                            setSelectedPage((prev) => Math.min(prev + 1, pages.length - 1));
                        }
                    }}
                >
                    {selectedPage === pages.length - 1 ? <Check className="size-4 mr-2" /> : <ArrowRight className="size-4 mr-2" />}
                    {selectedPage === pages.length - 1 ? 'Submit' : 'Next Page'}
                </Button>
            </div>
        </div>
    );
}

export default function FormPage() {
    const params = useParams()
    const org = useCurrentOrganization()
    const id = params.id as string
    const router = useRouter();
    const setActions = useAppStore((state) => state.setActions);
    const { data: form, isLoading, error } = useForm(org.data?.id || "", id)
    const { data: formData, isLoading: formDataLoading, error: formDataError } = useFormData(org.data?.id || "", id)

    const handleUnpreview = useCallback(() => {
        if (!org.data) return;
        router.push(`/app/${org.data.slug}/forms/${id}`);
    }, [org.data, router, id]);

    useEffect(() => {
        if (!org.data) return;
        setActions([
            <Button
                key="unpreview"
                variant="outline"
                size="xs"
                onClick={handleUnpreview}
                aria-label="Back to editor"
            >
                <ArrowLeft className="size-4 mr-2" />
                Back to Editor
            </Button>
        ]);
        return () => setActions([]);
    }, [org.data, handleUnpreview, setActions]);

    if (isLoading || formDataLoading || !org.data) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
                <div className="w-8 h-8 mb-3 border-4 border-solid border-muted-foreground/20 border-t-muted-foreground rounded-full animate-spin" />
                <span>Loading form...</span>
            </div>
        )
    }
    if (error || formDataError || !org.data) {
        console.error(error, formDataError)
        return (
            <div className="flex flex-col items-center justify-center">
                <Tilt
                    perspective={500}
                    glareEnable={true}
                    glareMaxOpacity={0.45}
                    scale={1.02}
                    className="transform-3d rounded-xl p-4 bg-muted overflow-hidden mb-4"
                >
                    <div className="flex items-center gap-2 text-destructive">
                        <AlertCircle className="size-5" />
                        <span>{error?.message || formDataError?.message || 'An unexpected error occurred.'}</span>
                    </div>
                </Tilt>
                <h2>Something went wrong</h2>
            </div>
        )
    }

    if (!form || !formData || !org.data) {
        return (
            <div className="flex flex-col items-center justify-center">
                <h2>Form not found</h2>
                <p>The form you are looking for does not exist or could not be loaded.</p>
            </div>
        )
    }

    return (
        <FormResponseStoreProvider>
            <FormPagePreviewWithButtons formData={formData} form={form} organization={org.data} />
        </FormResponseStoreProvider>
    )
}