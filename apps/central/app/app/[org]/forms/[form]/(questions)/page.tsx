'use client'
import { useForm } from "@/hooks/api/form"
import { useFormSlug } from "@/hooks/api/form"
import { useCurrentOrganization } from "@/hooks/use-current-org"
import { useQuestions } from "@/hooks/api/questions"
import { redirect, useSearchParams } from "next/navigation"
import { ShortAnswerQuestionPreview, LongAnswerQuestionPreview } from "@/components/form/questions/question-preview"
import { Slot } from "@radix-ui/react-slot"
import { questionTypes } from "@/lib/question-types"

export default function FormPage() {
    const searchParams = useSearchParams()
    const currentOrg = useCurrentOrganization()
    const { form } = useFormSlug()

    const { data } = useForm(currentOrg.data?.id ?? '', `form_${form}`)
    const { data: questions } = useQuestions(`org_${currentOrg.data?.id}`, `form_${form}`)

    if (!data || !questions) {
        return null;
    }

    if (questions.length === 0) {
        return null;
    }

    const questionId = searchParams.get('q')

    if (!questionId) {
        redirect(`/app/${currentOrg.data?.slug}/forms/${form}?q=0`)
    }

    const q = questions.find((_, index) => index.toString() === questionId)

    if (!q) {
        redirect(`/app/${currentOrg.data?.slug}/forms/${form}?q=0`)
    }

    return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <Slot className="md:w-5/6 h-auto lg:w-3/4 aspect-[1.7073170732]">
                {(() => {
                    switch (q.type) {
                        case "short_answer":
                            return <ShortAnswerQuestionPreview question={q} editable={true} />
                        case "long_answer":
                            return <LongAnswerQuestionPreview question={q} editable={true} />
                    }
                })()}
            </Slot>
            <div className="md:w-5/6 lg:w-3/4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-mono text-primary">
                        {parseInt(questionId) + 1}
                    </span>
                    <span className="text-sm text-muted-foreground">
                        {q.label}
                    </span>
                </div>
                <div className="bg-foreground text-background rounded-md p-2.5">
                    {questionTypes.find(t => t.type === q.type)?.icon}
                </div>
            </div>
        </div>
    )
}