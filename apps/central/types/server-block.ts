import type {
  ElementFormatType,
  LexicalUpdateJSON,
  NodeKey,
  SerializedLexicalNode,
  Spread,
} from 'lexical';

import { DecoratorNode } from 'lexical';

export type SerializedDecoratorBlockNode = Spread<
  {
    format: ElementFormatType;
  },
  SerializedLexicalNode
>;

export class ServerDecoratorBlockNode extends DecoratorNode<null> {
  __format: ElementFormatType;

  constructor(format?: ElementFormatType, key?: NodeKey) {
    super(key);
    this.__format = format || '';
  }

  exportJSON(): SerializedDecoratorBlockNode {
    return {
      ...super.exportJSON(),
      format: this.__format || '',
    };
  }

  updateFromJSON(
    serializedNode: LexicalUpdateJSON<SerializedDecoratorBlockNode>,
  ): this {
    return super
      .updateFromJSON(serializedNode)
      .setFormat(serializedNode.format || '');
  }

  canIndent(): false {
    return false;
  }

  createDOM(): HTMLElement {
    return document.createElement('div');
  }

  updateDOM(): false {
    return false;
  }

  setFormat(format: ElementFormatType): this {
    const self = this.getWritable();
    self.__format = format;
    return self;
  }

  isInline(): false {
    return false;
  }
}
