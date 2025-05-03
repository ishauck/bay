import { FormPartial } from "@/types/api/forms";
import { db } from "./drizzle";
import { form, organization } from "./schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

export async function getForm(id: string) {
  return await db.select().from(form).where(eq(form.id, id));
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
export async function createForm(orgId: string, formData: Omit<FormPartial, 'id' | 'organizationId' | 'responseCount'>) {
  console.log('createForm called with orgId:', orgId, 'formData:', formData);
  const id = nanoid();
  
  const formValues = {
    id,
    organizationId: orgId,
    responseCount: 0,
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