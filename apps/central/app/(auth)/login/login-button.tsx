'use client'

import { Button } from "@/components/ui/button";
import authClient, { signIn } from "@/lib/auth-client";
import { Github, Loader2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

type LoginOption = "passkey" | "github" | "google"

export default function LoginButton() {
    const [isLoading, setIsLoading] = useState<LoginOption | null>(null)

    useEffect(() => {
        if (!PublicKeyCredential.isConditionalMediationAvailable ||
            !PublicKeyCredential.isConditionalMediationAvailable()) {
            return;
        }

        // Check if there are any existing passkeys
        navigator.credentials.get({
            mediation: 'conditional',
            publicKey: {
                challenge: new Uint8Array(32),
                rpId: window.location.hostname,
                allowCredentials: [],
                timeout: 60000,
            }
        }).then((credential) => {
            if (credential) {
                toast("Passkey detected", {
                    description: "Would you like to use a passkey to login?",
                    action: {
                        label: "Use Passkey",
                        onClick: () => {
                            authClient.signIn.passkey()
                        }
                    }
                })
            }
        }).catch(() => {
            // No passkeys found or error occurred
            return;
        })
    }, [])

    const login = useCallback(async (type: LoginOption) => {
        setIsLoading(type)
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
        }
        setIsLoading(null)
    }, [])
    return (
        <>
            <Button className="md:w-72 w-68 shadow-sm" disabled={isLoading !== null} onClick={() => login("github")}>
                {isLoading == "github" ? <Loader2 className="w-4 h-4 ml-2 animate-spin" /> : <Github className="w-4 h-4" />}
                Login with Github
            </Button>
            <Button className="md:w-72 w-68 shadow-sm" disabled={isLoading !== null} onClick={() => login("google")}>
                {isLoading == "google" ? <Loader2 className="w-4 h-4 ml-2 animate-spin" /> : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="0.98em" height="1em" viewBox="0 0 256 262">
                        <path fill="#4285F4" d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"></path>
                        <path fill="#34A853" d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"></path>
                        <path fill="#FBBC05" d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"></path>
                        <path fill="#EB4335" d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"></path>
                    </svg>
                )}
                Login with Google
            </Button>
        </>
    )
}