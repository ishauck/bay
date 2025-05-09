import { LexicalEditorConfig } from "@/constants/lexical/lexical.server";
import { createEditor, EditorState } from "lexical";

export function validateLexicalState(value: string) {
  let failed = false;
  const editor = createEditor({
    ...LexicalEditorConfig,
    namespace: "validate-lexical-state",
    onError: (error) => {
      console.error(error);
      failed = true;
    },
    editable: false,
    editorState: undefined,
  });

  try {
    editor.parseEditorState(value);
  } catch (error) {
    console.error(error);
    return false;
  }

  return !failed;
}

/**
 * Returns the current editor state as a JSON string.
 * If a value is provided, it will be parsed into the editor first.
 */
export function getLexicalEditorState(value?: string): EditorState {
  const editor = createEditor({
    ...LexicalEditorConfig,
    namespace: "get-lexical-editor-state",
    editable: false,
    editorState: undefined,
    onError: (error) => {
      throw error;
    },
  });
  if (value) {
    editor.setEditorState(editor.parseEditorState(value));
  }
  return editor.getEditorState();
}
