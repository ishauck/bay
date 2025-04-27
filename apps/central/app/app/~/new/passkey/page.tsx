'use client'
import Tilt from "react-parallax-tilt"
import { KeyRound, Loader2, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import authClient from "@/lib/auth-client"

export default function PasskeyPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [isCreating, setIsCreating] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const backUrl = searchParams.get('back')

    const createPasskey = async () => {
        try {
            setIsCreating(true)
            setError(null)
            
            const res = await authClient.passkey.addPasskey();

            if (res?.error) {
                switch (res.error.message) {
                    case "The operation either timed out or was not allowed. See: https://www.w3.org/TR/webauthn-2/#sctn-privacy-considerations-client.":
                        setError("Operation timed out or was not allowed. Please try again.")
                        break
                    case "previously registered":
                        setError("A passkey is already registered.")
                        break
                    default:
                        setError(JSON.stringify(res.error))
                }
                return
            }
            
            toast.success("Passkey created successfully!")
            router.push(searchParams.get('redirect') || '/app')
        } catch (err) {
            console.error('Failed to create passkey:', err)
            setError(err instanceof Error ? err.message : 'Failed to create passkey')
            toast.error("Failed to create passkey")
        } finally {
            setIsCreating(false)
        }
    }

    return (
        <div className="w-screen h-screen flex flex-col items-center justify-center gap-8 p-4">
            {backUrl && (
                <Button
                    variant="ghost"
                    className="absolute top-4 left-4"
                    onClick={() => router.push(backUrl)}
                >
                    <ArrowLeft className="size-4 mr-2" />
                    Back
                </Button>
            )}
            
            <Tilt
                perspective={500}
                glareEnable={true}
                glareMaxOpacity={0.45}
                scale={1.02}
                className="transform-3d rounded-xl p-4 size-20 bg-muted overflow-hidden"
            >
                <KeyRound className="size-12 translate-z-20" />
            </Tilt>
            
            <div className="flex flex-col items-center justify-center gap-4 max-w-md text-center">
                <h1 className="text-2xl font-bold">Create a New Passkey</h1>
                <p className="text-muted-foreground">
                    Passkeys are a secure and convenient way to sign in without passwords. 
                    They work across your devices and are protected by biometric authentication.
                </p>
                
                {error && (
                    <div className="flex items-center gap-2 text-destructive">
                        <span>{error}</span>
                    </div>
                )}
                
                <Button 
                    onClick={createPasskey}
                    disabled={isCreating}
                    className="w-full max-w-xs"
                >
                    {isCreating ? (
                        <>
                            <Loader2 className="size-4 mr-2 animate-spin" />
                            Creating Passkey...
                        </>
                    ) : (
                        <>
                            <KeyRound className="size-4 mr-2" />
                            Create Passkey
                        </>
                    )}
                </Button>
                
                <p className="text-sm text-muted-foreground">
                    You&apos;ll be prompted to authenticate using your device&apos;s biometric sensor or PIN.
                </p>
            </div>
        </div>
    )
}