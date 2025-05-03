import { useQuery } from "@tanstack/react-query";
import { getForm, getForms } from "@/lib/api";
import { getDataOrThrow } from "@/lib/api";

export function useFormList(orgId: string) {
  let processedOrgId = orgId;
  if (!orgId.startsWith("org_")) {
    processedOrgId = "org_" + orgId;
  }

  return useQuery({
    queryKey: ["forms", processedOrgId],
    queryFn: async () => getDataOrThrow(await getForms(processedOrgId)),
  });
}

export function useForm(orgId: string, formId: string) {
  let processedOrgId = orgId;
  if (!orgId.startsWith("org_")) {
    processedOrgId = "org_" + orgId;
  }

  return useQuery({
    queryKey: ["forms", processedOrgId, formId],
    queryFn: async () => getDataOrThrow(await getForm(processedOrgId, formId)),
  });
}