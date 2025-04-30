import { Button } from "@/components/ui/button"
import type { QuestionList as QuestionListType, QuestionTypes } from "@/types/api/form-questions"
import { questionTypes } from "@/lib/question-types"
import { useIsMobile } from "@/hooks/use-mobile"
import { useCallback, KeyboardEvent } from "react"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { useCreateQuestion, useUpdateQuestions } from "@/hooks/api/questions"
import { DragDropContext, Droppable, Draggable, DropResult, DroppableProvided, DraggableProvided, DraggableProvidedDragHandleProps } from "@hello-pangea/dnd"
import { QuestionAdder } from "@/components/form/questions/question-adder"
import { PlusIcon, GripVertical } from "lucide-react"
import { toast } from "sonner"
import { useRouter, useSearchParams } from "next/navigation"

export function QuestionListSkeleton() {
    return (
        <div className="w-full h-48 border-t md:h-full md:w-64 md:border-t-0 md:border-r p-4 flex flex-col gap-2">
            <Skeleton className="h-4 w-20 mx-auto" />
            <div className="flex flex-col gap-2 overflow-y-auto flex-1">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-20 w-full rounded-md" />
                ))}
            </div>
        </div>
    )
}

interface QuestionListItemProps {
    question: QuestionTypes
    index: number
    isSelected?: boolean
    onSelect?: (index: number) => void
    dragHandleProps?: DraggableProvidedDragHandleProps | null
}

function QuestionListItem({ question, index, isSelected, onSelect, dragHandleProps }: QuestionListItemProps) {
    const isMobile = useIsMobile()
    const handleClick = useCallback(() => {
        onSelect?.(index)
    }, [index, onSelect])

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            handleClick()
        }
    }, [handleClick])

    return (
        <div
            onClick={handleClick}
            className={cn(
                "flex-none flex flex-col md:flex-row w-full h-full md:w-full md:h-30 md:items-center gap-2",
                isSelected && "ring-2 ring-primary",
                "snap-center"
            )}
        >
            {!isMobile && (
                <span className="text-xs text-muted-foreground mr-2 font-mono">{index + 1}</span>
            )}
            <div
                className={cn(
                    "flex-1 md:h-30 w-full rounded-md border flex flex-col gap-2 relative",
                    "cursor-grab active:cursor-grabbing",
                    "transition-transform active:scale-[0.98]",
                    "hover:bg-muted/50"
                )}
                onClick={handleClick}
                onKeyDown={handleKeyDown}
                aria-label={`Question ${index + 1}: ${question.type}`}
            >
                <div className="absolute bottom-2 left-2 bg-foreground text-background rounded-md p-2.5">
                    {questionTypes.find(t => t.type === question.type)?.icon}
                </div>
                <div
                    className={cn(
                        "absolute top-2 right-2 text-muted-foreground",
                        "cursor-grab active:cursor-grabbing"
                    )}
                    {...dragHandleProps}
                >
                    <GripVertical className="size-4" />
                </div>
            </div>
            {isMobile && (
                <span className="text-xs text-muted-foreground w-full text-center px-2">
                    Question {index + 1}
                </span>
            )}
        </div>
    )
}

interface QuestionListProps {
    questions: QuestionListType
    selectedIndex?: number
    isLoading?: boolean
    error?: Error | null
    orgId: string
    orgSlug: string
    formId: string
}

export function QuestionList({
    questions,
    selectedIndex,
    isLoading,
    error,
    orgId,
    orgSlug,
    formId
}: QuestionListProps) {
    const updateQuestions = useUpdateQuestions(orgId, formId)
    const createQuestion = useCreateQuestion(orgId, formId)
    const isMobile = useIsMobile()
    const searchParams = useSearchParams()
    const router = useRouter()

    const questionId = searchParams.get('q')

    const handleDragEnd = useCallback(async (result: DropResult) => {
        if (!result.destination) return

        const items = Array.from(questions)
        const [reorderedItem] = items.splice(result.source.index, 1)
        items.splice(result.destination.index, 0, reorderedItem)

        if (questionId) {
            const newIndex = parseInt(questionId)
            if (newIndex !== result.destination.index) {
                router.replace(`/app/${orgSlug}/forms/${formId.split('form_')[1]}?q=${result.destination.index}`)
            }
        }

        await updateQuestions(items)
    }, [formId, orgSlug, questionId, questions, router, updateQuestions])

    const onSelect = useCallback((index: number) => {
        router.replace(`/app/${orgSlug}/forms/${formId.split('form_')[1]}?q=${index}`)
    }, [router, orgSlug, formId])

    if (isLoading) {
        return <QuestionListSkeleton />
    }

    if (error) {
        return (
            <div className="w-full h-48 border-t md:h-full md:w-64 md:border-t-0 p-4 flex flex-col items-center justify-center">
                <p className="text-destructive text-sm">Failed to load questions</p>
            </div>
        )
    }

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="questions">
                {(provided: DroppableProvided) => (
                    <div
                        className={cn(
                            "w-full h-64 border-t md:h-full md:w-64 md:border-t-0 p-4 flex flex-col gap-2",
                            "md:overflow-y-auto"
                        )}
                        role="list"
                        aria-label="Questions list"
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                    >
                        <div className="flex items-center justify-between gap-2">
                            <h3 className="w-full text-center text-xs text-muted-foreground">
                                Questions
                            </h3>
                            <QuestionAdder
                                hoverCardSide={isMobile ? "bottom" : "right"}
                                onSelect={async (type) => {
                                    try {
                                        await createQuestion({
                                            type,
                                            label: 'Untitled Question',
                                            required: false
                                        })
                                        toast.success("Question added")
                                    } catch (error) {
                                        console.error('Failed to add question:', error)
                                        toast.error("Failed to add question")
                                    }
                                }}
                            >
                                <Button
                                    variant="ghost"
                                    size="iconSm"
                                    className="shrink-0"
                                >
                                    <PlusIcon className="size-4" />
                                    <span className="sr-only">Add Question</span>
                                </Button>
                            </QuestionAdder>
                        </div>
                        <div
                            className={cn(
                                "flex-1 relative no-scrollbar",
                                isMobile ? "overflow-x-auto snap-x snap-mandatory" : "overflow-y-auto"
                            )}
                        >
                            <div
                                className={cn(
                                    "flex gap-2",
                                    isMobile ? "flex-row h-full" : "flex-col"
                                )}
                            >
                                {questions.map((question, idx) => (
                                    <Draggable key={idx} draggableId={`question-${idx}`} index={idx}>
                                        {(provided: DraggableProvided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                className={cn(
                                                    isMobile && "w-[95%] flex-none"
                                                )}
                                            >
                                                <QuestionListItem
                                                    question={question}
                                                    index={idx}
                                                    isSelected={selectedIndex === idx}
                                                    onSelect={onSelect}
                                                    dragHandleProps={provided.dragHandleProps}
                                                />
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        </div>
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    )
}