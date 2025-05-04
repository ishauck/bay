import { Response } from "@/types/response";
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