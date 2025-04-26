'use client'

import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/auth-client";
import { Github, Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { verifyRedirect } from "@/lib/server-actions";
import { env } from "@/lib/env";

export default function LoginButton() {
    const [isLoading, setIsLoading] = useState(false)
    const params = useSearchParams()
    const next = params.get("next")

    const login = useCallback(async () => {
        console.log('Starting login process...')
        setIsLoading(true)
        try {
            let redirectUrl = next || "/app";
            
            // If we're not in development and have a prod domain, redirect to prod
            if (process.env.NODE_ENV !== 'development' && env.NEXT_PUBLIC_PROD_DOMAIN) {
                const currentUrl = new URL(window.location.href);
                const isLocalhost = currentUrl.hostname === 'localhost' || currentUrl.hostname === '127.0.0.1';
                
                if (!isLocalhost) {
                    const prodUrl = new URL(env.NEXT_PUBLIC_PROD_DOMAIN);
                    redirectUrl = `${prodUrl.origin}${redirectUrl}`;
                }
            }

            if (redirectUrl) {
                console.log('Next URL detected:', redirectUrl)
                const result = await verifyRedirect(redirectUrl)
                
                if (!result.success) {
                    toast.error('Redirect verification failed', {
                        description: result.error
                    })
                    return
                }
                console.log('Redirect verification successful')
            }

            console.log('Initiating GitHub login...')
            // Proceed with login
            await signIn.social({
                provider: "github",
                callbackURL: redirectUrl,
                errorCallbackURL: "/error",
                newUserCallbackURL: "/app/welcome"
            })
            console.log('GitHub login initiated successfully')
        } catch (error) {
            console.error('Login error:', error);
            if (error instanceof Error) {
                console.error('Error details:', {
                    message: error.message,
                    stack: error.stack,
                    name: error.name
                });
                toast.error('Login failed', {
                    description: error.message
                })
            } else {
                toast.error('Login failed', {
                    description: 'An unknown error occurred'
                })
            }
        } finally {
            console.log('Login process completed')
            setIsLoading(false)
        }
    }, [next])

    return <Button className="md:w-72 w-68 shadow-sm" variant="outline" disabled={isLoading} onClick={login}>
        {isLoading ? <Loader2 className="w-4 h-4 ml-2 animate-spin" /> : <Github className="w-4 h-4" />}
        Login with Github
    </Button>
}