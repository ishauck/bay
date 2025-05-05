import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SearchParams, UnresolvedSearchParams } from "@/types/utils";
import { BuildingIcon, CheckCircle, AlertTriangle, HouseIcon, Edit2Icon } from "lucide-react";
import Link from "next/link";
import { z } from "zod";

const QueryParams = z.object({
    orgSlug: z.string(),
    ref: z.enum(["preview", "submit"]),
    responseId: z.string(),
    formId: z.string(),
});

type QueryParamsType = z.infer<typeof QueryParams>;

type QueryResult =
    | { error: string; data: null }
    | { error: null; data: QueryParamsType };

async function checkQueryParams(searchParams: UnresolvedSearchParams): Promise<QueryResult> {
    const orgSlug = searchParams["org_slug"];
    const ref = searchParams["ref"];
    const responseId = searchParams["response_id"];
    const formId = searchParams["form_id"];

    const parsed = QueryParams.safeParse({
        orgSlug,
        ref,
        responseId,
        formId,
    });

    if (!parsed.success) {
        return {
            error: "Invalid query parameters",
            data: null,
        };
    }

    return {
        data: parsed.data,
        error: null,
    };
}

function ErrorState() {
    return (
        <div className="w-screen h-screen flex items-end md:items-center justify-center bg-gradient-to-b from-gray-50 to-gray-200">
            <div className="flex flex-col items-center justify-center gap-4 p-8 bg-white rounded-t-xl md:rounded-xl shadow-2xl max-w-md w-full h-[90%] md:h-auto relative">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10">
                    <AlertTriangle className="text-destructive size-10" />
                </div>
                <h1 className="text-2xl font-bold text-destructive">Invalid query parameters</h1>
                <p className="text-sm text-gray-600 text-center">Please check the query parameters and try again.</p>
                <Button asChild className="w-full mt-2">
                    <Link href="/">
                        <HouseIcon className="size-4" />
                        Go Home
                    </Link>
                </Button>
                <Separator className="w-full" />
                <p className="text-xs text-gray-600 text-center font-medium">
                    Created with <Link href="/" target="_blank" rel="noopener noreferrer"><Logo className="h-[0.875rem] inline-block" /></Link>
                </p>
            </div>
        </div>
    );
}

function SuccessState({ data }: { data: QueryParamsType }) {
    return (
        <div className="w-screen h-screen flex items-end md:items-center justify-center bg-gradient-to-b from-gray-50 to-gray-200">
            <div className="flex flex-col items-center justify-center gap-4 p-8 bg-white rounded-t-xl md:rounded-xl shadow-2xl max-w-md w-full h-[90%] md:h-auto relative">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100">
                    <CheckCircle className="text-green-600 size-10" />
                </div>
                <h1 className="text-2xl font-bold text-green-700 text-center">Form submitted successfully</h1>
                <p className="text-sm text-gray-600 text-center">Thank you for submitting the form.</p>
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
                <p className="text-xs text-gray-600 text-center font-medium">
                    Created with <Link href="/" target="_blank" rel="noopener noreferrer"><Logo className="h-[0.875rem] inline-block" /></Link>
                </p>
            </div>
        </div>
    );
}

export default async function FormCompletePage({
    searchParams,
}: {
    searchParams: SearchParams;
}) {
    // Remove await if searchParams is not a Promise
    const { error, data } = await checkQueryParams(await searchParams);

    if (error) {
        return <ErrorState />;
    }

    return <SuccessState data={data!} />;
}