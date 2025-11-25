import { World, IWorldOptions } from '@cucumber/cucumber';

import { Fleet } from '../../Domain/Fleet';
import { Vehicle } from '../../Domain/Vehicle';
import { Location } from '../../Domain/Location';
import { InMemoryFleetRepository } from '../../Infra/InMemoryFleetRepository';
import { RegisterVehicleHandler } from '../../App/Command/RegisterVehicleHandler';
import { ParkVehicleHandler } from '../../App/Command/ParkVehicleHandler';
import { GetVehicleLocationHandler } from '../../App/Query/GetVehicleLocationHandler';

/**
 * Custom World for BDD tests
 * Holds the state and context for scenario execution
 */
export class FleetWorld extends World {
  public fleetRepository: InMemoryFleetRepository;
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

    this.fleetRepository = new InMemoryFleetRepository();
    this.registerVehicleHandler = new RegisterVehicleHandler(this.fleetRepository);
    this.parkVehicleHandler = new ParkVehicleHandler(this.fleetRepository);
    this.getVehicleLocationHandler = new GetVehicleLocationHandler(this.fleetRepository);
  }

  createMyFleet(userId: string = 'user-1'): Fleet {
    this.myFleet = this.createFleet(userId);

    return this.myFleet;
  }

  createOtherFleet(userId: string = 'user-2') {
    this.otherFleet = this.createFleet(userId);

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
    this.fleetRepository.clear();
    this.myFleet = undefined;
    this.otherFleet = undefined;
    this.currentVehicle = undefined;
    this.currentLocation = undefined;
    this.lastError = undefined;
  }

  private createFleet(userId: string) {
    const fleetId = `fleet-${Date.now()}-${Math.random()}`;
    const fleet = new Fleet(fleetId, userId);

    this.fleetRepository.save(fleet);
    return fleet;
  }
}
