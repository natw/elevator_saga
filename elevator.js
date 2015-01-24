{
  init: function(elevators, floors) {
    var requestQueue = {
      up: [],
      down: [],
    }

    _.each(elevators, function(elevator) {

      elevator.on("idle", function() {
        console.log("start idle");
        var firstUp = requestQueue.up.shift();
        if (firstUp === undefined) {
          var firstDown = requestQueue.down.shift();
          if (firstDown === undefined) {
            elevator.stop();
          } else {
            elevator.goToFloor(firstDown);
          }
        } else {
          elevator.goToFloor(firstUp);
        }
        console.log("end idle");
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
      elevator.on("stopped_at_floor", function(floorNum) { });
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
