import { cn } from "@/lib/utils"
import {
    LongAnswerQuestion,
    QuestionTypes,
    ShortAnswerQuestion
} from "@/types/api/form-questions"
import { useState, useRef, useEffect, useCallback, memo } from "react"
import { Asterisk } from "lucide-react"

export interface QuestionPreviewProps<T extends QuestionTypes = QuestionTypes> {
    question: T;
    backgroundColor?: string;
    color?: string;
    editable?: boolean;
    value?: string;
    onValueChange?: (value: string) => void;
    className?: string;
    style?: React.CSSProperties;
}

interface QuestionLabelProps extends React.HTMLAttributes<HTMLDivElement> {
    onEdit?: (value: string) => void;
    editable?: boolean;
    label: string;
    required?: boolean;
}

const QuestionBackground = memo(function QuestionBackground({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn("p-4 md:p-10 lg:p-20 xl:p-25 w-full h-full rounded-lg shadow-md border", className)}
            role="region"
            aria-label="Question preview"
            {...props}
        />
    )
})

const QuestionLabel = memo(function QuestionLabel({ className, onEdit, editable, label, required, ...props }: QuestionLabelProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [editedLabel, setEditedLabel] = useState(label)

    const handleClick = useCallback(() => {
        if (editable) {
            setIsEditing(true)
            setEditedLabel(label)
        }
    }, [editable, label])

    const handleBlur = useCallback(() => {
        setIsEditing(false)
        if (onEdit && editedLabel !== label) {
            onEdit(editedLabel)
        }
    }, [onEdit, editedLabel, label])

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleBlur()
        }
    }, [handleBlur])

    if (isEditing) {
        return (
            <div className="flex items-center gap-2">
                <input
                    type="text"
                    value={editedLabel}
                    onChange={(e) => setEditedLabel(e.target.value)}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    maxLength={50}
                    className={cn("text-2xl font-bold bg-transparent border-b-2 border-current outline-none w-full", className)}
                    autoFocus
                    aria-label="Question label"
                />
                {required && <Asterisk className="size-4 text-red-500" aria-hidden="true" />}
            </div>
        )
    }

    return (
        <div className="flex items-center gap-2">
            <h2 
                className={cn("text-2xl font-bold", className)} 
                onClick={handleClick}
                style={{ cursor: editable ? 'pointer' : 'default' }}
                role={editable ? 'button' : undefined}
                tabIndex={editable ? 0 : undefined}
                onKeyDown={editable ? (e) => e.key === 'Enter' && handleClick() : undefined}
                {...props}
            >
                {label}
            </h2>
            {required && <Asterisk className="size-4 text-red-500" aria-hidden="true" />}
        </div>
    )
})

interface QuestionDescriptionProps {
    description?: string;
    className?: string;
    editable?: boolean;
    onEdit?: (value: string) => void;
}

const QuestionDescription = memo(function QuestionDescription({ description, className, editable, onEdit }: QuestionDescriptionProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [editedDescription, setEditedDescription] = useState(description || '')
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    const handleClick = useCallback(() => {
        if (editable) {
            setIsEditing(true)
            setEditedDescription(description || '')
        }
    }, [editable, description])

    const handleBlur = useCallback(() => {
        setIsEditing(false)
        if (onEdit && editedDescription !== description) {
            onEdit(editedDescription)
        }
    }, [onEdit, editedDescription, description])

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleBlur()
        }
    }, [handleBlur])

    const adjustTextareaHeight = useCallback(() => {
        const textarea = textareaRef.current
        if (textarea) {
            textarea.style.height = 'auto'
            textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`
        }
    }, [])

    useEffect(() => {
        if (isEditing && textareaRef.current) {
            adjustTextareaHeight()
        }
    }, [isEditing, editedDescription, adjustTextareaHeight])

    if (!description && !editable) return null;

    const baseStyles = "text-sm text-muted-foreground mt-2 w-full min-h-[24px]"

    if (isEditing) {
        return (
            <textarea
                ref={textareaRef}
                value={editedDescription}
                onChange={(e) => {
                    setEditedDescription(e.target.value)
                    adjustTextareaHeight()
                }}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                maxLength={200}
                className={cn(baseStyles, "bg-transparent border-b-2 border-current outline-none resize-none overflow-hidden", className)}
                autoFocus
                placeholder="Add a description..."
                aria-label="Question description"
                rows={1}
            />
        )
    }

    return (
        <p 
            className={cn(baseStyles, "w-full whitespace-pre-wrap break-words", className)} 
            onClick={handleClick}
            style={{ cursor: editable ? 'pointer' : 'default' }}
            role={editable ? 'button' : undefined}
            tabIndex={editable ? 0 : undefined}
            onKeyDown={editable ? (e) => e.key === 'Enter' && handleClick() : undefined}
        >
            {description || 'Click to add a description...'}
        </p>
    )
})

const BaseQuestionPreview = memo(function BaseQuestionPreview({
    className,
    style,
    backgroundColor = "#fff",
    color = "#000",
    children,
}: Pick<QuestionPreviewProps, 'className' | 'style' | 'backgroundColor' | 'color'> & { children: React.ReactNode }) {
    return (
        <QuestionBackground
            className={cn(className)}
            style={{
                backgroundColor,
                color,
                "--question-background": backgroundColor,
                "--question-text-color": color,
                ...style
            } as React.CSSProperties}
        >
            {children}
        </QuestionBackground>
    )
})

export function ShortAnswerQuestionPreview(props: QuestionPreviewProps<ShortAnswerQuestion>) {
    const { value = "", onValueChange, ...rest } = props;
    
    return (
        <BaseQuestionPreview {...rest}>
            <div className="space-y-4">
                <QuestionLabel 
                    label={props.question.label} 
                    editable={props.editable} 
                    required={props.question.required}
                    onEdit={(newLabel) => {
                        props.question.label = newLabel
                    }}
                />
                <QuestionDescription 
                    description={props.question.description} 
                    editable={props.editable}
                    onEdit={(newDescription) => {
                        props.question.description = newDescription
                    }}
                />
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onValueChange?.(e.target.value)}
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Type your answer here..."
                    aria-label="Short answer input"
                />
            </div>
        </BaseQuestionPreview>
    )
}

export function LongAnswerQuestionPreview(props: QuestionPreviewProps<LongAnswerQuestion>) {
    const { value = "", onValueChange, ...rest } = props;
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const adjustTextareaHeight = useCallback(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
        }
    }, []);

    useEffect(() => {
        adjustTextareaHeight();
    }, [value, adjustTextareaHeight]);

    return (
        <BaseQuestionPreview {...rest}>
            <div className="space-y-4">
                <QuestionLabel 
                    label={props.question.label} 
                    editable={props.editable} 
                    required={props.question.required}
                    onEdit={(newLabel) => {
                        props.question.label = newLabel
                    }}
                />
                <QuestionDescription 
                    description={props.question.description} 
                    editable={props.editable}
                    onEdit={(newDescription) => {
                        props.question.description = newDescription
                    }}
                />
                <textarea
                    ref={textareaRef}
                    value={value}
                    onChange={(e) => onValueChange?.(e.target.value)}
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary resize-none overflow-hidden"
                    placeholder="Type your answer here..."
                    aria-label="Long answer input"
                    rows={3}
                />
            </div>
        </BaseQuestionPreview>
    )
}