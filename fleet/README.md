# Vehicle Fleet Parking Management

A vehicle fleet parking management system implementing **Domain-Driven Design (DDD)** and **CQRS** principles with comprehensive BDD tests and a command-line interface.

## Architecture

This implementation follows clean architecture principles with clear separation of concerns:

### Directory Structure

```
fleet/
├── src/
│   ├── App/              # Application Layer (CQRS)
│   │   ├── Command/      # Commands and handlers
│   │   │   ├── CreateFleetCommand.ts
│   │   │   ├── CreateFleetHandler.ts
│   │   │   ├── RegisterVehicleCommand.ts
│   │   │   ├── RegisterVehicleHandler.ts
│   │   │   ├── ParkVehicleCommand.ts
│   │   │   └── ParkVehicleHandler.ts
│   │   ├── Query/        # Queries and handlers
│   │   │   ├── GetVehicleLocationQuery.ts
│   │   │   └── GetVehicleLocationHandler.ts
│   │   └── FleetService.ts  # Application Service
│   ├── Domain/           # Domain Layer (Business Logic)
│   │   ├── Fleet.ts      # Aggregate Root
│   │   ├── Vehicle.ts    # Value Object
│   │   ├── Location.ts   # Value Object
│   │   ├── FleetRepository.ts  # Repository Interface
│   │   └── Errors/       # Domain Errors
│   │       ├── VehicleAlreadyRegisteredError.ts
│   │       ├── VehicleNotRegisteredError.ts
│   │       └── VehicleAlreadyParkedError.ts
│   ├── Infra/            # Infrastructure Layer
│   │   ├── Database/     # Database configuration
│   │   │   ├── connection.ts
│   │   │   └── schema.ts
│   │   ├── InMemoryFleetRepository.ts
│   │   └── PostgresFleetRepository.ts
│   ├── cli.ts            # CLI Entry Point
│   └── tests/            # BDD Tests
│       ├── features/     # Gherkin scenarios
│       │   ├── register_vehicle.feature
│       │   └── park_vehicle.feature
│       ├── step_definitions/  # Cucumber steps
│       │   ├── common.steps.ts
│       │   ├── register_vehicle.steps.ts
│       │   └── park_vehicle.steps.ts
│       └── support/      # Test support (World)
│           └── world.ts
├── drizzle/              # Database migrations
│   ├── meta/
│   └── 0000_violet_zuras.sql
├── cucumber.cjs          # Cucumber configuration
├── drizzle.config.ts     # Drizzle ORM configuration
└── tsconfig.json         # TypeScript configuration
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

### Test Profiles

This project uses **Cucumber profiles** to separate tests based on infrastructure requirements:

#### 1. **Default Profile** (In-Memory, Fast)

Runs tests with `InMemoryFleetRepository` - no database required:

```bash
npm run test:fleet
```

- ✅ Fast execution
- ✅ No infrastructure setup needed
- ✅ Perfect for TDD/development
- ❌ Doesn't test real database integration

#### 2. **Persistence Profile** (PostgreSQL, Integration)

Runs tests tagged with `@persistence` using `PostgresFleetRepository`:

```bash
npm run test:fleet:persistence
```

**Prerequisites:**
1. PostgreSQL database running (via Docker):
   ```bash
   docker-compose up -d
   ```

2. Run migrations:
   ```bash
   npm run db:push
   ```

- ✅ Tests real database integration
- ✅ Validates serialization/deserialization
- ✅ Ensures PostgreSQL schema is correct
- ❌ Slower execution
- ❌ Requires infrastructure

#### 3. **All Profile** (Both)

Runs all tests regardless of tags:

```bash
npm run test:fleet:all
```

### Test Strategy

Following BDD best practices:

- **Critical business logic** (`@critical`): Tested with in-memory repository (fast feedback)
- **Persistence scenarios** (`@persistence`): Test the same scenarios but with PostgreSQL
- **Non-critical scenarios**: Remain in-memory only

### BDD Features

#### Register Vehicle (`register_vehicle.feature`)
- ✅ Register a new vehicle into a fleet
- ✅ Prevent duplicate registration in the same fleet
- ✅ Allow same vehicle in multiple fleets

#### Park Vehicle (`park_vehicle.feature`)
- ✅ Successfully park a vehicle at a location
- ✅ Prevent parking at the same location twice

## Command-Line Interface

### Installation

The CLI is available after installing dependencies:

```bash
npm ci
```

### Usage

#### Using npm script:

```bash
npm run fleet -- <command> [arguments]
```

#### Using wrapper script (Unix/Mac/Git Bash):

```bash
./fleet.sh <command> [arguments]
```

### Available Commands

#### 1. Create a Fleet

```bash
npm run fleet -- create <userId>
```

**Example:**
```bash
npm run fleet -- create user123
# Output: 1
```

Creates a new fleet for the specified user and returns the fleet ID.

#### 2. Register a Vehicle

```bash
npm run fleet -- register-vehicle <fleetId> <vehiclePlateNumber>
```

**Example:**
```bash
npm run fleet -- register-vehicle 1 ABC-123
# Output: Vehicle ABC-123 registered to fleet 1
```

Registers a vehicle with the given plate number to the specified fleet.

#### 3. Localize a Vehicle

```bash
npm run fleet -- localize-vehicle <fleetId> <vehiclePlateNumber> <lat> <lng> [alt]
```

**Examples:**
```bash
# Without altitude
npm run fleet -- localize-vehicle 1 ABC-123 48.8566 2.3522
# Output: Vehicle ABC-123 localized at 48.8566, 2.3522

# With altitude
npm run fleet -- localize-vehicle 1 ABC-123 48.8566 2.3522 100
# Output: Vehicle ABC-123 localized at 48.8566, 2.3522, 100
```

Sets the GPS location of a vehicle. Altitude is optional.

#### 4. Get Vehicle Location

```bash
npm run fleet -- get-vehicle-location <fleetId> <vehiclePlateNumber>
```

**Example:**
```bash
npm run fleet -- get-vehicle-location 1 ABC-123
# Output: Vehicle ABC-123 is at 48.8566, 2.3522, 100
```

Retrieves the current GPS location of a vehicle in the specified fleet. Returns latitude, longitude, and altitude (if set).

**Error case:**
```bash
# Vehicle not registered in the fleet
npm run fleet -- get-vehicle-location 1 XYZ-999
# Error: Vehicle with plate number XYZ-999 is not registered in fleet 1
```

### Data Persistence

The CLI uses **PostgreSQL** for data persistence when properly configured.

#### Setup PostgreSQL

1. Start the database:
   ```bash
   docker-compose up -d
   ```

2. Run migrations:
   ```bash
   npm run db:push
   ```

3. Configure environment (optional - defaults work with Docker setup):
   ```bash
   cp .env.example .env
   # Edit .env if needed
   ```

Fleet data persists between CLI invocations when using PostgreSQL.

### Error Handling

The CLI properly handles domain errors:

```bash
# Trying to register the same vehicle twice
npm run fleet -- register-vehicle 1 ABC-123
# Error: Vehicle with plate number ABC-123 is already registered in this fleet

# Trying to park at the same location twice
npm run fleet -- localize-vehicle 1 ABC-123 48.8566 2.3522
# Error: Vehicle with plate number ABC-123 is already parked at this location
```

### Help

Get help on available commands:

```bash
npm run fleet -- --help
npm run fleet -- <command> --help
```
