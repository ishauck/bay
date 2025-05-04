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
import { useEffect, useState, useMemo, useCallback, useRef } from "react"
import { FormData } from "@/types/api/form-data"
import { FormPartial } from "@/types/api/forms"
import { Organization } from "better-auth/plugins/organization"
import type { SerializedEditorState, SerializedLexicalNode } from 'lexical'
import { cn } from "@/lib/utils"

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

interface FormPagePreviewWithButtonsProps {
    formData: FormData;
    form: FormPartial;
    organization: Organization;
}
function FormPagePreviewWithButtons({ formData, form, organization }: FormPagePreviewWithButtonsProps) {
    const [selectedPage, setSelectedPage] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const pages = useMemo(() => splitLexicalStateIntoPages(formData.questions), [formData]);
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
                    disabled={selectedPage === 0}
                >
                    <ArrowLeft className="size-4 mr-2" />
                    Previous Page
                </Button>
                <div className="flex flex-row items-center gap-2">
                    {pages.map((page, index) => (
                        <div key={index} className="flex flex-row items-center gap-2">
                            <Button
                                variant="custom"
                                size="iconXs"
                                data-selected={selectedPage === index}
                                className={cn(
                                    "rounded-full size-3 bg-muted text-muted-foreground cursor-pointer hover:bg-muted-foreground hover:text-background transition-all duration-200",
                                    "data-[selected=true]:bg-primary data-[selected=true]:text-primary-foreground"
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
                    onClick={() => {
                        scrollToTop();
                        setSelectedPage((prev) => Math.min(prev + 1, pages.length - 1));
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
        <FormPagePreviewWithButtons formData={formData} form={form} organization={org.data} />
    )
}