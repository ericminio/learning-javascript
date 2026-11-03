export const positionPatternForVersion = (version) => {
    return [
        [1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 1, 1, 0, 1],
        [1, 0, 1, 1, 1, 0, 1],
        [1, 0, 1, 1, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1],
    ];
};

export const generateQRCodeMatrix = (version) => {
    const matrix = Array.from({ length: 21 }, () => Array(21).fill(0));
    const positionPattern = positionPatternForVersion(version);
    setValuesStartingAtPosition(0, 0, positionPattern, matrix);
    setValuesStartingAtPosition(14, 0, positionPattern, matrix);
    setValuesStartingAtPosition(0, 14, positionPattern, matrix);
    return matrix;
};

const setValuesStartingAtPosition = (x, y, values, matrix) => {
    for (let i = 0; i < values.length; i++) {
        for (let j = 0; j < values[i].length; j++) {
            matrix[y + i][x + j] = values[i][j];
        }
    }
};
