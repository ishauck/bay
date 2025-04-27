'use client'
import GithubIcon from "@/components/icons/github"
import GoogleIcon from "@/components/icons/google"
import { Button } from "@/components/ui/button"
import authClient, { useSession } from "@/lib/auth-client"
import { PlusIcon, TrashIcon, Loader2, KeyRound, PencilIcon } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import React, { useState } from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { usePathname } from "next/navigation"
import { toast } from "sonner"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import * as changeCase from "change-case"
import Link from "next/link"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

function LoginMethodIcon({ provider, props }: { provider: string, props?: React.SVGProps<SVGSVGElement> }) {
    if (provider === "github") {
        return <GithubIcon {...props} />
    }
    if (provider === "google") {
        return <GoogleIcon {...props} />
    }
    if (provider === "passkey") {
        return <KeyRound {...props} />
    }
    return null
}

interface LoginMethodProps {
    account: {
        id: string;
        provider: string;
        accountId: string;
        createdAt: Date;
    };
    isLast: boolean;
    onUnlink: (providerId: string, accountId: string) => Promise<void>;
}

function LoginMethod({ account, onUnlink, isLast }: LoginMethodProps) {
    const [isUnlinking, setIsUnlinking] = useState(false)
    const [showConfirmDialog, setShowConfirmDialog] = useState(false)

    const handleUnlink = async () => {
        try {
            setIsUnlinking(true)
            await onUnlink(account.provider, account.accountId)
            toast.success(`${account.provider} account unlinked successfully`)
        } catch (err) {
            console.error('Failed to unlink account:', err)
            toast.error(`Failed to unlink ${account.provider} account`)
        } finally {
            setIsUnlinking(false)
            setShowConfirmDialog(false)
        }
    }

    return (
        <>
            <li
                data-provider={account.provider}
                className="flex flex-row items-center gap-4 p-4 rounded-lg border border-border/50 hover:bg-border/30 dark:hover:bg-card/50 group transition-colors duration-200"
                key={account.id}
            >
                <LoginMethodIcon
                    props={{
                        className: "size-8 group-data-[provider=github]:fill-foreground transition-colors duration-200"
                    }}
                    provider={account.provider}
                />
                <div className="flex flex-col flex-1">
                    <span className="font-medium capitalize text-foreground/90">{account.provider}</span>
                    <span className="text-sm text-muted-foreground">Connected on {new Date(account.createdAt).toLocaleDateString()}</span>
                </div>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                disabled={account.provider === "email" || isLast || isUnlinking}
                                onClick={() => setShowConfirmDialog(true)}
                                variant="ghost"
                                size="icon"
                                className="hover:bg-destructive/10 hover:text-destructive"
                                aria-label="Delete login method"
                            >
                                {isUnlinking ? <Loader2 className="size-4 animate-spin" /> : <TrashIcon className="size-4" />}
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            {account.provider === "email" ? (
                                <p>You cannot delete your email account.</p>
                            ) : isLast ? (
                                <p>You cannot delete your only login method.</p>
                            ) : (
                                <p>Delete</p>
                            )}
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </li>

            <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Unlink {changeCase.capitalCase(account.provider)} account?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will remove your {changeCase.capitalCase(account.provider)} account as a login method. You can always add it back later.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleUnlink} disabled={isUnlinking}>
                            {isUnlinking ? <Loader2 className="size-4 animate-spin mr-2" /> : null}
                            Unlink Account
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

interface Passkey {
    id: string;
    name?: string;
    deviceType: string;
    createdAt: Date;
    credentialID: string;
    transports?: string;
}

function PasskeyList() {
    const [isEditing, setIsEditing] = useState<string | null>(null)
    const [newName, setNewName] = useState("")
    const { data: session } = useSession()
    const passkeys = useQuery({
        queryKey: ["passkeys"],
        queryFn: () => authClient.passkey.listUserPasskeys()
    })

    if (passkeys.isLoading) {
        return (
            <div className="flex items-center justify-center p-8">
                <Loader2 className="size-8 animate-spin" />
            </div>
        )
    }

    const handleDeletePasskey = async (id: string) => {
        try {
            // First, try to remove from the device's credential store
            try {
                // This will remove all passkeys for this domain from the device's credential store
                await navigator.credentials.preventSilentAccess()
            } catch (err) {
                // Ignore errors from credential store removal
                console.log('Error removing from credential store:', err)
            }

            // Then remove from our database
            await authClient.passkey.deletePasskey({ id })
            passkeys.refetch()
            toast.success("Passkey deleted successfully")
        } catch (err) {
            console.error('Failed to delete passkey:', err)
            toast.error("Failed to delete passkey")
        }
    }

    const handleEditPasskey = async (id: string) => {
        const passkey = passkeys.data?.data?.find(p => p.id === id)
        if (passkey) {
            setNewName(passkey.name || "")
            setIsEditing(id)
        }
    }

    const handleSaveEdit = async () => {
        if (!isEditing) return

        try {
            await authClient.passkey.updatePasskey({
                id: isEditing,
                name: newName
            })
            passkeys.refetch()
            toast.success("Passkey name updated successfully")
            setIsEditing(null)
            setNewName("")
        } catch (err) {
            console.error('Failed to update passkey:', err)
            toast.error("Failed to update passkey name")
        }
    }

    if (passkeys.isLoading) {
        return (
            <div className="flex items-center justify-center p-8">
                <Loader2 className="size-8 animate-spin" />
            </div>
        )
    }

    if (passkeys.error) {
        return (
            <div className="p-4 text-destructive">
                <p className="font-medium">Error loading passkeys</p>
                <p className="text-sm">{passkeys.error.message}</p>
            </div>
        )
    }

    const passkeysData = passkeys.data?.data
    if (!passkeysData) {
        return (
            <div className="p-4 text-destructive">
                <p className="font-medium">Error loading passkeys</p>
                <p className="text-sm">{passkeys.data?.error?.message}</p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold">Passkeys</h2>
            {passkeysData.length === 0 ? (
                <div className="text-center p-8 border rounded-lg">
                    <p className="text-muted-foreground">No passkeys added yet</p>
                    <p className="text-sm text-muted-foreground mt-2">Add a passkey to get started</p>
                </div>
            ) : (
                <ul className="flex flex-col gap-2">
                    {passkeysData.map((passkey: Passkey) => (
                        <li
                            key={passkey.id}
                            className="flex flex-row items-center gap-4 p-4 rounded-lg border border-border/50 hover:bg-border/30 dark:hover:bg-card/50 group transition-colors duration-200"
                        >
                            <KeyRound className="size-8" />
                            <div className="flex flex-col flex-1">
                                <span className="font-medium text-foreground/90">{passkey.name || "Unnamed Passkey"}</span>
                                <span className="text-sm text-muted-foreground">
                                    {changeCase.capitalCase(passkey.deviceType)} • Created on {new Date(passkey.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <div className="flex gap-2">
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                onClick={() => handleEditPasskey(passkey.id)}
                                                variant="ghost"
                                                size="icon"
                                                className="hover:bg-primary/10 hover:text-primary"
                                                aria-label="Edit passkey"
                                            >
                                                <PencilIcon className="size-4" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Edit Passkey</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                onClick={() => handleDeletePasskey(passkey.id)}
                                                variant="ghost"
                                                size="icon"
                                                className="hover:bg-destructive/10 hover:text-destructive"
                                                aria-label="Delete passkey"
                                            >
                                                <TrashIcon className="size-4" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Delete Passkey</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            <AlertDialog open={!!isEditing} onOpenChange={(open) => !open && setIsEditing(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Edit Passkey Name</AlertDialogTitle>
                        <AlertDialogDescription>
                            Enter a new name for your passkey to help you identify it.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="py-4">
                        <Label htmlFor="passkey-name">Passkey Name</Label>
                        <Input
                            id="passkey-name"
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            placeholder={`${session?.user?.name}'s Passkey`}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleSaveEdit}>Save</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

export default function LoginMethods() {
    const accounts = useQuery({
        queryKey: ["accounts"],
        queryFn: () => authClient.listAccounts()
    })
    const path = usePathname()
    const [isLinking, setIsLinking] = useState<"google" | "github" | null>(null)

    const handleLinkSocial = async (provider: "google" | "github") => {
        try {
            setIsLinking(provider)
            await authClient.linkSocial({
                provider,
                callbackURL: provider === "google" ? window.location.origin + path : undefined
            })
            toast.success(`${changeCase.capitalCase(provider)} account linked successfully`)
        } catch (err) {
            console.error('Failed to link account:', err)
            toast.error(`Failed to link ${changeCase.capitalCase(provider)} account`)
        } finally {
            setIsLinking(null)
        }
    }

    const handleUnlinkAccount = async (providerId: string, accountId: string) => {
        await authClient.unlinkAccount({
            providerId,
            accountId
        })
        accounts.refetch()
    }

    if (accounts.isLoading) {
        return (
            <div className="flex items-center justify-center p-8">
                <Loader2 className="size-8 animate-spin" />
            </div>
        )
    }

    if (accounts.error) {
        return (
            <div className="p-4 text-destructive">
                <p className="font-medium">Error loading login methods</p>
                <p className="text-sm">{accounts.error.message}</p>
            </div>
        )
    }

    const accountsData = accounts.data?.data
    if (!accountsData) {
        return (
            <div className="p-4 text-destructive">
                <p className="font-medium">Error loading login methods</p>
                <p className="text-sm">{accounts.data?.error?.message}</p>
            </div>
        )
    }

    return (
        <div className="p-4 space-y-6">
            <div className="flex flex-row items-center gap-2">
                <h1 className="md:text-4xl text-2xl font-bold flex-1">
                    Login Methods
                </h1>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon" aria-label="Add Login Method">
                            <PlusIcon className="size-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem
                            onClick={() => handleLinkSocial("google")}
                            disabled={isLinking === "google" || accountsData.some(account => account.provider === "google")}
                        >
                            {isLinking === "google" ? (
                                <Loader2 className="size-4 mr-2 animate-spin" />
                            ) : (
                                <GoogleIcon className="size-4 mr-2" />
                            )}
                            Google
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => handleLinkSocial("github")}
                            disabled={isLinking === "github" || accountsData.some(account => account.provider === "github")}
                        >
                            {isLinking === "github" ? (
                                <Loader2 className="size-4 mr-2 animate-spin" />
                            ) : (
                                <GithubIcon className="size-4 mr-2" />
                            )}
                            GitHub
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href={`/app/~/new/passkey?redirect=${encodeURIComponent(path)}&back=${encodeURIComponent(path + "?ref=passkey-reject")}`}>
                                <KeyRound className="size-4 mr-2" />
                                Passkey
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {accountsData.length === 0 ? (
                <div className="text-center p-8 border rounded-lg">
                    <p className="text-muted-foreground">No login methods added yet</p>
                    <p className="text-sm text-muted-foreground mt-2">Add a login method to get started</p>
                </div>
            ) : (
                <ul className="flex flex-col gap-2">
                    {accountsData.map((account) => (
                        <LoginMethod
                            key={account.id}
                            account={account}
                            isLast={accountsData.length === 1}
                            onUnlink={handleUnlinkAccount}
                        />
                    ))}
                </ul>
            )}

            <PasskeyList />
        </div>
    )
}