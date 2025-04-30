import { InfoIcon, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { toast } from "sonner"
import { FormMetadata } from "./form-metadata"

interface FormInfoPopoverProps {
    formId: string
    createdAt: string | null
    updatedAt: string | null
    responseCount: number
}

export function FormInfoPopover({ formId, createdAt, updatedAt, responseCount }: FormInfoPopoverProps) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-muted">
                    <InfoIcon className="size-4" />
                </Button>
            </PopoverTrigger>
            <PopoverContent side="bottom" align="end" className="w-80">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium">Form Details</h3>
                        <Button
                            variant="ghost"
                            size="iconXs"
                            onClick={() => {
                                navigator.clipboard.writeText(`form_${formId}`)
                                toast.success("Form ID copied to clipboard")
                            }}
                            className="h-6 w-6"
                        >
                            <Copy className="size-3" />
                            <span className="sr-only">Copy Form ID</span>
                        </Button>
                    </div>
                    
                    <FormMetadata
                        formId={formId}
                        createdAt={createdAt}
                        updatedAt={updatedAt}
                        responseCount={responseCount}
                    />
                </div>
            </PopoverContent>
        </Popover>
    )
} 