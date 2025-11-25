import { Fleet } from '../Domain/Fleet';
import { FleetRepository } from '../Domain/FleetRepository';

export class InMemoryFleetRepository implements FleetRepository {
  private fleets: Map<string, Fleet>;

  constructor() {
    this.fleets = new Map();
  }

  save(fleet: Fleet) {
    this.fleets.set(fleet.fleetId, fleet);
  }

  findById(fleetId: string) {
    return this.fleets.get(fleetId);
  }

  clear() {
    this.fleets.clear();
  }
}
