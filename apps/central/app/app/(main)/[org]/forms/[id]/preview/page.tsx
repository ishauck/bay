'use client'

import { useForm } from "@/hooks/api/form"
import { useCurrentOrganization } from "@/hooks/use-current-org"
import { useParams, useRouter } from "next/navigation"
import { AlertCircle } from "lucide-react"
import Tilt from "react-parallax-tilt"
import { FormEditor } from "@/components/form/editor"
import { useFormData } from "@/hooks/api/form-data"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useAppStore } from "@/components/provider/app-store"
import { useEffect, useState, useMemo } from "react"
import { FormData } from "@/types/api/form-data"
import { FormPartial } from "@/types/api/forms"
import { Organization } from "better-auth/plugins/organization"
import type { SerializedEditorState, SerializedLexicalNode } from 'lexical'

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
    return (
        <div>
            <FormEditor formData={{ ...formData, questions: pageState }} form={form} organization={organization} editable={false} />
            <div className="flex flex-row gap-4 p-4 justify-center items-center border-t bg-background sticky bottom-0 z-10">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedPage((prev) => Math.max(prev - 1, 0))}
                    disabled={selectedPage === 0}
                >
                    Previous Page
                </Button>
                <span className="mx-2 text-muted-foreground text-sm">
                    {pages[selectedPage]?.name || `Page ${selectedPage + 1}`} ({selectedPage + 1} of {pages.length})
                </span>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedPage((prev) => Math.min(prev + 1, pages.length - 1))}
                    disabled={selectedPage === pages.length - 1}
                >
                    Next Page
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

    const handleUnpreview = () => {
        if (!org.data) return;
        router.push(`/app/${org.data.slug}/forms/${id}`);
    };

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
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
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
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
                <h2>Form not found</h2>
                <p>The form you are looking for does not exist or could not be loaded.</p>
            </div>
        )
    }

    return (
        <FormPagePreviewWithButtons formData={formData} form={form} organization={org.data} />
    )
}