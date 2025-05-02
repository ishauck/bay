import { generatePaginatedResponse } from "../utils";
import { z } from "zod";
import { StyleOptions } from "./form-style";
// Base form schema containing all possible form fields
export const FormPartial = StyleOptions.extend({
  id: z.string(),
  organizationId: z.string(),
  name: z.string().max(40),
  responseCount: z.number().default(0),
  createdAt: z.string().datetime(),
  createdBy: z.string(),
  updatedAt: z.string().datetime().nullable()
});

// Schema for fields that can be edited on an existing form
export const FormEditable = FormPartial.pick({ name: true }).partial();

// Schema for fields that could technically be set when updating a form
export const FormSettableFields = FormPartial.omit({ id: true });

// Schema for the response when creating a new form
export const FormCreateResponse = FormPartial.pick({ id: true });

// Schema for paginated form list responses
export const GetFormsResponseSchema = generatePaginatedResponse(FormPartial);

// Schema for the data required to create a new form
export const CreatableForm = FormPartial.omit({ 
  id: true, 
  organizationId: true, 
  createdAt: true, 
  createdBy: true, 
  updatedAt: true,
  responseCount: true
});

// TypeScript type definitions derived from the Zod schemas
export type CreatableForm = z.infer<typeof CreatableForm>;
export type FormPartial = z.infer<typeof FormPartial>;
export type GetFormsResponse = z.infer<typeof GetFormsResponseSchema>;
export type FormCreateResponse = z.infer<typeof FormCreateResponse>;
export type FormEditable = z.infer<typeof FormEditable>;
export type FormSettableFields = z.infer<typeof FormSettableFields>;