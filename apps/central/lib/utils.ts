import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type SearchParams = { [key: string]: string | string[] | undefined }


export const isInstanceOfHTMLElement = (target: unknown): target is HTMLElement => {
  return target instanceof HTMLElement;
};

export const MAX_FORMS_PER_ORGANIZATION = 10;