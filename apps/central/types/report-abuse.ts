import { z } from "zod";

export const ReportAbuseBody = z.object({
    reason: z.string().max(1000, "Reason must be less than 1000 characters"),
    details: z.string().max(100, "Details must be less than 100 characters"),
})