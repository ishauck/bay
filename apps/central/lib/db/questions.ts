import { QuestionList, QuestionStore } from "@/types/api/form-questions";
import { db } from "../redis";

export async function getQuestions(formId: string): Promise<QuestionStore | null> {
  if (formId.startsWith("form_")) {
    formId = formId.substring("form_".length);
  }

  const questions = await db.get<QuestionStore>(`form:${formId}:questions`);

  if (!questions) {
    return null;
  }

  return questions;
}

export async function getOrCreateQuestions(formId: string): Promise<QuestionStore> {
  const questions = await getQuestions(formId);
  if (!questions) {
    return createQuestions(formId);
  }
  return questions;
}

export async function createQuestions(formId: string, questions: QuestionList = []): Promise<QuestionStore> {
  if (formId.startsWith("form_")) {
    formId = formId.substring("form_".length);
  }

  const data = await db.set(`form:${formId}:questions`, {
    id: formId,
    questions: questions,
  });

  if (!data) {
    throw new Error("Failed to create questions");
  }

  return {
    id: formId,
    questions: questions,
  };
}

export const setQuestions = createQuestions;

export const deleteQuestions = async (formId: string) => {
  if (formId.startsWith("form_")) {
    formId = formId.substring("form_".length);
  }
  return await db.del(`form:${formId}:questions`);
};
