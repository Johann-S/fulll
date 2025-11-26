import { ParkVehicleCommand } from './ParkVehicleCommand';

import { FleetRepository } from '../../Domain/FleetRepository';
import { Vehicle } from '../../Domain/Vehicle';

export class ParkVehicleHandler {
  constructor(private readonly fleetRepository: FleetRepository) {}

  async handle(command: ParkVehicleCommand): Promise<void> {
    const fleet = await this.fleetRepository.findById(command.fleetId);

    if (!fleet) {
      throw new Error(`Fleet with id ${command.fleetId} not found`);
    }

    fleet.parkVehicle(new Vehicle(command.plateNumber), command.location);

    await this.fleetRepository.save(fleet);
  }
}
