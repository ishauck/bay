'use client';
import { useDeleteAllResponses, useResponseKeys } from "@/hooks/api/responses";
import { useParams } from "next/navigation";
import { useCurrentOrganization } from "@/hooks/use-current-org";
import { useForm } from "@/hooks/api/form";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Globe2, MonitorSmartphone, Copy, Laptop2, Server, MapPin, MoreHorizontal, Delete, Inbox } from "lucide-react";
import Link from "next/link";
import { UAParser } from 'ua-parser-js';
import { useEffect, useState } from "react";
import type { ResponseMetadata } from "@/types/response";
import { toast } from "sonner";
import { atom, useAtom, useSetAtom } from "jotai";
import { ResizablePanel } from "@/components/ui/resizable";
import { ResizablePanelGroup } from "@/components/ui/resizable";
import { ResponseSheet } from "./ResponseSheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from "@/components/ui/table";
import { useAppStore } from "@/components/provider/app-store";

const visibleResponseAtom = atom<ResponseMetadata | null>(null);

export default function ResponsesPage() {
    const params = useParams();
    const formId = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : '';
    const orgSlug = typeof params.org === 'string' ? params.org : Array.isArray(params.org) ? params.org[0] : '';
    const org = useCurrentOrganization();
    const form = useForm(org.data?.id ?? "", formId);
    const [visibleResponse, setVisibleResponse] = useAtom(visibleResponseAtom);
    const deleteAllResponses = useDeleteAllResponses();
    const { data, isLoading, error } = useResponseKeys(org.data?.id ?? "", formId);
    const setFormShareModalId = useAppStore(state => state.setFormShareModalId);

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
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="iconSm">
                                        <MoreHorizontal />
                                        <span className="sr-only">More options</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start">
                                    <DropdownMenuItem onClick={() => {
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
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-destructive" onClick={() => deleteAllResponses.mutate({ orgId: org.data?.id ?? "", formId })}>
                                        <Delete />
                                        Delete all
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                    <div className="overflow-x-auto mt-4">
                        {data?.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-zinc-950 rounded-xl shadow border border-zinc-200 dark:border-zinc-800 transition-all">
                                <Inbox className="w-28 h-28 text-muted-foreground mb-6 animate-bounce-slow" />
                                <p className="text-lg text-zinc-500 dark:text-zinc-400 font-medium mb-2">No responses yet</p>
                                <p className="text-muted-foreground mb-4">Share your form to start collecting responses!</p>
                                <Button variant="default" size="sm" onClick={() => setFormShareModalId(formId)}>
                                    Share Form
                                </Button>
                            </div>
                        ) : (
                            <div className="rounded-xl shadow border border-border bg-card overflow-hidden">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="sticky left-0 z-20">ID</TableHead>
                                            <TableHead>Submitted At</TableHead>
                                            <TableHead>IP</TableHead>
                                            <TableHead>User Agent</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {data?.map((response: ResponseMetadata, idx: number) => (
                                            <ResponseTableRow
                                                key={response.id}
                                                response={response}
                                                rowIndex={idx}
                                            />
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>
            <ResponseSheet visibleResponse={visibleResponse} onClose={() => setVisibleResponse(null)} orgId={org.data?.id ?? ""} formId={formId} />
        </>
    )
}

function ResponseTableRow({ response, rowIndex }: { response: ResponseMetadata, rowIndex: number }) {
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
        <TableRow
            className={`cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/60 group ${rowIndex % 2 === 0 ? 'bg-zinc-50 dark:bg-zinc-900' : 'bg-white dark:bg-zinc-950'}`}
            onClick={() => setVisibleResponse(response)}
            tabIndex={0}
            aria-label={`View response ${response.id}`}
            onKeyDown={handleKeyDown}
        >
            <TableCell className="font-mono text-xs flex items-center gap-2 sticky left-0 z-10 bg-inherit" title={response.id}>
                <span className="truncate max-w-[120px]" tabIndex={-1}>{response.id}</span>
                <Button
                    aria-label="Copy Response ID"
                    onClick={e => { e.stopPropagation(); handleCopy(e); }}
                    variant="ghost"
                    size="iconXs"
                    tabIndex={-1}
                >
                    <Copy size={14} />
                </Button>
            </TableCell>
            <TableCell className="text-xs text-zinc-400 whitespace-nowrap" title={new Date(response.submittedAt).toLocaleString()}>{new Date(response.submittedAt).toLocaleString()}</TableCell>
            <TableCell className="text-xs">
                {response.sender?.ip ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-xs text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 leading-tight" title={response.sender.ip}>
                        <Server size={13} className="text-zinc-400" aria-label="IP Address" />
                        <span className="truncate max-w-[90px]">{response.sender.ip}</span>
                    </span>
                ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-xs text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 leading-tight">
                        <MapPin size={13} className="text-zinc-400" aria-label="IP Address" />
                        Unknown
                    </span>
                )}
            </TableCell>
            <TableCell className="text-xs">
                {ua && (
                    <div className="flex flex-wrap gap-1">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-green-100 dark:bg-green-900 text-xs text-green-700 dark:text-green-200 border border-green-200 dark:border-green-700 leading-tight" title={ua.device}>
                            <MonitorSmartphone size={13} className="text-green-400" aria-label="Device" />
                            <span className="truncate max-w-[70px]">{ua.device}</span>
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-yellow-100 dark:bg-yellow-900 text-xs text-yellow-700 dark:text-yellow-200 border border-yellow-200 dark:border-yellow-700 leading-tight" title={ua.browser}>
                            <Globe2 size={13} className="text-yellow-400" aria-label="Browser" />
                            <span className="truncate max-w-[70px]">{ua.browser}</span>
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-900 text-xs text-purple-700 dark:text-purple-200 border border-purple-700 dark:border-purple-700 leading-tight" title={ua.os}>
                            <Laptop2 size={13} className="text-purple-400" aria-label="OS" />
                            <span className="truncate max-w-[70px]">{ua.os}</span>
                        </span>
                    </div>
                )}
            </TableCell>
        </TableRow>
    );
}
