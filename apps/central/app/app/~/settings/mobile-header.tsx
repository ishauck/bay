'use client'

import Logo from "@/components/logo"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useIsMobile } from "@/hooks/use-mobile"
import Link from "next/link"
import UserProfile from "@/components/sidebar/user-profile"
export default function MobileHeader() {
    const isMobile = useIsMobile()
    if (!isMobile) return null

    return (
        <div className="flex items-center justify-between w-full h-12 bg-sidebar rounded-b-xl px-4">
            <Link href={`/app/`}>
                <Logo className="h-full w-10" />
            </Link>
            <Link href={`/app/~/settings`}>
                <h1 className="font-medium">
                    Settings
                </h1>
            </Link>
            <div className="flex items-center gap-2">
                <UserProfile />
                <SidebarTrigger />
            </div>
        </div>
    )
}