import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect, useRef } from "react";
// import { TextNode } from "lexical"; // removed unused import
import { isSavingAtom } from ".";
import { useAtom } from "jotai";
import { Organization } from "better-auth/plugins/organization";
import { setFormData } from "@/lib/api/form-data";
import { SerializedLexicalState } from "@/types/form-data";
import { toast } from "sonner";

interface EditorAutosaveProps {
    org: Organization;
    formId: string;
}

export default function EditorAutosave({ org, formId }: EditorAutosaveProps) {
    const [editor] = useLexicalComposerContext();
    const [isSaving, setIsSaving] = useAtom(isSavingAtom);
    const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
    const lastSavedState = useRef<string | null>(null);

    useEffect(() => {
        if (!editor || !editor.isEditable()) return;

        const unregister = editor.registerUpdateListener(({ editorState }) => {
            // Debounce save
            if (debounceTimeout.current) {
                clearTimeout(debounceTimeout.current);
            }
            debounceTimeout.current = setTimeout(async () => {
                // Get current state as JSON string
                const json = editorState.toJSON();
                const jsonString = JSON.stringify(json);
                // Avoid saving if state hasn't changed, or if saving is already in progress
                if (lastSavedState.current === jsonString || isSaving) return;
                setIsSaving(true);
                const res = await setFormData(org.id, formId, json as SerializedLexicalState);
                setIsSaving(false);
                if (!res.error) {
                    lastSavedState.current = jsonString;
                } else {
                    toast.error("Failed to save");
                }
            }, 1500);
        });
        return () => {
            if (debounceTimeout.current) {
                clearTimeout(debounceTimeout.current);
            }
            unregister();
        };
    }, [editor, setIsSaving, org, formId, isSaving]);

    return null;
}