'use client'
import { useForm, useFormSlug, useSetFormData } from "@/hooks/api/form"
import { Loader2, TriangleAlert, ArrowLeft } from "lucide-react"
import { useCurrentOrganization } from "@/hooks/use-current-org"
import Tilt from "react-parallax-tilt"
import Link from "next/link"
import { FormHeader } from "@/components/form/form-header"
import { FormActions } from "@/components/form/form-actions"
import { updateForm } from "@/lib/api/form"
import { toast } from "sonner"
import { useEffect, useState } from "react"
import { FormNav } from "@/components/form/form-nav"

export default function FormLayout({ children }: { children: React.ReactNode }) {
    const { form } = useFormSlug()
    const currentOrg = useCurrentOrganization()
    const setFormData = useSetFormData(currentOrg.data?.id ?? '', `form_${form}`)
    const [isFormTitleLoading, setIsFormTitleLoading] = useState(false)
    const [isTransitioning, setIsTransitioning] = useState(false)

    const res = useForm(`org_${currentOrg.data?.id}`, `form_${form}`)

    useEffect(() => {
        if (res.data && currentOrg.data) {
            document.title = `${res.data.name} - ${currentOrg.data.name}`
        } else {
            document.title = "Loading form... - Bay"
        }
    }, [currentOrg.data, res.data])

    if (res.isLoading) {
        return (
            <div className="w-screen h-screen flex items-center justify-center flex-col gap-4 text-muted-foreground animate-fade-in">
                <Loader2 className="size-8 animate-spin" />
                <h1 className="animate-pulse">Loading form details...</h1>
            </div>
        )
    }

    if (res.error || !res.data) {
        return (
            <div className="flex items-center gap-6 justify-center h-screen text-muted-foreground flex-col animate-fade-in">
                <Tilt
                    perspective={500}
                    glareEnable={true}
                    glareMaxOpacity={0.45}
                    scale={1.02}
                    className="transform-3d rounded-xl p-6 size-24 bg-muted/50 border border-muted-foreground/20 overflow-hidden flex items-center justify-center transition-all duration-300 hover:scale-105"
                >
                    <TriangleAlert className="size-16 text-destructive" />
                </Tilt>
                <div className="text-center space-y-2">
                    <h1 className="text-2xl font-bold">Error loading form</h1>
                    <p className="text-muted-foreground max-w-md">{res.error?.message || "An unknown error occurred"}</p>
                </div>
                <Link
                    href={`/app/${currentOrg.data?.id}/forms`}
                    className="mt-4 px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors flex items-center gap-2 hover:scale-105 active:scale-95"
                >
                    <ArrowLeft className="size-4" />
                    Back to Forms
                </Link>
            </div>
        )
    }

    const data = res.data
    const org = currentOrg.data

    const handleTitleChange = async (newTitle: string) => {
        if (isFormTitleLoading) return;
        
        setIsFormTitleLoading(true)
        setIsTransitioning(true)
        
        try {
            const updatedForm = await updateForm(`org_${currentOrg.data?.id}`, `form_${form}`, { name: newTitle })
            if (updatedForm.error) {
                toast.error('Failed to update form title', {
                    description: updatedForm.error.message
                })
                return
            }

            if (updatedForm.data) {
                setFormData(updatedForm.data)
                toast.success('Form title updated')
            }
        } catch (error) {
            toast.error('An unexpected error occurred', {
                description: error instanceof Error ? error.message : 'Unknown error'
            })
        } finally {
            setIsFormTitleLoading(false)
            setIsTransitioning(false)
        }
    }

    return (
        <div className="h-screen bg-background flex flex-col transition-all duration-300">
            <header className="w-full h-16 flex items-center justify-between bg-background border-b px-6 transition-all duration-300">
                <FormHeader
                    org={org}
                    formName={data.name}
                    onTitleChange={handleTitleChange}
                    isFormTitleLoading={isFormTitleLoading}
                />
                <FormNav org={org} form={data} />
                <FormActions
                    formId={data.id}
                    createdAt={data.createdAt}
                    updatedAt={data.updatedAt}
                    responseCount={data.responseCount}
                />
            </header>
            <main className={`flex-1 flex flex-col transition-all duration-300 ${isTransitioning ? 'opacity-50' : 'opacity-100'}`}>
                {children}
            </main>
        </div>
    )
}