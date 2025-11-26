export class VehicleNotRegisteredError extends Error {
  constructor(plateNumber: string) {
    super(`Vehicle with plate number ${plateNumber} is not registered in this fleet`);
    this.name = 'VehicleNotRegisteredError';
  }
}

