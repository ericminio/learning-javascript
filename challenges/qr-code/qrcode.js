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

export const mask = (cells) =>
    cells.map(({ value, row, column }) => ({
        value: masks[0]({ row, column }) ? 1 - value : value,
        row,
        column,
    }));

export const generateQRCodeMatrix = ({ version }) => {
    const data = [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0];

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
    return [
        { row: 20, column: 20 },
        { row: 20, column: 19 },
        { row: 19, column: 20 },
        { row: 19, column: 19 },
        { row: 18, column: 20 },
        { row: 18, column: 19 },
        { row: 17, column: 20 },
        { row: 17, column: 19 },
        { row: 16, column: 20 },
        { row: 16, column: 19 },
        { row: 15, column: 20 },
        { row: 15, column: 19 },
    ];
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
