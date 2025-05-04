import { getForm } from "@/lib/db/form";
import { verifyResponse } from "@/lib/server/response";
import { NextRequest, NextResponse } from "next/server";
import { RestError } from "@/lib/error";
import { Response } from "@/types/response";
import { getFormData } from "@/lib/db/form-data";
import { SerializedLexicalState } from "@/types/form-data";
import { createResponse } from "@/lib/db/response";
import { auth } from "@/lib/auth";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ form: string }> }
) {
  let { form } = await params;

  if (!form.startsWith("form_")) {
    return NextResponse.json(
      new RestError("invalid-request", "Invalid form ID", 400).toJSON(),
      { status: 400 }
    );
  }

  form = form.slice(5);

  const data = await request.json();

  const verify = Response.safeParse(data);
  if (!verify.success) {
    console.log("[API] Response.safeParse failed:", verify.error);
    return NextResponse.json(
      new RestError("invalid-request", "Invalid request", 400).toJSON(),
      { status: 400 }
    );
  }

  const formInfo = await getForm(form);
  if (!formInfo || formInfo.length === 0) {
    return NextResponse.json(
      new RestError("not-found", "Form not found", 404).toJSON(),
      { status: 404 }
    );
  }

  const formObject = formInfo[0];

  if (!formObject.isActive) {
    return NextResponse.json(
      new RestError(
        "invalid-request",
        formObject.nonAcceptingMessage ?? "Form is not accepting responses",
        400
      ).toJSON(),
      { status: 400 }
    );
  }

  const formData = await getFormData(formObject.id);
  if (!formData) {
    return NextResponse.json(
      new RestError("not-found", "Form not found", 404).toJSON(),
      { status: 404 }
    );
  }

  const state = formData.questions;

  try {
    verifyResponse(verify.data, state as SerializedLexicalState);
  } catch (e) {
    console.error("[API] Error verifying response:", e);
    return NextResponse.json(
      new RestError("invalid-request", "The provided response is invalid", 400).toJSON(),
      { status: 400 }
    );
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0];
  const userAgent = request.headers.get("user-agent");

  const session = await auth.api.getSession({
    headers: request.headers,
  });

  const response = await createResponse({
    formId: formObject.id,
    submittedAt: new Date().toISOString(),
    submittedBy: session?.user?.id ?? undefined,
    sender: {
      ip: ip ?? "127.0.0.1",
      userAgent: userAgent ?? undefined,
    },
    response: verify.data,
  });

  return NextResponse.json(
    {
      id: response.id,
    },
    { status: 200 }
  );
}
