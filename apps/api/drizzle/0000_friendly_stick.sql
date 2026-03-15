CREATE TYPE "public"."user_role" AS ENUM('admin', 'user', 'moderator');--> statement-breakpoint
CREATE TABLE "scores" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"composer" text NOT NULL,
	"lyricist" text NOT NULL,
	"description" text NOT NULL,
	"location" text NOT NULL,
	"category" text NOT NULL,
	"color" text NOT NULL,
	"key" text NOT NULL,
	"genre" text NOT NULL,
	"lyrics" text NOT NULL,
	"date" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"user_id" uuid
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"role" "user_role" DEFAULT 'user' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "scores" ADD CONSTRAINT "scores_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;