export const render = (matrix) => {
    return matrix.map((row) =>
        row.map((cell) => (cell.value === 1 ? '■' : '.'))
    );
};
