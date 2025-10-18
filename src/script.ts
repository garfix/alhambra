import { calculateDistance, calculatePieceCircleIntersections, calculatePiecePieceIntersection } from "./math";
import type { Circle, Diamond, LinePiece } from "./types";

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
