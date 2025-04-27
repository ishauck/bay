'use client'

import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/auth-client";
import { Github, Loader2 } from "lucide-react";
import { useCallback, useState } from "react";

export default function LoginButton() {
    const [isLoading, setIsLoading] = useState(false)
    const login = useCallback(async () => {
        setIsLoading(true)
        await signIn.social({
            provider: "github",
            callbackURL: process.env.VERCEL_URL + "/app",
            errorCallbackURL: process.env.VERCEL_URL + "/error",
            newUserCallbackURL: process.env.VERCEL_URL + "/app/welcome"
        })
        setIsLoading(false)
    }, [])

    return <Button className="md:w-72 w-68 shadow-sm" variant="outline" disabled={isLoading} onClick={login}>
        {isLoading ? <Loader2 className="w-4 h-4 ml-2 animate-spin" /> : <Github className="w-4 h-4" />}
        Login with Github
    </Button>
}