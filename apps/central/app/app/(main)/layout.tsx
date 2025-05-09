import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/sidebar/app-sidebar"
import MobileHeader from "./mobile-header"
import { AppStoreProvider } from "@/components/provider/app-store"
import OrgCreator from "@/components/org-creator"
import { KeybindProvider } from "@/components/provider/keybind"
export default function Layout({ children }: { children: React.ReactNode }) {

    return (
        <AppStoreProvider>
            <KeybindProvider>
                <SidebarProvider className="h-screen! bg-sidebar-background relative flex flex-col md:flex-row">
                    <AppSidebar />
                    <MobileHeader />
                    <div className="w-full md:pt-1.5 flex-1 h-screen!">
                        <div className="relative h-full w-full bg-background pt-px md:rounded-tl-2xl md:border md:border-b-0 md:border-r-0 md:border-neutral-200/80 md:dark:border-neutral-700/80 overflow-y-auto flex flex-col">
                            {children}
                        </div>
                    </div>
                </SidebarProvider>
            </KeybindProvider>
            <OrgCreator />
        </AppStoreProvider>
    )
}
