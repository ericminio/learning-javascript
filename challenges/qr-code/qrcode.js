export const positionPattern = [
    [1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 0, 1],
    [1, 0, 1, 1, 1, 0, 1],
    [1, 0, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1],
];
const size = (v) => 17 + 4 * v;
const masks = [({ row, column }) => (row + column) % 2 === 0];

export const generateQRCodeMatrix = ({ version, text }) => {
    const data = modeAndLengthOfText(text);

    const matrix = init({ version });
    addPositionPatterns({ version, matrix });
    addTimingPatterns({ version, matrix });
    const zygZag = computeDataPath(matrix);
    const positionedData = [];
    for (let i = 0; i < data.length; i++) {
        const { row, column } = zygZag[i];
        positionedData.push({ row, column, value: data[i] });
    }
    const maskedData = mask(positionedData);
    for (const { row, column, value } of maskedData) {
        matrix[row][column].value = value;
    }
    return matrix;
};

export const computeDataPath = (matrix) => {
    let maxRow = -1;
    let maxColumn = -1;
    for (let r = 0; r < matrix.length; r++) {
        for (let c = 0; c < matrix[r].length; c++) {
            const { row, column } = matrix[r][c];
            if (row > maxRow) maxRow = row;
            if (column > maxColumn) maxColumn = column;
        }
    }
    const path = [];
    for (let c = maxColumn; c >= 0; c -= 2) {
        const up = ((maxColumn - c) / 2) % 2 === 0;
        let move = {
            start: up ? maxRow : 0,
            stop: up ? 0 : maxRow,
            direction: up ? -1 : 1,
        };
        for (
            let r = move.start;
            r != move.stop + move.direction;
            r += move.direction
        ) {
            if (!matrix[r][c].locked) path.push({ row: r, column: c });
            if (!matrix[r][c - 1].locked) path.push({ row: r, column: c - 1 });
        }
    }
    return path;
};

export const mask = (cells) =>
    cells.map(({ value, row, column }) => ({
        value: masks[0]({ row, column }) ? 1 - value : value,
        row,
        column,
    }));

const modeAndLengthOfText = (text) => {
    const mode = [0, 1, 0, 0];
    const length = text ? text.length : 0;
    return mode.concat([
        (length >> 7) & 1,
        (length >> 6) & 1,
        (length >> 5) & 1,
        (length >> 4) & 1,
        (length >> 3) & 1,
        (length >> 2) & 1,
        (length >> 1) & 1,
        length & 1,
    ]);
};

const init = ({ version }) => {
    const matrix = Array.from({ length: size(version) }, () =>
        Array(size(version)).fill(0)
    );
    for (let r = 0; r < size(version); r++) {
        for (let c = 0; c < size(version); c++) {
            matrix[r][c] = { row: r, column: c, value: 0 };
        }
    }
    return matrix;
};

const addPositionPatterns = ({ version, matrix }) => {
    setValuesStartingAtPosition(0, 0, positionPattern, matrix);
    setValuesStartingAtPosition(
        0,
        size(version) - positionPattern.length,
        positionPattern,
        matrix
    );
    setValuesStartingAtPosition(
        size(version) - positionPattern.length,
        0,
        positionPattern,
        matrix
    );
    setDarkModule({ version, matrix });
};

const addTimingPatterns = ({ version, matrix }) => {
    const total = size(version);
    const positionPatternSize = positionPattern.length;
    const line = Array.from(
        { length: total - 2 * positionPatternSize },
        (_, i) => (i % 2 === 0 ? 0 : 1)
    );
    setValuesStartingAtPosition(
        positionPatternSize - 1,
        positionPatternSize,
        [line],
        matrix
    );
    const column = line.map((v) => [v]);
    setValuesStartingAtPosition(
        positionPatternSize,
        positionPatternSize - 1,
        column,
        matrix
    );
};

const setDarkModule = ({ version, matrix }) => {
    setValuesStartingAtPosition(size(version) - 8, 8, [[1]], matrix);
};

const setValuesStartingAtPosition = (row, column, values, matrix) => {
    for (let r = 0; r < values.length; r++) {
        for (let c = 0; c < values[r].length; c++) {
            matrix[row + r][column + c].value = values[r][c];
        }
    }
};
