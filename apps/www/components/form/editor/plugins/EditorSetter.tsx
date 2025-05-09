import { useAtom } from "jotai";
import { editorAtom } from "..";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";

export function EditorSetter() {
    const [lexicalEditor] = useLexicalComposerContext();
    const [, setEditor] = useAtom(editorAtom);

    useEffect(() => {
        setEditor(lexicalEditor);
    }, [lexicalEditor, setEditor]);

    return null;
}