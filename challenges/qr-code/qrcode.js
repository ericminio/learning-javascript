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
    const masked = byteMode.map(({ value, row, column }) => ({
        value: (row + column) % 2 === 0 ? 1 - value : value,
        row,
        column,
    }));
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
    return Array.from({ length: size(version) }, () =>
        Array(size(version)).fill(0)
    );
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

const setValuesStartingAtPosition = (row, column, values, matrix) => {
    for (let r = 0; r < values.length; r++) {
        for (let c = 0; c < values[r].length; c++) {
            matrix[row + r][column + c] = values[r][c];
        }
    }
};
const setDarkModule = ({ version, matrix }) => {
    matrix[size(version) - 8][8] = 1;
};
