import { Suspense } from "react";
import RespondClient from "./RespondClient";
import { getForm } from "@/lib/db/form";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
    const forms = await getForm(params.id);
    if (!forms.length) {
        notFound();
    }
    
    return {
        title: forms[0].name,
    };
}

export default function RespondPage({ params }: { params: { id: string } }) {
    // Server component: just pass id to client comp
    return (
        <Suspense fallback={null}>
            <RespondClient id={params.id} />
        </Suspense>
    );
}