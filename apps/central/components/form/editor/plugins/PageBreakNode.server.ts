import { LexicalNode, Spread } from "lexical";
import {
  SerializedDecoratorBlockNode,
} from "@lexical/react/LexicalDecoratorBlockNode";
import { NodeKey } from "lexical";
import { ServerDecoratorBlockNode } from "@/types/server-block";

export type SerializedPageBreakNode = Spread<
  {
    name: string;
  },
  SerializedDecoratorBlockNode
>;

export class PageBreakNode extends ServerDecoratorBlockNode {
  __name: string;

  static getType(): string {
    return "page-break";
  }

  static clone(node: PageBreakNode): PageBreakNode {
    return new PageBreakNode(node.__name, node.__key);
  }

  constructor(
    name: string = "Untitled Page",
    key?: NodeKey
  ) {
    super("center", key);
    this.__name = name;
  }

  createDOM(): HTMLElement {
    return document.createElement("div");
  }

  updateDOM(): false {
    return false;
  }

  static importJSON(serializedNode: SerializedPageBreakNode): PageBreakNode {
    return $createPageBreakNode(
      serializedNode.name
    ).updateFromJSON(serializedNode);
  }

  exportJSON(): SerializedPageBreakNode {
    return {
      ...super.exportJSON(),
      name: this.__name,
    };
  }

  setName(name: string): PageBreakNode {
    const self = this.getWritable();
    self.__name = name;
    return self;
  }

  decorate(): null {
    return null;
  }
}

export function $createPageBreakNode(
  name: string = "Untitled Page"
): PageBreakNode {
  return new PageBreakNode(name);
}

export function $isPageBreakNode(
  node: LexicalNode | null | undefined
): node is PageBreakNode {
  return node instanceof PageBreakNode;
}
