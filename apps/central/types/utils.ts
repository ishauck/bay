import { z } from "zod";

export type Pagination = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export const PaginationSchema = z.object({
  currentPage: z.number(),
  totalPages: z.number(),
  totalItems: z.number(),
  itemsPerPage: z.number(),
  hasNextPage: z.boolean(),
  hasPreviousPage: z.boolean(),
});

export type PaginatedResponse<T> = {
  data: T[];
  pagination: Pagination;
};

export function generatePaginatedResponse<T>(type: z.ZodType<T>) {
  return z.object({
    data: z.array(type),
    pagination: PaginationSchema,
  });
}

export type UnresolvedSearchParams = { [key: string]: string | string[] | undefined };
export type SearchParams = Promise<UnresolvedSearchParams>;