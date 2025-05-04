import { useAppStore } from "@/components/provider/app-store";
import { Button } from "@/components/ui/button";
import { useAtom } from "jotai";
import { CopyIcon } from "lucide-react";
import { useCallback, useEffect } from "react";
import { editorAtom } from ".";
import { toast } from "sonner";
import { Organization } from "better-auth/plugins";
import { SaveButton } from "./SaveButton";
import { PreviewButton } from "./PreviewButton";
import { PublishButton } from "./PublishButton";

interface Props {
    org: Organization;
    formId: string;
}

export function EditorButtons({ org, formId }: Props) {
    const setActions = useAppStore((state) => state.setActions);
    const [editor] = useAtom(editorAtom);

    const getEditorState = useCallback(() => {
        if (!editor) return null;
        return editor.getEditorState().toJSON();
    }, [editor]);

    useEffect(() => {
        setActions([
            <Button
                className="size-7.5"
                key="copy"
                variant="ghost"
                onClick={async () => {
                    const json = getEditorState();
                    if (!json) return;
                    try {
                        await navigator.clipboard.writeText(JSON.stringify(json));
                        toast.success("Copied to clipboard");
                    } catch {
                        toast.error("Failed to copy");
                    }
                }}
                aria-label="Copy JSON"
            >
                <CopyIcon className="size-4" />
                <span className="sr-only">Copy JSON</span>
            </Button>,
            <PreviewButton key="preview" org={org} formId={formId} />,
            <SaveButton key="save" org={org} formId={formId} />,
            <PublishButton key="publish" />,
        ]);
    }, [getEditorState, setActions, org, formId, editor]);

    return (
        <div className="flex flex-row gap-2 md:hidden">
            <PreviewButton variant="outline" org={org} formId={formId} />
            <SaveButton org={org} formId={formId} />
            <PublishButton />
        </div>
    );
}