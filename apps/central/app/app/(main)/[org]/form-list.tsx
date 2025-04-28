import { useFormList } from "@/hooks/api/form";
import { useCurrentOrganization } from "@/hooks/use-current-org";
import { Skeleton } from "@/components/ui/skeleton";
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
        <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold">Forms</h2>
            {data.data.length > 0 ? (
                <ul>
                    {data.data.map((form) => (
                        <li key={form.id}>{form.name}</li>
                    ))}
                </ul>
            ) : (
                <p className="text-muted-foreground">No forms to be seen!</p>
            )}
        </div>
    );
}
