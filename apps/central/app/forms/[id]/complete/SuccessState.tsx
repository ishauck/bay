'use client'
import { CheckCircle, BuildingIcon, Edit2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Logo from "@/components/logo";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { QueryParamsType } from "./page";

export default function SuccessState({ data }: { data: QueryParamsType }) {
    const [pop, setPop] = useState(false);
    useEffect(() => {
        setPop(true);
    }, []);
    return (
        <div className="w-screen h-screen flex items-end md:items-center justify-center bg-gradient-to-b from-gray-50 to-gray-200 dark:from-gray-900 dark:to-gray-800">
            <div className="flex flex-col items-center justify-center gap-4 p-8 bg-card rounded-t-xl md:rounded-xl shadow-2xl max-w-md w-full h-[90%] md:h-auto relative">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100">
                    <CheckCircle
                        className={`text-green-600 size-10 transition-transform duration-500 ease-out ${pop ? 'scale-110 opacity-100' : 'scale-75 opacity-0'}`}
                    />
                </div>
                <h1 className="text-2xl font-bold text-green-700 text-center">Form submitted successfully</h1>
                <p className="text-sm text-muted-foreground text-center">Thank you for submitting the form.</p>
                <div className="w-full flex flex-col md:flex-row items-center justify-center gap-2">
                    {data.ref === "preview" && (
                        <>
                            <Button asChild className="w-full flex-1">
                                <Link href={`/app/${data.orgSlug}/forms/${data.formId}`}>
                                    <Edit2Icon />
                                    Edit Form
                                </Link>
                            </Button>
                            <Button asChild variant="outline" className="w-full flex-1">
                                <Link href={`/app/${data.orgSlug}/forms/${data.formId}/preview`}>
                                    <BuildingIcon />
                                    View Form
                                </Link>
                            </Button>
                        </>
                    )}
                </div>
                <Separator className="w-full" />
                <p className="text-xs text-muted-foreground text-center font-medium">
                    Created with <Link href="/" target="_blank" rel="noopener noreferrer"><Logo className="h-[0.875rem] inline-block" /></Link>
                </p>
            </div>
        </div>
    );
} 