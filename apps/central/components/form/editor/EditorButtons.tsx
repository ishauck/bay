import { useAppStore } from "@/components/provider/app-store";
import { Button } from "@/components/ui/button";
import { useAtom } from "jotai";
import { CopyIcon } from "lucide-react";

import { CheckIcon, SaveIcon } from "lucide-react";
import { useCallback, useEffect } from "react";
import { editorAtom } from ".";
import { toast } from "sonner";

export function EditorButtons() {
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
            <Button size="xs" key="save" variant="outline" onClick={() => {
                console.log("Save");
            }}>
                <SaveIcon className="size-4" />
                <span className="sr-only md:not-sr-only">Save</span>
            </Button>,
            <Button size="xs" key="save" onClick={() => {
                console.log("Save");
            }}>
                <CheckIcon className="size-4" />
                <span className="sr-only md:not-sr-only">Publish</span>
            </Button>
        ]);
    }, [getEditorState, setActions]);

    return (
        <div className="flex flex-row gap-2 md:hidden">
            <Button size="xs" variant="outline" onClick={() => {
                console.log("Save");
            }}>
                <SaveIcon className="size-4" />
                <span>Save</span>
            </Button>
            <Button size="xs" onClick={() => {
                console.log("Publish");
            }}>
                <CheckIcon className="size-4" />
                <span>Publish</span>
            </Button>
        </div>
    )
}