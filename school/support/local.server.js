let http = require('http');
var url = require('url');
var port = 5001;

let LocalServer = function (handler) {
    this.handler = handler;
};
LocalServer.prototype.wrapHandler = function () {
    if (typeof this.handler == 'function') {
        return this.handler;
    } else {
        let self = this;
        return function (request, response) {
            response.setHeader('Access-Control-Allow-Origin', '*');
            var parsed = url.parse(request.url, true);
            var pattern = /^\/lib\/(.*)\.js$/;
            if (pattern.test(parsed.pathname)) {
                var path = require('path').join(
                    __dirname,
                    pattern.exec(parsed.pathname)[1] + '.js'
                );
                var body = require('fs').readFileSync(path).toString();
                response.setHeader('Content-Length', body.length);
                response.setHeader('Content-Type', 'application/javascript');
                response.write(body);
            } else {
                if (typeof self.handler == 'string') {
                    var body = self.handler;
                    response.setHeader('Content-Length', body.length);
                    response.setHeader('Content-Type', 'text/html');
                    response.write(body);
                } else {
                    if (self.handler[request.url]) {
                        var body = self.handler[request.url];
                        response.write(body);
                    } else {
                        if (
                            self.handler.json &&
                            self.handler.json[request.url]
                        ) {
                            var body = JSON.stringify(
                                self.handler.json[request.url]
                            );
                            response.setHeader('Content-Length', body.length);
                            response.setHeader(
                                'Content-Type',
                                'application/json'
                            );
                            response.write(body);
                        } else {
                            var body = 'not found';
                            response.setHeader('Content-Length', body.length);
                            response.setHeader('Content-Type', 'text/plain');
                            response.statusCode = 404;
                            response.write(body);
                        }
                    }
                }
            }
            response.end();
        };
    }
};
LocalServer.prototype.start = function (done) {
    let self = this;
    self.server = http.createServer(self.wrapHandler());
    self.server.on('error', (e) => {
        self.server.listen(++port);
    });
    self.server.on('listening', () => {
        self.port = port;
        done();
    });
    // console.log('trying port ' + (port+1));
    self.server.listen(++port);
};
LocalServer.prototype.stop = function (done) {
    // console.log(`stopping server on port ${this.port} (listening ${this.server.listening})`)
    if (this.server.listening) {
        this.server.close();
    }
    done();
};

module.exports = LocalServer;
