'use client'

import GoogleIcon from "@/components/icons/google";
import { Button } from "@/components/ui/button";
import authClient, { signIn } from "@/lib/auth-client";
import { Github, KeyRound, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

type LoginOption = "passkey" | "github" | "google"

export default function LoginButton() {
    const [isLoading, setIsLoading] = useState<LoginOption | null>(null)
    const [passkeyError, setPasskeyError] = useState<string | null>(null)
    const [isPasskeyAvailable, setIsPasskeyAvailable] = useState<boolean>(false)
    const router = useRouter()

    useEffect(() => {
        const checkPasskeyAvailability = async () => {
            try {
                const isAvailable = await PublicKeyCredential.isConditionalMediationAvailable?.()
                setIsPasskeyAvailable(!!isAvailable)
                
                if (isAvailable) {
                    try {
                        await authClient.signIn.passkey({ autoFill: true })
                    } catch (error) {
                        console.error('Auto-fill passkey error:', error)
                        setPasskeyError('Failed to auto-fill passkey. Please try manual login.')
                    }
                }
            } catch (error) {
                console.error('Passkey availability check error:', error)
                setIsPasskeyAvailable(false)
            }
        }

        void checkPasskeyAvailability()
    }, [])

    const login = useCallback(async (type: LoginOption) => {
        setIsLoading(type)
        setPasskeyError(null)

        try {
            switch (type) {
                case "github":
                    await signIn.social({
                        provider: "github",
                        callbackURL: window.location.origin + "/app",
                        errorCallbackURL: window.location.origin + "/error",
                        newUserCallbackURL: window.location.origin + "/app/welcome"
                    })
                    break;
                case "google":
                    await authClient.signIn.social({
                        provider: "google",
                        callbackURL: window.location.origin + "/app",
                        errorCallbackURL: window.location.origin + "/error",
                        newUserCallbackURL: window.location.origin + "/app/welcome"
                    })
                    break;
                case "passkey":
                    try {
                        const res = await authClient.signIn.passkey()
                        if (res?.error) {
                            setPasskeyError("Passkey sign in failed. Please try again.")
                            toast.error("Passkey sign in failed")
                        } else {
                            toast.success("Passkey sign in successful")
                            router.push("/app")
                        }
                    } catch (error) {
                        console.error('Passkey sign in error:', error)
                        setPasskeyError("An error occurred during passkey sign in. Please try again.")
                        toast.error("Passkey sign in failed")
                    }
                    break;
            }
        } catch (error) {
            console.error('Login error:', error)
            toast.error("Login failed. Please try again.")
        } finally {
            setIsLoading(null)
        }
    }, [router])

    return (
        <div className="flex flex-col items-center justify-center gap-4">
            <Button className="md:w-72 w-68 shadow-sm" disabled={isLoading !== null} onClick={() => login("github")}>
                {isLoading == "github" ? <Loader2 className="w-4 h-4 ml-2 animate-spin" /> : <Github className="w-4 h-4" />}
                Login with Github
            </Button>
            <Button className="md:w-72 w-68 shadow-sm" disabled={isLoading !== null} onClick={() => login("google")}>
                {isLoading == "google" ? <Loader2 className="w-4 h-4 ml-2 animate-spin" /> : (
                    <GoogleIcon className="w-4 h-4" />
                )}
                Login with Google
            </Button>
            <Button 
                className="md:w-72 w-68 shadow-sm" 
                disabled={isLoading !== null || !isPasskeyAvailable} 
                onClick={() => login("passkey")}
            >
                {isLoading == "passkey" ? <Loader2 className="w-4 h-4 ml-2 animate-spin" /> : <KeyRound className="w-4 h-4" />}
                Login with Passkey
            </Button>
            {passkeyError && (
                <p className="text-sm text-destructive mt-2 text-center w-full">{passkeyError}</p>
            )}
            {!isPasskeyAvailable && (
                <p className="text-sm text-muted-foreground mt-2 text-center w-full">
                    Passkey login is not available on this device. Please use another login method.
                </p>
            )}
        </div>
    )
}