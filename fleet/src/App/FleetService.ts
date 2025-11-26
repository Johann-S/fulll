import { Location } from '../Domain/Location';
import type { FleetRepository } from '../Domain/FleetRepository';

import { CreateFleetCommand } from './Command/CreateFleetCommand';
import { CreateFleetHandler } from './Command/CreateFleetHandler';
import { RegisterVehicleCommand } from './Command/RegisterVehicleCommand';
import { RegisterVehicleHandler } from './Command/RegisterVehicleHandler';
import { ParkVehicleCommand } from './Command/ParkVehicleCommand';
import { ParkVehicleHandler } from './Command/ParkVehicleHandler';

import { GetVehicleLocationQuery } from './Query/GetVehicleLocationQuery';
import { GetVehicleLocationHandler } from './Query/GetVehicleLocationHandler';

export class FleetService {
  private readonly createFleetHandler: CreateFleetHandler;
  private readonly registerVehicleHandler: RegisterVehicleHandler;
  private readonly parkVehicleHandler: ParkVehicleHandler;
  private readonly getVehicleLocationHandler: GetVehicleLocationHandler;

  constructor(fleetRepository: FleetRepository) {
    this.createFleetHandler = new CreateFleetHandler(fleetRepository);
    this.registerVehicleHandler = new RegisterVehicleHandler(fleetRepository);
    this.parkVehicleHandler = new ParkVehicleHandler(fleetRepository);
    this.getVehicleLocationHandler = new GetVehicleLocationHandler(fleetRepository);
  }

  async createFleet(userId: string) {
    return await this.createFleetHandler.handle(new CreateFleetCommand(userId));
  }

  async registerVehicle(fleetId: number, plateNumber: string) {
    await this.registerVehicleHandler.handle(new RegisterVehicleCommand(fleetId, plateNumber));
  }

  async localizeVehicle(fleetId: number, plateNumber: string, lat: number, lng: number, alt?: number) {
    const location = new Location(lat, lng, alt);

    await this.parkVehicleHandler.handle(new ParkVehicleCommand(fleetId, plateNumber, location));
  }

  async getVehicleLocation(fleetId: number, plateNumber: string) {
    return await this.getVehicleLocationHandler.handle(new GetVehicleLocationQuery(fleetId, plateNumber));
  }
}
