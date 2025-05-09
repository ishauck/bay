'use client'
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { notFound, redirect } from "next/navigation";
import authClient from "@/lib/auth-client";
export default function MainPage() {
    const orgs = authClient.useListOrganizations();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (orgs.isPending) {
        return <div className="flex items-center justify-center flex-1">
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
        </div>
    }

    if (orgs.error) {
        notFound();
    }

    if (orgs.data?.length === 0) {
        redirect('/app/welcome');
    }

    if (mounted && orgs.data?.length && orgs.data.length > 0) {
        redirect(`/app/${orgs.data[0].slug}`);
    }
    
    

    return <div></div>
}