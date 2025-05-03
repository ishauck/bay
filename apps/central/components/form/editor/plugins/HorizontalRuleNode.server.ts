import {
  DecoratorNode,
  LexicalNode,
  SerializedLexicalNode,
  Spread,
} from "lexical";

export type SerializedHorizontalRuleNode = Spread<
  object,
  SerializedLexicalNode
>;

export class HorizontalRuleNode extends DecoratorNode<null> {
  static getType(): string {
    return "horizontalrule";
  }

  static clone(node: HorizontalRuleNode): HorizontalRuleNode {
    return new HorizontalRuleNode(node.__key);
  }

  static importJSON(): HorizontalRuleNode {
    return $createHorizontalRuleNode();
  }

  createDOM(): HTMLElement {
    const hr = document.createElement("hr");
    return hr;
  }

  updateDOM(): false {
    return false;
  }

  exportJSON(): SerializedHorizontalRuleNode {
    return {
      ...super.exportJSON(),
    };
  }
}

export function $createHorizontalRuleNode(): HorizontalRuleNode {
  return new HorizontalRuleNode();
}

export function $isHorizontalRuleNode(
  node: LexicalNode | null | undefined
): node is HorizontalRuleNode {
  return node instanceof HorizontalRuleNode;
}
