import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getResponse,
  getResponseKeys,
  deleteResponse,
  deleteAllResponses,
} from "@/lib/api/response";
import { getDataOrThrow } from "@/lib/api";
import { ResponseMetadata } from "@/types/response";

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

export function useDeleteResponse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      orgId,
      formId,
      id,
    }: {
      orgId: string;
      formId: string;
      id: string;
    }) => {
      return getDataOrThrow(await deleteResponse(orgId, formId, id));
    },
    onSuccess: (_, variables) => {
      queryClient.setQueryData(["responses", variables.orgId, variables.formId], (input: ResponseMetadata[]) => {
        return input.filter((resp) => resp.id !== variables.id);
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
      const res = getDataOrThrow(await deleteAllResponses(orgId, formId));
      if (res) {
        return [];
      }
    },
    onSuccess: (_, variables) => {
      queryClient.setQueryData(["responses", variables.orgId, variables.formId], []);
    },
  });
}
