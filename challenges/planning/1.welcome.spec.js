const { Builder, By } = require('selenium-webdriver');
const { expect } = require('chai');
const fs = require('fs');
const path = require('path');

describe('Welcome page', function () {
    var server;
    var driver;

    beforeEach(async () => {
        server = require('http').createServer(function (request, response) {
            var index = fs
                .readFileSync(path.join(__dirname, 'index.html'))
                .toString();
            response.writeHead(200, { 'content-type': 'text/html' });
            response.end(index);
        });
        await server.listen(5000);
        driver = await new Builder().forBrowser('firefox').build();
    });

    afterEach(async () => {
        await server.close();
        await driver.quit();
    });

    it('is ready', async () => {
        await driver.get('http://localhost:5000');
        let element = await driver.findElement(By.id('data'));
        let value = await element.getText();

        expect(JSON.parse(value)).to.deep.equal({
            data: [
                { day: 1, value: 'A', label: 'one' },
                { day: 1, value: 'B', label: 'two' },
                { day: 2, value: 'B', label: 'three' },
            ],
        });
    });
});
