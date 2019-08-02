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

    it('handles default data as expected', async ()=> {
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

    it('can digest empty spaces', async ()=> {
        await driver.get('http://localhost:5000')
        let data = await driver.findElement(By.id('data'))
        await data.clear()
        let value = `{
            "data": [
                { "day":1, "value":"A", "label":"one"   },
                { "day":1, "value":"B", "label":"two"   },
                { "day":2, "value":"B", "label":"three" },
                { "day":3, "value":"A", "label":"four"  }
            ]
        }`
        await data.sendKeys(value)
        let render = await driver.findElement(By.id('render'))
        await render.click()

        await driver.sleep(1*1000)

        expect(await valueIn('table#grid tr:nth-child(1) td:nth-child(3)')).to.equal('four')
    })
})
