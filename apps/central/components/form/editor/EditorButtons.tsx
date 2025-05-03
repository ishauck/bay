import { useAppStore } from "@/components/provider/app-store";
import { Button } from "@/components/ui/button";
import { useAtom } from "jotai";
import { CopyIcon, EyeIcon, Loader2 } from "lucide-react";
import { CheckIcon, SaveIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { editorAtom } from ".";
import { toast } from "sonner";
import { setFormData } from "@/lib/api/form-data";
import { SerializedLexicalState } from "@/types/api/form-data";
import { useRouter } from "next/navigation";
import { Organization } from "better-auth/plugins";
import useKeybind from "@/hooks/use-keybind";

interface Props {
    org: Organization;
    formId: string;
}

interface ButtonProps extends Props, React.ComponentProps<typeof Button> { }

function SaveButton({ org, formId }: ButtonProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [editor] = useAtom(editorAtom);


    const getEditorState = useCallback(() => {
        if (!editor) return null;
        return editor.getEditorState().toJSON();
    }, [editor]);

    const handleSave = useCallback(async () => {
        if (isLoading) return;
        setIsLoading(true);
        const json = getEditorState();
        if (!json) {
            setIsLoading(false);
            return;
        }
        const res = await setFormData(org.id, formId, json as SerializedLexicalState);
        if (res.error) {
            toast.error(res.error.message);
        } else {
            toast.success("Saved");
        }
        setIsLoading(false);
    }, [formId, getEditorState, isLoading, org.id]);

    useKeybind("cmd+s", handleSave, {
        allowInputs: true,
    });

    return (
        <Button size="xs" variant="outline" onClick={handleSave} disabled={isLoading} aria-label="Save">
            {isLoading ? <Loader2 className="size-4 animate-spin" /> : <SaveIcon className="size-4" />}
            <span>Save</span>
        </Button>
    );
}

function PreviewButton({ org, formId, ...props }: ButtonProps) {
    const router = useRouter();
    return (
        <Button size="xs" variant="ghost" onClick={() => {
            router.push(`/app/${org.slug}/forms/${formId}/preview`);
        }} aria-label="Preview" {...props}>
            <EyeIcon className="size-4" />
            <span>Preview</span>
        </Button>
    );
}

function PublishButton({ org, formId, ...props }: ButtonProps) {
    // No props or state needed for now
    return (
        <Button size="xs" onClick={() => {
            console.log("Publish");
        }} aria-label="Publish" {...props}>
            <CheckIcon className="size-4" />
            <span>Publish</span>
        </Button>
    );
}

export function EditorButtons({ org, formId }: Props) {
    const setActions = useAppStore((state) => state.setActions);
    const [editor] = useAtom(editorAtom);

    const getEditorState = useCallback(() => {
        if (!editor) return null;
        return editor.getEditorState().toJSON();
    }, [editor]);

    useEffect(() => {
        setActions([
            <Button
                className="size-7.5"
                key="copy"
                variant="ghost"
                onClick={async () => {
                    const json = getEditorState();
                    if (!json) return;
                    try {
                        await navigator.clipboard.writeText(JSON.stringify(json));
                        toast.success("Copied to clipboard");
                    } catch {
                        toast.error("Failed to copy");
                    }
                }}
                aria-label="Copy JSON"
            >
                <CopyIcon className="size-4" />
                <span className="sr-only">Copy JSON</span>
            </Button>,
            <PreviewButton key="preview" org={org} formId={formId} />,
            <SaveButton key="save" org={org} formId={formId} />, // Only SaveButton needs props
            <PublishButton key="publish" org={org} formId={formId} />, // PublishButton does not accept props
        ]);
    }, [getEditorState, setActions, org, formId, editor]);

    return (
        <div className="flex flex-row gap-2 md:hidden">
            <PreviewButton variant="outline" org={org} formId={formId} />
            <SaveButton org={org} formId={formId} />
            <PublishButton org={org} formId={formId} />
        </div>
    );
}