import { auth } from "@/lib/auth";
import { getForm } from "@/lib/db/form";
import { RestError } from "@/lib/error";

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
