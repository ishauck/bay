import React from "react";
import { cn } from "@/lib/utils";

interface FormEditorHeaderProps {
    name: string;
    setName: (name: string) => void;
    editable: boolean;
}

export function FormEditorHeader({ name, setName, editable }: FormEditorHeaderProps) {
    return editable ? (
        <input
            className={cn(
                "text-3xl md:text-4xl font-bold",
                "focus:outline-none focus:ring-2 focus:ring-primary/50",
                "placeholder:text-muted-foreground/70",
                "transition-colors bg-transparent border-b border-transparent focus:border-primary/50"
            )}
            placeholder="Untitled Form"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
        />
    ) : (
        <h1 className="text-3xl md:text-4xl font-bold">{name}</h1>
    );
} 