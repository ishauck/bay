import { LexicalEditor, LexicalNode } from "lexical";

export type CustomData = {
  key: string;
  metadata: {
    id: string;
    group: string;
    icon: React.ReactNode;
    name: string;
    description?: string;
    onSelect: (editor: LexicalEditor) => LexicalNode | {
      node: LexicalNode;
      atTopLevel?: boolean;
    } | null;
  };
};
