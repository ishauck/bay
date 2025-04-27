'use client'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuTrigger } from "@/components/ui/context-menu";
import { Skeleton } from "@/components/ui/skeleton";
import authClient, { useSession } from "@/lib/auth-client";
import { OrganizationPartial } from "@/types/auth";
import { useQuery } from "@tanstack/react-query";
import * as changeCase from "change-case";
import { Settings, Users, CopyIcon, TextIcon } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function Workspace({ organization }: { organization: OrganizationPartial }) {
    const session = useSession();
    const query = useQuery({
        queryKey: ['organization', organization.id],
        queryFn: () => authClient.organization.getFullOrganization({
            query: {
                organizationId: organization.id
            }
        })
    })

    if (query.isLoading) {
        return (
            <div className="flex flex-row gap-2 items-center p-2 w-full justify-start h-12 transition-none">
                <Skeleton className="size-10 rounded-full" />
                <div className="flex flex-col items-start gap-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-16" />
                </div>
            </div>
        )
    }

    if (query.error) {
        return null;
    }

    if (!query.data || !query.data.data) {
        return null;
    }

    const org = query.data.data;

    const member = org.members.find((member) => member.userId === session.data?.user?.id);

    return (
        <li>
            <ContextMenu>
                <ContextMenuTrigger asChild>
                    <Button asChild variant={"ghost"} className="flex flex-row gap-2 items-center p-2 w-full justify-start h-12 transition-none">
                        <Link href={`/app/settings/o/${organization.slug}`}>
                            <Avatar className="size-10">
                                <AvatarImage src={organization.logo || ""} />
                                <AvatarFallback>
                                    {organization.name.slice(0, 2)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col items-start gap-1">
                                <p className="text-sm font-medium pointer-events-none">{organization.name}</p>
                                <p className="text-xs text-muted-foreground pointer-events-none">
                                    {org ? changeCase.capitalCase(member?.role || "") : 'Loading members...'}
                                </p>
                            </div>
                        </Link>
                    </Button>
                </ContextMenuTrigger>
                <ContextMenuContent>
                    <ContextMenuItem asChild>
                        <Link href={`/app/settings/o/${organization.slug}`}>
                            <Settings className="size-4" />
                            Workspace Settings
                        </Link>
                    </ContextMenuItem>
                    <ContextMenuItem asChild>
                        <Link href={`/app/settings/o/${organization.slug}/members`}>
                            <Users className="size-4" />
                            Members
                        </Link>
                    </ContextMenuItem>
                    <ContextMenuSeparator />
                    <ContextMenuItem onClick={() => {
                        navigator.clipboard.writeText(organization.slug);
                        toast.success("Workspace slug copied to clipboard");
                    }}>
                        <TextIcon className="size-4" />
                        Copy Workspace Slug
                    </ContextMenuItem>
                    <ContextMenuItem onClick={() => {
                        navigator.clipboard.writeText(organization.id);
                        toast.success("Workspace ID copied to clipboard");
                    }}>
                        <CopyIcon className="size-4" />
                        Copy Workspace ID
                    </ContextMenuItem>
                </ContextMenuContent>
            </ContextMenu>
        </li>
    )
}