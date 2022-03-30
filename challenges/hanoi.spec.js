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
        let secondTower = puzzle.getTowers()[1];
        puzzle.put(new Ring({ size:5 }), secondTower);
        puzzle.put(new Ring({ size:3 }), secondTower);

        expect(skyline(puzzle)).to.deep.equal([
            [],
            [5, 3],
            []
        ]);
    });    
    it('only allows pilling up rings in descending order', () => {
        let puzzle = new Hanoi();
        let secondTower = puzzle.getTowers()[1];
        puzzle.put(new Ring({ size:3 }), secondTower);

        expect(() => puzzle.put(new Ring({ size:7 }), secondTower))
            .to.throw(/^cannot put ring 7 on top of ring 3$/);
    });
    it('is about moving the rings from one tower to the next one', () => {
        let puzzle = new Hanoi();
        let firstTower = puzzle.getTowers()[0];
        puzzle.put(new Ring({ size:3 }), firstTower);
        puzzle.move({ from:0, to:1 });
        
        expect(skyline(puzzle)).to.deep.equal([
            [],
            [3],
            []
        ]);
    });
    it('cancels an illegal move', () => {
        let puzzle = new Hanoi();
        let firstTower = puzzle.getTowers()[0];
        let secondTower = puzzle.getTowers()[1];
        puzzle.put(new Ring({ size:3 }), firstTower);
        puzzle.put(new Ring({ size:1 }), secondTower);    
        puzzle.move({ from:0, to:1 });    
        
        expect(skyline(puzzle)).to.deep.equal([
            [3],
            [1],
            []
        ]);
    });
});
const skyline = (puzzle) => {
    return puzzle.getTowers().reduce((all, tower) => {
        all.push(tower.getRings().map(r => r.getSize()))
        return all;
    }, []);
}

class Hanoi {
    constructor() {
        this.towers = [new Tower(), new Tower(), new Tower()];
    }

    getTowers() {
        return this.towers;
    }
    put(ring, tower) {
        this.checkMove(ring, tower);
        tower.push(ring);
    }
    move(movement) {
        let from = this.getTowers()[movement.from];
        let to = this.getTowers()[movement.to];
        let ring = from.getRings().pop();
        try {
            this.put(ring, to);
        }
        catch {
            this.put(ring, from);
        }
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
    constructor(movement) {
        this.size = movement.size;
    }
    getSize() {
        return this.size;
    }
    isSmallerThan(other) {
        return this.getSize() < other.getSize();
    }
}