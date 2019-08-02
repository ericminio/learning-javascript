const { expect } = require('chai')
const fs = require('fs')
const path = require('path')
var sut = fs.readFileSync(path.join(__dirname, 'render.js')).toString()
var align = (new Function(`${sut} return align;`))()

describe('align', ()=> {

    it('works with default value', ()=>{
        var input = [
            { "day":1, "value":"A", "label":"one"   },
            { "day":1, "value":"B", "label":"two"   },
            { "day":2, "value":"B", "label":"three" }
        ]
        var aligned = align(input)
        expect(aligned).to.deep.equal([
            { "day":1, "value":"A", "label":"one", coordinates: { row:1, col:1 } },
            { "day":1, "value":"B", "label":"two", coordinates: { row:2, col:1 }   },
            { "day":2, "value":"B", "label":"three", coordinates: { row:2, col:2 } }
        ])
    })
})
