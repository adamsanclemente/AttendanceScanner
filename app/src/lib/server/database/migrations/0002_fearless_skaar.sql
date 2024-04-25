ALTER TABLE "classes" ALTER COLUMN "school_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "records" ALTER COLUMN "class_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "students" ALTER COLUMN "school_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "student_to_class" ALTER COLUMN "class_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "user_to_class" ALTER COLUMN "class_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "user_to_school" ALTER COLUMN "school_id" SET DATA TYPE uuid;