import { FormPartial, FormSettableFields } from "@/types/api/forms";
import { db } from "./drizzle";
import { form, organization } from "./schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { deleteQuestions } from "./questions";

export async function updateForm(id: string, data: FormSettableFields) {
  return await db.update(form)
    .set({
      ...data,
      createdAt: new Date(data.createdAt),
      updatedAt: data.updatedAt ? new Date(data.updatedAt) : null
    })
    .where(eq(form.id, id))
}

export async function getForm(id: string) {
  return await db.select().from(form).where(eq(form.id, id)).limit(1);
}

export async function getFormsByOrganizationId(orgId: string) {

  return await db
    .select()
    .from(form)
    .innerJoin(
      organization,
      eq(form.organizationId, organization.id)
    )
    .where(eq(organization.id, orgId));
}

export async function getFormsByOrganizationSlug(slug: string) {
  // First get the organization by slug
  const org = await db
    .select()
    .from(organization)
    .where(eq(organization.slug, slug))
    .limit(1);

  if (org.length === 0) {
    return [];
  }

  return await db
    .select()
    .from(form)
    .innerJoin(organization, eq(form.organizationId, organization.id))
    .where(eq(organization.slug, slug));
}
export async function createForm(orgId: string, formData: Omit<FormPartial, 'id' | 'organizationId'>) {
  console.log('createForm called with orgId:', orgId, 'formData:', formData);
  const id = nanoid();
  
  const formValues = {
    id,
    organizationId: orgId,
    ...formData,
  };
  console.log('Attempting to create form with values:', formValues);
  try {
    const result = await db.insert(form).values({
      ...formValues,
      createdAt: new Date(formValues.createdAt),
      updatedAt: formValues.updatedAt ? new Date(formValues.updatedAt) : null
    });
    console.log('Successfully created form');
    return {
      res: result,
      id,
    };
  } catch (error) {
    console.error('Error creating form:', error);
    throw error;
  }
}

export async function deleteForm(id: string) {
  if (id.startsWith("form_")) {
    id = id.substring("form_".length);
  }
  await deleteQuestions(id);
  return await db.delete(form).where(eq(form.id, id));
}