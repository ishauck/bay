import { z } from "zod";

export const QuestionType = z.enum(["short-answer", "long-answer", "radio", "hidden"]);

export const QuestionResponse = z.object({
    type: QuestionType,
    questionId: z.string(),
    response: z.any().optional(),
});

export const HiddenResponse = QuestionResponse.extend({
    type: z.literal("hidden"),
    response: z.string().optional(),
});

export const TextResponse = QuestionResponse.extend({
    type: z.enum(["short-answer", "long-answer"]),
    response: z.string().optional(),
});

export const ShortAnswerResponse = TextResponse.extend({
    type: z.literal("short-answer"),
    response: z.string().max(100).optional(),
});

export const LongAnswerResponse = TextResponse.extend({
    type: z.literal("long-answer"),
    response: z.string().max(1000).optional(),
});

export const RadioResponse = QuestionResponse.extend({
    type: z.literal("radio"),
    response: z.object({
        option: z.string(),
        otherValue: z.string().optional(),
    }).optional(),
});

export const AllowedResponse = ShortAnswerResponse.or(LongAnswerResponse).or(RadioResponse).or(HiddenResponse);

export type AllowedResponse = z.infer<typeof AllowedResponse>;
export type QuestionResponse = z.infer<typeof QuestionResponse>;

export type HiddenResponse = z.infer<typeof HiddenResponse>;
export type TextResponse = z.infer<typeof TextResponse>;
export type ShortAnswerResponse = z.infer<typeof ShortAnswerResponse>;
export type LongAnswerResponse = z.infer<typeof LongAnswerResponse>;
export type RadioResponse = z.infer<typeof RadioResponse>;
