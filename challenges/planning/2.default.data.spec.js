const { Builder, By } = require('selenium-webdriver')
const { expect } = require('chai')
const fs = require('fs')
const path = require('path')

describe('Default data', function() {

    var server
    var driver

    beforeEach(async ()=> {
        server = require('http').createServer(function(request, response) {
            var index = fs.readFileSync(path.join(__dirname, 'index.html')).toString()
            var script = fs.readFileSync(path.join(__dirname, 'render.js')).toString()
            var answer = index
            if (request.url == '/render.js') {
                answer = script
                response.writeHead(200, { 'content-type':'application/javascript' })
            }
            else {
                response.writeHead(200, { 'content-type':'text/html' })
            }
            response.end(answer)
        })
        await server.listen(5000)
        driver = await new Builder().forBrowser('firefox').build()
    })

    afterEach(async ()=> {
        await server.close()
        await driver.quit()
    })

    it('renders as expected', async ()=> {
        await driver.get('http://localhost:5000')
        let render = await driver.findElement(By.id('render'))
        await render.click()

        expect(await valueIn('#grid .row-1 .cell-1-1')).to.equal('one')
        expect(await valueIn('#grid .row-2 .cell-2-1')).to.equal('two')
        expect(await valueIn('#grid .row-2 .cell-2-2')).to.equal('three')
    })
    var valueIn = async (selector)=> {
        let element = await driver.findElement(By.css(selector))
        let value = await element.getText()

        return value
    }
})
