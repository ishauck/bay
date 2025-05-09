'use client'
import { useAppStore } from "@/components/provider/app-store";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Copy } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export function FormShareMenu() {
    const formShareModalId = useAppStore((state) => state.formShareModalId);
    const setFormShareModalId = useAppStore((state) => state.setFormShareModalId);

    return <Dialog open={!!formShareModalId} onOpenChange={(open) => {
        if (!open) {
            setFormShareModalId(null);
        }
    }}>
        <DialogContent className="sm:max-w-md">
            <DialogHeader>
                <DialogTitle>Share link</DialogTitle>
                <DialogDescription>
                    Anyone who has this link will be able to view this.
                </DialogDescription>
            </DialogHeader>
            <div className="flex items-center space-x-2">
                <div className="grid flex-1 gap-2">
                    <Label htmlFor="link" className="sr-only">
                        Link
                    </Label>
                    <Input
                        id="link"
                        defaultValue={typeof window !== 'undefined' ? `http${window.location.protocol === 'https:' ? 's' : ''}://${window.location.host}/respond/${formShareModalId}` : ''}
                        readOnly
                    />
                </div>
                <Button type="submit" size="sm" className="px-3" onClick={() => {
                    navigator.clipboard.writeText(`${window.location.protocol === 'https:' ? 'https' : 'http'}://${window.location.host}/respond/${formShareModalId}`);
                }}>
                    <span className="sr-only">Copy</span>
                    <Copy />
                </Button>
            </div>
            <DialogFooter className="sm:justify-start">
                <DialogClose asChild>
                    <Button type="button" variant="secondary">
                        Close
                    </Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>    
    </Dialog>;
}