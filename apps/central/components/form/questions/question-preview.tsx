import { cn } from "@/lib/utils"
import {
    LongAnswerQuestion,
    QuestionTypes,
    ShortAnswerQuestion
} from "@/types/api/form-questions"

export interface QuestionPreviewProps<T extends QuestionTypes = QuestionTypes>
    extends React.HTMLAttributes<HTMLDivElement> {
    question: T;
    backgroundColor?: string;
    editable?: boolean;
}

export function ShortAnswerQuestionPreview({
    question,
    className,
    editable = false,
    style,
    backgroundColor = "#fff",
    ...props
}: QuestionPreviewProps<ShortAnswerQuestion>) {
    return (
        <div
            className={cn(className)}
            {...props}
            style={{
                backgroundColor,
                "--question-background": backgroundColor,
                ...style
            } as React.CSSProperties}
        >
            {question.label}
        </div>
    )
}

export function LongAnswerQuestionPreview({
    question,
    className,
    editable = false,
    style,
    backgroundColor = "#fff",
    ...props
}: QuestionPreviewProps<LongAnswerQuestion>) {
    return (
        <div
            className={cn(className)}
            style={{
                backgroundColor,
                "--question-background": backgroundColor,
                ...style
            } as React.CSSProperties}
            {...props}
        >
            {question.label}
        </div>
    )
}