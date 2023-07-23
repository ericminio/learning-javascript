const { expect } = require('chai');

describe('mixin', () => {
    it('can be used to extend a class definition', () => {
        class Foo {
            name() {
                return 'foo';
            }
        }
        let extension = {
            fullname() {
                return 'foo bar';
            },
        };
        Object.assign(Foo.prototype, extension);
        let foo = new Foo();

        expect(foo.name()).to.equal('foo');
        expect(foo.fullname()).to.equal('foo bar');
    });
    it('can be used to extend an instance', () => {
        class Foo {
            name() {
                return 'foo';
            }
        }
        let extension = {
            fullname() {
                return 'foo bar';
            },
        };
        let foo = new Foo();
        Object.assign(foo, extension);

        expect(foo.name()).to.equal('foo');
        expect(foo.fullname()).to.equal('foo bar');
    });
    it('also work with extension being a class, with a little more plumbing', () => {
        class Foo {
            name() {
                return 'foo';
            }
        }
        class Extension {
            fullname() {
                return 'foo bar';
            }
        }
        for (var key of Object.getOwnPropertyNames(Extension.prototype)) {
            Foo.prototype[key] = Extension.prototype[key];
        }
        let foo = new Foo();

        expect(foo.name()).to.equal('foo');
        expect(foo.fullname()).to.equal('foo bar');
    });
    it('is less verbose via dynamic inheritance', () => {
        class Duck {
            name() {
                return 'ducky';
            }
        }
        let learnToBark = (Base) =>
            class extends Base {
                bark() {
                    return 'I can bark';
                }
            };
        class Alien extends learnToBark(Duck) {}
        let alien = new Alien();

        expect(alien.name()).to.equal('ducky');
        expect(alien.bark()).to.equal('I can bark');
    });
    it('is even less verbose via inline dynamic inheritance', () => {
        class Duck {
            name() {
                return 'ducky';
            }
        }
        let learnToBark = (Base) =>
            class extends Base {
                bark() {
                    return 'I can bark';
                }
            };
        let learnToYawn = (Base) =>
            class extends Base {
                yawn() {
                    return 'I can yawn';
                }
            };
        let alien = new (learnToYawn(learnToBark(Duck)))();

        expect(alien.name()).to.equal('ducky');
        expect(alien.bark()).to.equal('I can bark');
        expect(alien.yawn()).to.equal('I can yawn');
    });
});
