const { expect } = require('chai');

describe('timeout', () => {

    it('can be used with 1 to kind-off yield', (done)=> {
        let duration = 0;
        let start = new Date().getTime();
        new Promise((resolve, reject)=> {
            duration = new Date().getTime() - start;
            while (duration < 3) {
                duration = new Date().getTime() - start;
            }
            resolve();
        });
        setTimeout(()=> {
            expect(duration).to.equal(3);
            done();
        }, 1);
    });
});
