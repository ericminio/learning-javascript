const { describe, it } = require('node:test');
const { strict: assert } = require('node:assert');

const { Elevator } = require('./elevator');

describe('https://kata-log.rocks/lift-kata', () => {
    it('starts from the ground', () => {
        const elevator = new Elevator();

        assert.deepStrictEqual(elevator.floor, 0);
    });
    it('starts waiting', () => {
        const elevator = new Elevator();

        assert.deepStrictEqual(elevator.direction, 'waiting');
    });
    it('records calls', () => {
        const elevator = new Elevator();
        elevator.queues(3);
        elevator.queues(5);

        assert.deepStrictEqual(elevator.calls, [3, 5]);
    });
    it('knows when the next direction is up', () => {
        const elevator = new Elevator();
        elevator.queues(3);
        elevator.queues(5);

        assert.deepStrictEqual(elevator.direction, 'up');
    });
    it('knows when the next direction is down', () => {
        const elevator = new Elevator();
        elevator.floor = 5;
        elevator.queues(3);
        elevator.queues(10);

        assert.deepStrictEqual(elevator.direction, 'down');
    });
    it('can move to called floor', () => {
        const elevator = new Elevator();
        elevator.floor = 3;
        elevator.queues(5);
        elevator.move();

        assert.deepStrictEqual(elevator.floor, 5);
        assert.deepStrictEqual(elevator.calls, []);
        assert.deepStrictEqual(elevator.direction, 'waiting');
    });
    it('can visit three floors up in expected order', () => {
        const elevator = new Elevator();
        elevator.queues(3);
        elevator.queues(5);
        elevator.queues(4);
        elevator.moveAll();

        assert.deepStrictEqual(elevator.floor, 5);
        assert.deepStrictEqual(elevator.calls, []);
        assert.deepStrictEqual(elevator.direction, 'waiting');
    });
    it('dings', () => {
        let dings = [];
        const ding = (floor) => dings.push(floor);
        const elevator = new Elevator(ding);
        elevator.queues(3);
        elevator.queues(5);
        elevator.moveAll();

        assert.deepStrictEqual(dings, [3, 5]);
    });
    it('can go up and then down', () => {
        let dings = [];
        const ding = (floor) => dings.push(floor);
        const elevator = new Elevator(ding);
        elevator.floor = 3;
        elevator.queues(5);
        elevator.queues(2);
        elevator.moveAll();

        assert.deepStrictEqual(dings, [5, 2]);
    });
    it('can go down and then up', () => {
        let dings = [];
        const ding = (floor) => dings.push(floor);
        const elevator = new Elevator(ding);
        elevator.floor = 3;
        elevator.queues(2);
        elevator.queues(5);
        elevator.moveAll();

        assert.deepStrictEqual(dings, [2, 5]);
    });
});
