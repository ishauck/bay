import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { HorizontalRuleNode } from "@/components/form/editor/plugins/HorizontalRuleNode.server";
import { InputNode } from "@/components/form/editor/plugins/InputNode.server";
import { HiddenFieldNode } from "@/components/form/editor/plugins/HiddenFieldNode.server";
import { PageBreakNode } from "@/components/form/editor/plugins/PageBreakNode.server";

export const LexicalEditorConfig = {
  nodes: [
    HeadingNode,
    QuoteNode,
    HorizontalRuleNode,
    PageBreakNode,
    InputNode,
    HiddenFieldNode,
  ],
}; 