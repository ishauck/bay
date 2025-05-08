import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Metadata } from "next";
import TiltElem from "../tilt-elem";

export const metadata: Metadata = {
    title: "Report Submitted",
    description: "Your abuse report has been submitted",
    keywords: ["report", "abuse", "form", "success"],
    openGraph: {
        title: "Report Submitted",
        description: "Your abuse report has been submitted"
    },
}

export default function ReportAbuseSuccessPage() {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <TiltElem variant="success" />

            <div className="flex flex-col items-center justify-center gap-4 max-w-md text-center">
                <h1 className="text-2xl font-bold">Report Submitted</h1>
                <p className="text-muted-foreground">
                    Thank you for your report. Our team will review it and take appropriate action.
                </p>

                <Button asChild className="mt-2 w-full">
                    <Link href="/">
                        Return Home
                    </Link>
                </Button>
            </div>
        </div>
    );
}