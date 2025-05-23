import { DecoratorNode, LexicalNode, NodeKey, SerializedLexicalNode, Spread } from "lexical";
import { JSX, ReactNode } from "react";
import HiddenFieldComponent from "./HiddenFieldComponent";
import { nanoid } from "nanoid";
import { BaseSerializedFieldNode } from "./types";

type SerializedHiddenFieldNode = Spread<BaseSerializedFieldNode & {
    required: false;
    value: string;
}, SerializedLexicalNode>

export class HiddenFieldNode extends DecoratorNode<ReactNode> {
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
            required: false,
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

    decorate(): JSX.Element {
        return <HiddenFieldComponent nodeKey={this.__key} value={this.__value} questionId={this.__questionId} />;
    }
}


export function $createHiddenFieldNode(value: string = '', questionId?: string): HiddenFieldNode {
    return new HiddenFieldNode(value, questionId);
}

export function $isHiddenFieldNode(node: LexicalNode | null | undefined): node is HiddenFieldNode {
    return node instanceof HiddenFieldNode;
}