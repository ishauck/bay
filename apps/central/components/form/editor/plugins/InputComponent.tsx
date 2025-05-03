'use client'
import { AlertDialog, AlertDialogTitle, AlertDialogHeader, AlertDialogContent, AlertDialogTrigger, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getNodeByKey } from "lexical";
import { EditIcon } from "lucide-react";
import { $isInputNode, InputNode } from "./InputNode";
import { useState, useCallback, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";

export default function InputComponent({ label, placeholder, type, nodeKey }: { label: string, placeholder: string, type: 'short-answer' | 'long-answer', nodeKey: string }) {
    const [editor] = useLexicalComposerContext();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [newLabel, setNewLabel] = useState(label);
    const [newPlaceholder, setNewPlaceholder] = useState(placeholder);

    // Sync state with props when dialog opens
    useEffect(() => {
        if (dialogOpen) {
            setNewLabel(label);
            setNewPlaceholder(placeholder);
        }
    }, [dialogOpen, label, placeholder]);

    const isEditable = editor.isEditable();

    const withInputNode = useCallback((
        cb: (node: InputNode) => void,
        onUpdate?: () => void,
    ): void => {
        editor.update(
            () => {
                const node = $getNodeByKey(nodeKey);
                if ($isInputNode(node)) {
                    cb(node);
                }
            },
            { onUpdate },
        );
    }, [editor, nodeKey]);

    const hasChanges = newLabel !== label || newPlaceholder !== placeholder;

    return <div data-is-editable={isEditable} data-type={type} className="group w-full sm:w-1/2 md:w-1/3 data-[type=long-answer]:w-full my-4 pointer-events-none">
        <div className="flex flex-row items-center justify-between group-data-[is-editable=true]:mb-2">
            <Label className="flex-1 pointer-events-auto">{label}</Label>
            {isEditable && (
                <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <AlertDialogTrigger asChild>
                        <Button variant="outline" className="border-none shadow-none pointer-events-auto" size="iconXs">
                            <EditIcon className="w-4 h-4" />
                            <span className="sr-only">Edit Input</span>
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="pointer-events-auto">
                        <AlertDialogHeader>
                            <AlertDialogTitle>Edit Input</AlertDialogTitle>
                            <AlertDialogDescription>
                                Edit the input label and placeholder.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <div className="flex flex-col gap-2">
                            <div>
                                <Label>Label</Label>
                                <Input
                                    value={newLabel}
                                    onChange={(e) => setNewLabel(e.target.value)}
                                    placeholder="The text to show above the input."
                                    aria-label="Input label"
                                />
                            </div>
                            <div>
                                <Label>Placeholder</Label>
                                <Input
                                    value={newPlaceholder}
                                    onChange={(e) => setNewPlaceholder(e.target.value)}
                                    placeholder="The text to show inside the input."
                                    aria-label="Input placeholder"
                                />
                            </div>
                        </div>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={() => {
                                    withInputNode((node) => {
                                        node.setLabel(newLabel);
                                        node.setPlaceholder(newPlaceholder);
                                    });
                                    setDialogOpen(false);
                                }}
                                asChild
                                disabled={!hasChanges}
                            >
                                <Button variant="default" disabled={!hasChanges}>Save</Button>
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
        </div>
        {type === 'short-answer' ? (
            <Input className="pointer-events-auto" readOnly={isEditable} placeholder={placeholder} />
        ) : (
            <Textarea className="resize-y max-h-48 pointer-events-auto" readOnly={isEditable} placeholder={placeholder} />
        )}
    </div>;
}