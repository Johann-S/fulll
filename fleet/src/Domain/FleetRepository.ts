import { Fleet } from './Fleet';

export interface FleetRepository {
  save(fleet: Fleet): void;
  findById(fleetId: string): Fleet | undefined;
}
