'use client'
import { useEffect, useState } from "react";

import { notFound } from "next/navigation";
import { useCurrentOrganization } from "@/hooks/use-current-org";
import { Loader2 } from "lucide-react";
export default function OrgLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [mounted, setMounted] = useState(false);
    const org = useCurrentOrganization();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (org.isPending || !mounted) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <Loader2 className="size-7 text-muted-foreground animate-spin" />
            </div>
        )
    }

    const data = org.data;

    if (!data) {
        notFound();
    }

    return (
        <div>
            {children}
        </div>
    )
}