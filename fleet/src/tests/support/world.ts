import { World, IWorldOptions } from '@cucumber/cucumber';
import dotenv from 'dotenv';

import { Fleet } from '../../Domain/Fleet';
import { Vehicle } from '../../Domain/Vehicle';
import { Location } from '../../Domain/Location';
import { FleetRepository } from '../../Domain/FleetRepository';

import { InMemoryFleetRepository } from '../../Infra/InMemoryFleetRepository';
import { PostgresFleetRepository } from '../../Infra/PostgresFleetRepository';

import { RegisterVehicleHandler } from '../../App/Command/RegisterVehicleHandler';
import { ParkVehicleHandler } from '../../App/Command/ParkVehicleHandler';
import { GetVehicleLocationHandler } from '../../App/Query/GetVehicleLocationHandler';

dotenv.config();

/**
 * Custom World for BDD tests
 * Holds the state and context for scenario execution
 */
export class FleetWorld extends World {
  public fleetRepository: FleetRepository;
  public registerVehicleHandler: RegisterVehicleHandler;
  public parkVehicleHandler: ParkVehicleHandler;
  public getVehicleLocationHandler: GetVehicleLocationHandler;

  public myFleet?: Fleet;
  public otherFleet?: Fleet;
  public currentVehicle?: Vehicle;
  public currentLocation?: Location;
  public lastError?: Error;

  constructor(options: IWorldOptions) {
    super(options);

    const usePersistence = process.env.TEST_PERSISTENCE === 'true';

    if (usePersistence) {
      this.fleetRepository = new PostgresFleetRepository();
    } else {
      this.fleetRepository = new InMemoryFleetRepository();
    }

    this.registerVehicleHandler = new RegisterVehicleHandler(this.fleetRepository);
    this.parkVehicleHandler = new ParkVehicleHandler(this.fleetRepository);
    this.getVehicleLocationHandler = new GetVehicleLocationHandler(this.fleetRepository);
  }

  async createMyFleet(userId: string = `u${Date.now()}`): Promise<Fleet> {
    this.myFleet = await this.createFleet(userId);

    return this.myFleet;
  }

  async createOtherFleet(userId: string = `u${Date.now() + 7}`) {
    this.otherFleet = await this.createFleet(userId);

    return this.otherFleet;
  }

  createVehicle(plateNumber?: string) {
    const plate = plateNumber || `ABC-${Date.now()}`;
    this.currentVehicle = new Vehicle(plate);

    return this.currentVehicle;
  }

  createLocation(lat: number = 48.8566, lng: number = 2.3522, alt?: number) {
    this.currentLocation = new Location(lat, lng, alt);

    return this.currentLocation;
  }

  reset() {
    if (this.fleetRepository instanceof InMemoryFleetRepository) {
      this.fleetRepository.clear();
    }

    this.myFleet = undefined;
    this.otherFleet = undefined;
    this.currentVehicle = undefined;
    this.currentLocation = undefined;
    this.lastError = undefined;
  }

  private async createFleet(userId: string) {
    return await this.fleetRepository.create(userId);
  }
}
