import Link from "next/link"
import Logo from "@/components/logo"
import { TitleEditor } from "@/components/title-editor"
import { Organization } from "@/types/org"

interface FormHeaderProps {
    org: Organization | null | undefined
    formName: string
    onTitleChange: (newTitle: string) => void
    isFormTitleLoading: boolean
}

export function FormHeader({ org, formName, onTitleChange, isFormTitleLoading }: FormHeaderProps) {
    return (
        <div className="flex items-center gap-4">
            <Link href={`/app/${org?.slug}`}>
                <Logo className="size-12" />
            </Link>
            <div className="w-fit">
                <TitleEditor
                    title={formName}
                    onTitleChange={onTitleChange}
                    isLoading={isFormTitleLoading}
                />
                <p className="text-sm text-muted-foreground">{org?.name}</p>
            </div>
        </div>
    )
} 