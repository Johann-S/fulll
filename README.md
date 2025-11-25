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

Vehicle fleet management system using Domain-Driven Design (DDD) and CQRS principles with BDD tests.

- 📁 **Location**: [`fleet/`](./fleet)
- 🏗️ **Architecture**: DDD/CQRS with clean architecture
- 🧪 **Testing**: Cucumber.js BDD tests

**Test:**
```bash
npm run test:fleet
```

This will run all BDD scenarios using Cucumber.js.

**Features:**
- Register vehicles into fleets
- Park vehicles at locations (GPS coordinates)
- Query vehicle locations
- In-memory persistence
- Complete test coverage with Gherkin scenarios

## Technologies Used

- **TypeScript** - Type-safe JavaScript
- **tsx** - TypeScript execution engine
- **Node.js** - Runtime environment
- **Cucumber.js** - BDD testing framework
