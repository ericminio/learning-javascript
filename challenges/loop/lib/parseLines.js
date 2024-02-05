const lines = (incoming) =>
    incoming
        .trim()
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.length > 0);

module.exports = { lines };
