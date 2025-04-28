'use client'
import useKeybind from "@/hooks/use-keybind";
import { useAppStore } from "./app-store";
import { useRouter, usePathname } from "next/navigation";
import { useCurrentOrganizationSlug } from "@/hooks/use-current-org";
import { useCallback } from "react";

export function KeybindProvider({ children }: { children: React.ReactNode }) {
    const setIsWorkspaceCreatorShowing = useAppStore((state) => state.setIsWorkspaceCreatorShowing);
    const pathname = usePathname();
    const orgSlug = useCurrentOrganizationSlug();
    const router = useRouter();

    const goToNewForm = useCallback(() => {
        router.push(`/app/${orgSlug}/new/form?back=${pathname}`);
    }, [router, orgSlug, pathname]);

    useKeybind("c,w", () => {
        setIsWorkspaceCreatorShowing(true);
    });

    useKeybind("c,f", goToNewForm);

    useKeybind("n", goToNewForm);

    return <>{children}</>;
}
