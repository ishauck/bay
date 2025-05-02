import { useFormList } from "@/hooks/api/form";
import { useCurrentOrganization } from "@/hooks/use-current-org";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { FormMetadata } from "@/components/form/form-metadata";

export default function FormList() {
    const { data: org } = useCurrentOrganization();
    const { data, isLoading, error } = useFormList(org?.id ?? "");

    if (isLoading) {
        return (
            <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-bold">Forms</h2>
                <Skeleton className="h-10 w-full" />
            </div>
        );
    }

    if (error) {
        console.error(error);
        return <div>Error: {error.message}</div>;
    }

    if (!data?.data) {
        return <div className="text-muted-foreground">No forms to be seen!</div>;
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Forms</h2>
                <span className="text-sm text-muted-foreground">{data.data.length} forms</span>
            </div>
            {data.data.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {data.data.map((form) => (
                        <HoverCard closeDelay={0} key={form.id}>
                            <HoverCardTrigger asChild>
                                <Link 
                                    href={`/app/${org?.slug}/forms/${form.id}`}
                                    className="flex flex-col gap-2 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                                >
                                    <h3 className="font-semibold">{form.name}</h3>
                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                        {form.responseCount} response{form.responseCount === 1 ? "" : "s"}
                                    </p>
                                </Link>
                            </HoverCardTrigger>
                            <HoverCardContent className="w-80">
                                <div className="space-y-4">
                                    <h3 className="text-sm font-medium">Form Details</h3>
                                    <FormMetadata
                                        formId={form.id}
                                        createdAt={form.createdAt}
                                        updatedAt={form.updatedAt}
                                        responseCount={form.responseCount ?? 0}
                                    />
                                </div>
                            </HoverCardContent>
                        </HoverCard>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center p-8 rounded-lg border bg-card">
                    <p className="text-muted-foreground">No forms to be seen!</p>
                </div>
            )}
        </div>
    );
}
