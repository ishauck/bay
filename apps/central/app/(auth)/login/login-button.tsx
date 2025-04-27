'use client'

import { Button } from "@/components/ui/button";
import authClient, { signIn } from "@/lib/auth-client";
import { Github, Key, Loader2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export default function LoginButton() {
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (!PublicKeyCredential.isConditionalMediationAvailable ||
            !PublicKeyCredential.isConditionalMediationAvailable()) {
          return;
        }
      
       void authClient.signIn.passkey({ autoFill: true })
     }, [])

    const login = useCallback(async (type: "github" | "passkey") => {
        setIsLoading(true)
        switch (type) {
            case "github":
                await signIn.social({
                    provider: "github",
                    callbackURL: window.location.origin + "/app",
                    errorCallbackURL: window.location.origin + "/error",
                    newUserCallbackURL: window.location.origin + "/app/welcome"
                })
                break;
            case "passkey":
                await authClient.signIn.passkey()
                break;
        }
        setIsLoading(false)
    }, [])
    return (
        <>
            <Button className="md:w-72 w-68 shadow-sm" disabled={isLoading} onClick={() => login("github")}>
                {isLoading ? <Loader2 className="w-4 h-4 ml-2 animate-spin" /> : <Github className="w-4 h-4" />}
                Login with Github
            </Button>
            <Button className="md:w-72 w-68 shadow-sm" variant="outline" disabled={isLoading} onClick={() => login("passkey")}>
                {isLoading ? <Loader2 className="w-4 h-4 ml-2 animate-spin" /> : <Key className="w-4 h-4" />}
                Login with Passkey
            </Button>
        </>
    )
}