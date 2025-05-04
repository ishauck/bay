import { DecoratorNode, LexicalNode, NodeKey, SerializedLexicalNode, Spread } from "lexical";

type SerializedInputNode = Spread<{
    label: string;
    placeholder: string;
    inputType: 'short-answer' | 'long-answer';
    required: boolean;
}, SerializedLexicalNode>

export class InputNode extends DecoratorNode<null> {
    __label: string;
    __placeholder: string;
    __inputType: 'short-answer' | 'long-answer';
    __required: boolean;

    static getType(): string {
        return 'input';
    }

    static clone(node: InputNode): InputNode {
        return new InputNode(node.__label, node.__placeholder, node.__inputType, node.__required, node.__key);
    }

    constructor(label: string, placeholder: string, type: 'short-answer' | 'long-answer' = 'short-answer', required: boolean = false, key?: NodeKey) {
        super(key);
        this.__label = label;
        this.__placeholder = placeholder;
        this.__inputType = type;
        this.__required = required;
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
        };
    }

    static importJSON(serializedNode: SerializedInputNode): InputNode {
        return $createInputNode(serializedNode.label, serializedNode.placeholder, serializedNode.inputType, serializedNode.required);
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

export function $createInputNode(label: string, placeholder: string, type: 'short-answer' | 'long-answer' = 'short-answer', required: boolean = false): InputNode {
    return new InputNode(label, placeholder, type, required);
}

export function $isInputNode(node: LexicalNode | null | undefined): node is InputNode {
    return node instanceof InputNode;
} 