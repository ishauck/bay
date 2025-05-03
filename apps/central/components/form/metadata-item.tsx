import { ReactNode } from "react"

interface MetadataItemProps {
    icon: ReactNode
    label: string
    value: string
    subValue?: string
}

export function MetadataItem({ icon, label, value, subValue }: MetadataItemProps) {
    return (
        <div className="flex items-center gap-3 text-sm">
            <div className="p-2 rounded-md bg-muted">
                {icon}
            </div>
            <div>
                <p className="text-muted-foreground">{label}</p>
                <p>{value}</p>
                {subValue && (
                    <p className="text-xs text-muted-foreground">
                        {subValue}
                    </p>
                )}
            </div>
        </div>
    )
} 