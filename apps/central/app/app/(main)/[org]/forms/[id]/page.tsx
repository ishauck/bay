'use client'

import { useForm } from "@/hooks/api/form"
import { useCurrentOrganization } from "@/hooks/use-current-org"
import { useParams } from "next/navigation"
import { AlertCircle } from "lucide-react"
import Tilt from "react-parallax-tilt"
import { FormEditor } from "@/components/form/editor"
import { useFormData } from "@/hooks/api/form-data"
import { FormResponseStoreProvider } from "@/components/provider/form-response-store"

export default function FormPage() {
    const params = useParams()
    const org = useCurrentOrganization()
    const id = params.id as string
    const { data: form, isLoading, error } = useForm(org.data?.id || "", id)
    const { data: formData, isLoading: formDataLoading, error: formDataError } = useFormData(org.data?.id || "", id)

    if (isLoading || formDataLoading || !org.data) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
                <div className="w-8 h-8 mb-3 border-4 border-solid border-muted-foreground/20 border-t-muted-foreground rounded-full animate-spin" />
                <span>Loading form...</span>
            </div>
        )
    }
    if (error || formDataError || !org.data) {
        console.error(error, formDataError)
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
                <Tilt
                    perspective={500}
                    glareEnable={true}
                    glareMaxOpacity={0.45}
                    scale={1.02}
                    className="transform-3d rounded-xl p-4 bg-muted overflow-hidden mb-4"
                >
                    <div className="flex items-center gap-2 text-destructive">
                        <AlertCircle className="size-5" />
                        <span>{error?.message || formDataError?.message || 'An unexpected error occurred.'}</span>
                    </div>
                </Tilt>
                <h2>Something went wrong</h2>
            </div>
        )
    }

    if (!form || !formData || !org.data) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
                <h2>Form not found</h2>
                <p>The form you are looking for does not exist or could not be loaded.</p>
            </div>
        )
    }

    return (
        <FormResponseStoreProvider>
            <FormEditor formData={formData} form={form} organization={org.data} />
        </FormResponseStoreProvider>
    )
}