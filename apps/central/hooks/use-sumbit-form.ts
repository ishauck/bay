import { useState } from "react";
import { createResponse } from "@/lib/api/response";
import { useFormResponseStore } from "@/components/provider/form-response-store";

export function useSubmitForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const response = useFormResponseStore((state) => state.response);
    
    const submitForm = async (formId: string) => {
        setIsSubmitting(true);
        const res = await createResponse(response, formId);

        setIsSubmitting(false);

        return res;
    }

    return {
        isSubmitting,
        submitForm,
    }
}