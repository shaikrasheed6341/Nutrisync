ALTER TABLE "users" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "username" text NOT NULL;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "name";