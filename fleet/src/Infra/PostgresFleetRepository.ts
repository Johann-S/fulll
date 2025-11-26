import { count, eq, and } from 'drizzle-orm';

import { Fleet } from '../Domain/Fleet';
import { Vehicle } from '../Domain/Vehicle';
import { Location } from '../Domain/Location';
import { FleetRepository } from '../Domain/FleetRepository';

import { getDatabase } from './Database/connection';
import { fleets, vehicles, fleetVehicles, vehicleLocations } from './Database/schema';

type DbClient = ReturnType<typeof getDatabase>;
type DbExecutor = DbClient | Parameters<Parameters<DbClient['transaction']>[0]>[0];

export class PostgresFleetRepository implements FleetRepository {
  private get db() {
    return getDatabase();
  }

  async create(userId: string): Promise<Fleet> {
    const result = await this.db
      .insert(fleets)
      .values({ userId })
      .returning({ id: fleets.id });

    const fleetId = result[0].id;
    return new Fleet(fleetId, userId);
  }

  async save(fleet: Fleet) {
    await this.db.transaction(async (tx) => {
      await this.verifyFleetExists(tx, fleet.fleetId);
      await this.syncFleetVehicles(tx, fleet);
      await this.syncVehicleLocations(tx, fleet);
      await this.updateFleetTimestamp(tx, fleet.fleetId);
    });
  }

  async findById(fleetId: number) {
    const result = await this.db
      .select()
      .from(fleets)
      .where(eq(fleets.id, fleetId))
      .limit(1);

    if (result.length === 0) {
      return undefined;
    }

    const fleetData = result[0];
    const fleet = new Fleet(fleetData.id, fleetData.userId);

    const [fleetVehiclesList, locations] = await Promise.all([
      this.db
        .select({ plateNumber: fleetVehicles.plateNumber })
        .from(fleetVehicles)
        .where(eq(fleetVehicles.fleetId, fleetId)),
      this.db
        .select()
        .from(vehicleLocations)
        .where(eq(vehicleLocations.fleetId, fleetId)),
    ]);

    for (const vehicleData of fleetVehiclesList) {
      fleet.registerVehicle(new Vehicle(vehicleData.plateNumber));
    }

    for (const locationData of locations) {
      const location = new Location(
        parseFloat(locationData.latitude),
        parseFloat(locationData.longitude),
        locationData.altitude ? parseFloat(locationData.altitude) : undefined
      );

      fleet.parkVehicle(new Vehicle(locationData.plateNumber), location);
    }

    return fleet;
  }

  private async verifyFleetExists(tx: DbExecutor, fleetId: number): Promise<void> {
    const existing = await tx
      .select({ count: count() })
      .from(fleets)
      .where(eq(fleets.id, fleetId));

    if (!existing[0].count) {
      throw new Error('Fleet not found');
    }
  }

  private async updateFleetTimestamp(tx: DbExecutor, fleetId: number): Promise<void> {
    await tx
      .update(fleets)
      .set({ updatedAt: new Date() })
      .where(eq(fleets.id, fleetId));
  }

  private async syncFleetVehicles(tx: DbExecutor, fleet: Fleet): Promise<void> {
    const existingFleetVehicles = await tx
      .select({ plateNumber: fleetVehicles.plateNumber })
      .from(fleetVehicles)
      .where(eq(fleetVehicles.fleetId, fleet.fleetId));

    const existingPlateNumbers = new Set(
      existingFleetVehicles.map(v => v.plateNumber)
    );

    await Promise.all(
      fleet.getVehicles()
        .filter(vehicle => !existingPlateNumbers.has(vehicle.plateNumber))
        .map(async mVehicle => {
          await tx
            .insert(vehicles)
            .values({ plateNumber: mVehicle.plateNumber })
            .onConflictDoNothing();

          await tx
            .insert(fleetVehicles)
            .values({ fleetId: fleet.fleetId, plateNumber: mVehicle.plateNumber });
        })
    );
  }

  private async syncVehicleLocations(tx: DbExecutor, fleet: Fleet): Promise<void> {
    await Promise.all(
      fleet.getVehicles()
        .filter(vehicle => !!fleet.getVehicleLocation(vehicle))
        .map(vehicle =>
          this.upsertVehicleLocation(
            tx,
            fleet.fleetId,
            vehicle,
            fleet.getVehicleLocation(vehicle)!
          )
        )
    );
  }

  private async upsertVehicleLocation(
    tx: DbExecutor,
    fleetId: number,
    vehicle: Vehicle,
    location: Location
  ): Promise<void> {
    const existingLocation = await tx
      .select()
      .from(vehicleLocations)
      .where(
        and(
          eq(vehicleLocations.fleetId, fleetId),
          eq(vehicleLocations.plateNumber, vehicle.plateNumber)
        )
      )
      .limit(1);

    const locationData = {
      latitude: location.lat.toString(),
      longitude: location.lng.toString(),
      altitude: location.alt?.toString(),
    };

    if (existingLocation.length) {
      await tx
        .update(vehicleLocations)
        .set({
          ...locationData,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(vehicleLocations.fleetId, fleetId),
            eq(vehicleLocations.plateNumber, vehicle.plateNumber)
          )
        );
    } else {
      await tx
        .insert(vehicleLocations)
        .values({
          fleetId,
          plateNumber: vehicle.plateNumber,
          ...locationData,
        });
    }
  }
}
