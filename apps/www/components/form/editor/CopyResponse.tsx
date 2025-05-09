import { useFormResponseStore } from "@/components/provider/form-response-store";
import { Button } from "@/components/ui/button";
import { CopyIcon } from "lucide-react";

export function CopyResponse() {
    const response = useFormResponseStore(state => state.response);

    return (
        <Button variant="outline" size="iconXs" onClick={() => {
            navigator.clipboard.writeText(JSON.stringify(response, null, 2));
        }}>
            <CopyIcon className="size-4" />
            <span className="sr-only">Copy Response</span>
        </Button>
    )
}