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

export function run() {
    const horizontals = createHorizontalLines(8);
    // createLinePiecesTopLeft()
    const view = document.getElementById('view');

    for (const hor of horizontals) {
        const piece = document.createElementNS("http://www.w3.org/2000/svg", "line");
        piece.setAttribute("x1", project(hor.a.x));
        piece.setAttribute("y1", project(hor.a.y));
        piece.setAttribute("x2", project(hor.b.x));
        piece.setAttribute("y2", project(hor.b.y));
        piece.setAttribute("stroke", "#000000");
        piece.setAttribute("stroke-width", "1");
        view?.append(piece)
    }
}

function project(ordinate: number): string {
    return "" + (ordinate * 500 + 10)
}
