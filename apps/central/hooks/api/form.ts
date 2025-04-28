import { useQuery } from "@tanstack/react-query";
import { getForms } from "@/lib/api";
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
