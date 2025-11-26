CREATE TABLE "fleets" (
	"id" uuid PRIMARY KEY NOT NULL,
	"fleet_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"vehicles" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"vehicle_locations" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "fleets_fleet_id_unique" UNIQUE("fleet_id")
);
