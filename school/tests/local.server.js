let http = require('http');
var port = 5001;

let LocalServer = function(handler) {
    this.handler = handler;    
};
LocalServer.prototype.start = function(done) {
    let self = this;
    self.server = http.createServer(self.handler);
    self.server.on('error', (e)=>{
        self.server.listen(++port);
    });
    self.server.on('listening', ()=>{
        self.port = port;
        done();
    });
    self.server.listen(++port);   
};
LocalServer.prototype.stop = function(done) {
    if (this.server.listening) { this.server.close(done); }
    else { done(); }
};

module.exports = LocalServer;