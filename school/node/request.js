const http = require('http');
const extractPayload = require('./extract-payload');

const request = (options) => {
    return new Promise((resolve, reject) => {
        let request = http.request(options, (message) => {
            extractPayload(message)
                .then((payload) => {
                    message.payload = payload;
                    resolve(message);
                })
                .catch(reject);
        });
        request.on('error', reject);
        if (options.contentType) {
            request.setHeader('content-type', options.contentType);
        }
        if (options.payload) {
            request.write(options.payload);
        }
        request.end();
    });
};

module.exports = request;
