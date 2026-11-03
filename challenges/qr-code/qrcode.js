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
    const matrix = Array.from({ length: sizes[version].total }, () =>
        Array(sizes[version].total).fill(0)
    );
    const positionPattern = sizes[version].positionPattern();
    setValuesStartingAtPosition(0, 0, positionPattern, matrix);
    setValuesStartingAtPosition(
        sizes[version].total - positionPattern.length,
        0,
        positionPattern,
        matrix
    );
    setValuesStartingAtPosition(
        0,
        sizes[version].total - positionPattern.length,
        positionPattern,
        matrix
    );
    return matrix;
};

const setValuesStartingAtPosition = (x, y, values, matrix) => {
    for (let i = 0; i < values.length; i++) {
        for (let j = 0; j < values[i].length; j++) {
            matrix[y + i][x + j] = values[i][j];
        }
    }
};
