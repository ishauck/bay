import { createRestError, RestErrorSchema } from "../error";

export * from "./form";

export type RestResponse<T> = {
  data: T | null;
  error: RestErrorSchema | null;
};

export type PaginationOptions = {
  page: number;
  limit: number;
};

export function getDataOrThrow<T>(response: RestResponse<T>) {
  if (response.error) {
    throw createRestError(response.error.code, response.error.message, response.error.status);
  }

  return response.data as T;
}
