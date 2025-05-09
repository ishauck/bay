'use client'

import Logo from "@/components/logo"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useIsMobile } from "@/hooks/use-mobile"
import Link from "next/link"
import UserProfile from "@/components/sidebar/user-profile"
import { useCurrentOrganization } from "@/hooks/use-current-org"
export default function MobileHeader() {
    const isMobile = useIsMobile()
    const org = useCurrentOrganization()
    if (!isMobile) return null

    return (
        <div className="flex items-center justify-between w-full h-12 bg-sidebar rounded-b-xl px-4">
            <Link href={org.data ? `/app/${org.data.slug}` : "/app"}>
                <Logo className="h-full w-10" />
            </Link>
            {org.data && (
                <Link href={`/app/${org.data.slug}`}>
                    <h1 className="font-medium">
                        {org.data.name}
                    </h1>
                </Link>
            )}
            <div className="flex items-center gap-2">
                <UserProfile />
                <SidebarTrigger />
            </div>
        </div>
    )
}