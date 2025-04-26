import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import { HomeIcon } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <div className="flex flex-col items-center justify-center max-w-md">
                <Logo className="w-16" />
                <p className="text-muted-foreground">The page you are looking for does not exist.</p>
                <Button className="mt-4" asChild>
                    <Link href="/">
                        <HomeIcon className="w-4 h-4" />
                        <span>Go to home</span>
                    </Link>
                </Button>
            </div>
        </div>
    );
}