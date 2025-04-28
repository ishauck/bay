import * as changeCase from "change-case";
import { z } from "zod";

export const RestErrorSchema = z.object({
  code: z.string(),
  title: z.string(),
  message: z.string(),
  status: z.number(),
});

export type RestErrorSchema = z.infer<typeof RestErrorSchema>;

export class RestError extends Error {
  private code: string;
  private title: string;
  private status: number;

  constructor(
    code: string,
    message: string,
    status: number
  ) {
    super(message);
    this.name = 'RestError';
    this.code = changeCase.snakeCase(code);
    this.title = changeCase.capitalCase(code);
    this.status = status;
  }

  toJSON(): RestErrorSchema {
    return {
      code: this.code,
      title: this.title,
      message: this.message,
      status: this.status,
    };
  }
}

export function createRestError(code: string, message: string, status: number): RestError {
  return new RestError(code, message, status);
}