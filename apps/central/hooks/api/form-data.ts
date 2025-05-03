import { getDataOrThrow } from "@/lib/api";
import { getFormData } from "@/lib/api/form-data";
import { useQuery } from "@tanstack/react-query";

export function useFormData(orgId: string, formId: string) {
  let processedOrgId = orgId;
  if (!orgId.startsWith("org_")) {
    processedOrgId = "org_" + orgId;
  }

  return useQuery({
    queryKey: ["forms", processedOrgId, formId, "data"],
    queryFn: async () => getDataOrThrow(await getFormData(processedOrgId, formId)),
  });
}
