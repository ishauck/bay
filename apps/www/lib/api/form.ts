import {
  CreatableForm,
  FormCreateResponse,
  FormPartial,
  GetFormsResponse,
  GetFormsResponseSchema,
} from "@/types/forms";
import { RestErrorSchema } from "../error";
import { RestResponse, PaginationOptions } from "./index";

export async function getForms(
  orgId: string,
  options?: Partial<PaginationOptions>
): Promise<RestResponse<GetFormsResponse>> {
  if (!orgId.startsWith("org_")) {
    orgId = "org_" + orgId;
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
    orgId = "org_" + orgId;
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
  orgId: string | null,
  formId: string
): Promise<RestResponse<FormPartial>> {
  if (orgId && !orgId.startsWith("org_")) {
    orgId = "org_" + orgId;
  }

  if (!formId.startsWith("form_")) {
    formId = "form_" + formId;
  }

  const unauthed = orgId == null;

  const url = new URL(
    unauthed
      ? window.location.origin + "/api/forms/" + formId
      : window.location.origin + "/api/orgs/" + orgId + "/forms/" + formId
  );
  const response = await fetch(url);
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
  data: Partial<{ name: string }>
): Promise<RestResponse<boolean>> {
  if (!orgId.startsWith("org_")) {
    orgId = "org_" + orgId;
  }
  if (!formId.startsWith("form_")) {
    formId = "form_" + formId;
  }
  const url = new URL(
    window.location.origin + "/api/orgs/" + orgId + "/forms/" + formId
  );
  const response = await fetch(url, {
    method: "PATCH",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const resData = await response.json();
  if (RestErrorSchema.safeParse(resData).success) {
    return {
      data: null,
      error: resData as RestErrorSchema,
    };
  }
  if (response.ok) {
    return {
      data: true,
      error: null,
    };
  }
  throw new Error("Invalid response");
}
