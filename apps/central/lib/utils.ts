import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type SearchParams = { [key: string]: string | string[] | undefined }

export const MAX_FORMS_PER_ORGANIZATION = 10;