import { Suspense } from "react";
import RespondClient from "./RespondClient";
import { getForm } from "@/lib/db/form";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const forms = await getForm(id);
    if (!forms.length) {
        notFound();
    }
    
    return {
        title: forms[0].name,
    };
}

export default async function RespondPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    // Server component: just pass id to client comp
    return (
        <Suspense fallback={null}>
            <RespondClient id={id} />
        </Suspense>
    );
}