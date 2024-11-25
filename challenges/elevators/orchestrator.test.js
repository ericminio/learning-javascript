const { describe, it } = require('node:test');
const { strict: assert } = require('node:assert');

const { ElevatorOrchestrator } = require('./orchestrator');

describe('orchestrator', () => {
    it('manages several elevators', () => {
        const orchestrator = new ElevatorOrchestrator(3);
        assert.deepStrictEqual(orchestrator.elevators.length, 3);
    });
    it('prefers elevator with empty queue', () => {
        const orchestrator = new ElevatorOrchestrator(3);
        orchestrator.queues(3);
        orchestrator.queues(4);
        orchestrator.queues(5);

        assert.deepStrictEqual(orchestrator.elevators[0].calls, [3]);
        assert.deepStrictEqual(orchestrator.elevators[1].calls, [4]);
        assert.deepStrictEqual(orchestrator.elevators[2].calls, [5]);
    });
});
