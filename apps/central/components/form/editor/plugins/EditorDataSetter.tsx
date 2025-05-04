import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";
import { SerializedLexicalState } from "@/types/form-data";

export function EditorDataSetter({ defaultData }: { defaultData: SerializedLexicalState | null }) {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        if (editor && defaultData) {
            const state = editor.parseEditorState(defaultData);
            editor.update(() => {
                editor.setEditorState(state);
            });
        }
    }, [defaultData, editor]);

    return null;
}