import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getForm, getForms } from "@/lib/api";
import { getDataOrThrow } from "@/lib/api";
import { useCurrentOrganizationSlug } from "../use-current-org";
import { useParams } from "next/navigation";
import { FormPartial } from "@/types/api/forms";

const processOrgId = (orgId: string): string => {
    return orgId.startsWith("org_") ? orgId : `org_${orgId}`;
};

export function useFormList(orgId: string) {
    const processedOrgId = processOrgId(orgId);

    return useQuery({
        queryKey: ["forms", processedOrgId],
        queryFn: async () => {
            try {
                return getDataOrThrow(await getForms(processedOrgId));
            } catch (error) {
                console.error("Error fetching form list:", error);
                throw error;
            }
        },
        retry: 1,
    });
}

export function useFormSlug() {
    const org = useCurrentOrganizationSlug();
    const form = useParams<{ form: string }>();

    return {
        org,
        form: form.form,
    };
}

export function useForm(orgId: string, formId: string) {
    const processedOrgId = processOrgId(orgId);

    return useQuery({
        queryKey: ["form", processedOrgId, formId],
        queryFn: async () => {
            try {
                return getDataOrThrow(await getForm(processedOrgId, formId));
            } catch (error) {
                console.error("Error fetching form:", error);
                throw error;
            }
        },
        retry: 1,
    });
}

export function useSetFormData(orgId: string, formId: string) {
    const queryClient = useQueryClient();
    const processedOrgId = processOrgId(orgId);

    return (data: FormPartial) => {
        queryClient.setQueryData(['form', processedOrgId, formId], data);
    };
}