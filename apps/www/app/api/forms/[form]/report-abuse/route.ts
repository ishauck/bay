import { auth } from "@/lib/auth";
import { NextRequest } from "next/server";
import { headers } from "next/headers";
import { RestError } from "@/lib/error";
import { getForm } from "@/lib/db/form";
import { ReportAbuseBody } from "@/types/report-abuse";
import { createReportAbuse } from "@/lib/db/report-abuse";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ form: string }> }
) {
  const { form: formId } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return Response.json(
      new RestError("unauthorized", "Unauthorized", 401).toJSON(),
      { status: 401 }
    );
  }

  const body = await request.json();

  const parsedBody = ReportAbuseBody.safeParse(body);
  if (!parsedBody.success) {
    return Response.json(
      new RestError("invalid_request", "Invalid request: " + parsedBody.error.message, 400).toJSON(),
      { status: 400 }
    );
  }

  const form = await getForm(formId);
  if (!form) {
    return Response.json(
      new RestError("not_found", "Form not found", 404).toJSON(),
      { status: 404 }
    );
  }

  const reportAbuse = await createReportAbuse(formId, session.user.id, parsedBody.data.reason, parsedBody.data.details);

  return Response.json({
    id: reportAbuse.id,
  });
}