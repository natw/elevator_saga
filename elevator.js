{
    init: function(elevators, floors) {
        var requestQueue = [];
        _.each(elevators, function(elevator) {

            elevator.on("idle", function() {
                var req = requestQueue.shift();
                console.log(req);
                if (req === undefined) {
                    elevator.stop();
                } else {
                    elevator.goToFloor(req.floor);
                }
            });
            
            elevator.on("floor_button_pressed", function(floorNum) {
                elevator.goToFloor(floorNum);
            });
            
            elevator.on("passing_floor", function(floorNum, direction) {
                if (elevator.loadFactor() > 0.8) { return; }
                var floor = floors[floorNum];
                if (floor.requests[direction]) {
                    elevator.goToFloor(floorNum, true);
                    requestQueue = _.reject(requestQueue, function(req) {
                        return req.floor == floorNum && req.direction == direction
                    });
                    floor.requests[direction] = false;
                }
            });
            elevator.on("stopped_at_floor", function(floorNum) { });
        });
        
        _.each(floors, function(floor) {
            floor.requests = {}
            floor.on("up_button_pressed", function() {
                floor.requests.up = true;
                requestQueue.push({floor: floor.floorNum(), direction: "up"});
            });
            
            floor.on("down_button_pressed", function() {
                floor.requests.down = true;
                requestQueue.push({floor: floor.floorNum(), direction: "down"});
            });
        });
    },
    update: function(dt, elevators, floors) {
        // We normally don't need to do anything here
    }
}
