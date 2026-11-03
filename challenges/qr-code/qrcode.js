export const sizes = {
    'version 1': {
        total: 21,
        positionPattern: () => [
            [1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 1],
            [1, 0, 1, 1, 1, 0, 1],
            [1, 0, 1, 1, 1, 0, 1],
            [1, 0, 1, 1, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1],
        ],
    },
};

export const generateQRCodeMatrix = (version) => {
    const matrix = init(version);
    addPositionPatterns(version, matrix);
    return matrix;
};

const init = (version) => {
    return Array.from({ length: sizes[version].total }, () =>
        Array(sizes[version].total).fill(0)
    );
};

const addPositionPatterns = (version, matrix) => {
    const positionPattern = sizes[version].positionPattern();
    setValuesStartingAtPosition(0, 0, positionPattern, matrix);
    setValuesStartingAtPosition(
        0,
        sizes[version].total - positionPattern.length,
        positionPattern,
        matrix
    );
    setValuesStartingAtPosition(
        sizes[version].total - positionPattern.length,
        0,
        positionPattern,
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
