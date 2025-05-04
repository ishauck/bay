import { DecoratorNode, LexicalNode, NodeKey, SerializedLexicalNode, Spread } from "lexical";

type SerializedRadioOptionNode = Spread<{
    label: string;
    options: string[];
    allowOther: boolean;
}, SerializedLexicalNode>

export class RadioOptionNode extends DecoratorNode<null> {
    __label: string;
    __options: string[];
    __allowOther: boolean;

    static getType(): string {
        return 'radio-option';
    }

    static clone(node: RadioOptionNode): RadioOptionNode {
        return new RadioOptionNode(node.__label, node.__options, node.__allowOther, node.__key);
    }

    constructor(label: string, options: string[], allowOther: boolean = false, key?: NodeKey) {
        super(key);
        this.__label = label;
        this.__options = options;
        this.__allowOther = allowOther;
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

    exportJSON(): SerializedRadioOptionNode {
        return {
            ...super.exportJSON(),
            label: this.__label,
            options: this.__options,
            allowOther: this.__allowOther,
        };
    }

    static importJSON(serializedNode: SerializedRadioOptionNode): RadioOptionNode {
        return $createRadioOptionNode(serializedNode.label, serializedNode.options, serializedNode.allowOther);
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

export function $createRadioOptionNode(label: string, options: string[], allowOther: boolean = false): RadioOptionNode {
    return new RadioOptionNode(label, options, allowOther);
}

export function $isRadioOptionNode(node: LexicalNode | null | undefined): node is RadioOptionNode {
    return node instanceof RadioOptionNode;
} 