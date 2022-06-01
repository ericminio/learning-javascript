const extractBody = (incoming) => {
    return new Promise((resolve, reject) => {
        let body = '';
        incoming.on('data', chunk => {
            body += chunk;
        });
        incoming.on('end', ()=>{
            resolve(body);
        });
        incoming.on('error', error => {
            reject(error);
        })
    });
}

module.exports = extractBody;