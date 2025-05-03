'use client'
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getNodeByKey, COMMAND_PRIORITY_LOW, SELECT_ALL_COMMAND } from "lexical";
import { useCallback, useEffect } from "react";
import { mergeRegister } from "@lexical/utils";
import React from "react";
import { $isHiddenFieldNode, HiddenFieldNode } from "./HiddenFieldNode";
import { useLexicalNodeSelection } from "@lexical/react/useLexicalNodeSelection";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { InfoIcon } from "lucide-react";

export default function HiddenFieldComponent({ value, nodeKey }: { value: string, nodeKey: string }) {
    const [editor] = useLexicalComposerContext();
    const isEditable = editor.isEditable();


    const [isSelected, setSelected, clearSelection] =
        useLexicalNodeSelection(nodeKey);
    const inputRef = React.useRef<HTMLInputElement>(null);


    const withHiddenFieldNode = useCallback((
        cb: (node: HiddenFieldNode) => void,
        onUpdate?: () => void,
    ): void => {
        editor.update(
            () => {
                const node = $getNodeByKey(nodeKey);
                if ($isHiddenFieldNode(node)) {
                    cb(node);
                }
            },
            { onUpdate },
        );
    }, [editor, nodeKey]);

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

    if (!isEditable) {
        return null;
    }

    return (
        <div className="flex flex-row items-center justify-between gap-2 my-3">
            <Input
                ref={inputRef}
                value={value}
                maxLength={50}
                placeholder="Enter a search parameter name, e.g. 'utm_source', or 'ref'"
                className="font-mono placeholder:font-sans"
                onChange={(e) => {
                    const target = e.target;
                    const value = target.value;
                    const selectionStart = target.selectionStart;
                    const selectionEnd = target.selectionEnd;
                    withHiddenFieldNode(
                        (node) => {
                            node.setValue(value);
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
            />
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="outline" size="icon">
                            <InfoIcon className="w-4 h-4" />
                            <span className="sr-only">About</span>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>This is a hidden field used to grab search parameters (i.e. <code>utm_source</code>).</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    )
}