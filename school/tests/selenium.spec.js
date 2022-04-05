var chai = require('chai');
chai.use(require('chai-string'));
var expect = chai.expect;
const fs = require('fs');

const { Builder, By } = require('selenium-webdriver')
const firefox = () => new Builder().forBrowser('firefox').build()

describe('Selenium', function () {

    var server;
    var driver;

    beforeEach(function (done) {
        driver = firefox();
        server = require('http').createServer(function (request, response) {
            var page = `
                <html>
                    <head>
                        <title>hello</title>
                    </head>
                    <body>
                        <div id="greetings" style="display:inline-block">welcome</div>
                    </body>
                </html>
            `
            response.writeHead(200, { 'content-type': 'text/html' })
            response.end(page)
        }).listen(4999, done)
    })

    afterEach(async () => {
        server.close();
        await driver.quit();
    })

    it('can be used to inspect the computed width of an element', async () => {
        await driver.get('http://localhost:4999/')
        let element = await driver.findElement(By.id('greetings'))
        let value = await element.getCssValue('width')

        expect(value).to.endWith('px')
    })

    it('can be used to inspect the screenshot of an element', async () => {
        await driver.get('http://localhost:4999/')
        let element = await driver.findElement(By.id('greetings'))
        let actual = await element.takeScreenshot()
        let expected = fs.readFileSync('school/tests/expected-welcome.png', 'base64');

        expect(actual).to.equal(expected)
    })
})
