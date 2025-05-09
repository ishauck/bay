import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { HorizontalRuleNode } from "@/components/form/editor/plugins/HorizontalRuleNode.server";
import { InputNode } from "@/components/form/editor/plugins/InputNode.server";
import { HiddenFieldNode } from "@/components/form/editor/plugins/HiddenFieldNode.server";
import { PageBreakNode } from "@/components/form/editor/plugins/PageBreakNode.server";
import { RadioOptionNode } from "@/components/form/editor/plugins/RadioOptionNode.server";

export const TYPES_TO_NODES: Record<
  string,
  typeof HiddenFieldNode | typeof InputNode | typeof RadioOptionNode
> = {
  "hidden-field": HiddenFieldNode,
  "input": InputNode,
  "radio-option": RadioOptionNode,
};

export const LexicalEditorConfig = {
  nodes: [
    HeadingNode,
    QuoteNode,
    HorizontalRuleNode,
    PageBreakNode,
    InputNode,
    HiddenFieldNode,
    RadioOptionNode,
  ],
};