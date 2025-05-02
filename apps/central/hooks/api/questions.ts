// *******************
// EDITOR
// *******************

import { getDataOrThrow } from "@/lib/api";
import {
  createQuestion,
  getQuestions,
  updateQuestions,
  deleteQuestion,
} from "@/lib/api/questions";
import { QuestionList, QuestionTypes } from "@/types/api/form-questions";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const processOrgId = (orgId: string): string => {
  return orgId.startsWith("org_") ? orgId : `org_${orgId}`;
};

export function useQuestions(orgId: string, formId: string) {
  const processedOrgId = processOrgId(orgId);

  return useQuery({
    queryKey: ["questions", processedOrgId, formId],
    queryFn: async () => {
      try {
        return getDataOrThrow(await getQuestions(processedOrgId, formId));
      } catch (error) {
        throw error;
      }
    },
    retry: 1,
  });
}

/**
 * Updates the questions data in the React Query cache for a specific form
 *
 * @param orgId - The organization ID
 * @param formId - The form ID
 * @param questions - The new questions data to set in the cache
 *
 * @example
 * ```tsx
 * const { mutate } = useUpdateQuestions()
 *
 * // Later in your component
 * useSetQuestions('org_123', 'form_456', newQuestions)
 * ```
 */
export function useSetQuestions(orgId: string, formId: string) {
  const queryClient = useQueryClient();
  const processedOrgId = processOrgId(orgId);

  return (questions: QuestionList) => {
    queryClient.setQueryData(["questions", processedOrgId, formId], questions);
  };
}

export function useCreateQuestion(orgId: string, formId: string) {
  const queryClient = useQueryClient();
  const processedOrgId = processOrgId(orgId);

  return async (question: QuestionTypes | QuestionTypes[]) => {
    try {
      const res = await createQuestion(processedOrgId, formId, question);
      if (res.error) {
        throw new Error(res.error.message);
      }

      queryClient.setQueryData(["questions", processedOrgId, formId], res.data);
      return res.data;
    } catch (error) {
      console.error("Error creating question:", error);
      throw error;
    }
  };
}

export function useUpdateQuestions(orgId: string, formId: string) {
  const queryClient = useQueryClient();
  const processedOrgId = processOrgId(orgId);

  return async (questions: QuestionTypes | QuestionTypes[]) => {
    try {
      const res = await updateQuestions(processedOrgId, formId, questions);
      if (res.error) {
        throw new Error(res.error.message);
      }

      queryClient.setQueryData(["questions", processedOrgId, formId], res.data);
      return res.data;
    } catch (error) {
      console.error("Error updating questions:", error);
      throw error;
    }
  };
}

export function useDeleteQuestion(orgId: string, formId: string) {
  const queryClient = useQueryClient();
  const processedOrgId = processOrgId(orgId);

  return async (questionIndex: number) => {
    try {
      const res = await deleteQuestion(processedOrgId, formId, questionIndex);
      if (res.error) {
        throw new Error(res.error.message);
      }
      queryClient.setQueryData([
        "questions",
        processedOrgId,
        formId,
      ], res.data);
      return res.data;
    } catch (error) {
      console.error("Error deleting question:", error);
      throw error;
    }
  };
}
