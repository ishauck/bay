import { auth } from "@/lib/auth";
import { createForm, getFormsByOrganizationId } from "@/lib/db/form";
import { RestError } from "@/lib/error";
import { MAX_FORMS_PER_ORGANIZATION } from "@/lib/utils";
import { CreatableForm } from "@/types/api/forms";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ org: string }> }
) {
  const session = await auth.api.getSession({
    headers: req.headers,
  });
  const { org } = await params;

  if (!session) {
    return Response.json(
      new RestError("unauthorized", "Unauthorized", 401).toJSON(),
      { status: 401 }
    );
  }

  if (!org) {
    return Response.json(
      new RestError("invalid_request", "Invalid request", 400).toJSON(),
      { status: 400 }
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

  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = Math.min(parseInt(url.searchParams.get("limit") || "10"), 100);
  const offset = (page - 1) * limit;

  const forms = await getFormsByOrganizationId(orgObject.id);
  const paginatedForms = forms
    .slice(offset, offset + limit)
    .map((form) => form.form);
  const totalPages = Math.ceil(forms.length / limit);

  return Response.json({
    data: paginatedForms,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems: forms.length,
      itemsPerPage: limit,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  });
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ org: string }> }
) {
  const session = await auth.api.getSession({
    headers: req.headers,
  });
  const { org } = await params;

  if (!session) {
    return Response.json(
      new RestError("unauthorized", "Unauthorized", 401).toJSON(),
      { status: 401 }
    );
  }

  if (!org) {
    return Response.json(
      new RestError("invalid_request", "Invalid request", 400).toJSON(),
      { status: 400 }
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

  const forms = await getFormsByOrganizationId(orgObject.id);
  if (forms.length >= MAX_FORMS_PER_ORGANIZATION) {
    return Response.json(
      new RestError(
        "too_many_forms",
        "You have reached the maximum number of forms (" +
          MAX_FORMS_PER_ORGANIZATION +
          ")",
        400
      ).toJSON(),
      { status: 400 }
    );
  }

  const form = CreatableForm.safeParse(await req.json());

  if (!form.success) {
    return Response.json(
      new RestError(
        "invalid_request",
        "The request body is not a valid form",
        400
      ).toJSON(),
      { status: 400 }
    );
  }

  const formData = {
    name: form.data.name,
    createdAt: new Date().toISOString(),
    createdBy: session.user.id,
    updatedAt: null,
  } as const;

  const newForm = await createForm(orgObject.id, formData);

  return Response.json({
    id: newForm.id,
  });
}
