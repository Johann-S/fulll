import { Before, Given, setWorldConstructor } from '@cucumber/cucumber';
import assert from 'node:assert';

import { FleetWorld } from '../support/world';
import { RegisterVehicleCommand } from '../../App/Command/RegisterVehicleCommand';
import { ParkVehicleCommand } from '../../App/Command/ParkVehicleCommand';

setWorldConstructor(FleetWorld);

Before(function (this: FleetWorld) {
  this.reset();
});

Given('my fleet', function (this: FleetWorld) {
  this.createMyFleet();
});

Given('the fleet of another user', function (this: FleetWorld) {
  this.createOtherFleet();
});

Given('a vehicle', function (this: FleetWorld) {
  this.createVehicle();
});

Given('a location', function (this: FleetWorld) {
  this.createLocation();
});

Given('I have registered this vehicle into my fleet', function (this: FleetWorld) {
  assert(this.myFleet, 'My fleet must exist');
  assert(this.currentVehicle, 'Current vehicle must exist');

  const command = new RegisterVehicleCommand(
    this.myFleet.fleetId,
    this.currentVehicle.plateNumber
  );
  this.registerVehicleHandler.handle(command);
});

Given('this vehicle has been registered into the other user\'s fleet', function (this: FleetWorld) {
  assert(this.otherFleet, 'Other fleet must exist');
  assert(this.currentVehicle, 'Current vehicle must exist');

  const command = new RegisterVehicleCommand(
    this.otherFleet.fleetId,
    this.currentVehicle.plateNumber
  );
  this.registerVehicleHandler.handle(command);
});

Given('my vehicle has been parked into this location', function (this: FleetWorld) {
  assert(this.myFleet, 'My fleet must exist');
  assert(this.currentVehicle, 'Current vehicle must exist');
  assert(this.currentLocation, 'Current location must exist');

  const command = new ParkVehicleCommand(
    this.myFleet.fleetId,
    this.currentVehicle.plateNumber,
    this.currentLocation
  );
  this.parkVehicleHandler.handle(command);
});
