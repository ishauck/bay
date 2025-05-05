import { z } from "zod";
import { isValidPhoneNumber } from "libphonenumber-js";
export const QuestionType = z.enum([
  "short-answer",
  "long-answer",
  "email",
  "phone",
  "number",
  "radio",
  "hidden",
]);

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
  type: z.enum(["short-answer", "long-answer", "email", "phone", "number"]),
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

export const EmailResponse = TextResponse.extend({
  type: z.literal("email"),
  response: z.string().email().optional(),
});

export const PhoneResponse = TextResponse.extend({
  type: z.literal("phone"),
  response: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val) return true;

        return isValidPhoneNumber(val);
      },
      {
        message: "Invalid phone number",
      }
    ),
});

export const NumberResponse = TextResponse.extend({
  type: z.literal("number"),
  response: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val) return true;

        return !isNaN(Number(val));
      },
      {
        message: "Invalid number",
      }
    ),
});

export const RadioResponse = QuestionResponse.extend({
  type: z.literal("radio"),
  response: z
    .object({
      option: z.string(),
      otherValue: z.string().optional(),
    })
    .optional(),
});

export const AllowedResponse = ShortAnswerResponse.or(LongAnswerResponse)
  .or(EmailResponse)
  .or(PhoneResponse)
  .or(NumberResponse)
  .or(RadioResponse)
  .or(HiddenResponse);

export const Response = z.array(AllowedResponse);

export const ResponseMetadata = z.object({
  id: z.string(),
  formId: z.string(),
  submittedAt: z.string().datetime(),
  submittedBy: z.string().optional(),
  sender: z
    .object({
      ip: z.string(),
      userAgent: z.string().optional(),
    })
    .optional(),
});

export const StoredResponse = ResponseMetadata.extend({
  response: Response,
});

export type AllowedResponse = z.infer<typeof AllowedResponse>;
export type QuestionResponse = z.infer<typeof QuestionResponse>;

export type HiddenResponse = z.infer<typeof HiddenResponse>;
export type TextResponse = z.infer<typeof TextResponse>;
export type ShortAnswerResponse = z.infer<typeof ShortAnswerResponse>;
export type LongAnswerResponse = z.infer<typeof LongAnswerResponse>;
export type RadioResponse = z.infer<typeof RadioResponse>;

export type Response = z.infer<typeof Response>;
export type StoredResponse = z.infer<typeof StoredResponse>;
export type ResponseMetadata = z.infer<typeof ResponseMetadata>;