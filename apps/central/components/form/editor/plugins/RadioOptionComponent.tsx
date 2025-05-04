'use client'
import { AlertDialog, AlertDialogTitle, AlertDialogHeader, AlertDialogContent, AlertDialogTrigger, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getNodeByKey } from "lexical";
import { EditIcon, XIcon } from "lucide-react";
import { $isRadioOptionNode, RadioOptionNode } from "./RadioOptionNode";
import { useState, useCallback, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function RadioOptionComponent({ label, options, allowOther, nodeKey }: { label: string, options: string[], allowOther: boolean, nodeKey: string }) {
    const [editor] = useLexicalComposerContext();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [newLabel, setNewLabel] = useState(label);
    const [newOptions, setNewOptions] = useState<string[]>(options);
    const [newAllowOther, setNewAllowOther] = useState(allowOther);

    // Sync state with props when dialog opens
    useEffect(() => {
        if (dialogOpen) {
            setNewLabel(label);
            setNewOptions(options);
            setNewAllowOther(allowOther);
        }
    }, [dialogOpen, label, options, allowOther]);

    const isEditable = editor.isEditable();

    const withRadioOptionNode = useCallback((
        cb: (node: RadioOptionNode) => void,
        onUpdate?: () => void,
    ): void => {
        editor.update(
            () => {
                const node = $getNodeByKey(nodeKey);
                if ($isRadioOptionNode(node)) {
                    cb(node);
                }
            },
            { onUpdate },
        );
    }, [editor, nodeKey]);

    const hasChanges = newLabel !== label || newAllowOther !== allowOther || JSON.stringify(newOptions) !== JSON.stringify(options);

    // Handlers for editing options
    const handleOptionChange = (idx: number, value: string) => {
        setNewOptions(opts => opts.map((opt, i) => i === idx ? value : opt));
    };
    const handleAddOption = () => {
        setNewOptions(opts => [...(opts.filter(opt => opt.trim() !== "")), ""]);
    };
    const handleRemoveOption = (idx: number) => {
        setNewOptions(opts => opts.filter((_, i) => i !== idx));
    };

    return <div data-is-editable={isEditable} className="group w-full sm:w-1/2 md:w-1/3 my-4 pointer-events-none">
        <div className="flex flex-row items-center justify-between mb-2">
            <Label className="flex-1 pointer-events-auto">{label}</Label>
            {isEditable && (
                <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <AlertDialogTrigger asChild>
                        <Button variant="outline" className="border-none shadow-none pointer-events-auto" size="iconXs">
                            <EditIcon className="w-4 h-4" />
                            <span className="sr-only">Edit Radio Options</span>
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="pointer-events-auto">
                        <AlertDialogHeader>
                            <AlertDialogTitle>Edit Radio Options</AlertDialogTitle>
                            <AlertDialogDescription>
                                Edit the label, options, and whether to allow an &quot;Other&quot; option.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <div className="flex flex-col gap-2">
                            <div>
                                <Label>Label</Label>
                                <Input
                                    value={newLabel}
                                    onChange={e => setNewLabel(e.target.value)}
                                    placeholder="The text to show above the radio group."
                                    aria-label="Radio group label"
                                />
                            </div>
                            <div>
                                <Label>Options</Label>
                                <div className="flex flex-col gap-1">
                                    {newOptions.map((opt, idx) => (
                                        <div key={idx} className="flex items-center gap-2">
                                            <Input
                                                value={opt}
                                                onChange={e => handleOptionChange(idx, e.target.value)}
                                                placeholder={`Option ${idx + 1}`}
                                                aria-label={`Option ${idx + 1}`}
                                            />
                                            <Button variant="ghost" size="iconXs" onClick={() => handleRemoveOption(idx)} disabled={newOptions.length <= 1}>
                                                <span className="sr-only">Remove option</span>
                                                <XIcon className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ))}
                                    <Button variant="outline" size="sm" onClick={handleAddOption} className="mt-1 w-fit">+ Add Option</Button>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                                <Switch id="allow-other" checked={newAllowOther} onCheckedChange={setNewAllowOther} />
                                <Label htmlFor="allow-other">Allow &quot;Other&quot; option</Label>
                            </div>
                        </div>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={() => {
                                    withRadioOptionNode((node) => {
                                        node.setLabel(newLabel);
                                        node.setOptions(newOptions);
                                        node.setAllowOther(newAllowOther);
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
        <RadioGroup className="flex flex-col gap-2 pointer-events-auto">
            {options.map((opt, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                    <RadioGroupItem id={`radio-${nodeKey}-${idx}`} value={opt} disabled={isEditable} />
                    <Label htmlFor={`radio-${nodeKey}-${idx}`}>{opt}</Label>
                </div>
            ))}
            {allowOther && (
                <div className="flex items-center space-x-2">
                    <RadioGroupItem id={`radio-${nodeKey}-other`} value="other" disabled={isEditable} />
                    <Label htmlFor={`radio-${nodeKey}-other`}>Other</Label>
                </div>
            )}
        </RadioGroup>
    </div>;
}