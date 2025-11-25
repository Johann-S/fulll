import { ParkVehicleCommand } from './ParkVehicleCommand';
import { FleetRepository } from '../../Domain/FleetRepository';
import { Vehicle } from '../../Domain/Vehicle';

export class ParkVehicleHandler {
  constructor(private readonly fleetRepository: FleetRepository) {}

  handle(command: ParkVehicleCommand) {
    const fleet = this.fleetRepository.findById(command.fleetId);

    if (!fleet) {
      throw new Error(`Fleet with id ${command.fleetId} not found`);
    }

    const vehicle = new Vehicle(command.plateNumber);
    fleet.parkVehicle(vehicle, command.location);

    this.fleetRepository.save(fleet);
  }
}
