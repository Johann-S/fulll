import { Fleet } from '../Domain/Fleet';
import type { FleetRepository } from '../Domain/FleetRepository';

export class InMemoryFleetRepository implements FleetRepository {
  private fleets: Map<number, Fleet>;

  constructor() {
    this.fleets = new Map();
  }

  async create(userId: string): Promise<Fleet> {
    const fleetId = this.generateFleetId();
    const fleet = new Fleet(fleetId, userId);

    await this.save(fleet);
    return fleet;
  }

  async save(fleet: Fleet) {
    this.fleets.set(fleet.fleetId, fleet);
  }

  async findById(fleetId: number) {
    return this.fleets.get(fleetId);
  }

  clear() {
    this.fleets.clear();
  }

  private generateFleetId(): number {
    return Math.floor(Math.random() * 1000000);
  }
}
