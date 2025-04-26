'use client'
import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";
import Image from "next/image";
import { useTheme } from "next-themes";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    const { resolvedTheme, setTheme } = useTheme()
    const toggleTheme = () => {
        setTheme(resolvedTheme === "dark" ? "light" : "dark")
    }
    return <div className="w-screen h-screen flex flex-col md:flex-row">
        <div className="w-full h-1/2 md:w-1/2 md:h-full p-3">
            <div className="rounded-lg w-full h-full p-3 inset-0 relative md:shadow-lg">
                <Image
                    src={resolvedTheme === "dark" ? "/images/login-dark.jpg" : "/images/login-light.jpg"}
                    alt="Login background"
                    fill
                    className="object-cover rounded-lg absolute inset-0"
                    priority
                    suppressHydrationWarning
                />

                <Logo className="w-10 h-10 text-white relative z-10" />
                <Button onClick={toggleTheme} className="uppercase absolute top-2 right-2 bg-foreground/50 rounded-full text-xs font-mono hover:bg-foreground/70 text-background py-0.5 backdrop-blur-xl" variant="custom">
                    <span suppressHydrationWarning>
                        {resolvedTheme === "dark" ? <Sun suppressHydrationWarning className="w-4 h-4" /> : <Moon suppressHydrationWarning className="w-4 h-4" />}
                    </span>
                    <span>Toggle Theme</span>
                </Button>
                <p className="text-white text-sm absolute bottom-2 left-2 z-10 [&_a]:text-white [&_a]:underline">Photo by{" "}
                    <a href="https://unsplash.com/@atharvapatil">Atharva Patil</a>.
                </p>
            </div>
        </div>
        {children}
    </div>
}