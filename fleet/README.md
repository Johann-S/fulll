# Vehicle Fleet Parking Management

A vehicle fleet parking management system implementing **Domain-Driven Design (DDD)** and **CQRS** principles with comprehensive BDD tests.

## Architecture

This implementation follows clean architecture principles with clear separation of concerns:

### Directory Structure

```
fleet/
├── src/
│   ├── App/              # Application Layer (CQRS)
│   │   ├── Command/      # Commands and handlers
│   │   └── Query/        # Queries and handlers
│   ├── Domain/           # Domain Layer (Business Logic)
│   │   ├── Fleet.ts      # Aggregate Root
│   │   ├── Vehicle.ts    # Value Object
│   │   ├── Location.ts   # Value Object
│   │   ├── FleetRepository.ts  # Repository Interface
│   │   └── Errors/       # Domain Errors
│   ├── Infra/            # Infrastructure Layer
│   │   └── InMemoryFleetRepository.ts
│   └── tests/            # BDD Tests
│       ├── features/     # Gherkin scenarios
│       ├── step_definitions/  # Cucumber steps
│       └── support/      # Test support (World)
└── cucumber.js           # Cucumber configuration
```

## Domain Model

### Entities & Value Objects

- **Fleet** (Aggregate Root): Manages a collection of vehicles and their locations
  - Properties: `fleetId`, `userId`
  - Methods: `registerVehicle()`, `parkVehicle()`, `getVehicleLocation()`

- **Vehicle** (Value Object): Represents a vehicle identified by plate number
  - Properties: `plateNumber`

- **Location** (Value Object): GPS coordinates
  - Properties: `lat`, `lng`, `alt` (optional)

### Commands (Write Operations)

- `RegisterVehicleCommand`: Register a vehicle into a fleet
- `ParkVehicleCommand`: Park a vehicle at a location

### Queries (Read Operations)

- `GetVehicleLocationQuery`: Retrieve the location of a vehicle

### Domain Rules

1. A vehicle cannot be registered twice in the same fleet
2. A vehicle can belong to multiple fleets (different users)
3. A vehicle cannot be parked at the same location twice in a row
4. Location equality considers latitude, longitude, and altitude

## Testing

### Run Tests

```bash
npm run test:fleet
```

### BDD Features

#### Register Vehicle (`register_vehicle.feature`)
- ✅ Register a new vehicle into a fleet
- ✅ Prevent duplicate registration in the same fleet
- ✅ Allow same vehicle in multiple fleets

#### Park Vehicle (`park_vehicle.feature`)
- ✅ Successfully park a vehicle at a location
- ✅ Prevent parking at the same location twice
