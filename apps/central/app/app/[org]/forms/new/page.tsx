'use client'
import { useCurrentOrganization } from "@/hooks/use-current-org";
import { createForm } from "@/lib/api/form";
import { Loader2 } from "lucide-react";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function NewFormPage() {
    const router = useRouter();
    const org = useCurrentOrganization();
    const formCreated = useRef(false);
    
    useEffect(() => {
        const run = async () => {
            if (!org.data?.id || formCreated.current) return;
            
            formCreated.current = true;
            const response = await createForm(`org_${org.data.id}`, {
                name: "Untitled Form",
            });

            if (response.error) {
                console.error(response.error);
            }

            if (response.data) {
                router.replace(`/app/${org.data.slug}/forms/${response.data.id}`);
            }
        };

        if (typeof window !== "undefined") {
            run();
        }
    }, [org.data?.id, org.data?.slug, router]);
    
    return (
        <div className="flex flex-col items-center justify-center h-screen gap-2">
            <Loader2 className="size-7 text-muted-foreground animate-spin" />
            <p className="text-muted-foreground text-center text- cursor-default">Creating form...</p>
        </div>
    )
}