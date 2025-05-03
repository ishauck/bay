import { useAppStore } from "@/components/provider/app-store";
import { Button } from "@/components/ui/button";
import { useAtom } from "jotai";
import { CopyIcon, Loader2 } from "lucide-react";

import { CheckIcon, SaveIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { editorAtom } from ".";
import { toast } from "sonner";
import { setFormData } from "@/lib/api/form-data";
import { SerializedLexicalState } from "@/types/api/form-data";

interface ButtonProps {
    orgId: string;
    formId: string;
}

function SaveButton({ orgId, formId }: ButtonProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [editor] = useAtom(editorAtom);

    const getEditorState = useCallback(() => {
        if (!editor) return null;
        return editor.getEditorState().toJSON();
    }, [editor]);

    const handleSave = useCallback(async () => {
        setIsLoading(true);
        const json = getEditorState();
        if (!json) return;

        const res = await setFormData(orgId, formId, json as SerializedLexicalState);
        if (res.error) {
            toast.error(res.error.message);
        } else {
            toast.success("Saved");
        }
        setIsLoading(false);
    }, [formId, getEditorState, orgId]);

    return (
        <Button size="xs" variant="outline" onClick={handleSave} disabled={isLoading}>
            {isLoading ? <Loader2 className="size-4 animate-spin" /> : <SaveIcon className="size-4" />}
            <span>Save</span>
        </Button>
    )
}

function PublishButton() {
    const [isLoading, setIsLoading] = useState(false);

    return (
        <Button size="xs" onClick={() => {
            console.log("Publish");
        }}>
            <CheckIcon className="size-4" />
            <span>Publish</span>
        </Button>
    )
}

export function EditorButtons({ orgId, formId }: ButtonProps) {
    const setActions = useAppStore((state) => state.setActions);
    const [editor] = useAtom(editorAtom);

    const getEditorState = useCallback(() => {
        if (!editor) return null;
        return editor.getEditorState().toJSON();
    }, [editor]);

    useEffect(() => {
        setActions([
            <Button className="size-7.5" key="copy" variant="outline" onClick={() => {
                const json = getEditorState();
                console.log(json);
                if (!json) return;
                navigator.clipboard.writeText(JSON.stringify(json));

                toast.success("Copied to clipboard");
            }}>
                <CopyIcon className="size-4" />
                <span className="sr-only">Copy JSON</span>
            </Button>,
            <SaveButton key="save" orgId={orgId} formId={formId} />,
            <PublishButton key="publish" orgId={orgId} formId={formId} />
        ]);
    }, [getEditorState, setActions]);

    return (
        <div className="flex flex-row gap-2 md:hidden">
            <SaveButton orgId={orgId} formId={formId} />
            <PublishButton orgId={orgId} formId={formId} />
        </div>
    )
}