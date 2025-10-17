type Point = {
    x: number,
    y: number
}

type LinePiece = {
    a: Point,
    b: Point
}

type Circle = {
    center: Point,
    radius: number
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

function calculateIntersection(p1: LinePiece, p2: LinePiece): Point {
    // p1, p2 define line 1; p3, p4 define line 2
    const x1 = p1.a.x, y1 = p1.a.y;
    const x2 = p1.b.x, y2 = p1.b.y;
    const x3 = p2.a.x, y3 = p2.a.y;
    const x4 = p2.b.x, y4 = p2.b.y;

    // Calculate the determinant
    const denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    if (denom === 0) throw new Error("parallel lines"); // Lines are parallel or coincident

    // Intersection coordinates
    const px = ((x1*y2 - y1*x2)*(x3 - x4) - (x1 - x2)*(x3*y4 - y3*x4)) / denom;
    const py = ((x1*y2 - y1*x2)*(y3 - y4) - (y1 - y2)*(x3*y4 - y3*x4)) / denom;

    return { x: px, y: py };
}

function calculateDistance(point1: Point, point2: Point) {
    const dx = point2.x - point1.x;
    const dy = point2.y - point1.y;
    return Math.sqrt(dx * dx + dy * dy);
}

function calculateRadius(piece1: LinePiece, piece2: LinePiece) {
    const intersectionPoint = calculateIntersection(piece1, piece2);
    const centerPoint = {x: 2/8, y: 2/8}

    return calculateDistance(intersectionPoint, centerPoint);
}

function createCircles(radius: number) {
    return [
        {center: {x: 2/8, y: 2/8}, radius: radius},
        {center: {x: 6/8, y: 2/8}, radius: radius},
        {center: {x: 2/8, y: 6/8}, radius: radius},
        {center: {x: 6/8, y: 6/8}, radius: radius},
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
    const radius = calculateRadius(slightAscendings[0], steepDescendings[2])
    const circles = createCircles(radius)

    if (view) {
        drawLinePieces(horizontals, view);
        drawLinePieces(verticals, view);
        drawLinePieces(steepAscendings, view);
        drawLinePieces(steepDescendings, view);
        drawLinePieces(slightAscendings, view);
        drawLinePieces(slightDescendings, view);
        drawCircles(circles, view);
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

function drawCircles(circles: Circle[], view: HTMLElement) {
    for (const c of circles) {
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("r", project(c.radius, false));
        circle.setAttribute("cx", project(c.center.x));
        circle.setAttribute("cy", project(c.center.y));
        circle.setAttribute("stroke", "#000000");
        circle.setAttribute("fill", "none");
        circle.setAttribute("stroke-width", "1");
        view.append(circle)
    }
}

function project(ordinate: number, useOffset: boolean = true): string {
    const offset = useOffset ? 10 : 0;
    return "" + (ordinate * 500 + offset)
}
