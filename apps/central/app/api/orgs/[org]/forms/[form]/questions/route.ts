import { NextResponse } from "next/server";
import { Params } from "../types";
import { RestError } from "@/lib/error";
import { getForm } from "@/lib/db/form";
import { auth } from "@/lib/auth";
import { getOrCreateQuestions, setQuestions } from "@/lib/db/questions";
import { QuestionTypes } from "@/types/api/form-questions";

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

  const questions = await getOrCreateQuestions(formObj.id);
  const questionsList = questions.questions;

  return NextResponse.json(questionsList);
}

export async function POST(
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

  const questions = await getOrCreateQuestions(formObj.id);
  const questionsList = questions.questions;

  const body = await request.json();
  const parsedQuestions = Array.isArray(body) ? body : [body];
  const validatedQuestions = parsedQuestions.map(q => QuestionTypes.safeParse(q));

  if (validatedQuestions.some(result => !result.success)) {
    return NextResponse.json(
      new RestError("invalid_question", "One or more questions are invalid", 400).toJSON(),
      { status: 400 }
    );
  }

  const newQuestions = [...questionsList, ...validatedQuestions.map(q => q.data).filter((q): q is NonNullable<typeof q> => q !== undefined)];
  if (newQuestions.length > 50) {
    return NextResponse.json(
      new RestError("too_many_questions", "You have reached the maximum number of questions.", 400).toJSON(),
      { status: 400 }
    );
  }

  await setQuestions(formObj.id, newQuestions);

  return NextResponse.json(newQuestions);
}

export async function PUT(
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
  const parsedQuestions = Array.isArray(body) ? body : [body];
  const validatedQuestions = parsedQuestions.map(q => QuestionTypes.safeParse(q));

  if (validatedQuestions.some(result => !result.success)) {
    return NextResponse.json(
      new RestError("invalid_question", "One or more questions are invalid", 400).toJSON(),
      { status: 400 }
    );
  }

  const newQuestions = validatedQuestions.map(q => q.data).filter((q): q is NonNullable<typeof q> => q !== undefined);
  if (newQuestions.length > 50) {
    return NextResponse.json(
      new RestError("too_many_questions", "You have reached the maximum number of questions.", 400).toJSON(),
      { status: 400 }
    );
  }

  await setQuestions(formObj.id, newQuestions);

  return NextResponse.json(newQuestions);
}