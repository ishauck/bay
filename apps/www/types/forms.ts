import { generatePaginatedResponse } from "./utils";
import { z } from "zod";

export const ThemingSchema = z.object({
  backgroundType: z.enum(["color", "image"]).nullable(),
  backgroundValue: z.string().nullable(),
  fontFamily: z.string().nullable(),
  fontColor: z.number().nullable(),
  primaryColor: z.number().nullable(),
  secondaryColor: z.number().nullable(),
  accentColor: z.number().nullable(),
  primaryTextColor: z.number().nullable(),
  secondaryTextColor: z.number().nullable(),
  accentTextColor: z.number().nullable(),
  borderRadius: z.number().nullable(),
  borderColor: z.number().nullable(),
  ringColor: z.number().nullable(),
  destructiveColor: z.number().nullable(),
});

export const FormPartial = ThemingSchema.extend({
  id: z.string(),
  organizationId: z.string(),
  name: z.string(),
  createdAt: z.string().datetime(),
  createdBy: z.string(),
  updatedAt: z.string().datetime().nullable(),
  responseCount: z.number().default(0),
  isActive: z.boolean().default(true),
  nonAcceptingMessage: z
    .string()
    .optional()
    .default("This form is not currently accepting responses."),
});

export const FormCreateResponse = FormPartial.pick({ id: true });

export const GetFormsResponseSchema = generatePaginatedResponse(FormPartial);

export const CreatableForm = FormPartial.pick({
  name: true,
});

export const UpdatableForm = FormPartial.partial().extend({
  name: z.string().optional(),
  isActive: z.boolean().optional(),
  nonAcceptingMessage: z.string().optional(),
  backgroundType: z.enum(["color", "image"]).optional(),
  backgroundValue: z.string().optional(),
  fontFamily: z.string().optional(),
  fontColor: z.number().optional(),
  primaryColor: z.number().optional(),
  secondaryColor: z.number().optional(),
  accentColor: z.number().optional(),
  primaryTextColor: z.number().optional(),
  secondaryTextColor: z.number().optional(),
  accentTextColor: z.number().optional(),
  borderRadius: z.number().optional(),
  borderColor: z.number().optional(),
  ringColor: z.number().optional(),
});

export type CreatableForm = z.infer<typeof CreatableForm>;
export type FormPartial = z.infer<typeof FormPartial>;
export type GetFormsResponse = z.infer<typeof GetFormsResponseSchema>;
export type FormCreateResponse = z.infer<typeof FormCreateResponse>;
export type UpdatableForm = z.infer<typeof UpdatableForm>;
export type ThemingSchema = z.infer<typeof ThemingSchema>;