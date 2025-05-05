import { useQuery } from "@tanstack/react-query";
import { getResponse, getResponseKeys } from "@/lib/api/response";
import { getDataOrThrow } from "@/lib/api";

export function useResponseKeys(orgId: string, formId: string) {
  if (!orgId.startsWith("org_")) {
    orgId = `org_${orgId}`;
  }

  if (!formId.startsWith("form_")) {
    formId = `form_${formId}`;
  }
  
  return useQuery({
    queryKey: ["responses", orgId, formId],
    queryFn: async () => getDataOrThrow(await getResponseKeys(orgId, formId)),
  });
}

export function useResponse(orgId: string, formId: string, id: string) {
  if (!orgId.startsWith("org_")) {
    orgId = `org_${orgId}`;
  }

  if (!formId.startsWith("form_")) {
    formId = `form_${formId}`;
  }

  return useQuery({
    queryKey: ["response", orgId, formId, id],
    queryFn: async () => getDataOrThrow(await getResponse(orgId, formId, id)),
  });
}
