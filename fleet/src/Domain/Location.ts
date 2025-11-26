import { z } from 'zod/v4';

const schema = z.object({
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  alt: z.coerce.number().optional(),
});

export class Location {
  constructor(
    public readonly lat: number,
    public readonly lng: number,
    public readonly alt?: number,
  ) {
    schema.parse({ lat, lng, alt });
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
