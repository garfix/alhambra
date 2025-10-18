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

// a square on its side
type Diamond = {
    top: Point,
    right: Point,
    bottom: Point,
    left: Point
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

function calculatePiecePieceIntersection(p1: LinePiece, p2: LinePiece): Point {
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

// Results are ordered by x values
function calculatePieceCircleIntersections(piece: LinePiece, circle: Circle): Point[] {
    const { center, radius } = circle;
    const a = piece.a;
    const b = piece.b;

    // Direction vector of the line segment
    const dx = b.x - a.x;
    const dy = b.y - a.y;

    // Compute coefficients of the quadratic equation
    const fx = a.x - center.x;
    const fy = a.y - center.y;

    const A = dx * dx + dy * dy;
    const B = 2 * (fx * dx + fy * dy);
    const C = fx * fx + fy * fy - radius * radius;

    const discriminant = B * B - 4 * A * C;

    // No intersection
    if (discriminant < 0) {
        return [];
    }

    // One or two intersections
    const results = [];
    const sqrtD = Math.sqrt(discriminant);

    // Compute t values (parametric position on the line)
    const t1 = (-B + sqrtD) / (2 * A);
    const t2 = (-B - sqrtD) / (2 * A);

    // Only count intersections that lie within the segment [0, 1]
    if (t1 >= 0 && t1 <= 1) {
        results.push({ x: a.x + t1 * dx, y: a.y + t1 * dy });
    }
    if (t2 >= 0 && t2 <= 1 && discriminant !== 0) {
        results.push({ x: a.x + t2 * dx, y: a.y + t2 * dy });
    }

    results.sort((a: Point, b: Point) => a.x < b.x ? -1 : 1);

    return results
}

function calculateDistance(point1: Point, point2: Point) {
    const dx = point2.x - point1.x;
    const dy = point2.y - point1.y;
    return Math.sqrt(dx * dx + dy * dy);
}

function calculateRadius(piece1: LinePiece, piece2: LinePiece) {
    const intersectionPoint = calculatePiecePieceIntersection(piece1, piece2);
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

function createDiamond(circle: Circle, steep: LinePiece, slight: LinePiece): Diamond {
    const steepPoints = calculatePieceCircleIntersections(steep, circle)
    const slightPoints = calculatePieceCircleIntersections(slight, circle)
    return {
        top: steepPoints[0], 
        right: slightPoints[1], 
        bottom: steepPoints[1], 
        left: slightPoints[0]
    }
}

function createSquares(circles: Circle[], steepAscs: LinePiece[], steepDescs: LinePiece[], slightAscs: LinePiece[], slightDescs: LinePiece[]) {

    return [
        createDiamond(circles[0], steepDescs[1], slightAscs[1]),
        createDiamond(circles[1], steepAscs[1], slightDescs[1]),
        createDiamond(circles[2], steepAscs[4], slightDescs[4]),
        createDiamond(circles[3], steepDescs[4], slightAscs[4]),
    ]
}

export function run() {
    const view = document.getElementById('view');

    const horizontals = createHorizontalLines(8);
    const verticals = createVerticalLines(8);
    const steepAscs = createSteepAscendingLines()
    const steepDescs = createSteepDescendingLines()
    const slightAscs = createSlightAscendingLines()
    const slightDescs = createSlightDescendingLines()
    const radius = calculateRadius(slightAscs[0], steepDescs[2])
    const circles = createCircles(radius)
    const squares = createSquares(circles, steepAscs, steepDescs, slightAscs, slightDescs)

    if (view) {
        drawLinePieces(horizontals, view);
        drawLinePieces(verticals, view);
        drawLinePieces(steepAscs, view);
        drawLinePieces(steepDescs, view);
        drawLinePieces(slightAscs, view);
        drawLinePieces(slightDescs, view);
        drawCircles(circles, view);
        drawDiamonds(squares, view)
    }

}

function drawLinePieces(linePieces: LinePiece[], view: HTMLElement) {
    for (const piece of linePieces) {
        const l = document.createElementNS("http://www.w3.org/2000/svg", "line");
        l.setAttribute("x1", project(piece.a.x));
        l.setAttribute("y1", project(piece.a.y));
        l.setAttribute("x2", project(piece.b.x));
        l.setAttribute("y2", project(piece.b.y));
        l.setAttribute("stroke", "#000000");
        l.setAttribute("stroke-width", "1");
        view.append(l)
    }
}

function drawCircles(circles: Circle[], view: HTMLElement) {
    for (const circle of circles) {
        const c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        c.setAttribute("r", project(circle.radius, false));
        c.setAttribute("cx", project(circle.center.x));
        c.setAttribute("cy", project(circle.center.y));
        c.setAttribute("stroke", "#000000");
        c.setAttribute("fill", "none");
        c.setAttribute("stroke-width", "1");
        view.append(c)
    }
}

function drawDiamonds(diamonds: Diamond[], view: HTMLElement) {
    for (const diamond of diamonds) {
        const p = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        p.setAttribute("points", [
            [project(diamond.top.x), project(diamond.top.y)].join(","),
            [project(diamond.right.x), project(diamond.right.y)].join(","),
            [project(diamond.bottom.x), project(diamond.bottom.y)].join(","),
            [project(diamond.left.x), project(diamond.left.y)].join(","),
        ].join(" "));
        p.setAttribute("stroke", "#000000");
        p.setAttribute("fill", "none");
        p.setAttribute("stroke-width", "1");
        view.append(p)
    }
}

function project(ordinate: number, useOffset: boolean = true): string {
    const offset = useOffset ? 10 : 0;
    return "" + (ordinate * 500 + offset)
}
