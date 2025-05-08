import { NextResponse } from "next/server";

import { getForm } from "@/lib/db/form";
import { RestError } from "@/lib/error";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ form: string }> }
) {
  const { form } = await params;

  const forms = await getForm(form.substring("form_".length));

  if (forms.length === 0) {
    return Response.json(
      new RestError("not_found", "Form not found", 404).toJSON(),
      { status: 404 }
    );
  }

  const formObject = forms[0];

  if (formObject.isActive === false) {
    return Response.json(
      new RestError("inactive", "Form is not active", 403).toJSON(),
      { status: 403 }
    );
  }

  return NextResponse.json(formObject);
}
