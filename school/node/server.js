const http = require('http');

class Server {
    constructor(port, handler) {
        this.port = port;
        this.internal = http.createServer();
        this.handler = handler || ((request, response) => {
            response.writeHead(501, { 'content-Type': 'text/plain' });
            response.end('NOT IMPLEMENTED');
        });
        this.use(this.handler);
    }
    start(done) {
        this.internal.listen(this.port, done);
    }
    stop(done) {
        this.internal.close(done);
    }
    use(handler) {
        this.internal.removeListener('request', this.handler);
        this.handler = handler;
        this.internal.on('request', this.handler);
    }
};

module.exports = { Server };