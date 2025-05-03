import { db as redis } from "@/lib/redis";
import { SerializedLexicalState, FormData } from "@/types/api/form-data";

export async function createFormData(
  formId: string,
  questions?: SerializedLexicalState
) {
  if (formId.startsWith("form_")) {
    formId = formId.slice(5);
  }

  const formData: FormData = {
    id: formId,
    questions: questions ?? null,
  };

  const data = await redis.set(`form_data:${formId}`, formData);

  if (!data) {
    throw new Error("Failed to create form data");
  }

  return formData;
}

export async function getFormData(formId: string) {
  if (formId.startsWith("form_")) {
    formId = formId.slice(5);
  }
  const formData = await redis.get<FormData>(`form_data:${formId}`);
  console.log(formData);
  return formData;
}

export async function getOrCreateFormData(formId: string) {
  const formData = await getFormData(formId);
  if (!formData) {
    return createFormData(formId);
  }
  return formData;
}

export const setFormData = createFormData;