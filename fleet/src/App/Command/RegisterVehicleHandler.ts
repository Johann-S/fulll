import { RegisterVehicleCommand } from './RegisterVehicleCommand';
import { FleetRepository } from '../../Domain/FleetRepository';
import { Vehicle } from '../../Domain/Vehicle';

export class RegisterVehicleHandler {
  constructor(private readonly fleetRepository: FleetRepository) {}

  handle(command: RegisterVehicleCommand): void {
    const fleet = this.fleetRepository.findById(command.fleetId);

    if (!fleet) {
      throw new Error(`Fleet with id ${command.fleetId} not found`);
    }

    const vehicle = new Vehicle(command.plateNumber);
    fleet.registerVehicle(vehicle);

    this.fleetRepository.save(fleet);
  }
}
