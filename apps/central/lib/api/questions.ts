import { QuestionList, QuestionTypes } from "@/types/api/form-questions";
import { RestResponse } from ".";
import { RestErrorSchema } from "../error";

export async function getQuestions(
  orgId: string,
  formId: string
): Promise<RestResponse<QuestionList>> {
  const response = await fetch(`/api/orgs/${orgId}/forms/${formId}/questions`);
  const data: QuestionList | RestErrorSchema = await response.json();

  if (RestErrorSchema.safeParse(data).success) {
    return {
      data: null,
      error: data as RestErrorSchema,
    };
  }

  if (QuestionList.safeParse(data).success) {
    return {
      data: data as QuestionList,
      error: null,
    };
  }

  throw new Error("Invalid response");
}

export async function createQuestion(
  orgId: string,
  formId: string,
  question: QuestionTypes | QuestionTypes[]
): Promise<RestResponse<QuestionList>> {
  const response = await fetch(`/api/orgs/${orgId}/forms/${formId}/questions`, {
    method: "POST",
    body: JSON.stringify(question),
  });

  const data: QuestionList | RestErrorSchema = await response.json();

  if (RestErrorSchema.safeParse(data).success) {
    return {
      data: null,
      error: data as RestErrorSchema,
    };
  }

  if (QuestionList.safeParse(data).success) {
    return {
      data: data as QuestionList,
      error: null,
    };
  }

  throw new Error("Invalid response");
}

export async function updateQuestions(
  orgId: string,
  formId: string,
  questions: QuestionTypes | QuestionTypes[]
): Promise<RestResponse<QuestionList>> {
  const response = await fetch(`/api/orgs/${orgId}/forms/${formId}/questions`, {
    method: "PUT",
    body: JSON.stringify(questions),
  });

  const data: QuestionList | RestErrorSchema = await response.json();

  if (RestErrorSchema.safeParse(data).success) {
    return {
      data: null,
      error: data as RestErrorSchema,
    };
  }

  if (QuestionList.safeParse(data).success) {
    return {
      data: data as QuestionList,
      error: null,
    };
  }

  throw new Error("Invalid response");
}

export async function deleteQuestion(
  orgId: string,
  formId: string,
  questionId: number,
  questions?: QuestionList
): Promise<RestResponse<QuestionList>> {
  if (!questions) {
    const { data, error } = await getQuestions(orgId, formId);
    if (error || !data) {
      return {
        data: null,
        error,
      };
    }

    questions = data;
  }

  return updateQuestions(
    orgId,
    formId,
    questions?.filter((_, index) => index !== questionId)
  );
}
