import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Workspace from "./workspace";
export default async function WorkspacesList() {
    try {
        const organizations = await auth.api.listOrganizations({
            headers: await headers()
        });
        if (!organizations || organizations.length === 0) {
            return (
                <div className="flex flex-col gap-2">
                    <p className="text-sm text-muted-foreground">No workspaces found.</p>
                </div>
            );
        }

        return (
            <ul className="flex flex-col gap-2">
                {organizations.map((organization) => (
                    <Workspace key={organization.id} organization={organization} />
                ))}
            </ul>
        );
    } catch (error) {
        console.error('Failed to fetch workspaces:', error);
        return (
            <div className="flex flex-col gap-2">
                <p className="text-sm text-destructive">Failed to load workspaces. Please try again later.</p>
            </div>
        );
    }
}