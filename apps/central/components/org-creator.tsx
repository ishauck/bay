'use client'
import { useAppStore } from "./provider/app-store";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogTitle } from "./ui/alert-dialog";
import Logo from "./logo";
import { NameSlugForm } from "./shared/name-slug-form";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";

export default function OrgCreator() {
    const [isLoading, setIsLoading] = useState(false);
    const isWorkspaceCreatorShowing = useAppStore((state) => state.isWorkspaceCreatorShowing);
    const setIsWorkspaceCreatorShowing = useAppStore((state) => state.setIsWorkspaceCreatorShowing);
    const router = useRouter();

    const onSubmit = async (values: { name: string; slug: string }) => {
        try {
            setIsLoading(true);
            const org = await authClient.organization.create({
                name: values.name,
                slug: values.slug
            });
            
            if (org.error) {
                toast.error(org.error.message);
                return;
            }

            setIsWorkspaceCreatorShowing(false);
            router.push(`/app/${values.slug}`);
        } catch (error) {
            console.error('Failed to create organization:', error);
            toast.error('Failed to create organization');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <AlertDialog open={isWorkspaceCreatorShowing} onOpenChange={setIsWorkspaceCreatorShowing}>
            <AlertDialogContent className="p-0 overflow-hidden">
                <div className="flex flex-col w-full h-24 bg-accent dark:bg-white/10 text-accent-foreground p-2 items-center justify-center">
                    <Logo className="h-6" />
                    <AlertDialogTitle>Create Workspace</AlertDialogTitle>
                    <AlertDialogDescription>
                        Create a new workspace to start using Bay.
                    </AlertDialogDescription>
                </div>
                <div className="p-4">
                    <NameSlugForm 
                        onSubmit={onSubmit}
                        isLoading={isLoading}
                        nameLabel="Workspace Name"
                        nameDescription="This is the display name of your workspace"
                        slugLabel="Workspace Slug"
                        slugDescription="This will be used in your workspace URL"
                        submitLabel="Create Workspace"
                        alertDialog={true}
                    />
                </div>
            </AlertDialogContent>
        </AlertDialog>
    );
}