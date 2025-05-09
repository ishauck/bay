import { db } from "@/lib/db/drizzle";
import { reportAbuse } from "@/lib/db/schema";
import { nanoid } from "nanoid";

export async function createReportAbuse(formId: string, userId: string, reason: string, details: string) {
    const id = nanoid();
    const createdAt = new Date();

    await db.insert(reportAbuse).values({
        id,
        formId,
        userId,
        reason,
        details,
        createdAt,
    });

    return {
        id
    };
}

