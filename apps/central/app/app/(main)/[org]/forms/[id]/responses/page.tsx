'use client';
import { useResponseKeys } from "@/hooks/api/responses";
import { useParams } from "next/navigation";
import { useCurrentOrganization } from "@/hooks/use-current-org";
import { useForm } from "@/hooks/api/form";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Globe2, MonitorSmartphone, Copy, Laptop2, Server, MapPin } from "lucide-react";
import Link from "next/link";
import { UAParser } from 'ua-parser-js';
import { useEffect, useState } from "react";
import type { ResponseMetadata } from "@/types/response";
import { toast } from "sonner";
import { atom, useAtom, useSetAtom } from "jotai";
import { ResizablePanel } from "@/components/ui/resizable";
import { ResizablePanelGroup } from "@/components/ui/resizable";
import Image from "next/image";
import { ResponseSheet } from "./ResponseSheet";

const visibleResponseAtom = atom<ResponseMetadata | null>(null);

export default function ResponsesPage() {
    const params = useParams();
    const formId = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : '';
    const orgSlug = typeof params.org === 'string' ? params.org : Array.isArray(params.org) ? params.org[0] : '';
    const org = useCurrentOrganization();
    const form = useForm(org.data?.id ?? "", formId);
    const [visibleResponse, setVisibleResponse] = useAtom(visibleResponseAtom);
    const { data, isLoading, error } = useResponseKeys(org.data?.id ?? "", formId);

    // Add Escape key support to close the details panel
    useEffect(() => {
        if (!visibleResponse) return;
        function handleKeyDown(e: KeyboardEvent) {
            if (e.key === "Escape") {
                setVisibleResponse(null);
            }
        }
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [visibleResponse, setVisibleResponse]);

    if (isLoading) {
        return <div className="flex flex-col items-center justify-center min-h-[40vh]">
            <div className="animate-pulse w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-white dark:bg-zinc-900 rounded-lg shadow p-4 border border-zinc-200 dark:border-zinc-800 h-32" />
                ))}
            </div>
            <span className="mt-4 text-zinc-400">Loading responses...</span>
        </div>;
    }

    if (error) {
        return <div className="flex flex-col items-center justify-center min-h-[40vh] text-red-500">
            <span className="font-bold text-lg">Error</span>
            <span>{error.message}</span>
        </div>;
    }

    return (
        <>
            <ResizablePanelGroup direction="horizontal">
                <ResizablePanel maxSize={65} minSize={35} className="flex flex-col gap-4 p-4">
                    <div className="flex flex-col">
                        <span className="text-sm font-medium h-3">{form.data?.name}</span>
                        <h1 className="text-2xl md:text-4xl font-bold">Responses</h1>
                        <p className="text-sm text-muted-foreground">
                            {data?.length} responses
                        </p>
                        <div className="flex flex-row gap-2 mt-2">
                            <Button variant="outline" size="sm" asChild>
                                <Link href={`/app/${orgSlug}/forms/${formId}`}>
                                    <ArrowLeft />
                                    Back to form
                                </Link>
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => {
                                if (!data) return;
                                const json = JSON.stringify(data, null, 2);
                                const blob = new Blob([json], { type: 'application/json' });
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = `${formId}__responses.json`;
                                document.body.appendChild(a);
                                a.click();
                                document.body.removeChild(a);
                                URL.revokeObjectURL(url);
                            }}>
                                <Download />
                                Download all
                            </Button>
                        </div>
                    </div>
                    <div className="overflow-x-auto mt-4">
                        {data?.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12">
                                <Image src="/empty-state.svg" alt="No responses" width={128} height={128} className="mb-4" />
                                <p className="text-zinc-500">No responses yet. Share your form to start collecting responses!</p>
                            </div>
                        ) : (
                            <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800">
                                <thead className="sticky top-0 z-10 bg-zinc-100 dark:bg-zinc-900">
                                    <tr>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-zinc-500">ID</th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-zinc-500">Submitted At</th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-zinc-500">IP</th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-zinc-500">User Agent</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-zinc-950 divide-y divide-zinc-200 dark:divide-zinc-800">
                                    {data?.map((response: ResponseMetadata) => (
                                        <ResponseTableRow
                                            key={response.id}
                                            response={response}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>
            <ResponseSheet visibleResponse={visibleResponse} onClose={() => setVisibleResponse(null)} orgId={org.data?.id ?? ""} />
        </>
    )
}

function ResponseTableRow({ response }: { response: ResponseMetadata }) {
    const [ua, setUa] = useState<{ device?: string, os?: string, browser?: string } | null>(null);
    const setVisibleResponse = useSetAtom(visibleResponseAtom);

    useEffect(() => {
        // Parse user agent
        if (response.sender?.userAgent) {
            const parser = new UAParser(response.sender.userAgent);
            setUa({
                device: parser.getDevice().model || parser.getDevice().type || "Unknown Device",
                os: parser.getOS().name ? `${parser.getOS().name} ${parser.getOS().version || ""}` : "Unknown OS",
                browser: parser.getBrowser().name ? `${parser.getBrowser().name} ${parser.getBrowser().version || ""}` : "Unknown Browser",
            });
        } else {
            setUa(null);
        }
    }, [response.sender?.userAgent]);

    const handleCopy = (e: React.MouseEvent) => {
        e.preventDefault();
        navigator.clipboard.writeText(response.id);
        toast.success("Copied to clipboard");
    };

    // Keyboard accessibility: open details on Enter/Space
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
            setVisibleResponse(response);
        }
    };

    return (
        <tr
            className={`transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/60 hover:bg-primary/10 focus:bg-primary/20 even:bg-zinc-50 dark:even:bg-zinc-900`}
            onClick={() => setVisibleResponse(response)}
            tabIndex={0}
            aria-label={`View response ${response.id}`}
            onKeyDown={handleKeyDown}
        >
            <td className="px-3 py-2 font-mono text-xs text-zinc-500 flex items-center gap-2">
                <span>{response.id}</span>
                <Button
                    aria-label="Copy Response ID"
                    onClick={e => { e.stopPropagation(); handleCopy(e); }}
                    variant="ghost"
                    size="iconXs"
                >
                    <Copy size={14} />
                </Button>
            </td>
            <td className="px-3 py-2 text-xs text-zinc-400">{new Date(response.submittedAt).toLocaleString()}</td>
            <td className="px-3 py-2 text-xs">
                {response.sender?.ip ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-xs text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 leading-tight">
                        <Server size={13} className="text-zinc-400" aria-label="IP Address" />
                        {response.sender.ip}
                    </span>
                ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-xs text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 leading-tight">
                        <MapPin size={13} className="text-zinc-400" aria-label="IP Address" />
                        Unknown
                    </span>
                )}
            </td>
            <td className="px-3 py-2 text-xs">
                {ua && (
                    <div className="flex flex-wrap gap-1">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-green-100 dark:bg-green-900 text-xs text-green-700 dark:text-green-200 border border-green-200 dark:border-green-700 leading-tight">
                            <MonitorSmartphone size={13} className="text-green-400" aria-label="Device" />
                            {ua.device}
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-yellow-100 dark:bg-yellow-900 text-xs text-yellow-700 dark:text-yellow-200 border border-yellow-200 dark:border-yellow-700 leading-tight">
                            <Globe2 size={13} className="text-yellow-400" aria-label="Browser" />
                            {ua.browser}
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-900 text-xs text-purple-700 dark:text-purple-200 border border-purple-700 dark:border-purple-700 leading-tight">
                            <Laptop2 size={13} className="text-purple-400" aria-label="OS" />
                            {ua.os}
                        </span>
                    </div>
                )}
            </td>
        </tr>
    );
}
