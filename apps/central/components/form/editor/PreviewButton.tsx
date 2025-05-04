import { Button } from "@/components/ui/button";
import { EyeIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Organization } from "better-auth/plugins";
import React from "react";

interface ButtonProps extends React.ComponentProps<typeof Button> {
    org: Organization;
    formId: string;
}

export function PreviewButton(props: ButtonProps) {
    const { org, formId, ...buttonProps } = props;
    const router = useRouter();
    return (
        <Button size="xs" variant="ghost" onClick={() => {
            router.push(`/app/${org.slug}/forms/${formId}/preview`);
        }} aria-label="Preview" {...buttonProps}>
            <EyeIcon className="size-4" />
            <span>Preview</span>
        </Button>
    );
} 