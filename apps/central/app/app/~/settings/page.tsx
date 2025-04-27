import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import WorkspacesList from "./workspaces-list";

export default async function Settings() {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session) {
        return null;
    }

    return (
        <div className="p-4">
            <h1 className="md:text-4xl text-2xl font-bold">
                Settings
            </h1>
            <p className="md:text-base text-sm text-muted-foreground">
                You&apos;re currently signed in as <span className="font-bold">{session.user?.email}</span>.
            </p>
            <div className="flex flex-col gap-4">
                <div className="flex flex-row gap-4">
                    <Card className="shadow-xs md:w-1/2 w-full">
                        <CardHeader>
                            <CardTitle>Account Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 grid grid-cols-2 w-full gap-4">
                            <div className="flex flex-col gap-2">
                                <p className="text-sm text-muted-foreground">
                                    Email
                                </p>
                                <p className="text-sm font-medium">
                                    {session.user?.email}
                                </p>
                            </div>
                            <div className="flex flex-col gap-2">
                                <p className="text-sm text-muted-foreground">
                                    Name
                                </p>
                                <p className="text-sm font-medium">
                                    {session.user?.name}
                                </p>
                            </div>
                            <div className="flex flex-col gap-2">
                                <p className="text-sm text-muted-foreground">
                                    Account Created
                                </p>
                                <p className="text-sm font-medium">
                                    {new Date(session.user?.createdAt || '').toLocaleDateString()}
                                </p>
                            </div>
                            <div className="flex flex-col gap-2">
                                <p className="text-sm text-muted-foreground">
                                    Last Updated
                                </p>
                                <p className="text-sm font-medium">
                                    {new Date(session.user?.updatedAt || '').toLocaleDateString()}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div className="flex flex-col gap-4">
                    <h2 className="text-xl font-medium">Workspaces</h2>
                    <WorkspacesList />
                </div>
            </div>
        </div>
    );
}