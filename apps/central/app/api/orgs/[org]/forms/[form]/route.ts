import { auth } from "@/lib/auth";
import { getForm, updateForm, deleteForm } from "@/lib/db/form";
import { RestError } from "@/lib/error";
import { FormEditable } from "@/types/api/forms";
import { NextResponse } from "next/server";
import { Params } from "./types";

export async function GET(
  request: Request,
  { params }: { params: Promise<Params> }
) {
  const { form, org } = await params;

  if (!form.startsWith("form_")) {
    return NextResponse.json(
      new RestError("invalid_form", "The form ID is invalid", 400).toJSON(),
      { status: 400 }
    );
  }

  if (!org.startsWith("org_")) {
    return NextResponse.json(
      new RestError(
        "invalid_org",
        "The organization ID is invalid",
        400
      ).toJSON(),
      { status: 400 }
    );
  }

  const formId = form.substring("form_".length);
  const orgId = org.substring("org_".length);

  const orgs = await auth.api.listOrganizations({
    headers: request.headers,
  });

  if (!orgs.some((o) => o.id === orgId)) {
    return NextResponse.json(
      new RestError(
        "org_not_found",
        "The organization could not be found",
        404
      ).toJSON(),
      { status: 404 }
    );
  }

  const formData = await getForm(formId);
  if (formData.length === 0 || formData[0].organizationId !== orgId) {
    return NextResponse.json(
      new RestError("invalid_form", "The form ID is invalid", 404).toJSON(),
      { status: 404 }
    );
  }

  const formObj = formData[0];

  return NextResponse.json(formObj);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<Params> }
) {
  const { form, org } = await params;

  if (!form.startsWith("form_")) {
    return NextResponse.json(
      new RestError("invalid_form", "The form ID is invalid", 400).toJSON(),
      { status: 400 }
    );
  }

  if (!org.startsWith("org_")) {
    return NextResponse.json(
      new RestError(
        "invalid_org",
        "The organization ID is invalid",
        400
      ).toJSON(),
      { status: 400 }
    );
  }

  const formId = form.substring("form_".length);
  const orgId = org.substring("org_".length);

  const orgs = await auth.api.listOrganizations({
    headers: request.headers,
  });

  if (!orgs.some((o) => o.id === orgId)) {
    return NextResponse.json(
      new RestError(
        "org_not_found",
        "The organization could not be found",
        404
      ).toJSON(),
      { status: 404 }
    );
  }

  const formData = await getForm(formId);
  if (formData.length === 0 || formData[0].organizationId !== orgId) {
    return NextResponse.json(
      new RestError("invalid_form", "The form ID is invalid", 404).toJSON(),
      { status: 404 }
    );
  }

  const formObj = formData[0];

  const body = await request.json();
  const result = FormEditable.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      new RestError("invalid_form", "The form ID is invalid", 400).toJSON(),
      { status: 400 }
    );
  }

  const updatedForm = {
    ...formObj,
    ...result.data,
    createdAt: formObj.createdAt.toISOString(),
    updatedAt: formObj.updatedAt?.toISOString() ?? null,
  };

  await updateForm(formId, updatedForm);

  return NextResponse.json(updatedForm);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<Params> }
) {
  const { form, org } = await params;

  if (!form.startsWith("form_")) {
    return NextResponse.json(
      new RestError("invalid_form", "The form ID is invalid", 400).toJSON(),
      { status: 400 }
    );
  }

  if (!org.startsWith("org_")) {
    return NextResponse.json(
      new RestError(
        "invalid_org",
        "The organization ID is invalid",
        400
      ).toJSON(),
      { status: 400 }
    );
  }

  const formId = form.substring("form_".length);
  const orgId = org.substring("org_".length);

  const orgs = await auth.api.listOrganizations({
    headers: request.headers,
  });

  if (!orgs.some((o) => o.id === orgId)) {
    return NextResponse.json(
      new RestError(
        "org_not_found",
        "The organization could not be found",
        404
      ).toJSON(),
      { status: 404 }
    );
  }

  const formData = await getForm(formId);
  if (formData.length === 0 || formData[0].organizationId !== orgId) {
    return NextResponse.json(
      new RestError("invalid_form", "The form ID is invalid", 404).toJSON(),
      { status: 404 }
    );
  }

  await deleteForm(formId);

  return new NextResponse(null, { status: 204 });
}
