var fs = require('fs')
var path = require('path')
var addFetchFeature = (document)=> {
    var script =  document.createElement("script")
    script.type = "text/javascript"
    script.innerHTML = fs.readFileSync(path.join(__dirname, './fetch.umd.js')).toString()
    var head= document.getElementsByTagName('head')[0]
    head.appendChild(script)
}

module.exports = {
    addFetchFeature: addFetchFeature
}
