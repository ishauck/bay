import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import { SearchParams, UnresolvedSearchParams } from "@/types/utils";
import { BuildingIcon } from "lucide-react";
import Image from "next/image";
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
        <div className="w-screen h-screen flex flex-col md:flex-row">
            <div className="relative w-full md:w-1/2 h-56 md:h-full">
                <Image
                    src="/images/login-dark.jpg"
                    alt="Form submission error illustration"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                />
                <Link href="/" target="_blank" rel="noopener noreferrer">
                    <Logo className="w-10 h-10 text-white absolute top-4 left-4 z-10 drop-shadow-lg" />
                </Link>
            </div>
            <div className="flex flex-col items-start justify-center p-8 gap-2 w-full md:w-1/2">
                <h1 className="text-3xl md:text-4xl font-bold">Invalid query parameters</h1>
                <p className="text-sm text-gray-500">Please check the query parameters and try again.</p>
            </div>
        </div>
    );
}

function SuccessState({ data }: { data: QueryParamsType }) {
    return (
        <div className="w-screen h-screen flex flex-col md:flex-row">
            <div className="relative w-full md:w-1/2 h-56 md:h-full">
                <Image
                    src="/images/login-dark.jpg"
                    alt="Form submission success illustration"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                />
                <Link href="/" target="_blank" rel="noopener noreferrer">
                    <Logo className="w-10 h-10 text-white absolute top-4 left-4 z-10 drop-shadow-lg" />
                </Link>
            </div>
            <div className="flex flex-col items-start justify-center p-8 gap-3 w-full md:w-1/2">
                <h1 className="text-3xl md:text-4xl font-bold">Form submitted successfully</h1>
                <p className="text-sm text-gray-500">Thank you for submitting the form.</p>
                {data.ref === "preview" && (
                    <Button asChild>
                        <Link href={`/app/${data.orgSlug}/forms/${data.formId}/preview`}>
                            <BuildingIcon className="size-4 mr-2" />
                            View Form
                        </Link>
                    </Button>
                )}
                <p className="text-sm text-gray-500">Created with <Link href="/" target="_blank" rel="noopener noreferrer"><Logo className="h-[0.875rem] inline-block" /></Link></p>
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