export type NodeProps<T> = T & {
    questionId: string;
    nodeKey: string;
}

export type BaseSerializedFieldNode = {
    required: boolean;
    questionId: string;
}