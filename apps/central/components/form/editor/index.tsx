import { cn } from "@/lib/utils"
import { FormPartial } from "@/types/api/forms"
import { useState } from "react"
import { Editor } from "./editor";
import { LexicalEditor } from "lexical";
import { atom } from 'jotai';
import { EditorButtons } from "./EditorButtons";
import { FormData } from "@/types/api/form-data";
interface FormEditorProps extends React.HTMLAttributes<HTMLDivElement> {
    form: FormPartial;
    formData: FormData;
    editable?: boolean;
}

export const editorAtom = atom<LexicalEditor | null>(null);

export function FormEditor({ className, form, formData, editable = true, ...props }: FormEditorProps) {
    const [name, setName] = useState(form.name);

    return (
        <div className={cn("p-6 h-full flex flex-col gap-2", className)} {...props}>
            {editable ? (
                <input
                    className={cn(
                        "text-3xl md:text-4xl font-bold",
                        "focus:outline-none placeholder:text-muted-foreground/70",
                    )}
                    placeholder="Untitled Form"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            ) : (
                <h1 className="text-3xl md:text-4xl font-bold">{name}</h1>
            )}
            {editable && (
                <EditorButtons />
            )}
            <Editor defaultData={formData.questions} editable={editable} />
        </div>
    )
}