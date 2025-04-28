CREATE TABLE "form" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"created_by" text NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "organization_data" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "form" ADD CONSTRAINT "form_organization_id_organization_data_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization_data"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "form" ADD CONSTRAINT "form_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organization_data" ADD CONSTRAINT "organization_data_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;