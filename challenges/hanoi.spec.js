const { expect } = require('chai');

describe('the Hanoi puzzle', ()=> {

    let puzzle;
    let firstTower;
    let secondTower;
    let player;
    beforeEach(() => {
        puzzle = new Hanoi();
        firstTower = puzzle.getTowers()[0];
        secondTower = puzzle.getTowers()[1];
        player = new Player(puzzle);
    });
    it('is about 3 towers', ()=> {
        expect(puzzle.getTowers().length).to.equal(3);
        puzzle.getTowers().forEach(o => {
            expect(o instanceof Tower).to.equal(true);
        })
    });
    it('is about pilling up rings on tower', () => {        
        puzzle.put(new Ring({ size:5 }), secondTower);
        puzzle.put(new Ring({ size:3 }), secondTower);

        expect(skyline(puzzle)).to.deep.equal([
            [],
            [5, 3],
            []
        ]);
    });    
    it('only allows pilling up rings in descending order', () => {
        puzzle.put(new Ring({ size:3 }), secondTower);

        expect(() => puzzle.put(new Ring({ size:7 }), secondTower))
            .to.throw(/^cannot put ring 7 on top of ring 3$/);
    });
    it('is about moving the rings from one tower to the next one', () => {
        puzzle.put(new Ring({ size:3 }), firstTower);
        player.move({ from:0, to:1 });
        
        expect(skyline(puzzle)).to.deep.equal([
            [],
            [3],
            []
        ]);
    });
    it('cancels an illegal move', () => {
        puzzle.put(new Ring({ size:3 }), firstTower);
        puzzle.put(new Ring({ size:1 }), secondTower);            
        
        expect(() => player.move({ from:0, to:1 }))
            .to.throw(/^cannot put ring 3 on top of ring 1$/);
        expect(skyline(puzzle)).to.deep.equal([
            [3],
            [1],
            []
        ]);
    });
    it('is easy to solve with 2 rings', () => {
        puzzle.put(new Ring({ size:2 }), firstTower);
        puzzle.put(new Ring({ size:1 }), firstTower);
        player.play({ from:0, to:2 });

        expect(skyline(puzzle)).to.deep.equal([
            [],
            [],
            [2, 1]
        ]);
    });
});
describe('third tower', () => {    

    let player;
    beforeEach(() => {
        player = new Player();
    });
    it('is needed to move 2 rings', () => {
        expect(player.thirdTower({ from:0, to:2 })).to.equal(1);
    });
    it('is the tower that is not in the spec', () => {
        expect(player.thirdTower({ from:2, to:1 })).to.equal(0);
    });
});
const skyline = (puzzle) => {
    return puzzle.getTowers().reduce((all, tower) => {
        all.push(tower.getRings().map(r => r.getSize()))
        return all;
    }, []);
}
class Player {
    constructor(puzzle) {
        this.hanoi = puzzle;
    }
    play(spec) {
        this.moveRings(spec);
    }
    moveRings(spec) {
        this.move({ from:spec.from, to:this.thirdTower(spec) });
        this.move({ from:spec.from, to:spec.to });
        this.move({ from:this.thirdTower(spec), to:spec.to });
    }
    move(spec) {
        let from = this.hanoi.getTowers()[spec.from];
        let to = this.hanoi.getTowers()[spec.to];
        let ring = from.getRings().pop();
        try {
            this.hanoi.put(ring, to);
        }
        catch(error) {
            this.hanoi.put(ring, from);
            throw error;
        }
    }
    thirdTower(spec) {
        return 3 - spec.from - spec.to;
    }
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
    constructor(spec) {
        this.size = spec.size;
    }
    getSize() {
        return this.size;
    }
    isSmallerThan(other) {
        return this.getSize() < other.getSize();
    }
}