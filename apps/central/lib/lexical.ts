import { LexicalEditorConfig } from "@/constants";
import { createEditor } from "lexical";

export function validateLexicalState(value: string) {
  let failed = false;
  const editor = createEditor({
    ...LexicalEditorConfig,
    namespace: "validate-lexical-state",
    onError: () => {
      failed = true;
    },
    editorState: undefined,
  });

  try {
    editor.parseEditorState(value);
  } catch {
    return false;
  }

  return !failed;
}
