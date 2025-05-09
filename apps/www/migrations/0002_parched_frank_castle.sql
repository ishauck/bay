CREATE TABLE "report_abuse" (
	"id" text PRIMARY KEY NOT NULL,
	"form_id" text NOT NULL,
	"user_id" text NOT NULL,
	"reason" text NOT NULL,
	"details" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"reviewed_at" timestamp,
	"reviewed_by" text,
	"status" text DEFAULT 'pending' NOT NULL
);
--> statement-breakpoint
ALTER TABLE "report_abuse" ADD CONSTRAINT "report_abuse_form_id_form_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."form"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "report_abuse" ADD CONSTRAINT "report_abuse_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "report_abuse" ADD CONSTRAINT "report_abuse_reviewed_by_user_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;