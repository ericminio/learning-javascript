var expect = require('chai').expect;

describe('string', function () {
    describe('replace', function () {
        it('can use regex', function () {
            expect('red is good'.replace(/red/g, 'green')).to.equal(
                'green is good'
            );
        });

        it('works to replace the first occurence of a char', function () {
            expect('***'.replace(/^\*/, 'A')).to.equal('A**');
        });

        it('only replaces first occurence', function () {
            expect('  ***  '.replace('*', 'A')).to.equal('  A**  ');
        });

        it('can replace the last occurence with the help of a regexp', function () {
            expect('  ***  '.replace(/.(\s*)$/, 'A$1')).to.equal('  **A  ');
        });

        it('can replace the first and the last occurence with the help of a regexp', function () {
            expect(
                '  ***  '.replace(/^(\s*)(\*)(\**)(\*)(\s*)$/, '$1B$3B$5')
            ).to.equal('  B*B  ');
        });
    });

    describe('repetition of same character', function () {
        it('can be done with array', function () {
            expect(Array(3).join('A')).to.equal('AA');
        });
    });
});
