import { DecoratorNode, LexicalNode, NodeKey, SerializedLexicalNode, Spread } from "lexical";

type SerializedHiddenFieldNode = Spread<{
    value: string;
}, SerializedLexicalNode>

export class HiddenFieldNode extends DecoratorNode<null> {
    __value: string;

    static getType(): string {
        return 'hidden-field';
    }

    static clone(node: HiddenFieldNode): HiddenFieldNode {
        return new HiddenFieldNode(node.__value, node.__key);
    }

    constructor(value: string, key?: NodeKey) {
        super(key);
        this.__value = value;
    }

    setValue(value: string): HiddenFieldNode {
        const self = this.getWritable();
        self.__value = value;
        return self;
    }

    exportJSON(): SerializedHiddenFieldNode {
        return {
            ...super.exportJSON(),
            value: this.__value,
        };
    }

    static importJSON(serializedNode: SerializedHiddenFieldNode): HiddenFieldNode {
        return $createHiddenFieldNode(serializedNode.value);
    }

    createDOM(): HTMLElement {
        return document.createElement('div');
    }

    updateDOM(): false {
        return false;
    }

    decorate(): null {
        return null;
    }
}

export function $createHiddenFieldNode(value: string = ''): HiddenFieldNode {
    return new HiddenFieldNode(value);
}

export function $isHiddenFieldNode(node: LexicalNode | null | undefined): node is HiddenFieldNode {
    return node instanceof HiddenFieldNode;
} 