const { expect } = require('chai');

describe('the Hanoi puzzle', ()=> {

    it('is about 3 towers', ()=> {
        let puzzle = new Hanoi();

        expect(puzzle.getTowers().length).to.equal(3);
        puzzle.getTowers().forEach(o => {
            expect(o instanceof Tower).to.equal(true);
        })
    });
    it('is about pilling up rings on tower', () => {
        let puzzle = new Hanoi();
        let aTower = puzzle.getTowers()[1];
        puzzle.try(new Ring({ size:5 }), aTower);
        puzzle.try(new Ring({ size:3 }), aTower);

        expect(aTower.getRings().map(r => r.getSize())).to.deep.equal([5, 3]);
    });
    it('only allows pilling up rings in descending order', () => {
        let puzzle = new Hanoi();
        let aTower = puzzle.getTowers()[1];
        puzzle.try(new Ring({ size:3 }), aTower);

        expect(() => puzzle.try(new Ring({ size:7 }), aTower))
            .to.throw(/^cannot put ring 7 on top of ring 3$/);
    });
});

class Hanoi {
    constructor() {
        this.towers = [new Tower(), new Tower(), new Tower()];
    }

    getTowers() {
        return this.towers;
    }
    try(ring, tower) {
        this.checkMove(ring, tower);
        tower.push(ring);
    }
    checkMove(ring, tower) {
        if (! this.isLegalMove(ring, tower)) {
            throw `cannot put ring ${ring.getSize()} on top of ring ${tower.getRingSize()}`;
        }        
    }
    isLegalMove(ring, tower) {
        return tower.isEmpty()
            || ring.isSmallerThan(tower.getRing());
    }
}
class Tower {
    constructor() {
        this.rings = [];
    }

    isEmpty() {
        return this.rings.length == 0;
    }
    getRing() {
        return this.rings[this.rings.length - 1];
    }
    getRingSize() {
        return this.getRing().size;
    }
    getRings() {
        return this.rings;
    }
    push(ring) {
        this.rings.push(ring);
    }
}
class Ring {
    constructor(options) {
        this.size = options.size;
    }
    getSize() {
        return this.size;
    }
    isSmallerThan(other) {
        return this.getSize() < other.getSize();
    }
}