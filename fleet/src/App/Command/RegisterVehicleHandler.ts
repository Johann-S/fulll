import type { RegisterVehicleCommand } from './RegisterVehicleCommand';

import type { FleetRepository } from '../../Domain/FleetRepository';
import { Vehicle } from '../../Domain/Vehicle';

export class RegisterVehicleHandler {
  constructor(private readonly fleetRepository: FleetRepository) {}

  async handle(command: RegisterVehicleCommand): Promise<void> {
    const fleet = await this.fleetRepository.findById(command.fleetId);

    if (!fleet) {
      throw new Error(`Fleet with id ${command.fleetId} not found`);
    }

    const vehicle = new Vehicle(command.plateNumber);
    fleet.registerVehicle(vehicle);

    await this.fleetRepository.save(fleet);
  }
}
