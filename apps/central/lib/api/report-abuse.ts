import { z } from "zod";
import { RestErrorSchema } from "../error";

const ReportAbuseResponse = z.object({
    id: z.string(),
});

type ReportAbuseResponse = z.infer<typeof ReportAbuseResponse>;

export async function reportAbuse(formId: string, reason: string, details: string) {
    const response = await fetch(`/api/forms/${formId}/report-abuse`, {
        method: "POST",
        body: JSON.stringify({
            reason,
            details,
        }),
    });

    const data: ReportAbuseResponse | RestErrorSchema = await response.json();

    if (ReportAbuseResponse.safeParse(data).success) {
        return {
            data: data as ReportAbuseResponse,
            error: null,
        };
    }

    if (RestErrorSchema.safeParse(data).success) {
        return {
            data: null,
            error: data as RestErrorSchema,
        };
    }

    throw new Error("Invalid response");
}
