'use client'
import Logo from "@/components/logo";
import { Button } from "@/components/ui/button"
import { ArrowLeft, Sparkles, Plus, Mail, Star, User, List, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCurrentOrganization } from "@/hooks/use-current-org";
import UserProfile from "@/components/sidebar/user-profile";
import { cn } from "@/lib/utils";
import { notFound } from "next/navigation";
import { FormTemplateCard } from "@/components/form-template-card";
import useKeybind from "@/hooks/use-keybind";
import NewFormSkeleton from "./skeleton";

export default function NewForm() {
    const searchParams = useSearchParams()
    const org = useCurrentOrganization()
    const backUrl = searchParams.get("back")
    const router = useRouter()

    useKeybind("escape", () => {
        if (backUrl) {
            router.push(backUrl)
        }
    })

    if (org.isPending) {
        return <NewFormSkeleton />
    }

    if (org.error || !org.data) {
        notFound();
    }

    return (
        <div className="w-full overflow-x-hidden">
            <div className="w-full h-fit flex flex-col gap-2 border-b pb-4">
                <header className="flex items-center gap-2 p-2 h-12 px-4">
                    {backUrl ? (
                        <Button variant="ghost" asChild>
                            <Link href={backUrl}>
                                <ArrowLeft className="w-4 h-4" />
                                Back
                            </Link>
                        </Button>
                    ) : (
                        <Logo className="w-9" />
                    )}
                    <div className="text-sm text-muted-foreground">
                        {org.data?.name}
                    </div>
                    <div className="flex-1" />
                    <UserProfile />
                </header>
                <div className="flex flex-col gap-2 px-3 md:px-6 md:py-2">
                    <h1 className="text-3xl md:text-5xl font-bold">Let&apos;s create something great</h1>
                    <p className="text-muted-foreground">
                        Create a new form to start collecting data.
                    </p>
                </div>
            </div>
            <svg height="100%" className="absolute w-full h-20 sm:h-32 md:h-48 pointer-events-none -z-50 opacity-40 dark:opacity-100">
                <defs>
                    <pattern id="grid" patternUnits="userSpaceOnUse" width="10" height="20">
                        <line className="stroke-border sm:stroke-ring/50" x2="10" y1="20" />
                    </pattern>
                    <linearGradient id="fade" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="white" />
                        <stop offset="100%" stopColor="black" />
                    </linearGradient>
                    <mask id="mask">
                        <rect fill="url(#fade)" height="100%" width="100%" />
                    </mask>
                </defs>
                <rect fill="url(#grid)" height="100%" mask="url(#mask)" width="100%" />
            </svg>
            <div className="py-4 px-3 md:px-36 lg:px-48 w-full">
                <div className="mb-4 flex items-center gap-2">
                    <div className={cn(
                        "placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground bg-card border-input flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none data-[slot=input]:disabled:pointer-events-none data-[slot=input]:disabled:cursor-not-allowed data-[slot=input]:disabled:opacity-50 md:text-sm",
                        "focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]",
                        "data-[slot=input]:aria-invalid:ring-destructive/20 dark:data-[slot=input]:aria-invalid:ring-destructive/40 data-[slot=input]:aria-invalid:border-destructive",
                        "h-10 flex items-center gap-2"
                    )}>
                        <Sparkles className="w-4 h-4 text-muted-foreground" />
                        <input data-slot="input" className="w-full bg-transparent outline-none flex-1" placeholder="Generate a form" />
                    </div>
                    <Button>
                        Create
                    </Button>
                </div>

                <div className="flex items-center gap-2 mb-6">
                    <div className="h-px flex-1 bg-border" />
                    <span className="text-sm text-muted-foreground">or</span>
                    <div className="h-px flex-1 bg-border" />
                </div>

                <div className="mb-4">
                    <h2 className="text-lg font-semibold mb-4">Start from a template</h2>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <Link className="h-full" href={`/app/${org.data.slug}/forms/new?template=blank`}>
                            <FormTemplateCard
                                icon={Plus}
                                iconColor="primary"
                                title="Create from scratch"
                                description="Start with a blank form"
                            />
                        </Link>
                        <FormTemplateCard
                            icon={Mail}
                            title="Contact Form"
                            description="Collect contact information and messages"
                            iconColor="blue"
                        />
                        <FormTemplateCard
                            icon={Star}
                            title="Feedback Form"
                            description="Gather user feedback and ratings"
                            iconColor="green"
                        />
                        <FormTemplateCard
                            icon={User}
                            title="Registration Form"
                            description="Sign up users for events or services"
                            iconColor="yellow"
                        />
                        <FormTemplateCard
                            icon={List}
                            title="Survey Form"
                            description="Create multi-question surveys"
                            iconColor="purple"
                        />
                        <FormTemplateCard
                            icon={ArrowRight}
                            title="Browse All Templates"
                            description="See all available form templates"
                            href="#"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}