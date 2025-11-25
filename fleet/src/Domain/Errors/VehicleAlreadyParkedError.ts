export class VehicleAlreadyParkedError extends Error {
  constructor(plateNumber: string) {
    super(`Vehicle with plate number ${plateNumber} is already parked at this location`);

    this.name = 'VehicleAlreadyParkedError';
  }
}
