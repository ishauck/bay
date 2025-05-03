'use client'
import { useEffect, useState } from "react";
import { useCurrentOrganization } from "@/hooks/use-current-org";
import { notFound, usePathname } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import FormList from "./form-list";
import Link from "next/link";

export default function OrgPage() {
  const [mounted, setMounted] = useState(false);
  const org = useCurrentOrganization();
  const session = useSession();
  const isMobile = useIsMobile();
  const pathname = usePathname();
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (org.data?.name) {
      document.title = org.data.name;
    }
  }, [org.data?.name]);



  if (!mounted || org.isPending) {
    return (
      <div className="flex flex-col gap-4 w-full h-48 bg-accent/30 dark:bg-white/5 p-6 animate-pulse">
      </div>
    )
  }

  if (org.error) {
    return (
      <div className="flex items-center justify-center w-full h-48 bg-destructive/10 dark:bg-destructive/20 p-6 border border-destructive">
        <p className="text-destructive">Error: {org.error.message}</p>
      </div>
    );
  }

  const data = org.data;

  if (!data) {
    notFound();
  }

  return (
    <div className="p-6">
      <div className="space-y-4">
        <div className="space-y-3">
          <h1 className="text-4xl font-bold tracking-tight">
            Welcome back, {session.data?.user?.name}!
          </h1>
          <p className="text-lg text-muted-foreground">
            You are working in <span className="font-semibold">{data.name}</span>.
          </p>
        </div>

        <div className="grid gap-6 w-fit sm:grid-cols-2 lg:grid-cols-3">
          <Button
            className="md:h-auto md:w-72 md:p-6 md:flex md:flex-col md:gap-1 md:items-center md:hover:bg-accent/50 md:transition-colors"
            variant={isMobile ? "default" : "outline"}
            asChild
          >
            <Link href={`/app/${data.slug}/new/form?back=${encodeURIComponent(pathname)}`}>
              {isMobile ? (
                <>
                  <Plus />
                  <span>Create a new form</span>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <Plus className="w-6 h-6 text-primary" />
                    <span className="font-semibold text-base">Create a new form</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Start from scratch or use a template
                  </p>
                </>
              )}
            </Link>
          </Button>
        </div>
      </div>
      <FormList />
    </div>
  );
}