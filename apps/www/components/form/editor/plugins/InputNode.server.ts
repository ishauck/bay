import { DecoratorNode, LexicalNode, NodeKey, SerializedLexicalNode, Spread } from "lexical";
import { nanoid } from "nanoid";
import { BaseSerializedFieldNode } from "./types";

type SerializedInputNode = Spread<BaseSerializedFieldNode & {
    label: string;
    placeholder: string;
    inputType: 'short-answer' | 'long-answer' | 'email' | 'phone' | 'number';
}, SerializedLexicalNode>

export class InputNode extends DecoratorNode<null> {
    __label: string;
    __placeholder: string;
    __inputType: 'short-answer' | 'long-answer' | 'email' | 'phone' | 'number';
    __required: boolean;
    __questionId: string;

    static getType(): string {
        return 'input';
    }

    static clone(node: InputNode): InputNode {
        return new InputNode(node.__label, node.__placeholder, node.__inputType, node.__required, node.__questionId, node.__key);
    }

    constructor(label: string, placeholder: string, type: 'short-answer' | 'long-answer' | 'email' | 'phone' | 'number' = 'short-answer', required: boolean = false, questionId?: string, key?: NodeKey) {
        super(key);
        this.__label = label;
        this.__placeholder = placeholder;
        this.__inputType = type;
        this.__required = required;
        this.__questionId = questionId || nanoid();
    }

    setLabel(label: string): InputNode {
        const self = this.getWritable();
        self.__label = label;
        return self;
    }

    setPlaceholder(placeholder: string): InputNode {
        const self = this.getWritable();
        self.__placeholder = placeholder;
        return self;
    }

    setType(type: 'short-answer' | 'long-answer'): InputNode {
        const self = this.getWritable();
        self.__inputType = type;
        return self;
    }

    setRequired(required: boolean): InputNode {
        const self = this.getWritable();
        self.__required = required;
        return self;
    }

    exportJSON(): SerializedInputNode {
        return {
            ...super.exportJSON(),
            label: this.__label,
            placeholder: this.__placeholder,
            inputType: this.__inputType,
            required: this.__required,
            questionId: this.__questionId,
        };
    }

    static importJSON(serializedNode: SerializedInputNode): InputNode {
        return $createInputNode(serializedNode.label, serializedNode.placeholder, serializedNode.inputType, serializedNode.required, serializedNode.questionId);
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

export function $createInputNode(label: string, placeholder: string, type: 'short-answer' | 'long-answer' | 'email' | 'phone' | 'number' = 'short-answer', required: boolean = false, questionId?: string): InputNode {
    return new InputNode(label, placeholder, type, required, questionId);
}

export function $isInputNode(node: LexicalNode | null | undefined): node is InputNode {
    return node instanceof InputNode;
} 