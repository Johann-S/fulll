import type { Fleet } from './Fleet';

export interface FleetRepository {
  create(userId: string): Promise<Fleet>;
  save(fleet: Fleet): Promise<void>;
  findById(fleetId: number): Promise<Fleet | undefined>;
}
