import { cn } from "@/lib/utils"
import { FormPartial } from "@/types/forms"
import { useState } from "react"
import { Editor } from "./editor";
import { LexicalEditor } from "lexical";
import { atom } from 'jotai';
import { EditorButtons } from "./EditorButtons";
import { FormData } from "@/types/form-data";
import { Organization } from "better-auth/plugins/organization";
import { FormEditorHeader } from "./FormEditorHeader";

interface FormEditorProps extends React.HTMLAttributes<HTMLDivElement> {
    form: FormPartial;
    organization: Organization;
    formData: FormData;
    editable?: boolean;
    customHeader?: React.ReactNode;
}

export const editorAtom = atom<LexicalEditor | null>(null);
export const isSavingAtom = atom<boolean>(false);

export function FormEditor({ className, form, formData, organization, editable = true, customHeader = null, ...props }: FormEditorProps) {
    const [name, setName] = useState(form.name);

    return (
        <div className={cn("p-6 h-full flex flex-col gap-2", className)} {...props}>
            {customHeader ? (
                customHeader
            ) : (
                <FormEditorHeader name={name} setName={setName} editable={editable} orgId={organization.id} formId={form.id} />
            )}
            {editable && (
                <EditorButtons org={organization} formId={form.id} />
            )}
            <Editor defaultData={formData.questions} editable={editable} org={organization} formId={form.id} />
        </div>
    )
}