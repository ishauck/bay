import { Response, StoredResponse, ResponseMetadata } from "@/types/response";
import { RestResponse } from ".";
import { z } from "zod";
import { RestErrorSchema } from "../error";

const CreateResponseResponse = z.object({
    id: z.string(),
});

type CreateResponseResponse = z.infer<typeof CreateResponseResponse>;

export async function createResponse(response: Response, formId: string): Promise<RestResponse<CreateResponseResponse>> {
    if (!formId.startsWith("form_")) {
        formId = `form_${formId}`;
    }

    const res = await fetch(`/api/forms/${formId}/responses`, {
        method: "POST",
        body: JSON.stringify(response),
    });

    const data = await res.json();
    if (RestErrorSchema.safeParse(data).success) {
        return {
            data: null,
            error: data as RestErrorSchema,
        };
    }

    if (CreateResponseResponse.safeParse(data).success) {
        return {
            data: data as CreateResponseResponse,
            error: null,
        };
    }

    throw new Error("Invalid response");
}

export async function getResponseKeys(orgId: string, formId: string): Promise<RestResponse<ResponseMetadata[]>> {
    if (!formId.startsWith("form_")) {
        formId = `form_${formId}`;
    }

    if (!orgId.startsWith("org_")) {
        orgId = `org_${orgId}`;
    }

    const res = await fetch(`/api/orgs/${orgId}/forms/${formId}/responses`);
    const data = await res.json();
    if (RestErrorSchema.safeParse(data).success) {
        return {
            data: null,
            error: data as RestErrorSchema,
        };
    }

    return {
        data: data as ResponseMetadata[],
        error: null,
    };
}

export async function getResponse(orgId: string, formId: string, id: string): Promise<RestResponse<StoredResponse>> {
    if (!formId.startsWith("form_")) {
        formId = `form_${formId}`;
    }

    if (!orgId.startsWith("org_")) {
        orgId = `org_${orgId}`;
    }

    const res = await fetch(`/api/orgs/${orgId}/forms/${formId}/responses/${id}`);
    const data = await res.json();
    if (RestErrorSchema.safeParse(data).success) {
        return {
            data: null,
            error: data as RestErrorSchema,
        };
    }

    if (StoredResponse.safeParse(data).success) {
        return {
            data: data as StoredResponse,
            error: null,
        };
    }

    throw new Error("Invalid response");
}