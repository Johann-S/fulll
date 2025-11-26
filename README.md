# Fulll Technical Test

Technical test submissions for Fulll.

## Prerequisites

- Node.js (LTS or higher)
- npm

## Installation

```bash
npm ci
```

## Available Tests

### [Algo] FizzBuzz

Classic FizzBuzz implementation with a scalable, rule-based architecture.

- 📁 **Location**: [`algo/`](./algo)
- 📖 **Documentation**: [algo/README.md](./algo/README.md)

**Run:**
```bash
npm run algo
```

**Test:**
```bash
npm run test:algo
```

This will run all unit tests across using Node.js's native test runner.

### [Back/DDD/CQRS] Vehicle Fleet Parking Management

Vehicle fleet management system using Domain-Driven Design (DDD) and CQRS principles with BDD tests and CLI.

- 📁 **Location**: [`fleet/`](./fleet)
- 🏗️ **Architecture**: DDD/CQRS with clean architecture
- 🧪 **Testing**: Cucumber.js BDD tests
- 🖥️ **CLI**: Commander.js-based command-line interface

**Test:**
```bash
npm run test:fleet
```

This will run all BDD scenarios using Cucumber.js.

**Database Setup:**
```bash
# Start PostgreSQL with Docker
docker-compose up -d

# Apply db schema
npm run db:push
```

**CLI Usage:**
```bash
# Using npm script
npm run fleet -- create <userId>
npm run fleet -- register-vehicle <fleetId> <vehiclePlateNumber>
npm run fleet -- localize-vehicle <fleetId> <vehiclePlateNumber> <lat> <lng> [alt]
npm run fleet -- get-vehicle-location <fleetId> <vehiclePlateNumber>

# Using wrapper script (Unix/Mac/Git Bash)
./fleet.sh create <userId>
./fleet.sh register-vehicle <fleetId> <vehiclePlateNumber>
./fleet.sh localize-vehicle <fleetId> <vehiclePlateNumber> <lat> <lng> [alt]
./fleet.sh get-vehicle-location <fleetId> <vehiclePlateNumber>
```

**Features:**
- Register vehicles into fleets
- Park vehicles at locations (GPS coordinates)
- Query vehicle locations
- PostgreSQL persistence with Drizzle ORM
- Docker Compose for easy database setup
- Complete test coverage with Gherkin scenarios
- Command-line interface for all operations

## CI/CD

This project includes a GitHub Actions workflow for continuous integration.

**Workflow:** `.github/workflows/test.yml`

The CI pipeline automatically:
- Triggers on pushes and pull requests to the `main` branch
- Sets up Node.js 22.x environment
- Installs dependencies with `npm ci`
- Runs all tests with `npm test` which will run all the tests for `fizzBuzz` and `fleet` projects.

This ensures code quality and test coverage are maintained.

## Code Quality

This project uses **ESLint** for static code analysis and code quality enforcement.

**Why ESLint was added:**
- **Static analysis** - Catches bugs, anti-patterns, and code smells before runtime
- **Type safety enforcement** - TypeScript-aware rules prevent type-related issues and ensure type safety
- **Code consistency** - Enforces consistent coding conventions (naming, imports, formatting) across the codebase
- **Prevents common mistakes** - Detects unused variables, incorrect equality operators (`==` vs `===`), and missing error handling
- **Maintainability** - Makes code easier to read, review, and maintain for the entire team

**Run linting:**
```bash
npm run lint
```

The ESLint configuration includes:
- TypeScript-specific rules for type safety
- Stylistic rules for consistent code formatting
- Best practices enforcement (prefer const, no var, etc.)
- Code quality rules (no unused vars, no debugger, etc.)

## Technologies Used

- **TypeScript** - Type-safe JavaScript
- **tsx** - TypeScript execution engine
- **Node.js** - Runtime environment
- **Cucumber.js** - BDD testing framework
- **Commander.js** - CLI framework
- **Drizzle ORM** - TypeScript ORM for PostgreSQL
- **PostgreSQL** - Relational database
- **Docker** - Containerization
- **GitHub Actions** - CI/CD automation
