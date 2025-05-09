import { auth } from "@/lib/auth";
import { getForm, updateForm } from "@/lib/db/form";
import { deleteResponse, getResponse } from "@/lib/db/response";
import { RestError } from "@/lib/error";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ org: string; form: string; id: string }> }
) {
  const { org, form, id } = await params;

  const session = await auth.api.getSession({
    headers: req.headers,
  });

  if (!session) {
    return Response.json(
      new RestError("unauthorized", "Unauthorized", 401).toJSON(),
      { status: 401 }
    );
  }

  const orgs = await auth.api.listOrganizations({
    headers: req.headers,
  });

  const orgObject = orgs.find((o) => o.id === org.substring("org_".length));

  if (!orgObject) {
    return Response.json(
      new RestError("not_found", "Organization not found", 404).toJSON(),
      { status: 404 }
    );
  }

  const forms = await getForm(form.substring("form_".length));

  if (forms.length === 0 || forms[0].organizationId !== orgObject.id) {
    return Response.json(
      new RestError("not_found", "Form not found", 404).toJSON(),
      { status: 404 }
    );
  }

  const formObject = forms[0];

  const response = await getResponse(formObject.id, id);

  if (!response || response.formId !== formObject.id) {
    return Response.json(
      new RestError("not_found", "Response not found", 404).toJSON(),
      { status: 404 }
    );
  }

  return Response.json(response);
}


export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ org: string; form: string; id: string }> }
) {
  const { org, form, id } = await params;

  const session = await auth.api.getSession({
    headers: req.headers,
  });

  if (!session) {
    return Response.json(
      new RestError("unauthorized", "Unauthorized", 401).toJSON(),
      { status: 401 }
    );
  }

  const orgs = await auth.api.listOrganizations({
    headers: req.headers,
  });

  const orgObject = orgs.find((o) => o.id === org.substring("org_".length));

  if (!orgObject) {
    return Response.json(
      new RestError("not_found", "Organization not found", 404).toJSON(),
      { status: 404 }
    );
  }

  const forms = await getForm(form.substring("form_".length));

  if (forms.length === 0 || forms[0].organizationId !== orgObject.id) {
    return Response.json(
      new RestError("not_found", "Form not found", 404).toJSON(),
      { status: 404 }
    );
  }

  const formObject = forms[0];

  await deleteResponse(formObject.id, id);

  // Decrement responseCount in the form table, but not below 0
  await updateForm(formObject.id, {
    ...formObject,
    createdAt: formObject.createdAt instanceof Date ? formObject.createdAt.toISOString() : formObject.createdAt,
    updatedAt: new Date().toISOString(),
    responseCount: Math.max(0, (formObject.responseCount || 1) - 1),
    nonAcceptingMessage: formObject.nonAcceptingMessage ?? "This form is not currently accepting responses.",
  });

  return Response.json({ success: true });
}
