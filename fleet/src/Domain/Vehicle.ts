export class Vehicle {
  constructor(public readonly plateNumber: string) {
    this.validate();
  }

  private validate() {
    if (!this.plateNumber || this.plateNumber.trim().length === 0) {
      throw new Error('Plate number cannot be empty');
    }
  }

  equals(other: Vehicle) {
    return this.plateNumber === other.plateNumber;
  }

  toString() {
    return `Vehicle(${this.plateNumber})`;
  }
}
