var expect = require('chai').expect;

describe.only('Regexp', function () {

	describe('matching beginning of a string', function () {

		var pattern = /^players/;

		it('passes with a matching string', function () {
			expect(pattern.test('players')).to.equal(true);
		});

		it('fails with a non-matching string', function () {
			expect(pattern.test('the players')).to.equal(false);
		});
	});

	describe('matching extension', function () {

		var pattern = /\.js$/;

		it('passes with a matching filename', function () {
			expect(pattern.test('any-file.js')).to.equal(true);
		});

		it('fails with a non-matching extension', function () {
			expect(pattern.test('another.extension')).to.equal(false);
		});

		it('fails with a mal-formed extension', function () {
			expect(pattern.test('hiddenjs')).to.equal(false);
		});
	});

	describe('matching /players', function () {

		var pattern = /^\/players/;

		it('passes with a matching string', function () {
			expect(pattern.test('/players')).to.equal(true);
		});

		it('fails with a non-matching string', function () {
			expect(pattern.test('/the players')).to.equal(false);
		});

	});

	describe('matching /players/{login}', function () {

		var pattern = /^\/players\/[A-z]+$/;

		it('passes with a matching string', function () {
			expect(pattern.test('/players/any')).to.equal(true);
		});

		it('fails with a non-matching string', function () {
			expect(pattern.test('/players/any/thing')).to.equal(false);
		});

	});

	describe('matching /players/{login} with a dot in the login', function () {

		var pattern = /^\/players\/[A-z|\.]+$/;

		it('passes with a matching string', function () {
			expect(pattern.test('/players/any.name')).to.equal(true);
		});

		it('fails with a non-matching string', function () {
			expect(pattern.test('/players/any:name')).to.equal(false);
		});

	});

	describe('matching /players/{login} with a dash in the login', function () {

		var pattern = /^\/players\/[A-z|\.|\-]+$/;

		it('passes with a matching string', function () {
			expect(pattern.test('/players/any-name')).to.equal(true);
		});

		it('fails with a non-matching string', function () {
			expect(pattern.test('/players/any:name')).to.equal(false);
		});

	});

	describe('matching /players/{login} with a number in the login', function () {

		var pattern = /^\/players\/[A-z|\.|\-|0-9]+$/;

		it('passes with a matching string', function () {
			expect(pattern.test('/players/any-name-42')).to.equal(true);
		});

		it('fails with a non-matching string', function () {
			expect(pattern.test('/players/any:name')).to.equal(false);
		});

	});

	describe('matching /players/{login} with a @ in the login', function () {

		var pattern = /^\/players\/[A-z|\.|\-|@]+$/;

		it('passes with a matching string', function () {
			expect(pattern.test('/players/any@name')).to.equal(true);
		});

		it('fails with a non-matching string', function () {
			expect(pattern.test('/players/any:name')).to.equal(false);
		});

	});

	describe('matching /players/{login}/play/world/{id}', function () {

		var pattern = /^\/players\/[A-z]+\/play\/world\/[0-9]+$/;

		it('passes with a matching string', function () {
			expect(pattern.test('/players/any/play/world/42')).to.equal(true);
		});

		it('fails with a non-matching string', function () {
			expect(pattern.test('/players/any/play/world/3/any')).to.equal(false);
		});

	});

	describe('matching /any-route', function () {

		var pattern = /^\/any-route$/;

		it('passes with a matching string', function () {
			expect(pattern.test('/any-route')).to.equal(true);
		});

		it('fails with a non-matching string', function () {
			expect(pattern.test('/any-route/more')).to.equal(false);
		});

	});

	describe('matching all', function () {

		var pattern = /.*/;

		it('passes with a matching string', function () {
			expect(pattern.test('/-42any/thing')).to.equal(true);
		});

	});

	describe.only('Data extraction', function () {

		var pattern = /^\/players\/(.*)\/play\/world\/(.*)/;

		it('is built-in', function () {
			expect(pattern.exec('/players/ericminio/play/world/1')[1]).to.equal('ericminio');
		});

		it('can extract second parameter', function () {
			expect(pattern.exec('/players/ericminio/play/world/42')[2]).to.equal('42');
		});

		it('returns null when not found', function () {
			expect(pattern.exec('/non/matching')).to.equal(null);
		});

		it('can extract a parameter with a dot', function () {
			expect(pattern.exec('/players/eric.mignot/play/world/1')[1]).to.equal('eric.mignot');
		});
	});

	describe('Regex concatanation', function () {

		it('works', function () {
			var start = /\/any/;
			var end = /\/route/;
			var pattern = /^/ && start && end && /$/;

			expect(pattern.test('/any/route')).to.equal(true);
		});

		it('works inline', function () {
			var pattern = /^/ && /\/any/ && /\/route/ && /$/;

			expect(pattern.test('/any/route')).to.equal(true);
		});
	});

	describe('Regex string spliting', function () {

		it('can be used to split a string at each space', function () {
			expect('Hello world'.split(/\s/)).to.deep.equal(['Hello', 'world']);
		});

		it('can be used to split a string at each 2 characters', function () {
			expect('Helo'.match(/.{2}/g)).to.deep.equal(['He', 'lo']);
		});

		it('can be used with a variable', function () {
			var length = 2;
			var regex = new RegExp('.{' + length + '}', 'g');
			expect('Helo'.match(regex)).to.deep.equal(['He', 'lo']);
		});
	});
});
