var order = (data)=> {
    data[0].coordinates = { row:1, col:1 }
    data[1].coordinates = { row:2, col:1 }
    data[2].coordinates = { row:2, col:2 }

    return data
}

var render = (document, source, target)=> {
    var textarea = document.getElementById(source)
    var data = JSON.parse(textarea.innerHTML).data
    data = order(data)

    var tbody = document.querySelector(`table#${target} tbody`)
    var currentRow = -1
    var trs = []
    var tr
    for (var i=0; i<data.length; i++) {
        var item = data[i]
        if (currentRow != item.coordinates.row) {
            currentRow = item.coordinates.row
            tr = document.createElement('TR')
            tr.className = `row-${currentRow}`
            trs.push(tr)
        }
        var td = document.createElement('TD')
        td.className = `cell-${currentRow}-${item.coordinates.col}`
        td.innerHTML = item.label
        tr.appendChild(td)
    }
    for (var i=0; i<trs.length; i++) {
        tbody.appendChild(trs[i])
    }
}
