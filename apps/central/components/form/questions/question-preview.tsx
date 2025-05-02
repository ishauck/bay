import { cn } from "@/lib/utils";
import { generateCssProperties, StyleOptions } from "@/types/api/form-style";
import { useState } from "react";
import useContrast from "@/hooks/use-contrast";
import { QuestionTypes } from "@/types/api/form-questions";
import { InlineEditableText } from "@/components/ui/inline-editable-text";

interface QuestionPreviewPropsBase {
    question: QuestionTypes;
    colors: StyleOptions;
    label?: string;
    description?: string;
    onLabelChange?: (label: string) => void;
    onDescriptionChange?: (description: string) => void;
    isLoading?: boolean;
    editable?: boolean;
}

function QuestionBackground({ className, colors, ...props }: React.HTMLAttributes<HTMLDivElement> & { colors: StyleOptions }) {
    const isDark = useContrast(colors.backgroundValue) === "dark";

    return (
        <div style={generateCssProperties(colors)} className={cn(`w-full h-full rounded-md p-4 md:p-24 flex flex-col gap-2 shadow-md border bg-card`, isDark ? "dark" : "light", className)} {...props} />
    )
}

function BaseQuestionPreview({ question, colors, label: externalLabel, onLabelChange, description: externalDescription, onDescriptionChange, isLoading, editable }: QuestionPreviewPropsBase) {
    const [internalLabel, setInternalLabel] = useState(question.label);
    const label = externalLabel ?? internalLabel;
    const setLabel = onLabelChange ?? setInternalLabel;

    const [internalDescription, setInternalDescription] = useState(question.description);
    const description = externalDescription ?? internalDescription;
    const setDescription = onDescriptionChange ?? setInternalDescription;

    return (
        <QuestionBackground colors={colors}>
            <InlineEditableText
                value={label}
                onSave={setLabel}
                isLoading={isLoading}
                editable={editable}
                placeholder="Question label"
                as="h1"
                className="text-2xl font-bold mb-1"
            />
            <InlineEditableText
                value={description || ""}
                onSave={setDescription}
                isLoading={isLoading}
                editable={editable}
                placeholder="Add a description to help your respondents understand the question"
                as="p"
                className="text-sm text-muted-foreground mb-2"
            />
        </QuestionBackground>
    );
}

export function ShortAnswerQuestionPreview(props: QuestionPreviewPropsBase) {
    return <BaseQuestionPreview {...props} />;
}

export function LongAnswerQuestionPreview(props: QuestionPreviewPropsBase) {
    return <BaseQuestionPreview {...props} />;
}