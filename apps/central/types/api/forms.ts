import { generatePaginatedResponse } from "../utils";
import { z } from "zod";


export const FormPartial = z.object({
  id: z.string(),
  organizationId: z.string(),
  name: z.string(),
  createdAt: z.string().datetime(),
  createdBy: z.string(),
  updatedAt: z.string().datetime().nullable(),
});

export const FormCreateResponse = FormPartial.pick({ id: true });

export const GetFormsResponseSchema = generatePaginatedResponse(FormPartial);

export const CreatableForm = FormPartial.omit({ id: true, organizationId: true, createdAt: true, createdBy: true, updatedAt: true });

export type CreatableForm = z.infer<typeof CreatableForm>;
export type FormPartial = z.infer<typeof FormPartial>;
export type GetFormsResponse = z.infer<typeof GetFormsResponseSchema>;
export type FormCreateResponse = z.infer<typeof FormCreateResponse>;