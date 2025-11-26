import { z } from 'zod/v4';
import { Location } from '../../Domain/Location';

const schema = z.object({
  fleetId: z.coerce.number().int().positive(),
  plateNumber: z.string().min(1),
  location: z.instanceof(Location),
});

export class ParkVehicleCommand {
  constructor(
    public readonly fleetId: number,
    public readonly plateNumber: string,
    public readonly location: Location
  ) {
    schema.parse({ fleetId, plateNumber, location });
  }
}
