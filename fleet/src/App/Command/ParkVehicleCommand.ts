import { Location } from '../../Domain/Location';

export class ParkVehicleCommand {
  constructor(
    public readonly fleetId: string,
    public readonly plateNumber: string,
    public readonly location: Location
  ) {}
}
