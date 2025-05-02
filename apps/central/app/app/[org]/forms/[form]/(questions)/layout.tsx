'use client'

import { QuestionList as QuestionListComponent, QuestionListSkeleton } from "@/components/form/questions/question-list"
import { QuestionAdder } from "@/components/form/questions/question-adder"
import { useFormSlug } from "@/hooks/api/form"
import { useCreateQuestion, useQuestions } from "@/hooks/api/questions"
import { useCurrentOrganization } from "@/hooks/use-current-org"
import { useIsMobile } from "@/hooks/use-mobile"
import { PlusIcon, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import { QuestionType } from "@/types/api/form-questions"

export default function QuestionsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { form } = useFormSlug()
    const currentOrg = useCurrentOrganization()
    const isMobile = useIsMobile()
    const questionListRef = useRef<HTMLDivElement>(null)
    const [questionListHeight, setQuestionListHeight] = useState<number>(0)
    const [isCreatingQuestion, setIsCreatingQuestion] = useState(false)

    const { data: questions, isLoading } = useQuestions(`org_${currentOrg.data?.id}`, `form_${form}`)
    const createQuestion = useCreateQuestion(`org_${currentOrg.data?.id}`, `form_${form}`)

    useEffect(() => {
        if (questionListRef.current) {
            setQuestionListHeight(questionListRef.current.clientHeight)
        }
    }, [questionListRef.current?.clientHeight])

    const handleCreateQuestion = async (type: QuestionType) => {
        if (isCreatingQuestion) return;
        
        setIsCreatingQuestion(true)
        try {
            await createQuestion({
                type,
                label: 'Untitled Question',
                required: false
            })
            toast.success('Question created successfully')
        } catch (error) {
            toast.error('Failed to create question', {
                description: error instanceof Error ? error.message : 'Unknown error'
            })
        } finally {
            setIsCreatingQuestion(false)
        }
    }

    if (questions?.length === 0 && !isLoading) {
        return (
            <div className="flex-1 h-full flex relative items-center justify-center flex-col gap-4 text-muted-foreground animate-fade-in">
                <div className="absolute top-2 left-2">
                    <QuestionAdder onSelect={handleCreateQuestion}>
                        <Button 
                            variant="outline" 
                            disabled={isCreatingQuestion}
                            className="transition-all duration-300 hover:scale-105 active:scale-95"
                        >
                            {isCreatingQuestion ? (
                                <Loader2 className="size-4 animate-spin" />
                            ) : (
                                <PlusIcon className="size-4" />
                            )}
                            Add Question
                        </Button>
                    </QuestionAdder>
                </div>
                <h1 className="text-2xl font-bold animate-fade-in">No questions found</h1>
                <p className="flex items-center gap-2 flex-wrap animate-fade-in">
                    Press the <PlusIcon className="size-4 inline-block" /> button to add a question
                </p>
            </div>
        )
    }

    const QuestionList = isLoading ? (
        <div className="animate-fade-in">
            <QuestionListSkeleton />
        </div>
    ) : (() => {
        if (!questions) {
            return null
        }

        return (
            <div className="overflow-y-auto md:h-full animate-fade-in">
                <QuestionListComponent 
                    questions={questions} 
                    orgId={`org_${currentOrg.data?.id}`} 
                    orgSlug={currentOrg.data?.slug ?? ''}
                    formId={`form_${form}`} 
                />
            </div>
        )
    })()

    return (
        <div
            style={{ "--question-list-height": `${questionListHeight}px` } as React.CSSProperties}
            ref={questionListRef}
            className="flex-1 h-full overflow-hidden flex md:flex-row flex-col w-full max-h-[calc(100vh-4rem)] transition-all duration-300"
        >
            {isMobile ? (
                <>
                    <div className="flex-1 overflow-hidden transition-all duration-300">
                        {children}
                    </div>
                    <div className="transition-all duration-300">
                        {QuestionList}
                    </div>
                </>
            ) : (
                <>
                    <div className="transition-all duration-300">
                        {QuestionList}
                    </div>
                    <div className="flex-1 overflow-hidden transition-all duration-300">
                        {children}
                    </div>
                </>
            )}
        </div>
    )
}