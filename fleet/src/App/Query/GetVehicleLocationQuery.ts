import { z } from 'zod/v4';

const schema = z.object({
  fleetId: z.coerce.number().int().positive(),
  plateNumber: z.string().min(1),
});

export class GetVehicleLocationQuery {
  constructor(
    public readonly fleetId: number,
    public readonly plateNumber: string,
  ) {
    schema.parse({ fleetId, plateNumber });
  }
}
