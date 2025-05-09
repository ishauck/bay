import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { updateForm } from "@/lib/api/form";
import { isSavingAtom } from ".";
import { useAtom } from "jotai";
interface FormEditorHeaderProps {
    name: string;
    setName: (name: string) => void;
    editable: boolean;
    orgId: string;
    formId: string;
}

export function FormEditorHeader({ name, setName, editable, orgId, formId }: FormEditorHeaderProps) {
    const [, setIsSaving] = useAtom(isSavingAtom);
    const [lastSavedName, setLastSavedName] = useState(name);
    const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (!editable) return;
        if (name === lastSavedName) return;
        if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
        debounceTimeout.current = setTimeout(async () => {
            setIsSaving(true);
            await updateForm(orgId, formId, { name });
            setLastSavedName(name);
            setIsSaving(false);
        }, 1000);
        return () => {
            if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
        };
    }, [name, orgId, formId, editable, lastSavedName, setIsSaving]);

    return editable ? (
        <div className="relative">
            <input
                className={cn(
                    "text-3xl md:text-4xl font-bold",
                    "focus:outline-none",
                    "placeholder:text-muted-foreground/70",
                    "transition-colors bg-transparent border-b border-transparent focus:border-primary/50"
                )}
                placeholder="Untitled Form"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
        </div>
    ) : (
        <h1 className="text-3xl md:text-4xl font-bold">{name}</h1>
    );
} 