import { Button } from "@/components/ui/button";
import { getForm } from "@/lib/db/form";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next"
import { notFound, redirect } from "next/navigation";
import TiltElem from "./tilt-elem";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { ReportAbuseForm } from "./form";

export const metadata: Metadata = {
    title: "Report Abuse",
    description: "Report abuse for form",
    keywords: ["report", "abuse", "form"],
    openGraph: {
        title: "Report Abuse",
        description: "Report abuse for form"
    },
}

export default async function ReportAbusePage({ searchParams }: { searchParams: Promise<{ id?: string; back?: string }> }) {
    const { id, back: backUrl } = await searchParams;
    if (!id) {
        return notFound();
    }

    const form = await getForm(id);
    if (!form) {
        return notFound();
    }

    const session = await auth.api.getSession({
        headers: await headers()
    })
    if (!session) {
        redirect("/login");
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            {backUrl && (
                <Button
                    variant="ghost"
                    className="absolute top-4 left-4"
                    asChild
                >
                    <Link href={backUrl}>
                        <ArrowLeft className="size-4 mr-2" />
                        Back
                    </Link>
                </Button>
            )}

            <TiltElem />

            <div className="flex flex-col items-center justify-center gap-4 max-w-md text-center">
                <h1 className="text-2xl font-bold">Report Abuse</h1>
                <p className="text-muted-foreground">
                    If you believe this form is being used for malicious purposes, please report it to us.
                </p>

                <ReportAbuseForm formId={id} />

                <p className="text-sm text-muted-foreground">
                    Logged in as {session.user.email}
                </p>
            </div>
        </div>
    )
}