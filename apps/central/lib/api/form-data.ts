import { RestResponse } from ".";
import { FormData, SerializedLexicalState } from "@/types/form-data";
import { RestErrorSchema } from "../error";

export async function getFormData(
  orgId: string,
  formId: string
): Promise<RestResponse<FormData>> {
  if (!orgId.startsWith("org_")) {
    orgId = "org_" + orgId;
  }

  if (!formId.startsWith("form_")) {
    formId = "form_" + formId;
  }

  const url = new URL(
    window.location.origin +
      "/api/orgs/" +
      orgId +
      "/forms/" +
      formId +
      "/questions"
  );

  const response = await fetch(url);
  const data = await response.json();

  if (FormData.safeParse(data).success) {
    return {
      data: data as FormData,
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


export async function setFormData(
  orgId: string,
  formId: string,
  data: SerializedLexicalState
): Promise<RestResponse<boolean>> {
  if (!orgId.startsWith("org_")) {
    orgId = "org_" + orgId;
  }

  if (!formId.startsWith("form_")) {
    formId = "form_" + formId;
  }

  const url = new URL(
    window.location.origin +
      "/api/orgs/" +
      orgId +
      "/forms/" +
      formId +
      "/questions"
  );

  const response = await fetch(url, {
    method: "PUT",
    body: JSON.stringify(data),
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
