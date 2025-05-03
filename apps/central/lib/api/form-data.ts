import { RestResponse } from ".";
import { FormData } from "@/types/api/form-data";
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

  console.log(data);

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
