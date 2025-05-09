import Logo from "@/components/logo";
import { useWelcomeStore } from "@/components/provider/welcome-store";
import { useState } from "react";
import { NameSlugForm } from "@/components/shared/name-slug-form";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function WorkspaceCreator() {
    const [isLoading, setIsLoading] = useState(false);
    const nextStep = useWelcomeStore((state) => state.nextStep);
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

            nextStep();
            router.push(`/app/${values.slug}`);
        } catch (error) {
            console.error('Failed to create workspace:', error);
            toast.error('Failed to create workspace');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex flex-col items-center gap-4">
            <Logo className="w-12" />
            <h1 className="text-4xl font-bold text-center">Workspace Creator</h1>
            <p className="text-sm text-muted-foreground text-center">
                Create a workspace to get started.
            </p>
            <NameSlugForm 
                onSubmit={onSubmit}
                isLoading={isLoading}
                nameLabel="Workspace Name"
                nameDescription="This is the display name of your workspace"
                slugLabel="Workspace Slug"
                slugDescription="This will be used in your workspace URL"
                submitLabel="Create Workspace"
            />
        </div>
    );
}