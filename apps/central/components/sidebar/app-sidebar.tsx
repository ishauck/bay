'use client'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
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
import UserProfile from "./user-profile"
import { useIsMobile } from "@/hooks/use-mobile"
import { useEffect } from "react"
import Link from "next/link"
import { OrganizationSwitcher } from "./org-switcher"
import { Home, Settings } from "lucide-react"

export function AppSidebar() {
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
        <OrganizationSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem key="home">
                <SidebarMenuButton asChild>
                  <Link href="/app">
                    <Home />
                    <span>Home</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/app/~/settings">
                <Settings />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
