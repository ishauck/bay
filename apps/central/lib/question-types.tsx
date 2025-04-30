import { QuestionType } from "@/types/api/form-questions";
import { TextCursorInputIcon, TextIcon } from "lucide-react";

export type QuestionMetadata = {
    name: string;
    description: string;
    icon: React.ReactNode;
    type: QuestionType;
}


export const questionTypes: QuestionMetadata[] = [
    {
        name: "Short Answer",
        description: "For short text-based answers",
        icon: <TextCursorInputIcon className="size-4" />,
        type: "short_answer",
    },
    {
        name: "Long Answer",
        description: "For longer text-based answers (e.g. paragraphs)",
        icon: <TextIcon className="size-4" />,
        type: "long_answer",
    },
] as const;

