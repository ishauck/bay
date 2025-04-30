import { z } from "zod";

export const QuestionType = z.enum(["short_answer", "long_answer"]);
export type QuestionType = z.infer<typeof QuestionType>;

export const Question = z.object({
  type: QuestionType,
  label: z.string(),
  description: z.string().optional(),
  required: z.boolean(),
});

export const ShortAnswerQuestion = Question.extend({
  type: z.literal("short_answer"),
});

export const LongAnswerQuestion = Question.extend({
  type: z.literal("long_answer"),
});

export type ShortAnswerQuestion = z.infer<typeof ShortAnswerQuestion>;
export type LongAnswerQuestion = z.infer<typeof LongAnswerQuestion>;

export const questionTypeArray = ["short_answer", "long_answer"] as const;

export const QuestionTypes = z.union([ShortAnswerQuestion, LongAnswerQuestion]);
export type QuestionTypes = z.infer<typeof QuestionTypes>;

export const QuestionList = z.array(QuestionTypes);
export type QuestionList = z.infer<typeof QuestionList>;

export const QuestionStore = z.object({
  id: z.string(),
  questions: QuestionList,
});
export type QuestionStore = z.infer<typeof QuestionStore>;