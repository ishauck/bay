'use client'
import authClient from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { User, Plus, Loader2 } from "lucide-react"
import Image from "next/image"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { useState } from "react";
import { useCurrentOrganization, useSetCurrentOrganizationSlug } from "@/hooks/use-current-org";
import { useAppStore } from "../provider/app-store";
import Link from "next/link"
import { usePathname } from "next/navigation";
export function OrganizationSwitcher() {
  const activeOrganization = useCurrentOrganization();
  const organizations = authClient.useListOrganizations();
  const setOrg = useSetCurrentOrganizationSlug();
  const setIsWorkspaceCreatorShowing = useAppStore((state) => state.setIsWorkspaceCreatorShowing);
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);

  if (typeof window === 'undefined' || organizations.isPending || activeOrganization.isPending) {
    return (
      <Button variant="outline" disabled>
        <User className="w-4 h-4" />
        Loading...
      </Button>
    );
  }

  if (organizations.error || !organizations.data) {
    if (organizations.error) {
      console.error(organizations.error)
    }
    return null;
  }

  if (organizations.data.length === 0 || activeOrganization.error) {
    return (
      <Button variant="outline" onClick={() => setIsWorkspaceCreatorShowing(true)}>
        <Plus className="w-4 h-4" />
        Create Workspace
      </Button>
    );
  }

  const activeOrgName = activeOrganization.data?.name || 'Select Workspace';

  return (
    <div className="h-10 flex flex-row items-center justify-between w-full px-2 gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="overflow-hidden shadow-xs hover:opacity-80" variant="ghost" size="icon" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              activeOrganization.data?.logo ? (
                <Image
                  src={activeOrganization.data?.logo}
                  alt={activeOrgName}
                  width={36}
                  height={36}
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-accent text-accent-foreground">
                  <p className="text-sm font-medium" aria-hidden="true">{activeOrgName.slice(0, 1)}</p>
                  <span className="sr-only">{activeOrgName}</span>
                </div>
              )
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="bottom" align="start" className="min-w-48">
          {organizations.data?.map((organization) => (
            <DropdownMenuItem onClick={async () => {
              setIsLoading(true);
              setOrg(organization.slug);
              setIsLoading(false);
            }} key={organization.id}>
              <div className="size-6 rounded-sm overflow-hidden text-xs">
                {
                  organization.logo ? (
                    <Image
                      src={organization.logo}
                      alt={organization.name}
                      width={36}
                      height={36}
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-accent text-accent-foreground">
                      <p className="text-sm font-medium" aria-hidden="true">{organization.name.slice(0, 1)}</p>
                      <span className="sr-only">{organization.name}</span>
                    </div>
                  )
                }
              </div>
              {organization.name}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setIsWorkspaceCreatorShowing(true)}>
            <Plus className="w-4 h-4" />
            Create Workspace
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Button className="flex-1" asChild>
        <Link href={`/app/${activeOrganization.data?.slug}/new/form?back=${encodeURIComponent(pathname)}`}>
          <Plus className="w-4 h-4" />
          Create Form
        </Link>
      </Button>
    </div>
  );
}
