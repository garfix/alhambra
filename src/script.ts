function createGrid(labelPrefix: string, count: number, points: Record<string, [number, number]>) {
    const d = 1.0 / count;
    for (let y = 0; y <= count; y++) {
        for (let x = 0; x <= count; x++) {
            points[`${labelPrefix}${x},${y}`] = [x * d, y * d];
        }
    }
}
export function run() {
    const points: Record<string, [number, number]> = {};
    createGrid("Black", 4, points)
    createGrid("Red", 8, points)
    console.log('Done');
}