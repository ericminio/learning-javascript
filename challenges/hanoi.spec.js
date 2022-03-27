const { expect } = require('chai');

describe('the Hanoi game', ()=> {

    it('is about 3 towers', ()=> {
        let game = new Hanoi();

        expect(game.getTowers().length).to.equal(3);
        game.getTowers().forEach(o => {
            expect(o instanceof Tower).to.equal(true);
        })
    });
    it('is about pilling rings on tower', () => {
        let game = new Hanoi();
        let tower = game.getTowers()[1];
        game.push({ ring:{ size:5 }, tower:tower });
        game.push({ ring:{ size:3 }, tower:tower });

        expect(tower.getRings()).to.deep.equal([ { size:5 }, { size:3 }]);
    });

});

class Hanoi {
    constructor() {
        this.towers = [new Tower(), new Tower(), new Tower()];
    }

    getTowers() {
        return this.towers;
    }
    push(options) {
        options.tower.push(options.ring);
    }
}
class Tower {
    constructor() {
        this.rings = [];
    }

    getRings() {
        return this.rings;
    }
    push(ring) {
        this.rings.push(ring);
    }
}