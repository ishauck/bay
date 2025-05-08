import { getDataOrThrow } from "@/lib/api";
import { getFormData } from "@/lib/api/form-data";
import { useQuery } from "@tanstack/react-query";

export function useFormData(orgId: string | null, formId: string) {
  let processedOrgId = orgId;
  if (orgId && !orgId.startsWith("org_")) {
    processedOrgId = "org_" + orgId;
  }

  return useQuery({
    queryKey: [`forms${orgId ? "" : "_unauthed"}`, orgId, formId, "data"],
    queryFn: async () => getDataOrThrow(await getFormData(processedOrgId, formId)),
  });
}
