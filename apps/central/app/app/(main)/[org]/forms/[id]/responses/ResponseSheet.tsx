import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { CopyIcon, Info, Download } from "lucide-react";
import { toast } from "sonner";
import type { ResponseMetadata } from "@/types/response";
import { useResponse } from "@/hooks/api/responses";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useFormData } from "@/hooks/api/form-data";
import { FIELD_TYPES } from "@/constants/lexical/shared";
import type { SerializedLexicalNode } from "lexical";
import { Separator } from "@/components/ui/separator";

interface ResponseSheetProps {
    visibleResponse: ResponseMetadata | null;
    orgId: string;
    onClose: () => void;
}

// Utility to recursively flatten all nodes in a tree
function isNodeWithChildren(node: unknown): node is SerializedLexicalNode & { children: SerializedLexicalNode[] } {
    return typeof node === 'object' && node !== null && Array.isArray((node as { children?: unknown }).children);
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

// Type guards for node types
function isInputNode(node: SerializedLexicalNode): node is SerializedLexicalNode & { questionId: string; label: string } {
    return node.type === "input" && typeof (node as unknown as { questionId?: unknown }).questionId === "string";
}
function isRadioOptionNode(node: SerializedLexicalNode): node is SerializedLexicalNode & { questionId: string; label: string } {
    return node.type === "radio-option" && typeof (node as unknown as { questionId?: unknown }).questionId === "string";
}
function isHiddenFieldNode(node: SerializedLexicalNode): node is SerializedLexicalNode & { questionId: string; value: string } {
    return node.type === "hidden-field" && typeof (node as unknown as { questionId?: unknown }).questionId === "string";
}
function isPageBreakNode(node: SerializedLexicalNode): node is SerializedLexicalNode & { questionId: string; label: string } {
    return node.type === "page-break";
}

export function ResponseSheet({ visibleResponse, onClose, orgId }: ResponseSheetProps) {
    const { data: response, isLoading, error } = useResponse(orgId, visibleResponse?.formId ?? "", visibleResponse?.id ?? "");
    const { data: formData } = useFormData(orgId, visibleResponse?.formId ?? "");

    // Extract all question nodes from the form's lexical state
    let questionNodes: SerializedLexicalNode[] = [];
    if (formData && formData.questions && formData.questions.root && Array.isArray(formData.questions.root.children)) {
        questionNodes = flattenNodes(formData.questions.root.children).filter(
            (node) => FIELD_TYPES.includes(node.type)
        );
    }

    // Helper to get the response for a questionId
    function getResponseForQuestion(questionId: string) {
        if (!response || !response.response) return undefined;
        return response.response.find((r: { questionId: string }) => r.questionId === questionId);
    }

    return (
        <Sheet open={!!visibleResponse} onOpenChange={open => { if (!open) onClose(); }}>
            <SheetContent side="right" className="p-0 max-w-lg w-full flex flex-col overflow-y-auto">
                <SheetHeader className="p-4 pb-0 flex-none">
                    <SheetTitle className="flex items-center gap-2">
                        Response
                        <Button variant="ghost" onClick={() => {
                            navigator.clipboard.writeText(visibleResponse?.id ?? "");
                            toast.success("Copied to clipboard");
                        }} size="iconSm">
                            <CopyIcon className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" onClick={() => {
                            if (!response) return;
                            const dataStr = JSON.stringify(response, null, 2);
                            const blob = new Blob([dataStr], { type: "application/json" });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement("a");
                            a.href = url;
                            a.download = `response-${visibleResponse?.id ?? "data"}.json`;
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                            URL.revokeObjectURL(url);
                        }} size="iconSm" title="Download JSON">
                            <Download className="w-4 h-4" />
                        </Button>
                    </SheetTitle>
                </SheetHeader>
                <div className="p-4 pt-0 flex flex-1 flex-col">

                    <ScrollArea className="flex-1 h-full">
                        {isLoading ? (
                            <div className="p-4 text-center text-muted-foreground">Loading...</div>
                        ) : error ? (
                            <div className="p-4 text-center text-destructive flex flex-col items-center">
                                <Info className="mb-2" />
                                Error loading response.
                            </div>
                        ) : questionNodes.length > 0 ? (
                            <div className="flex flex-col gap-6">
                                {questionNodes.map((node, idx) => {
                                    let questionId: string | undefined;
                                    let label: string | undefined;
                                    let answer: React.ReactNode = (
                                        <span className="flex items-center gap-1 text-muted-foreground">
                                            <Info size={14} /> No answer
                                        </span>
                                    );
                                    if (isInputNode(node)) {
                                        questionId = node.questionId;
                                        label = node.label;
                                        const resp = getResponseForQuestion(questionId);
                                        if (resp && typeof resp.response === "string") {
                                            answer = resp.response;
                                        }
                                    } else if (isRadioOptionNode(node)) {
                                        questionId = node.questionId;
                                        label = node.label;
                                        const resp = getResponseForQuestion(questionId);
                                        if (resp && resp.response && typeof resp.response === "object" && resp.response.option) {
                                            answer = resp.response.option;
                                            if (resp.response.otherValue) {
                                                answer = <>{resp.response.option} <span className="italic">(Other: {resp.response.otherValue})</span></>;
                                            }
                                        }
                                    } else if (isHiddenFieldNode(node)) {
                                        questionId = node.questionId;
                                        label = node.value;
                                        const resp = getResponseForQuestion(questionId);
                                        answer = (
                                            <span className="italic text-muted-foreground">
                                                {resp && resp.response
                                                    ? (typeof resp.response === 'string'
                                                        ? resp.response
                                                        : JSON.stringify(resp.response))
                                                    : <span className="flex items-center gap-1 text-muted-foreground"><Info size={14} /> No answer</span>}
                                            </span>
                                        );
                                    }
                                    else if (isPageBreakNode(node)) {
                                        return (
                                            <Separator className="my-2" key={`page-break-${idx}`} />
                                        )
                                    }
                                    if (!questionId) return null;
                                    return (
                                        <div key={questionId + idx} className="flex flex-col gap-1">
                                            <div className="font-semibold text-base">{label || <span className="italic text-muted-foreground">(No label)</span>}</div>
                                            <div className="pl-2">
                                                <div className="bg-muted/40 rounded px-3 py-2 text-muted-foreground break-words">
                                                    {answer}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="p-4 text-center text-muted-foreground">No questions found for this form.</div>
                        )}
                    </ScrollArea>
                </div>
            </SheetContent>
        </Sheet>
    );
} 