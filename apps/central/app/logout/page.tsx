import { Loader2 } from "lucide-react"
import LogoutComponent from "./logout"
import { SearchParams } from "@/lib/utils"
export default async function Logout({ searchParams }: { searchParams: Promise<SearchParams> }) {
    const params = await searchParams;

    return (
        <div className="w-screen h-screen flex items-center justify-center flex-col gap-4">
            <Loader2 className="size-6 text-muted-foreground animate-spin" />
            <p className="text-muted-foreground">We&apos;re sorry to see you go!</p>
            <LogoutComponent searchParams={params} />
        </div>
    )
}