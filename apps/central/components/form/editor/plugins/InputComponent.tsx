'use client'
import { AlertDialog, AlertDialogTitle, AlertDialogHeader, AlertDialogContent, AlertDialogTrigger, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getNodeByKey } from "lexical";
import { EditIcon, HashIcon, MailIcon, PhoneIcon, TextCursorInputIcon } from "lucide-react";
import { $isInputNode, InputNode } from "./InputNode";
import { useState, useCallback, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useFormResponseStore } from "@/components/provider/form-response-store";
import { TextResponse } from "@/types/response";
import { NodeProps } from "./types";
import { Slot } from "@radix-ui/react-slot";
import { PhoneInput } from "@/components/ui/phone-input";

type Props = NodeProps<{
    label: string;
    placeholder: string;
    type: 'short-answer' | 'long-answer' | 'email' | 'phone' | 'number';
    required?: boolean;
}>

export default function InputComponent({ label, placeholder, type, nodeKey, questionId, required }: Props) {
    const [editor] = useLexicalComposerContext();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [newLabel, setNewLabel] = useState(label);
    const [newPlaceholder, setNewPlaceholder] = useState(placeholder);
    const [newRequired, setNewRequired] = useState(!!required);
    const response = useFormResponseStore(state => state.response.find(r => r.questionId === questionId)) as TextResponse | undefined;
    const respond = useFormResponseStore(state => state.respond) as (response: TextResponse) => void;

    // Sync state with props when dialog opens
    useEffect(() => {
        if (dialogOpen) {
            setNewLabel(label);
            setNewPlaceholder(placeholder);
            setNewRequired(!!required);
        }
    }, [dialogOpen, label, placeholder, required]);

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

    const hasChanges = newLabel !== label || newPlaceholder !== placeholder || newRequired !== !!required;

    return <div data-is-editable={isEditable} data-type={type} className="group w-full sm:w-1/2 md:w-1/3 data-[type=long-answer]:w-full my-4 pointer-events-none">
        <div className="flex flex-row items-center justify-between mb-2">
            <Label className="flex-1 pointer-events-auto">
                {label} {required && <span className="text-red-500 ml-1" title="Required">*</span>}
            </Label>
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
                            <div className="flex items-center gap-2 mt-2">
                                <Checkbox
                                    id={`required-toggle-${nodeKey}`}
                                    checked={newRequired}
                                    onCheckedChange={checked => setNewRequired(!!checked)}
                                />
                                <Label htmlFor={`required-toggle-${nodeKey}`}>Required</Label>
                            </div>
                        </div>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={() => {
                                    withInputNode((node) => {
                                        node.setLabel(newLabel);
                                        node.setPlaceholder(newPlaceholder);
                                        node.setRequired(newRequired);
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
        <div className="flex flex-row items-center justify-between gap-2">
            <Slot className="bg-transparent dark:bg-input/30 shadow-xs rounded-md size-9! border-input border flex items-center justify-center">
                {(() => {
                    switch (type) {
                        case 'short-answer': {
                            return (
                                <div>
                                    <TextCursorInputIcon className="w-4 h-4" />
                                    <span className="sr-only">Short Answer</span>
                                </div>
                            )
                        }
                        case 'long-answer': {
                            return null;
                        }
                        case 'email': {
                            return (
                                <div>
                                    <MailIcon className="w-4 h-4" />
                                    <span className="sr-only">Email</span>
                                </div>
                            )
                        }
                        case 'phone': {
                            return (
                                <div>
                                    <PhoneIcon className="w-4 h-4" />
                                    <span className="sr-only">Phone</span>
                                </div>
                            )
                        }
                        case 'number': {
                            return (
                                <div>
                                    <HashIcon className="w-4 h-4" />
                                    <span className="sr-only">Number</span>
                                </div>
                            )
                        }
                    }
                })()}
            </Slot>
            <div className="flex-1">
                {(() => {
                    switch (type) {
                        case 'short-answer': {
                            return (
                                <Input className="pointer-events-auto"
                                    maxLength={100}
                                    readOnly={isEditable}
                                    placeholder={placeholder}
                                    value={response?.response || ""}
                                    onChange={(e) => respond({
                                        type: "short-answer",
                                        questionId: questionId,
                                        response: e.target.value,
                                    })}
                                />
                            )
                        }
                        case 'long-answer': {
                            return (
                                <Textarea className="resize-y max-h-48 pointer-events-auto"
                                    maxLength={1000}
                                    readOnly={isEditable}
                                    placeholder={placeholder}
                                    value={response?.response || ""}
                                    onChange={(e) => respond({
                                        type: "long-answer",
                                        questionId: questionId,
                                        response: e.target.value,
                                    })}
                                />
                            )
                        }
                        case 'email': {
                            return (
                                <Input className="pointer-events-auto"
                                    type="email"
                                    readOnly={isEditable}
                                    placeholder={placeholder}
                                    value={response?.response || ""}
                                    onChange={(e) => respond({
                                        type: "email",
                                        questionId: questionId,
                                        response: e.target.value,
                                    })}
                                />
                            )
                        }
                        case 'phone': {
                            return (
                                <PhoneInput
                                    className="pointer-events-auto"
                                    disabled={isEditable}
                                    placeholder={placeholder}
                                    value={response?.response || ""}
                                    onChange={(value) => respond({
                                        type: "phone",
                                        questionId: questionId,
                                        response: typeof value === 'string' ? value : (value || ""),
                                    })}
                                />
                            )
                        }
                    }
                })()}
            </div>
        </div>
    </div >;
}