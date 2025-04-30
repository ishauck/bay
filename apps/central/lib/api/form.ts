import {
  CreatableForm,
  FormCreateResponse,
  FormEditable,
  FormPartial,
  GetFormsResponse,
  GetFormsResponseSchema,
} from "@/types/api/forms";
import { RestErrorSchema } from "../error";
import { RestResponse, PaginationOptions } from "./index";

export async function getForms(
  orgId: string,
  options?: Partial<PaginationOptions>
): Promise<RestResponse<GetFormsResponse>> {
  if (!orgId.startsWith("org_")) {
    throw new Error("Invalid organization ID");
  }

  const url = new URL(window.location.origin + "/api/orgs/" + orgId + "/forms");
  if (options?.page) {
    url.searchParams.set("page", options.page.toString());
  }
  if (options?.limit) {
    url.searchParams.set("limit", options.limit.toString());
  }

  const response = await fetch(url);
  const data: GetFormsResponse | RestErrorSchema = await response.json();

  if (GetFormsResponseSchema.safeParse(data).success) {
    return {
      data: data as GetFormsResponse,
      error: null,
    };
  }

  if (RestErrorSchema.safeParse(data).success) {
    return {
      data: null,
      error: data as RestErrorSchema,
    };
  }

  throw new Error("Invalid response");
}

export async function createForm(
  orgId: string,
  form: CreatableForm
): Promise<RestResponse<FormCreateResponse>> {
  if (!orgId.startsWith("org_")) {
    throw new Error("Invalid organization ID");
  }

  const response = await fetch("/api/orgs/" + orgId + "/forms", {
    method: "POST",
    body: JSON.stringify(form),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data: FormCreateResponse | RestErrorSchema = await response.json();

  if (FormCreateResponse.safeParse(data).success) {
    return {
      data: data as FormCreateResponse,
      error: null,
    };
  }

  if (RestErrorSchema.safeParse(data).success) {
    return {
      data: null,
      error: data as RestErrorSchema,
    };
  }

  throw new Error("Invalid response");
}

export async function getForm(
  orgId: string,
  formId: string
): Promise<RestResponse<FormPartial>> {
  const response = await fetch("/api/orgs/" + orgId + "/forms/" + formId);
  const data: FormPartial | RestErrorSchema = await response.json();

  if (FormPartial.safeParse(data).success) {
    return {
      data: data as FormPartial,
      error: null,
    };
  }

  if (RestErrorSchema.safeParse(data).success) {
    return {
      data: null,
      error: data as RestErrorSchema,
    };
  }

  throw new Error("Invalid response");
}

export async function updateForm(
  orgId: string,
  formId: string,
  form: FormEditable
): Promise<RestResponse<FormPartial>> {
  const response = await fetch("/api/orgs/" + orgId + "/forms/" + formId, {
    method: "PATCH",
    body: JSON.stringify(form),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data: FormPartial | RestErrorSchema = await response.json();

  if (FormPartial.safeParse(data).success) {
    return {
      data: data as FormPartial,
      error: null,
    };
  }

  if (RestErrorSchema.safeParse(data).success) {
    return {
      data: null,
      error: data as RestErrorSchema,
    };
  }

  throw new Error("Invalid response");
}
