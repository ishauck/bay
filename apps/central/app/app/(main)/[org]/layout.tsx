'use client'
import { useState } from "react";
import { useCurrentOrganization } from "@/hooks/use-current-org";
import { useEffect } from "react";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppStore } from "@/components/provider/app-store";

export default function OrgLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [mounted, setMounted] = useState(false);
    const org = useCurrentOrganization();
    const actions = useAppStore((state) => state.actions);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (org.isPending || !mounted) {
        return (
            <div>
                <header className="w-full border-b border-border p-1 h-12 md:flex hidden items-center">
                    <div className="flex items-center justify-between">
                        <Skeleton className="h-8 w-48" />
                    </div>
                </header>
                {children}
            </div>
        )
    }

    const data = org.data;

    if (!data) {
        notFound();
    }

    return <div className="h-full flex flex-col overflow-hidden">
        <header className="w-full border-b border-border p-1 h-12 md:flex hidden items-center">
            <div className="flex items-center justify-between flex-1">
                <Button variant="ghost" className="text-base" asChild>
                    <Link href={`/app/${data.slug}`}>
                        <Avatar className="size-5 rounded-[0.4rem]">
                            <AvatarImage src={data.logo || ""} />
                            <AvatarFallback className="text-sm rounded-none font-semibold bg-accent w-full h-full flex items-center justify-center">
                                {data.name.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                        <h1 className="font-medium">
                            {data.name}
                        </h1>
                    </Link>
                </Button>
            </div>
            <div className="flex flex-row gap-2 px-2">
                {actions.map((action, index) => (
                    <div key={index}>
                        {action}
                    </div>
                ))}
            </div>
        </header>
        <main className="flex-1 overflow-y-auto">
            {children}
        </main>
    </div>
}