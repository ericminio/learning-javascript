const { expect } = require('chai');

describe('the Hanoi game', ()=> {

    it('is about 3 towers', ()=> {
        let game = new Hanoi();

        expect(game.getTowers().length).to.equal(3);
        game.getTowers().forEach(o => {
            expect(o instanceof Tower).to.equal(true);
        })
    });
    it('is about pilling up rings on tower', () => {
        let game = new Hanoi();
        let tower = game.getTowers()[1];
        game.push({ ring:{ size:5 }, tower:tower });
        game.push({ ring:{ size:3 }, tower:tower });

        expect(tower.getRings()).to.deep.equal([ { size:5 }, { size:3 }]);
    });
    it('only allows pilling up rings in descending order', () => {
        let game = new Hanoi();
        let tower = game.getTowers()[1];
        game.push({ ring:{ size:3 }, tower:tower });

        expect(() => game.push({ ring:{ size:7 }, tower:tower }))
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
    push(options) {
        let rings = options.tower.getRings();
        if (rings.length > 0) {
            let top = rings[rings.length - 1]
            let incoming = options.ring;
            if(incoming.size > top.size) {
                throw `cannot put ring ${incoming.size} on top of ring ${top.size}`;
            }
        }
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