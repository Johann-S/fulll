import { When, Then } from '@cucumber/cucumber';
import assert from 'node:assert';

import type { FleetWorld } from '../support/world';
import { RegisterVehicleCommand } from '../../App/Command/RegisterVehicleCommand';
import { VehicleAlreadyRegisteredError } from '../../Domain/Errors/VehicleAlreadyRegisteredError';

When('I register this vehicle into my fleet', async function (this: FleetWorld) {
  assert(this.myFleet, 'My fleet must exist');
  assert(this.currentVehicle, 'Current vehicle must exist');

  const command = new RegisterVehicleCommand(
    this.myFleet.fleetId,
    this.currentVehicle.plateNumber,
  );
  await this.registerVehicleHandler.handle(command);

  this.myFleet = await this.fleetRepository.findById(this.myFleet.fleetId);
});

When('I try to register this vehicle into my fleet', async function (this: FleetWorld) {
  assert(this.myFleet, 'My fleet must exist');
  assert(this.currentVehicle, 'Current vehicle must exist');

  try {
    const command = new RegisterVehicleCommand(
      this.myFleet.fleetId,
      this.currentVehicle.plateNumber,
    );
    await this.registerVehicleHandler.handle(command);
  } catch (error) {
    this.lastError = error as Error;
  }
});

Then('this vehicle should be part of my vehicle fleet', function (this: FleetWorld) {
  assert(this.myFleet, 'My fleet must exist');
  assert(this.currentVehicle, 'Current vehicle must exist');

  const hasVehicle = this.myFleet.hasVehicle(this.currentVehicle);

  assert(hasVehicle, `Vehicle ${this.currentVehicle.plateNumber} should be part of the fleet`);
});

Then('I should be informed this this vehicle has already been registered into my fleet', function (this: FleetWorld) {
  assert(this.lastError, 'An error should have been thrown');
  assert(
    this.lastError instanceof VehicleAlreadyRegisteredError,
    `Expected VehicleAlreadyRegisteredError but got ${this.lastError.constructor.name}`,
  );
});
