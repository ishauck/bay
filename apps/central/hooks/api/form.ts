import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getForm, getForms, updateForm } from "@/lib/api";
import { getDataOrThrow } from "@/lib/api";
import { UpdatableForm } from "@/types/forms";

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

export function useUpdateForm(orgId: string, formId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (form: UpdatableForm) => getDataOrThrow(await updateForm(orgId, formId, form)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forms", orgId, formId] });
    },
  });
}
