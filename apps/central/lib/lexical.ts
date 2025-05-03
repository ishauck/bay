import { LexicalEditorConfig } from "@/constants/lexical.server";
import { createEditor } from "lexical";

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
