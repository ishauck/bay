import { DecoratorNode, LexicalNode, NodeKey, SerializedLexicalNode, Spread } from "lexical";
import { JSX, ReactNode } from "react";
import RadioOptionComponent from "./RadioOptionComponent";
import { nanoid } from "nanoid";
import { BaseSerializedFieldNode } from "./types";

type SerializedRadioOptionNode = Spread<BaseSerializedFieldNode & {
    label: string;
    options: string[];
    allowOther: boolean;
}, SerializedLexicalNode>

export class RadioOptionNode extends DecoratorNode<ReactNode> {
    __question_id: string;
    __label: string;
    __options: string[];
    __allowOther: boolean;
    __required: boolean;

    static getType(): string {
        return 'radio-option';
    }

    static clone(node: RadioOptionNode): RadioOptionNode {
        return new RadioOptionNode(node.__label, node.__options, node.__allowOther, node.__required, node.__question_id, node.getKey());
    }

    constructor(label: string, options: string[], allowOther: boolean = false, required: boolean = false, questionId?: string, key?: NodeKey) {
        super(key);
        this.__label = label;
        this.__options = options;
        this.__allowOther = allowOther;
        this.__required = required;
        this.__question_id = questionId || nanoid();
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
            questionId: this.__question_id,
        };
    }

    static importJSON(serializedNode: SerializedRadioOptionNode): RadioOptionNode {
        return $createRadioOptionNode(serializedNode.label, serializedNode.options, serializedNode.allowOther, serializedNode.required, serializedNode.questionId);
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
        return <RadioOptionComponent label={this.__label} options={this.__options} allowOther={this.__allowOther} required={this.__required} questionId={this.__question_id} nodeKey={this.getKey()} />;
    }
}


export function $createRadioOptionNode(label: string, options: string[], allowOther: boolean = false, required: boolean = false, questionId?: string): RadioOptionNode {
    return new RadioOptionNode(label, options, allowOther, required, questionId);
}

export function $isRadioOptionNode(node: LexicalNode | null | undefined): node is RadioOptionNode {
    return node instanceof RadioOptionNode;
}