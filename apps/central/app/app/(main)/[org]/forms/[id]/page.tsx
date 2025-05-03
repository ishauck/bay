'use client'

import { useForm } from "@/hooks/api/form"
import { useCurrentOrganization } from "@/hooks/use-current-org"
import { useParams } from "next/navigation"
import { AlertCircle } from "lucide-react"
import Tilt from "react-parallax-tilt"
import { FormEditor } from "@/components/form/editor"
import { useFormData } from "@/hooks/api/form-data"

export default function FormPage() {
    const params = useParams()
    const org = useCurrentOrganization()
    const id = params.id as string
    const { data: form, isLoading, error } = useForm(org.data?.id || "", id)
    const { data: formData, isLoading: formDataLoading, error: formDataError } = useFormData(org.data?.id || "", id)

    if (isLoading || formDataLoading) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
                <div className="spinner" style={{ marginBottom: 12, width: 32, height: 32, border: '4px solid #eee', borderTop: '4px solid #333', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                <span>Loading form...</span>
                <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            </div>
        )
    }
    if (error || formDataError) {
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

    if (!form || !formData) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
                <h2>Form not found</h2>
                <p>The form you are looking for does not exist or could not be loaded.</p>
            </div>
        )
    }

    return (
        <FormEditor formData={formData} className="h-screen" form={form} />
    )
}