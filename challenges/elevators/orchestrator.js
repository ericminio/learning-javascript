const { Elevator } = require('./elevator');

class ElevatorOrchestrator {
    constructor(n) {
        this.elevators = Array.from({ length: n }, () => new Elevator());
    }
    queues(floor) {
        const freeElevator = this.elevators.find((e) => e.calls.length === 0);
        freeElevator.queues(floor);
    }
}

module.exports = { ElevatorOrchestrator };
