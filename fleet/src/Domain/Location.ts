export class Location {
  constructor(
    public readonly lat: number,
    public readonly lng: number,
    public readonly alt?: number
  ) {
    this.validate();
  }

  private validate() {
    if (this.lat < -90 || this.lat > 90) {
      throw new Error('Latitude must be between -90 and 90');
    }
    if (this.lng < -180 || this.lng > 180) {
      throw new Error('Longitude must be between -180 and 180');
    }
  }

  equals(other: Location) {
    return (
      this.lat === other.lat &&
      this.lng === other.lng &&
      this.alt === other.alt
    );
  }

  toString() {
    return this.alt
      ? `Location(${this.lat}, ${this.lng}, ${this.alt})`
      : `Location(${this.lat}, ${this.lng})`;
  }
}
