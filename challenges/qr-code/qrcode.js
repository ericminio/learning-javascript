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
    const matrix = init({ version });
    addPositionPatterns({ version, matrix });
    addTimingPatterns({ version, matrix });
    const byteMode = [
        { value: 0, row: 20, column: 20 },
        { value: 1, row: 20, column: 19 },
        { value: 0, row: 19, column: 20 },
        { value: 0, row: 19, column: 19 },
    ];
    const masked = mask(byteMode);
    const values = [
        [
            masked.find(({ row, column }) => row === 19 && column === 19)
                ?.value,
            masked.find(({ row, column }) => row === 19 && column === 20)
                ?.value,
        ],
        [
            masked.find(({ row, column }) => row === 20 && column === 19)
                ?.value,
            masked.find(({ row, column }) => row === 20 && column === 20)
                ?.value,
        ],
    ];
    setValuesStartingAtPosition(19, 19, values, matrix);
    return matrix;
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
