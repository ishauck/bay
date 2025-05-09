import { Skeleton } from "@/components/ui/skeleton";

export default function NewFormSkeleton() {
    return (
        <div className="w-full overflow-x-hidden">
            <div className="w-full h-fit flex flex-col gap-2 border-b pb-4">
                <header className="flex items-center gap-2 p-2 h-12 px-4">
                    <Skeleton className="w-9 h-6" />
                    <Skeleton className="w-24 h-4" />
                    <div className="flex-1" />
                    <Skeleton className="w-8 h-8 rounded-full" />
                </header>
                <div className="flex flex-col gap-2 px-3 md:px-6 md:py-2">
                    <Skeleton className="w-96 h-7 md:h-12" />
                    <Skeleton className="w-48 h-4" />
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
                    <Skeleton className="w-full h-10 rounded-md" />
                    <Skeleton className="w-24 h-10 rounded-md" />
                </div>

                <div className="flex items-center gap-2 mb-6">
                    <div className="h-px flex-1 bg-border" />
                    <span className="text-sm text-muted-foreground">or</span>
                    <div className="h-px flex-1 bg-border" />
                </div>

                <div className="mb-4">
                    <h2 className="text-lg font-semibold mb-4">Start from a template</h2>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="p-4 bg-card border rounded-xl flex flex-col items-start gap-2 min-h-[120px]">
                                <Skeleton className="w-10 h-10 rounded-md mb-2" />
                                <Skeleton className="w-32 h-5" />
                                <Skeleton className="w-48 h-4" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}