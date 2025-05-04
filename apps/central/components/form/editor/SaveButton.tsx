import { Button } from "@/components/ui/button";
import { useAtom } from "jotai";
import { Loader2, SaveIcon } from "lucide-react";
import { useCallback } from "react";
import { editorAtom, isSavingAtom } from ".";
import { toast } from "sonner";
import { setFormData } from "@/lib/api/form-data";
import { SerializedLexicalState } from "@/types/form-data";
import useKeybind from "@/hooks/use-keybind";
import { Organization } from "better-auth/plugins";
import React from "react";

interface ButtonProps extends React.ComponentProps<typeof Button> {
    org: Organization;
    formId: string;
}


export function SaveButton(props: ButtonProps) {
    const { org, formId, ...buttonProps } = props;
    const [isLoading, setIsLoading] = useAtom(isSavingAtom);
    const [editor] = useAtom(editorAtom);

    const getEditorState = useCallback(() => {
        if (!editor) return null;
        return editor.getEditorState().toJSON();
    }, [editor]);

    const handleSave = useCallback(async () => {
        if (isLoading) return;
        setIsLoading(true);
        const json = getEditorState();
        if (!json) {
            setIsLoading(false);
            return;
        }
        const res = await setFormData(org.id, formId, json as SerializedLexicalState);
        if (res.error) {
            toast.error(res.error.message);
        } else {
            toast.success("Saved");
        }
        setIsLoading(false);
    }, [formId, getEditorState, isLoading, org.id, setIsLoading]);

    useKeybind("cmd+s", handleSave, {
        allowInputs: true,
    });

    return (
        <Button size="xs" variant="outline" onClick={handleSave} disabled={isLoading} aria-label="Save" {...buttonProps}>
            {isLoading ? <Loader2 className="size-4 animate-spin" /> : <SaveIcon className="size-4" />}
            <span>Save</span>
        </Button>
    );
} 