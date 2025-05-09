import { FileText, Calendar, Clock, Users } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { MetadataItem } from "@/components/form/metadata-item"

interface FormMetadataProps {
    formId: string
    createdAt: string | null
    updatedAt: string | null
    responseCount: number
}

export function FormMetadata({ formId, createdAt, updatedAt, responseCount }: FormMetadataProps) {
    const formatDate = (date: string | null) => {
        if (!date) return 'Never'
        return new Date(date).toLocaleString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const formatTimeAgo = (date: string | null) => {
        if (!date) return 'Never'
        return formatDistanceToNow(new Date(date), { addSuffix: true })
    }

    return (
        <div className="space-y-3">
            <MetadataItem
                icon={<FileText className="size-4 text-muted-foreground" />}
                label="Form ID"
                value={formId}
            />

            <MetadataItem
                icon={<Calendar className="size-4 text-muted-foreground" />}
                label="Created"
                value={formatDate(createdAt)}
                subValue={formatTimeAgo(createdAt)}
            />

            <MetadataItem
                icon={<Clock className="size-4 text-muted-foreground" />}
                label="Last Updated"
                value={formatDate(updatedAt)}
                subValue={updatedAt ? formatTimeAgo(updatedAt) : undefined}
            />

            <MetadataItem
                icon={<Users className="size-4 text-muted-foreground" />}
                label="Responses"
                value={`${responseCount} submission${responseCount === 1 ? '' : 's'}`}
            />
        </div>
    )
}