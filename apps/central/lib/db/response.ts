import { db as redis } from "@/lib/redis";
import { nanoid } from "nanoid";
import { StoredResponse } from "@/types/response";

type SubmitResponse = Omit<StoredResponse, "id">;

export async function createResponse(response: SubmitResponse) {
    if (response.formId.startsWith("form_")) {
        response.formId = response.formId.substring("form_".length);
    }

    const responseId = nanoid();

    const res = {
        ...response,
        id: responseId,
    }

    await redis.set(`response:${response.formId}:${responseId}`, res);
    return res;
}

export async function getResponse(formId: string, responseId: string) {
    if (formId.startsWith("form_")) {
        formId = formId.substring("form_".length);
    }
    const res = await redis.get(`response:${formId}:${responseId}`);
    return res ? StoredResponse.parse(res) : null;
}

export async function getResponseKeys(formId: string) {
    if (formId.startsWith("form_")) {
        formId = formId.substring("form_".length);
    }
    const res = await redis.keys(`response:${formId}:*`);
    return res.map((r) => r.split(":")[2]);
}

export async function getResponses(formId: string) {
    if (formId.startsWith("form_")) {
        formId = formId.substring("form_".length);
    }
    const res = await getResponseKeys(formId);
    return res.map((r) => getResponse(formId, r));
}

export async function deleteResponse(formId: string, responseId: string) {
    if (formId.startsWith("form_")) {
        formId = formId.substring("form_".length);
    }
    await redis.del(`response:${formId}:${responseId}`);
}

export async function deleteAllResponses(formId: string) {
    if (formId.startsWith("form_")) {
        formId = formId.substring("form_".length);
    }
    const res = await redis.keys(`response:${formId}:*`);
    await redis.del(...res);
}