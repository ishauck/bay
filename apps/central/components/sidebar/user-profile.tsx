import { useSession } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut, Sun, Moon } from "lucide-react";
import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";

function SessionIcon() {
    const user = useSession()
    const userData = user.data?.user

    return (
        <>
            {userData?.image ? (
                <Avatar>
                    <AvatarImage src={userData.image} />
                    <AvatarFallback className="bg-blue-600 text-white">
                        {userData?.name?.charAt(0)}
                    </AvatarFallback>
                </Avatar>
            ) : (
                <Skeleton className="size-8 aspect-square rounded-full" />
            )}
            <span className="sr-only">{userData?.name}</span>
        </>
    )
}

export default function UserProfile() {
    const user = useSession()
    const router = useRouter()
    const { resolvedTheme, setTheme } = useTheme()
    const userData = user.data?.user
    const logout = useCallback(async () => {
        router.push("/logout")
    }, [router])

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost" className="rounded-full">
                    <SessionIcon />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel className="flex flex-row items-center gap-2">
                    <SessionIcon />
                    <div className="flex flex-col">
                        {userData ? (
                            <>
                                <span className="text-sm font-medium">{userData?.name}</span>
                                <span className="text-xs text-muted-foreground">{userData?.email}</span>
                            </>
                        ) : (
                            <>
                                <Skeleton className="h-4 w-24 mb-1" />
                                <Skeleton className="h-3 w-17" />
                            </>
                        )}
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => {
                    setTheme(resolvedTheme === "dark" ? "light" : "dark");
                }}>
                    {resolvedTheme === "light" ? (
                        <Sun className="w-4 h-4" />
                    ) : (
                        <Moon className="w-4 h-4" />
                    )}
                    Toggle Theme
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                    <LogOut className="w-4 h-4" />
                    Logout
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}