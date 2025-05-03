import { LexicalNode, Spread } from "lexical";
import {
    DecoratorBlockNode,
    SerializedDecoratorBlockNode,
} from '@lexical/react/LexicalDecoratorBlockNode';

import { NodeKey } from "lexical";

export type SerializedPageBreakNode = Spread<
    {
        name: string;
        isThankYouPage: boolean;
    },
    SerializedDecoratorBlockNode
>;

export class PageBreakNode extends DecoratorBlockNode {
    __name: string;
    __is_thank_you_page: boolean;

    static getType(): string {
        return 'page-break';
    }

    static clone(node: PageBreakNode): PageBreakNode {
        return new PageBreakNode(node.__is_thank_you_page, node.__name, node.__key);
    }

    constructor(isThankYouPage: boolean = false, name: string = "Untitled Page", key?: NodeKey) {
        super('center', key);
        this.__is_thank_you_page = isThankYouPage;
        this.__name = name;
    }

    createDOM(): HTMLElement {
        return document.createElement('div');
    }

    updateDOM(): false {
        return false;
    }

    static importJSON(serializedNode: SerializedPageBreakNode): PageBreakNode {
        return $createPageBreakNode(serializedNode.isThankYouPage, serializedNode.name).updateFromJSON(
            serializedNode,
        );
    }

    exportJSON(): SerializedPageBreakNode {
        return {
            ...super.exportJSON(),
            name: this.__name,
            isThankYouPage: this.__is_thank_you_page,
        };
    }

    setName(name: string): PageBreakNode {
        const self = this.getWritable();
        self.__name = name;
        return self;
    }

    setIsThankYouPage(isThankYouPage: boolean): PageBreakNode {
        const self = this.getWritable();
        self.__is_thank_you_page = isThankYouPage;
        return self;
    }
}

export function $createPageBreakNode(isThankYouPage: boolean = false, name: string = "Untitled Page"): PageBreakNode {
    return new PageBreakNode(isThankYouPage, name);
}

export function $isPageBreakNode(
    node: LexicalNode | null | undefined,
): node is PageBreakNode {
    return node instanceof PageBreakNode;
} 