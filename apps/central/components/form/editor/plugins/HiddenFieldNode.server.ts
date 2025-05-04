import { DecoratorNode, LexicalNode, NodeKey, SerializedLexicalNode, Spread } from "lexical";
import { nanoid } from "nanoid";

type SerializedHiddenFieldNode = Spread<{
    value: string;
    questionId: string;
}, SerializedLexicalNode>

export class HiddenFieldNode extends DecoratorNode<null> {
    __value: string;
    __questionId: string;

    static getType(): string {
        return 'hidden-field';
    }

    static clone(node: HiddenFieldNode): HiddenFieldNode {
        return new HiddenFieldNode(node.__value, node.__questionId, node.__key);
    }

    constructor(value: string, questionId?: string, key?: NodeKey) {
        super(key);
        this.__value = value;
        this.__questionId = questionId || nanoid();
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
            questionId: this.__questionId,
        };
    }

    static importJSON(serializedNode: SerializedHiddenFieldNode): HiddenFieldNode {
        return $createHiddenFieldNode(serializedNode.value, serializedNode.questionId);
    }

    createDOM(): HTMLElement {
        const div = document.createElement('div');
        div.classList.add('pointer-events-none');
        return div;
    }

    updateDOM(): false {
        return false;
    }

    decorate(): null {
        return null;
    }
}

export function $createHiddenFieldNode(value: string = '', questionId?: string): HiddenFieldNode {
    return new HiddenFieldNode(value, questionId);
}

export function $isHiddenFieldNode(node: LexicalNode | null | undefined): node is HiddenFieldNode {
    return node instanceof HiddenFieldNode;
} 