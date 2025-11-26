import { GetVehicleLocationQuery } from './GetVehicleLocationQuery';

import { FleetRepository } from '../../Domain/FleetRepository';
import { Vehicle } from '../../Domain/Vehicle';

export class GetVehicleLocationHandler {
  constructor(private readonly fleetRepository: FleetRepository) {}

  async handle(query: GetVehicleLocationQuery) {
    const fleet = await this.fleetRepository.findById(query.fleetId);

    if (!fleet) {
      throw new Error(`Fleet with id ${query.fleetId} not found`);
    }

    return fleet.getVehicleLocation(new Vehicle(query.plateNumber));
  }
}
