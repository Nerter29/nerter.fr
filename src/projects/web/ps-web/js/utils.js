export function randomInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
export function normalize(vec) {
    const [x, y] = vec;
    const length = Math.sqrt(x * x + y * y);
    if (length === 0) return [0, 0];
    return [x / length, y / length];
}

export function getColorFromSpectrum(index, totalItems, endRatio) {
    const t = index / (totalItems - 1);
    const hue = t * 360 * endRatio;
    return `hsl(${hue}, 100%, 80%)`;
}