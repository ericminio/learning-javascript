var expect = require('chai').expect;
var crypto = require('crypto');

describe('crypto', function() {

	it('knows md5 hash algo', function() {
		expect(crypto.createHash('md5')).not.to.equal(undefined);
	});

	it('knows sha1 hash algo', function() {
		expect(crypto.createHash('sha1')).not.to.equal(undefined);
	});

	describe('crypting', function() {

		var encrypt = function(secret) {
			var hash = crypto.createHash('md5');
			hash.update(secret);
			return hash.digest('hex');
		};

		it('encrypts consistently', function() {
			var secret = 'my secret, can be long or short ; as you wish';
			expect(encrypt(secret)).to.equal(encrypt(secret));
		});

		it('encrypts uniquely', function() {
			expect(encrypt('one secret')).not.to.equal(encrypt('another secret'));
		});

        it('encrypts into 32 digits', function() {
            expect(encrypt('anything').length).to.equal(32);
        });
	});
});
