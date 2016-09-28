var expect = require('chai').expect;
var log4js = require('log4js');

describe('Log4js', function() {

    var logger;
    var loggedEvent;

    describe('debug without category', function() {

        beforeEach(function(done){
            logger = log4js.getLogger();
            logger.appenders = [];
            logger.addListener('log', function(event) { loggedEvent = event; done(); });
            logger.debug('hello world');
        });

        afterEach(function() {
            logger.removeAllListeners();
        });

        it('creates an entry with level DEBUG', function() {
            expect(loggedEvent.level.levelStr).to.equal('DEBUG');
        });

        it('creates an entry with default category', function() {
            expect(loggedEvent.categoryName).to.equal('[default]');
        });

        it('creates an entry with default category', function() {
            expect(loggedEvent.data).to.deep.equal(['hello world']);
        });
    });
});
