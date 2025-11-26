import { When, Then } from '@cucumber/cucumber';
import assert from 'node:assert';

import { FleetWorld } from '../support/world';
import { ParkVehicleCommand } from '../../App/Command/ParkVehicleCommand';
import { GetVehicleLocationQuery } from '../../App/Query/GetVehicleLocationQuery';
import { VehicleAlreadyParkedError } from '../../Domain/Errors/VehicleAlreadyParkedError';
import { VehicleNotRegisteredError } from '../../Domain/Errors/VehicleNotRegisteredError';

When('I park my vehicle at this location', async function (this: FleetWorld) {
  assert(this.myFleet, 'My fleet must exist');
  assert(this.currentVehicle, 'Current vehicle must exist');
  assert(this.currentLocation, 'Current location must exist');

  const command = new ParkVehicleCommand(
    this.myFleet.fleetId,
    this.currentVehicle.plateNumber,
    this.currentLocation
  );
  await this.parkVehicleHandler.handle(command);
  this.myFleet = await this.fleetRepository.findById(this.myFleet.fleetId);
});

When('I try to park my vehicle at this location', async function (this: FleetWorld) {
  assert(this.myFleet, 'My fleet must exist');
  assert(this.currentVehicle, 'Current vehicle must exist');
  assert(this.currentLocation, 'Current location must exist');

  try {
    const command = new ParkVehicleCommand(
      this.myFleet.fleetId,
      this.currentVehicle.plateNumber,
      this.currentLocation
    );
    await this.parkVehicleHandler.handle(command);
  } catch (error) {
    this.lastError = error as Error;
  }
});

Then('the known location of my vehicle should verify this location', async function (this: FleetWorld) {
  assert(this.myFleet, 'My fleet must exist');
  assert(this.currentVehicle, 'Current vehicle must exist');
  assert(this.currentLocation, 'Current location must exist');

  const query = new GetVehicleLocationQuery(
    this.myFleet.fleetId,
    this.currentVehicle.plateNumber
  );
  const location = await this.getVehicleLocationHandler.handle(query);

  assert(location, 'Vehicle should have a location');
  assert(
    location.equals(this.currentLocation),
    `Expected location ${this.currentLocation.toString()} but got ${location.toString()}`
  );
});

Then('I should be informed that my vehicle is already parked at this location', function (this: FleetWorld) {
  assert(this.lastError, 'An error should have been thrown');
  assert(
    this.lastError instanceof VehicleAlreadyParkedError,
    `Expected VehicleAlreadyParkedError but got ${this.lastError.constructor.name}`
  );
});

Then('I should be informed that this vehicle is not registered in my fleet', function (this: FleetWorld) {
  assert(this.lastError, 'An error should have been thrown');
  assert(
    this.lastError instanceof VehicleNotRegisteredError,
    `Expected VehicleNotRegisteredError but got ${this.lastError.constructor.name}`
  );
});
