import { SidebarProvider } from "@/components/ui/sidebar"
import MobileHeader from "./mobile-header"
import { SettingsSidebar } from "@/components/settings/sidebar"

export default function Layout({ children }: { children: React.ReactNode }) {

    return (
        <SidebarProvider className="h-screen bg-sidebar-background relative flex flex-col md:flex-row">
            <SettingsSidebar />
            <MobileHeader />
            <div className="w-full md:pt-1.5 flex-1">
                <div className="relative min-h-full w-full bg-background pt-px md:rounded-tl-2xl md:border md:border-b-0 md:border-r-0 md:border-neutral-200/80 md:dark:border-neutral-700/80 flex flex-col overflow-y-auto overflow-hidden">
                    {children}
                </div>
            </div>
        </SidebarProvider>
    )
}
