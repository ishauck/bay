'use client'
import { useForm } from "@/hooks/api/form"
import { useFormSlug } from "@/hooks/api/form"
import { useCurrentOrganization } from "@/hooks/use-current-org"
import { useQuestions, useUpdateQuestions } from "@/hooks/api/questions"
import { redirect, useSearchParams } from "next/navigation"
import { ShortAnswerQuestionPreview, LongAnswerQuestionPreview } from "@/components/form/questions/question-preview"
import { Slot } from "@radix-ui/react-slot"
import { questionTypes } from "@/lib/question-types"
import * as changeCase from "change-case"
import { abstractStyleOptions } from "@/types/api/form-style"
import { useCallback, useState } from "react"
import { toast } from "sonner"

export default function FormPage() {
    const searchParams = useSearchParams()
    const currentOrg = useCurrentOrganization()
    const { form } = useFormSlug()
    const [isUpdatingLabel, setIsUpdatingLabel] = useState(false)
    const [isUpdatingDescription, setIsUpdatingDescription] = useState(false)

    const { data: formData } = useForm(currentOrg.data?.id ?? '', `form_${form}`)
    const { data: questions } = useQuestions(`org_${currentOrg.data?.id}`, `form_${form}`)
    const updateQuestions = useUpdateQuestions(`org_${currentOrg.data?.id}`, `form_${form}`)
    const questionId = searchParams.get('q')
    const questionIndex = questionId ? parseInt(questionId) : 0

    const handleLabelChange = useCallback(async (newLabel: string) => {
        if (!questions) return;
        setIsUpdatingLabel(true);
        try {
            const updatedQuestions = [...questions];
            updatedQuestions[questionIndex] = {
                ...updatedQuestions[questionIndex],
                label: newLabel
            };
            await updateQuestions(updatedQuestions);
        } catch (error) {
            console.error('Failed to update question label:', error);
            toast.error("Failed to update question label");
        } finally {
            setIsUpdatingLabel(false);
        }
    }, [questionIndex, questions, updateQuestions]);

    const handleDescriptionChange = useCallback(async (newDescription: string) => {
        if (!questions) return;
        setIsUpdatingDescription(true);
        try {
            const updatedQuestions = [...questions];
            updatedQuestions[questionIndex] = {
                ...updatedQuestions[questionIndex],
                description: newDescription
            };
            await updateQuestions(updatedQuestions);
        } catch (error) {
            console.error('Failed to update question description:', error);
            toast.error("Failed to update question description");
        } finally {
            setIsUpdatingDescription(false);
        }
    }, [questionIndex, questions, updateQuestions]);

    if (!formData || !questions) {
        return null;
    }

    if (questions.length === 0) {
        return null;
    }

    if (!questionId) {
        redirect(`/app/${currentOrg.data?.slug}/forms/${form}?q=0`)
    }

    const q = questions[questionIndex]

    if (!q) {
        redirect(`/app/${currentOrg.data?.slug}/forms/${form}?q=0`)
    }

    return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-4 p-6 bg-background">
            <div className="w-11/12 md:w-5/6 h-auto lg:w-3/4 flex flex-col items-center justify-center gap-2 aspect-[1.564453125]">
                <Slot className="w-full h-auto aspect-[1.7073170732] flex flex-col justify-center items-center">
                    {(() => {
                        switch (q.type) {
                            case "short_answer":
                                return <ShortAnswerQuestionPreview 
                                    question={q} 
                                    colors={abstractStyleOptions(formData)}
                                    label={q.label}
                                    onLabelChange={handleLabelChange}
                                    description={q.description}
                                    onDescriptionChange={handleDescriptionChange}
                                    isLoading={isUpdatingLabel || isUpdatingDescription}
                                />
                            case "long_answer":
                                return <LongAnswerQuestionPreview 
                                    question={q} 
                                    colors={abstractStyleOptions(formData)}
                                    label={q.label}
                                    onLabelChange={handleLabelChange}
                                    description={q.description}
                                    onDescriptionChange={handleDescriptionChange}
                                    isLoading={isUpdatingLabel || isUpdatingDescription}
                                />
                        }
                    })()}
                </Slot>
                <div className="w-full flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-mono text-primary">
                            {questionIndex + 1}
                        </span>
                        <span className="text-sm text-muted-foreground">
                            {q.label}
                        </span>
                    </div>
                    <div className="bg-foreground text-background rounded-md p-2.5 flex items-center gap-2">
                        {questionTypes.find(t => t.type === q.type)?.icon}
                        <span className="text-sm">
                            {changeCase.capitalCase(q.type)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}