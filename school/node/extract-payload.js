const extractBody = (incoming) => {
    return new Promise((resolve, reject) => {
        let payload = '';
        incoming.on('data', chunk => {
            payload += chunk;
        });
        incoming.on('end', ()=>{
            resolve(payload);
        });
        incoming.on('error', error => {
            reject(error);
        })
    });
}

module.exports = extractBody;