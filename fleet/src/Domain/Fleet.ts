import { Vehicle } from './Vehicle';
import { Location } from './Location';
import { VehicleAlreadyRegisteredError } from './Errors/VehicleAlreadyRegisteredError';
import { VehicleAlreadyParkedError } from './Errors/VehicleAlreadyParkedError';
import { VehicleNotRegisteredError } from './Errors/VehicleNotRegisteredError';

export class Fleet {
  private vehicles: Set<string>;
  private vehicleLocations: Map<string, Location>;

  constructor(
    public readonly fleetId: number,
    public readonly userId: string
  ) {
    this.vehicles = new Set();
    this.vehicleLocations = new Map();
  }

  registerVehicle(vehicle: Vehicle) {
    if (this.vehicles.has(vehicle.plateNumber)) {
      throw new VehicleAlreadyRegisteredError(vehicle.plateNumber);
    }

    this.vehicles.add(vehicle.plateNumber);
  }

  parkVehicle(vehicle: Vehicle, location: Location) {
    if (!this.vehicles.has(vehicle.plateNumber)) {
      throw new VehicleNotRegisteredError(vehicle.plateNumber);
    }

    const currentLocation = this.vehicleLocations.get(vehicle.plateNumber);

    if (currentLocation && currentLocation.equals(location)) {
      throw new VehicleAlreadyParkedError(vehicle.plateNumber);
    }

    this.vehicleLocations.set(vehicle.plateNumber, location);
  }

  getVehicleLocation(vehicle: Vehicle) {
    return this.vehicleLocations.get(vehicle.plateNumber);
  }

  hasVehicle(vehicle: Vehicle) {
    return this.vehicles.has(vehicle.plateNumber);
  }

  getVehicles() {
    return Array.from(this.vehicles).map(plateNumber => new Vehicle(plateNumber));
  }
}
