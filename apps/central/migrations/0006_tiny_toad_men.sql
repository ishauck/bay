ALTER TABLE "organization_data" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "organization_data" CASCADE;--> statement-breakpoint
ALTER TABLE "form" DROP CONSTRAINT "form_organization_id_organization_data_id_fk";
--> statement-breakpoint
ALTER TABLE "form" ADD CONSTRAINT "form_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;