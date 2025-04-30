import { FormInfoPopover } from "./form-info-popover"
import UserProfile from "@/components/sidebar/user-profile"

interface FormActionsProps {
    formId: string
    createdAt: string | null
    updatedAt: string | null
    responseCount: number
}

export function FormActions({ formId, createdAt, updatedAt, responseCount }: FormActionsProps) {
    return (
        <div className="flex items-center gap-4">
            <FormInfoPopover
                formId={formId}
                createdAt={createdAt}
                updatedAt={updatedAt}
                responseCount={responseCount}
            />
            <UserProfile />
        </div>
    )
} 