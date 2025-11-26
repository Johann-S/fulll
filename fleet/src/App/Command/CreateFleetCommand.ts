import { z } from 'zod/v4';

const schema = z.object({
  userId: z.string().min(1).max(100),
});

export class CreateFleetCommand {
  constructor(public readonly userId: string) {
    schema.parse({ userId });
  }
}
