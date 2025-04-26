'use client'
import useKeybind from "@/hooks/use-keybind";
import { useAppStore } from "./app-store";

export function KeybindProvider({ children }: { children: React.ReactNode }) {
    const setIsWorkspaceCreatorShowing = useAppStore((state) => state.setIsWorkspaceCreatorShowing);
    
    useKeybind("c,w", () => {
        setIsWorkspaceCreatorShowing(true);
    });

    return <>{children}</>;
}
