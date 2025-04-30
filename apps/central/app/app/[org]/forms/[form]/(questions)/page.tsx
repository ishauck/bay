'use client'
import { useForm } from "@/hooks/api/form"
import { useFormSlug } from "@/hooks/api/form"
import { useCurrentOrganization } from "@/hooks/use-current-org"
import { useQuestions } from "@/hooks/api/questions"
import { redirect, useSearchParams } from "next/navigation"
import { ShortAnswerQuestionPreview, LongAnswerQuestionPreview } from "@/components/form/questions/question-preview"

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
        <div className="w-full h-full flex items-center justify-center">
            {(() => {
                switch (q.type) {
                    case "short_answer":
                        return <ShortAnswerQuestionPreview question={q} />
                    case "long_answer":
                        return <LongAnswerQuestionPreview question={q} />
                }
            })()}
        </div>
    )
}