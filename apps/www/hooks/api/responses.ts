import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getResponse,
  getResponseKeys,
  deleteResponse,
  deleteAllResponses,
} from "@/lib/api/response";
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
    queryKey: ["responses", orgId, formId, id],
    queryFn: async () => getDataOrThrow(await getResponse(orgId, formId, id)),
  });
}

export function useDeleteResponse(orgId: string, formId: string) {
  const queryClient = useQueryClient();
  const responses = useResponseKeys(orgId, formId);

  if (!orgId.startsWith("org_")) {
    orgId = `org_${orgId}`;
  }

  if (!formId.startsWith("form_")) {
    formId = `form_${formId}`;
  }

  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      return getDataOrThrow(await deleteResponse(orgId, formId, id));
    },
    onSuccess: (_, variables) => {
      queryClient.setQueryData(["responses", orgId, formId], () => {
        return responses.data?.filter((resp) => resp.id !== variables.id);
      });
    },
  });
}

export function useDeleteAllResponses() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      orgId,
      formId,
    }: {
      orgId: string;
      formId: string;
    }) => {
      if (!orgId.startsWith("org_")) {
        orgId = `org_${orgId}`;
      }

      if (!formId.startsWith("form_")) {
        formId = `form_${formId}`;
      }

      console.log("deleting all responses", orgId, formId);

      const res = getDataOrThrow(await deleteAllResponses(orgId, formId));
      if (res) {
        return [];
      }
    },
    onSuccess: (_, variables) => {
      let { orgId, formId } = variables;

      if (!orgId.startsWith("org_")) {
        orgId = `org_${orgId}`;
      }

      if (!formId.startsWith("form_")) {
        formId = `form_${formId}`;
      }

      console.log("deleting all responses", orgId, formId);

      queryClient.setQueryData(
        ["responses", variables.orgId, variables.formId],
        []
      );
    },
  });
}
