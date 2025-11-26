#!/usr/bin/env node

import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Command } from 'commander';
import 'dotenv/config';

import { PostgresFleetRepository } from './Infra/PostgresFleetRepository';
import { FleetService } from './App/FleetService';
import { closeDatabase } from './Infra/Database/connection';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageJson = JSON.parse(readFileSync(join(__dirname, '../../package.json'), 'utf-8'));

const repository = new PostgresFleetRepository();
const fleetService = new FleetService(repository);
const program = new Command();

process.on('exit', () => {
  closeDatabase();
});
process.on('SIGINT', async () => {
  await closeDatabase();
  process.exit(0);
});
process.on('SIGTERM', async () => {
  await closeDatabase();
  process.exit(0);
});

program
  .name('fleet')
  .description('Vehicle fleet management CLI')
  .version(packageJson.version);

program
  .command('create')
  .description('Create a new fleet for a user')
  .argument('<userId>', 'User ID who owns the fleet')
  .action(async (userId: string) => {
    try {
      const fleetId = await fleetService.createFleet(userId);
      console.log(fleetId);
      await closeDatabase();
    } catch (error) {
      console.error('Error:', error instanceof Error ? error.message : error);
      await closeDatabase();
      process.exit(1);
    }
  });

program
  .command('register-vehicle')
  .description('Register a vehicle into a fleet')
  .argument('<fleetId>', 'Fleet ID')
  .argument('<vehiclePlateNumber>', 'Vehicle plate number')
  .action(async (fleetId: number, vehiclePlateNumber: string) => {
    try {
      await fleetService.registerVehicle(fleetId, vehiclePlateNumber);
      console.log(`Vehicle ${vehiclePlateNumber} registered to fleet ${fleetId}`);
      await closeDatabase();
    } catch (error) {
      console.error('Error:', error instanceof Error ? error.message : error);
      await closeDatabase();
      process.exit(1);
    }
  });

program
  .command('localize-vehicle')
  .description('Set the location of a vehicle')
  .argument('<fleetId>', 'Fleet ID')
  .argument('<vehiclePlateNumber>', 'Vehicle plate number')
  .argument('<lat>', 'Latitude')
  .argument('<lng>', 'Longitude')
  .argument('[alt]', 'Altitude (optional)')
  .action(async (fleetId: number, vehiclePlateNumber: string, lat: number, lng: number, alt?: number) => {
    try {
      await fleetService.localizeVehicle(fleetId, vehiclePlateNumber, lat, lng, alt);
      const location = alt
        ? `${lat}, ${lng}, ${alt}`
        : `${lat}, ${lng}`;
      console.log(`Vehicle ${vehiclePlateNumber} localized at ${location}`);
      await closeDatabase();
    } catch (error) {
      console.error('Error:', error instanceof Error ? error.message : error);
      await closeDatabase();
      process.exit(1);
    }
  });

program
  .command('get-vehicle-location')
  .description('Get the location of a vehicle')
  .argument('<fleetId>', 'Fleet ID')
  .argument('<vehiclePlateNumber>', 'Vehicle plate number')
  .action(async (fleetId: number, vehiclePlateNumber: string) => {
    try {
      const location = await fleetService.getVehicleLocation(fleetId, vehiclePlateNumber);
      console.log(`Vehicle ${vehiclePlateNumber} location: ${location}`);
      await closeDatabase();
    } catch (error) {
      console.error('Error:', error instanceof Error ? error.message : error);
      await closeDatabase();
      process.exit(1);
    }
  });

program.parse();
