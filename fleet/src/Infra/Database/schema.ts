import {
  pgTable,
  varchar,
  timestamp,
  integer,
  uniqueIndex,
  index,
  decimal,
  primaryKey,
} from 'drizzle-orm/pg-core';

export const fleets = pgTable('fleets', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  userId: varchar('user_id', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => [
  uniqueIndex('fleets_user_id_idx').on(table.userId),
]);

export const vehicles = pgTable('vehicles', {
  plateNumber: varchar('plate_number', { length: 50 }).primaryKey(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Fleet-Vehicle relationship - junction table
// A vehicle can belong to multiple fleets (many-to-many relationship)
export const fleetVehicles = pgTable('fleet_vehicles', {
  fleetId: integer('fleet_id').notNull().references(() => fleets.id, { onDelete: 'cascade' }),
  plateNumber: varchar('plate_number', { length: 50 })
    .notNull()
    .references(() => vehicles.plateNumber, { onDelete: 'cascade' }),
  registeredAt: timestamp('registered_at').notNull().defaultNow(),
}, (table) => [
  // Composite primary key: a vehicle can only be registered once per fleet
  primaryKey({ columns: [table.fleetId, table.plateNumber] }),
  // Index for efficient queries by fleet
  index('fleet_vehicles_fleet_id_idx').on(table.fleetId),
  // Index for finding all fleets that have a specific vehicle
  index('fleet_vehicles_plate_number_idx').on(table.plateNumber),
]);

export const vehicleLocations = pgTable('vehicle_locations', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  fleetId: integer('fleet_id').notNull().references(() => fleets.id, { onDelete: 'cascade' }),
  plateNumber: varchar('plate_number', { length: 50 })
    .notNull()
    .references(() => vehicles.plateNumber, { onDelete: 'cascade' }),
  // Using DECIMAL for precise geographic coordinates
  latitude: decimal('latitude', { precision: 10, scale: 8 }).notNull(), // -90.00000000 to 90.00000000
  longitude: decimal('longitude', { precision: 11, scale: 8 }).notNull(), // -180.00000000 to 180.00000000
  altitude: decimal('altitude', { precision: 10, scale: 2 }), // Optional altitude in meters
  parkedAt: timestamp('parked_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => [
  // Composite index for efficient lookups
  uniqueIndex('vehicle_locations_fleet_vehicle_idx').on(table.fleetId, table.plateNumber),
  index('vehicle_locations_fleet_id_idx').on(table.fleetId),
  index('vehicle_locations_plate_number_idx').on(table.plateNumber),
  // For time-based queries (e.g., location history)
  index('vehicle_locations_parked_at_idx').on(table.parkedAt),
]);

export type Fleet = typeof fleets.$inferSelect;
export type NewFleet = typeof fleets.$inferInsert;
export type Vehicle = typeof vehicles.$inferSelect;
export type NewVehicle = typeof vehicles.$inferInsert;
export type FleetVehicle = typeof fleetVehicles.$inferSelect;
export type NewFleetVehicle = typeof fleetVehicles.$inferInsert;
export type VehicleLocation = typeof vehicleLocations.$inferSelect;
export type NewVehicleLocation = typeof vehicleLocations.$inferInsert;
