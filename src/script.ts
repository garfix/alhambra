type Point = {
    x: number,
    y: number
}

type LinePiece = {
    a: Point,
    b: Point
}

function createHorizontalLines(count: number) {
    const linePieces: LinePiece[] = [];
    const d = 1.0 / count;
    for (let y = 0; y <= count; y++) {
        linePieces.push({
            a: {x: 0, y: y*d},
            b: {x: 1, y: y*d}
        })
    }
    return linePieces
}

function createVerticalLines(count: number) {
    const linePieces: LinePiece[] = [];
    const d = 1.0 / count;
    for (let x = 0; x <= count; x++) {
        linePieces.push({
            a: {x: x*d, y: 0},
            b: {x: x*d, y: 1}
        })
    }
    return linePieces
}

function createSteepAscendingLines() {
    return [
        {a: {x: 4/8, y: 4/8}, b: {x: 6/8, y: 0}},
        {a: {x: 5/8, y: 4/8}, b: {x: 7/8, y: 0}},
        {a: {x: 6/8, y: 4/8}, b: {x: 8/8, y: 0}},
        {a: {x: 0/8, y: 1}, b: {x: 2/8, y: 4/8}},
        {a: {x: 1/8, y: 1}, b: {x: 3/8, y: 4/8}},
        {a: {x: 2/8, y: 1}, b: {x: 4/8, y: 4/8}},
    ]
}

function createSteepDescendingLines() {
    return [
        {a: {x: 0/8, y: 0}, b: {x: 2/8, y: 4/8}},
        {a: {x: 1/8, y: 0}, b: {x: 3/8, y: 4/8}},
        {a: {x: 2/8, y: 0}, b: {x: 4/8, y: 4/8}},
        {a: {x: 4/8, y: 4/8}, b: {x: 6/8, y: 1}},
        {a: {x: 5/8, y: 4/8}, b: {x: 7/8, y: 1}},
        {a: {x: 6/8, y: 4/8}, b: {x: 8/8, y: 1}},
    ]
}

function createSlightAscendingLines() {
    return [
        {a: {x: 0, y: 2/8}, b: {x: 4/8, y: 0/8}},
        {a: {x: 0, y: 3/8}, b: {x: 4/8, y: 1/8}},
        {a: {x: 0, y: 4/8}, b: {x: 4/8, y: 2/8}},
        {a: {x: 4/8, y: 6/8}, b: {x: 1, y: 4/8}},
        {a: {x: 4/8, y: 7/8}, b: {x: 1, y: 5/8}},
        {a: {x: 4/8, y: 8/8}, b: {x: 1, y: 6/8}},
    ]
}

function createSlightDescendingLines() {
    return [
        {a: {x: 4/8, y: 0/8}, b: {x: 1, y: 2/8}},
        {a: {x: 4/8, y: 1/8}, b: {x: 1, y: 3/8}},
        {a: {x: 4/8, y: 2/8}, b: {x: 1, y: 4/8}},
        {a: {x: 0, y: 4/8}, b: {x: 4/8, y: 6/8}},
        {a: {x: 0, y: 5/8}, b: {x: 4/8, y: 7/8}},
        {a: {x: 0, y: 6/8}, b: {x: 4/8, y: 8/8}},
    ]
}

export function run() {
    const view = document.getElementById('view');

    const horizontals = createHorizontalLines(8);
    const verticals = createVerticalLines(8);
    const steepAscendings = createSteepAscendingLines()
    const steepDescendings = createSteepDescendingLines()
    const slightAscendings = createSlightAscendingLines()
    const slightDescendings = createSlightDescendingLines()

    if (view) {
        drawLinePieces(horizontals, view);
        drawLinePieces(verticals, view);
        drawLinePieces(steepAscendings, view);
        drawLinePieces(steepDescendings, view);
        drawLinePieces(slightAscendings, view);
        drawLinePieces(slightDescendings, view);
    }

}

function drawLinePieces(linePieces: LinePiece[], view: HTMLElement) {
    for (const piece of linePieces) {
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", project(piece.a.x));
        line.setAttribute("y1", project(piece.a.y));
        line.setAttribute("x2", project(piece.b.x));
        line.setAttribute("y2", project(piece.b.y));
        line.setAttribute("stroke", "#000000");
        line.setAttribute("stroke-width", "1");
        view.append(line)
    }

}

function project(ordinate: number): string {
    return "" + (ordinate * 500 + 10)
}
