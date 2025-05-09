import { SerializedLexicalState } from "@/types/form-data";
import { $getRoot, createEditor, ElementNode } from "lexical";
import { getLexicalEditorState } from "./server/lexical";
import { EditorState, LexicalNode, RootNode } from "lexical";
import { LexicalEditorConfig } from "@/constants/lexical/lexical.server";

export const ERROR = {
    INVALID_STATE: "invalid-state",
}

export function _getChildren(node: LexicalNode): LexicalNode[] {
    if (node instanceof ElementNode) {
        const children = node.getChildren();
        return children.map((child: LexicalNode) => {
            return _getChildren(child);
        }).flat();
    }
    return [node];
}

export function getChildren(serialized: SerializedLexicalState): {
    error: typeof ERROR[keyof typeof ERROR] | null;
    data: LexicalNode[] | null;
} {
    let state: EditorState;
    
    try {
        state = getLexicalEditorState(serialized);
    } catch {
        return {
            error: ERROR.INVALID_STATE,
            data: null,
        };
    }

    const editor = createEditor({
        ...LexicalEditorConfig,
        namespace: "get-children",
        editable: false,
        editorState: state,
    });

    let root: RootNode | null = null;
    let data: LexicalNode[] | null = null;

    editor.read(() => {
        root = $getRoot();
        data = _getChildren(root);
    })

    if (!root) {
        return {
            error: ERROR.INVALID_STATE,
            data: null,
        };
    }

    return {
        error: null,
        data: data,
    };
}