import { DecoratorNode, LexicalNode, NodeKey, SerializedLexicalNode, Spread } from "lexical";
import { JSX, ReactNode } from "react";
import RadioOptionComponent from "./RadioOptionComponent";

type SerializedRadioOptionNode = Spread<{
    label: string;
    options: string[];
    allowOther: boolean;
    required: boolean;
}, SerializedLexicalNode>

export class RadioOptionNode extends DecoratorNode<ReactNode> {
    __label: string;
    __options: string[];
    __allowOther: boolean;
    __required: boolean;

    static getType(): string {
        return 'radio-option';
    }

    static clone(node: RadioOptionNode): RadioOptionNode {
        return new RadioOptionNode(node.__label, node.__options, node.__allowOther, node.__required, node.__key);
    }

    constructor(label: string, options: string[], allowOther: boolean = false, required: boolean = false, key?: NodeKey) {
        super(key);
        this.__label = label;
        this.__options = options;
        this.__allowOther = allowOther;
        this.__required = required;
    }

    setLabel(label: string): RadioOptionNode {
        const self = this.getWritable();
        self.__label = label;
        return self;
    }

    setOptions(options: string[]): RadioOptionNode {
        const self = this.getWritable();
        self.__options = options;
        return self;
    }

    setAllowOther(allowOther: boolean): RadioOptionNode {
        const self = this.getWritable();
        self.__allowOther = allowOther;
        return self;
    }

    setRequired(required: boolean): RadioOptionNode {
        const self = this.getWritable();
        self.__required = required;
        return self;
    }

    exportJSON(): SerializedRadioOptionNode {
        return {
            ...super.exportJSON(),
            label: this.__label,
            options: this.__options,
            allowOther: this.__allowOther,
            required: this.__required,
        };
    }

    static importJSON(serializedNode: SerializedRadioOptionNode): RadioOptionNode {
        return $createRadioOptionNode(serializedNode.label, serializedNode.options, serializedNode.allowOther, serializedNode.required);
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
        return <RadioOptionComponent nodeKey={this.__key} label={this.__label} options={this.__options} allowOther={this.__allowOther} required={this.__required} />;
    }
}


export function $createRadioOptionNode(label: string, options: string[], allowOther: boolean = false, required: boolean = false): RadioOptionNode {
    return new RadioOptionNode(label, options, allowOther, required);
}

export function $isRadioOptionNode(node: LexicalNode | null | undefined): node is RadioOptionNode {
    return node instanceof RadioOptionNode;
}