import { Fleet } from '../../Domain/Fleet';
import { FleetRepository } from '../../Domain/FleetRepository';

import { CreateFleetCommand } from './CreateFleetCommand';

export class CreateFleetHandler {
  constructor(private readonly fleetRepository: FleetRepository) {}

  async handle(command: CreateFleetCommand): Promise<Fleet> {
    return await this.fleetRepository.create(command.userId);
  }
}
