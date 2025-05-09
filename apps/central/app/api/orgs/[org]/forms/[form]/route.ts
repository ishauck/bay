import { auth } from "@/lib/auth";
import { getForm, updateForm } from "@/lib/db/form";
import { RestError } from "@/lib/error";
import { UpdatableForm } from "@/types/forms";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ org: string; form: string }> }
) {
  const { org, form } = await params;

  const session = await auth.api.getSession({
    headers: req.headers,
  });

  if (!session) {
    return Response.json(new RestError("unauthorized", "Unauthorized", 401).toJSON(), { status: 401 });
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
    return Response.json(new RestError("not_found", "Form not found", 404).toJSON(), { status: 404 });
  }

  const formObject = forms[0];

  return Response.json(formObject);
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ org: string; form: string }> }
) {
  const { org, form } = await params;

  const session = await auth.api.getSession({
    headers: req.headers,
  });

  if (!session) {
    return Response.json(new RestError("unauthorized", "Unauthorized", 401).toJSON(), { status: 401 });
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
    return Response.json(new RestError("not_found", "Form not found", 404).toJSON(), { status: 404 });
  }

  const formObject = forms[0];

  const body = await req.json();

  const result = UpdatableForm.partial().safeParse(body);

  if (!result.success) {
    return Response.json(new RestError("invalid_request", "Invalid request", 400).toJSON(), { status: 400 });
  }

  const { isActive, nonAcceptingMessage, name } = result.data;

  const updatedForm = formObject;

  if (isActive !== undefined) {
    updatedForm.isActive = isActive;
  }

  if (nonAcceptingMessage !== undefined) {
    updatedForm.nonAcceptingMessage = nonAcceptingMessage;
  }

  if (name !== undefined) {
    updatedForm.name = name;
  }

  await updateForm(form.substring("form_".length), {
    ...updatedForm,
    createdAt: updatedForm.createdAt instanceof Date ? updatedForm.createdAt.toISOString() : updatedForm.createdAt,
    updatedAt: updatedForm.updatedAt instanceof Date && updatedForm.updatedAt !== null ? updatedForm.updatedAt.toISOString() : updatedForm.updatedAt,
    nonAcceptingMessage: updatedForm.nonAcceptingMessage ?? "This form is not currently accepting responses.",
  });

  return Response.json(formObject);
}
