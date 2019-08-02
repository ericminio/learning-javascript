const { expect } = require('chai')
const fs = require('fs')
const path = require('path')
var sut = fs.readFileSync(path.join(__dirname, 'render.js')).toString()
var align = (new Function(`${sut} return align;`))()

describe('align', ()=> {

    it('works with default value', ()=>{
        var input = [
            { "day":1, "value":"A" },
            { "day":1, "value":"B" },
            { "day":2, "value":"B" }
        ]
        var aligned = align(input)
        expect(aligned).to.deep.equal([
            { "day":1, "value":"A", coordinates: { row:1, col:1 } },
            { "day":1, "value":"B", coordinates: { row:2, col:1 }   },
            { "day":2, "value":"B", coordinates: { row:2, col:2 } }
        ])
    })
    it('resists unordered input', ()=>{
        var input = [
            { "day":2, "value":"B" },
            { "day":1, "value":"A" },
            { "day":1, "value":"B" }
        ]
        var aligned = align(input)
        expect(aligned).to.deep.equal([
            { "day":1, "value":"A", coordinates: { row:1, col:1 } },
            { "day":1, "value":"B", coordinates: { row:2, col:1 }   },
            { "day":2, "value":"B", coordinates: { row:2, col:2 } }
        ])
    })
})
