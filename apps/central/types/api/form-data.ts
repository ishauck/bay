import { validateLexicalState } from "@/lib/lexical";
import { z } from "zod";

export type SerializedLexicalState = never;

export const FormData = z.object({
    id: z.string(),
    questions: z.any().optional().refine((data) => {
        return data === null || validateLexicalState(data);
    }, {
        message: "Invalid lexical state"
    })
})

export type FormData = z.infer<typeof FormData>;

