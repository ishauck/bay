ALTER TABLE "form" RENAME COLUMN "background_color" TO "background_value";--> statement-breakpoint
ALTER TABLE "form" ADD COLUMN "background_type" text DEFAULT 'solid' NOT NULL;