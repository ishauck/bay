import { Button } from "@/components/ui/button";
import { CheckIcon } from "lucide-react";
import React from "react";

export function PublishButton(props: React.ComponentProps<typeof Button>) {
    const { ...buttonProps } = props;
    // No props or state needed for now
    return (
        <Button size="xs" onClick={() => {
            console.log("Publish");
        }} aria-label="Publish" {...buttonProps}>
            <CheckIcon className="size-4" />
            <span>Publish</span>
        </Button>
    );
} 