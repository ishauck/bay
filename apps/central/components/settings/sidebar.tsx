'use client'
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"
import Logo from "../logo"
import UserProfile from "../sidebar/user-profile"
import { useIsMobile } from "@/hooks/use-mobile"
import { useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, UserIcon, LockIcon } from "lucide-react"
import { Button } from "../ui/button"

export function SettingsSidebar() {
    const { setOpen } = useSidebar()
    const isMobile = useIsMobile()

    useEffect(() => {
        if (!isMobile) {
            setOpen(true)
        }
    }, [isMobile, setOpen])

    return (
        <Sidebar variant="inset">
            <SidebarHeader>
                <div className="h-10 flex flex-row items-center justify-between w-full px-2">
                    <Link href="/app">
                        <Logo className="h-full w-10" />
                    </Link>
                    <UserProfile />
                </div>
                <Button className="flex-1" asChild>
                    <Link href="/app">
                        <ArrowLeft className="w-4 h-4" />
                        Exit Settings
                    </Link>
                </Button>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Settings</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <Link href="/app/~/settings">
                                        <UserIcon className="w-4 h-4" />
                                        <span>Account</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <Link href="/app/~/settings/login">
                                        <LockIcon className="w-4 h-4" />
                                        <span>Login Methods</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}
