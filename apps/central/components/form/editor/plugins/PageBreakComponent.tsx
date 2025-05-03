import { Separator } from "@/components/ui/separator";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection';
import { mergeRegister } from "@lexical/utils";
import { $getNodeByKey, COMMAND_PRIORITY_LOW, SELECT_ALL_COMMAND } from "lexical";
import React, { useEffect } from "react";
import { $isPageBreakNode, PageBreakNode } from "./PageBreakNode";


export interface PageBreakProps {
    name: string;
    nodeKey: string;
}

export default function PageBreak({ name, nodeKey }: PageBreakProps) {
    const [editor] = useLexicalComposerContext();

    const isEditable = editor.isEditable();
    const [isSelected, setSelected, clearSelection] =
        useLexicalNodeSelection(nodeKey);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const spanRef = React.useRef<HTMLSpanElement>(null);

    const withPageBreakNode = (
        cb: (node: PageBreakNode) => void,
        onUpdate?: () => void,
    ): void => {
        editor.update(
            () => {
                const node = $getNodeByKey(nodeKey);
                if ($isPageBreakNode(node)) {
                    cb(node);
                }
            },
            { onUpdate },
        );
    };

    useEffect(() => {
        if (!inputRef.current) {
            return;
        }

        return mergeRegister(
            editor.registerCommand<MouseEvent | KeyboardEvent>(
                SELECT_ALL_COMMAND,
                (payload) => {
                    // Handle both keyboard and mouse events
                    if (payload instanceof KeyboardEvent && payload.target === inputRef.current) {
                        if (inputRef.current) {
                            inputRef.current.select();
                        }
                        return true;
                    }

                    // If this is a programmatic SELECT_ALL_COMMAND (no payload)
                    if (!payload) {
                        // Don't select our node if it's already selected
                        if (!isSelected) {
                            setSelected(true);
                        }
                        return false; // Allow other nodes to be selected too
                    }

                    return false;
                },
                COMMAND_PRIORITY_LOW,
            ),
        );
    }, [clearSelection, editor, isSelected, nodeKey, setSelected]);


    React.useEffect(() => {
        if (inputRef.current && spanRef.current) {
            // Add a small buffer to the width for caret and padding
            inputRef.current.style.width = `${spanRef.current.offsetWidth + 8}px`;
        }
    }, [name]);

    return (
        <div data-is-editable={isEditable} className="flex flex-row items-center justify-center group gap-2 my-4">
            {isEditable ? (
                <>
                    <input
                        ref={inputRef}
                        type="text"
                        className="w-fit focus:outline-none text-muted-foreground focus:text-foreground"
                        value={name}
                        maxLength={60}
                        onChange={(e) => {
                            const target = e.target;
                            const value = target.value;
                            const selectionStart = target.selectionStart;
                            const selectionEnd = target.selectionEnd;
                            withPageBreakNode(
                                (node) => {
                                    node.setName(value);
                                },
                                () => {
                                    if (
                                        inputRef.current &&
                                        document.activeElement === inputRef.current &&
                                        selectionStart === selectionEnd
                                    ) {
                                        inputRef.current.selectionStart = selectionStart;
                                        inputRef.current.selectionEnd = selectionEnd;
                                    }
                                }
                            );
                        }}
                        style={{ minWidth: 20 }}
                    />
                    {/* Hidden span to measure text width */}
                    <span
                        ref={spanRef}
                        className="invisible absolute whitespace-pre pointer-events-none"
                        style={{ position: 'absolute', visibility: 'hidden', height: 0, whiteSpace: 'pre', fontSize: 'inherit', fontFamily: 'inherit', fontWeight: 'inherit' }}
                    >
                        {name || ' '}
                    </span>
                </>
            ) : (
                <span className="text-sm text-muted-foreground">{name}</span>
            )}
            <Separator className="flex-1 border-1" />
        </div>
    );
}