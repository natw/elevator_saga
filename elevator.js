{
  init: function(elevators, floors) {
    var requestQueue = {
      up: [],
      down: [],
    }

    _.each(elevators, function(elevator) {

      elevator.on("idle", function() {
        elevator.goingDownIndicator(true);
        elevator.goToFloor(0);
      });

      elevator.on("floor_button_pressed", function(floorNum) {
        elevator.goToFloor(floorNum);
      });

      elevator.on("passing_floor", function(floorNum, direction) {
        if (elevator.loadFactor() > 0.8) { return; }
        if (_.contains(requestQueue[direction], floorNum)) {
          elevator.goToFloor(floorNum, true);
          requestQueue[direction] = _.without(requestQueue[direction], floorNum)
        }
      });
      elevator.on("stopped_at_floor", function(floorNum) {
        if (elevator.destinationQueue[0] > floorNum) {
          elevator.goingUpIndicator(true);
        } else {
          elevator.goingDownIndicator(true);
        }

      });
    });

    _.each(floors, function(floor) {
      floor.on("up_button_pressed", function() {
        requestQueue["up"].push(floor.floorNum());
      });

      floor.on("down_button_pressed", function() {
        requestQueue["down"].push(floor.floorNum());
      });
    });
  },
  update: function(dt, elevators, floors) {
    // We normally don't need to do anything here
  }
}
