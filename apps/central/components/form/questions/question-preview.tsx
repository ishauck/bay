import { LongAnswerQuestion, QuestionTypes, ShortAnswerQuestion } from "@/types/api/form-questions";
import { cn } from "@/lib/utils";
import { generateCssProperties, StyleOptions } from "@/types/api/form-style";
import { useCallback, useRef, useState } from "react";
import { Loader2, Pencil } from "lucide-react";
import useContrast from "@/hooks/use-contrast";

interface QuestionPreviewProps<T extends QuestionTypes> {
    question: T;
    colors: StyleOptions;
    label?: string;
    onLabelChange?: (label: string) => void;
    isLoading?: boolean;
}

function QuestionBackground({ className, colors, ...props }: React.HTMLAttributes<HTMLDivElement> & { colors: StyleOptions }) {
    const isDark = useContrast(colors.backgroundValue) === "dark";

    return (
        <div style={generateCssProperties(colors)} className={cn(`w-full h-full rounded-md p-4 md:p-24 flex gap-2 shadow-md border bg-card`, isDark ? "dark" : "light", className)} {...props} />
    )
}

function QuestionLabel({ className, label: initialLabel, setLabel, isLoading = false, editable = true }: { className?: string, label: string, setLabel: (label: string) => void, isLoading?: boolean, editable?: boolean }) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [editingText, setEditingText] = useState("");

    const handleHeaderClick = useCallback(() => {
        if (!editable) return;
        setEditingText(initialLabel);
        inputRef.current?.focus();
    }, [initialLabel, editable]);

    const handleInputFocus = useCallback(() => {
        inputRef.current?.select();
    }, []);

    const handleInputBlur = useCallback(() => {
        setLabel(editingText);
        setEditingText("");
    }, [editingText, setLabel]);

    const onKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleInputBlur();
        }

        if (e.key === "Escape") {
            handleInputBlur();
            setLabel(editingText);
        }
    }, [editingText, handleInputBlur, setLabel]);

    if (editingText !== "") {
        return (
            <input
                type="text"
                ref={inputRef}
                value={editingText}
                onChange={(e) => setEditingText(e.target.value)}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                onKeyDown={onKeyDown}
                className={cn("text-2xl h-[1.5rem] underline underline-offset-2 font-medium focus:outline-none", className)}
                disabled={!editable}
                autoFocus
            />
        )
    }

    return (
        <h1 onClick={handleHeaderClick} className={cn("text-2xl font-medium group h-[1.5rem]", className)}>
            {initialLabel}
            <button
                onClick={() => setEditingText(initialLabel)}
                disabled={isLoading}
                className="opacity-0 group-data-[is-loading=true]:opacity-70 group-hover:opacity-100 focus:opacity-100 transition-opacity p-1 hover:bg-muted disabled:hover:bg-transparent rounded-md ml-2"
            >
                {isLoading ? <Loader2 className="size-4 text-muted-foreground animate-spin" /> : <Pencil className="size-4 text-muted-foreground" />}
                <span className="sr-only">Edit</span>
            </button>
        </h1>
    )
}

export function ShortAnswerQuestionPreview({ question, colors, label: externalLabel, onLabelChange, isLoading }: QuestionPreviewProps<ShortAnswerQuestion>) {
    const [internalLabel, setInternalLabel] = useState(question.label);
    const label = externalLabel ?? internalLabel;
    const setLabel = onLabelChange ?? setInternalLabel;

    return (
        <QuestionBackground colors={colors}>
            <QuestionLabel label={label} setLabel={setLabel} isLoading={isLoading} />
            <p>{question.description}</p>
        </QuestionBackground>
    )
}

export function LongAnswerQuestionPreview({ question, colors, label: externalLabel, onLabelChange, isLoading }: QuestionPreviewProps<LongAnswerQuestion>) {
    const [internalLabel, setInternalLabel] = useState(question.label);
    const label = externalLabel ?? internalLabel;
    const setLabel = onLabelChange ?? setInternalLabel;

    return (
        <QuestionBackground colors={colors}>
            <QuestionLabel label={label} setLabel={setLabel} isLoading={isLoading} />
            <p>{question.description}</p>
        </QuestionBackground>
    )
}