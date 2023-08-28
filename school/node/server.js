const http = require('http');

const notImplemented = (_, response) => {
    response.writeHead(501, { 'content-Type': 'text/plain' });
    response.end('NOT IMPLEMENTED');
};

class Server {
    constructor(handler) {
        this.sockets = [];
        this.port = 5001;
        this.internal = http.createServer();
        this.internal.on('connection', (socket) => {
            this.sockets.push(socket);
            socket.on('close', () => {
                this.sockets.splice(this.sockets.indexOf(socket), 1);
            });
        });
        this.handler = handler || notImplemented;
        this.use(this.handler);
        this.started = false;
    }
    start(done) {
        if (this.started) {
            if (done) {
                done(this.port);
            } else {
                return Promise.resolve(this.port);
            }
        } else {
            this.started = true;
            if (done) {
                this.internal.listen(this.port, () => done(this.port));
            } else {
                return new Promise((resolve) => {
                    this.internal.listen(this.port, () => resolve(this.port));
                });
            }
        }
    }
    stop(done) {
        this.sockets.forEach((socket) => socket.destroy());
        if (done) {
            this.internal.close(() => {
                this.started = false;
                done();
            });
        } else {
            return new Promise((resolve) => {
                this.internal.close(() => {
                    this.started = false;
                    resolve();
                });
            });
        }
    }
    use(handler) {
        this.internal.removeListener('request', this.handler);
        this.handler = handler;
        this.internal.on('request', this.handler);
    }
}

module.exports = { Server };
