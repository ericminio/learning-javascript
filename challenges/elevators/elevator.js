class Elevator {
    constructor(ding) {
        this.ding = ding;
        this.floor = 0;
        this.calls = [];
        this.thenWhat();
    }
    queues(floor) {
        this.calls.push(floor);
        this.thenWhat();
    }
    thenWhat() {
        if (this.calls.length === 0) {
            this.direction = 'waiting';
            return;
        }
        if (this.direction === 'up' && this.ups().length === 0) {
            this.direction = 'waiting';
        }
        if (this.direction === 'down' && this.downs().length === 0) {
            this.direction = 'waiting';
        }
        if (this.direction === 'waiting') {
            this.direction = this.calls[0] > this.floor ? 'up' : 'down';
        }
    }
    ups() {
        return this.calls.filter((c) => c > this.floor);
    }
    downs() {
        return this.calls.filter((c) => c < this.floor);
    }
    move() {
        this.called = (
            this.direction === 'up' ? this.ups() : this.downs()
        ).sort();
        this.floor = this.called[0];
        if (this.ding) {
            this.ding(this.floor);
        }
        this.calls.splice(this.calls.indexOf(this.floor), 1);
        this.thenWhat();
    }
    moveAll() {
        while (this.calls.length > 0) {
            this.move();
        }
    }
}

module.exports = { Elevator };
