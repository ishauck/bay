import { cn } from "@/lib/utils"
import { FormPartial } from "@/types/api/forms"
import { useState } from "react"
import { Editor } from "./editor";

interface FormEditorProps extends React.HTMLAttributes<HTMLDivElement> {
    form: FormPartial;
    editable?: boolean;
}

export function FormEditor({ className, form, editable = true, ...props }: FormEditorProps) {
    const [name, setName] = useState(form.name)

    return (
        <div className={cn("p-6 h-full flex flex-col", className)} {...props}>
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
            <Editor />
        </div>
    )
}