'use client'

import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/auth-client";
import { env } from "@/lib/env";
import { Github, Loader2 } from "lucide-react";
import { useCallback, useState } from "react";

export default function LoginButton() {
    const [isLoading, setIsLoading] = useState(false)
    const login = useCallback(async () => {
        setIsLoading(true)
        if (window.location.origin == env.NEXT_PUBLIC_AUTH_URL) {
            await signIn.social({
                provider: "github",
                callbackURL: "/app",
                errorCallbackURL: "/error",
                newUserCallbackURL: "/app/welcome",
            })
        } else {
            await signIn.social({
                provider: "github",
                callbackURL: window.location.origin + "/app",
                errorCallbackURL: window.location.origin + "/error",
                newUserCallbackURL: window.location.origin + "/app/welcome"
            }, {
                onSuccess: () => {
                    setIsLoading(false)
                },
                onError: () => {
                    setIsLoading(false)
                }
            })
        }
        setIsLoading(false)
    }, [])
    return <Button className="md:w-72 w-68 shadow-sm" variant="outline" disabled={isLoading} onClick={login}>
        {isLoading ? <Loader2 className="w-4 h-4 ml-2 animate-spin" /> : <Github className="w-4 h-4" />}
        Login with Github
    </Button>
}