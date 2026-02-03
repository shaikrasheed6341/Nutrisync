CREATE TYPE "public"."bodytype" AS ENUM('lean', 'athletic', 'overweight', 'obese');--> statement-breakpoint
CREATE TYPE "public"."foodcategory" AS ENUM('veg', 'nonveg', 'vegan', 'pescatarian', 'vegetarian');--> statement-breakpoint
CREATE TYPE "public"."gender" AS ENUM('male', 'female', 'other');--> statement-breakpoint
CREATE TYPE "public"."usergoal" AS ENUM('loseweight', 'gainweight', 'maintainweight');--> statement-breakpoint
CREATE TYPE "public"."usertype" AS ENUM('user', 'admin', 'nutritionist');--> statement-breakpoint
CREATE TABLE "userpersonaldata" (
	"id" uuid PRIMARY KEY NOT NULL,
	"age" integer NOT NULL,
	"height" real NOT NULL,
	"weight" real NOT NULL,
	"gender" text NOT NULL,
	"bodytype" text NOT NULL,
	"documentimage" text,
	"medicalissues" text NOT NULL,
	"foodcategory" text,
	"usergoal" text NOT NULL,
	"user_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"usertype" text DEFAULT 'user' NOT NULL,
	"image" text,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "userpersonaldata" ADD CONSTRAINT "userpersonaldata_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;