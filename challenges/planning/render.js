var align = (data) => {
    data.sort((a, b) => {
        if (a.value < b.value) {
            return -1;
        }
        if (a.value > b.value) {
            return 1;
        }
        if (a.value == b.value) {
            return a.day - b.day;
        }
    });
    data.forEach((item) => {
        item.coordinates = { col: item.day };
    });
    var row = 0;
    var currentValue;
    for (var i = 0; i < data.length; i++) {
        var item = data[i];
        if (item.value != currentValue) {
            currentValue = item.value;
            row += 1;
        }
        item.coordinates.row = row;
    }

    return data;
};

var render = (document, source, target) => {
    var textarea = document.getElementById(source);
    var data = JSON.parse(textarea.value).data;
    data = align(data);
    console.log(data);

    var tbody = document.querySelector(`table#${target} tbody`);
    tbody.innerHTML = '';

    var currentRow = -1,
        currentCol = -1;
    var trs = [];
    var tr;
    for (var i = 0; i < data.length; i++) {
        var item = data[i];
        if (currentRow != item.coordinates.row) {
            currentRow = item.coordinates.row;
            currentCol = 1;
            tr = document.createElement('TR');
            tr.className = `row-${currentRow}`;
            trs.push(tr);
        }
        while (currentCol != item.coordinates.col) {
            var td = document.createElement('TD');
            td.className = `cell-${currentRow}-${currentCol}`;
            tr.appendChild(td);
            currentCol += 1;
        }
        var td = document.createElement('TD');
        td.className = `cell-${currentRow}-${item.coordinates.col} with-value`;
        td.innerHTML = item.label;
        tr.appendChild(td);
        currentCol += 1;
    }
    for (var i = 0; i < trs.length; i++) {
        tbody.appendChild(trs[i]);
    }
};
