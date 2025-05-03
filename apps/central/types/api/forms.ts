import { generatePaginatedResponse } from "../utils";
import { z } from "zod";

export const FormPartial = z.object({
  id: z.string(),
  organizationId: z.string(),
  name: z.string(),
  createdAt: z.string().datetime(),
  createdBy: z.string(),
  updatedAt: z.string().datetime().nullable(),
  responseCount: z.number().default(0),
});

export const FormCreateResponse = FormPartial.pick({ id: true });

export const GetFormsResponseSchema = generatePaginatedResponse(FormPartial);

export const CreatableForm = FormPartial.pick({
  name: true,
});

export type CreatableForm = z.infer<typeof CreatableForm>;
export type FormPartial = z.infer<typeof FormPartial>;
export type GetFormsResponse = z.infer<typeof GetFormsResponseSchema>;
export type FormCreateResponse = z.infer<typeof FormCreateResponse>;
