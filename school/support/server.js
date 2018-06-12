var server = function(options) {
    return require('http').createServer(function(request, response) {
        var url = require('url');
        var parsed = url.parse(request.url, true);
        if (/\.js$/.test(parsed.pathname)) {
            var path = require('path').join(__dirname, parsed.pathname);
            var content = require('fs').readFileSync(path).toString();
            response.setHeader('Content-Type', 'application/javascript');
            response.write(content);
        }
        else {
            response.setHeader('Content-Type', 'text/html');
            response.write(options.index);
        }
        response.end();
    });
};

module.exports = server;
