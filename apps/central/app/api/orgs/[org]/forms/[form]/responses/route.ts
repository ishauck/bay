import { POST } from "@/app/api/forms/[form]/responses/route";
import { auth } from "@/lib/auth";
import { getForm, updateForm } from "@/lib/db/form";
import { deleteAllResponses, getResponses } from "@/lib/db/response";
import { RestError } from "@/lib/error";
import { ResponseMetadata } from "@/types/response";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ org: string; form: string }> }
) {
  const { org, form } = await params;

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

  const responses = await getResponses(formObject.id);

  const responseMetadata: ResponseMetadata[] = await Promise.all(
    responses.map(async (responsePromise) => {
      const response = await responsePromise;
      if (!response) return null;
      return {
        id: response.id,
        formId: response.formId,
        submittedAt: response.submittedAt,
        submittedBy: response.submittedBy,
        sender: response.sender
      };
    })
  ).then(results => results.filter(Boolean) as ResponseMetadata[]);

  return Response.json(responseMetadata);
}

export { POST };


export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ org: string; form: string }> }
) {
  const { org, form } = await params;

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

  await deleteAllResponses(formObject.id);

  // Reset responseCount to 0 in the form table
  await updateForm(formObject.id, {
    ...formObject,
    createdAt: formObject.createdAt instanceof Date ? formObject.createdAt.toISOString() : formObject.createdAt,
    updatedAt: new Date().toISOString(),
    responseCount: 0,
    nonAcceptingMessage: formObject.nonAcceptingMessage ?? "This form is not currently accepting responses.",
  });

  return Response.json({ success: true });
}

