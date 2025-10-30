import { calculateDistance, calculatePieceCircleIntersections, calculatePiecePieceIntersection, normalizePolygon, rotatePolygon, translatePolygon } from "../lib/math";
import type { Circle, Diamond, LinePiece, Polygon } from "../lib/types";
import { clearView, drawCircles, drawDiamonds, drawLinePieces, drawPolygon } from "../lib/view";

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
    const steepPoints = calculatePieceCircleIntersections(steep, circle, 'ver')
    const slightPoints = calculatePieceCircleIntersections(slight, circle, 'hor')
    return {
        top: steepPoints[0], 
        right: slightPoints[1], 
        bottom: steepPoints[1], 
        left: slightPoints[0]
    }
}

function createDiamonds(circles: Circle[], steepAscs: LinePiece[], steepDescs: LinePiece[], slightAscs: LinePiece[], slightDescs: LinePiece[]): Diamond[] {

    return [
        createDiamond(circles[0], steepDescs[1], slightAscs[1]),
        createDiamond(circles[1], steepAscs[1], slightDescs[1]),
        createDiamond(circles[2], steepAscs[4], slightDescs[4]),
        createDiamond(circles[3], steepDescs[4], slightAscs[4]),
    ]
}

function createChevronPolygon(steepAscs: LinePiece[], steepDescs: LinePiece[], slightAscs: LinePiece[], slightDescs: LinePiece[], diamonds: Diamond[]): Polygon {
    const d1 = diamonds[0];
    const d2 = diamonds[2];

    return {points: [
        calculatePiecePieceIntersection(slightAscs[2], steepDescs[0]),
        calculatePiecePieceIntersection(slightAscs[2], {a: d1.left, b: d1.bottom}),
        d1.bottom,
        calculatePiecePieceIntersection(slightAscs[2], {a: d1.bottom, b: d1.right}),
        calculatePiecePieceIntersection(slightAscs[2], steepDescs[2]),
        steepDescs[2].b,
        calculatePiecePieceIntersection(slightDescs[3], steepAscs[5]),
        calculatePiecePieceIntersection(slightDescs[3], {a: d2.top, b: d2.right}),
        d2.top,
        calculatePiecePieceIntersection(slightDescs[3], {a: d2.left, b: d2.top}),
        calculatePiecePieceIntersection(slightDescs[3], steepAscs[3]),
        steepDescs[0].b,
    ]}
}

export function designShapes(view: SVGSVGElement, draw: boolean): Record<string, Polygon> {

    const rawPivot = {x:2/8, y:6/8};

    const horizontals = createHorizontalLines(8);
    const verticals = createVerticalLines(8);
    const steepAscs = createSteepAscendingLines()
    const steepDescs = createSteepDescendingLines()
    const slightAscs = createSlightAscendingLines()
    const slightDescs = createSlightDescendingLines()
    const radius = calculateRadius(slightAscs[0], steepDescs[2])
    const circles = createCircles(radius)
    const diamonds = createDiamonds(circles, steepAscs, steepDescs, slightAscs, slightDescs)
    const chevron = createChevronPolygon(steepAscs, steepDescs, slightAscs, slightDescs, diamonds)
    const normalizedChevron = normalizePolygon(chevron, rawPivot)

    if (draw) {
        clearView(view, '#f0f0f0')
        drawLinePieces(horizontals, view);
        drawLinePieces(verticals, view);
        drawLinePieces(steepAscs, view);
        drawLinePieces(steepDescs, view);
        drawLinePieces(slightAscs, view);
        drawLinePieces(slightDescs, view);
        drawCircles(circles, view);
        drawDiamonds(diamonds, view);
        drawPolygon(chevron, view);
    }

    const pivot = {x: 0, y: 0};
    const upChevron = normalizedChevron
    const rightChevron = rotatePolygon(normalizedChevron, Math.PI / 2, pivot)
    const downChevron = rotatePolygon(normalizedChevron, Math.PI, pivot)
    const leftChevron = rotatePolygon(normalizedChevron, -Math.PI / 2, pivot)

    return {
        up: upChevron,
        right: rightChevron,
        down: downChevron,
        left: leftChevron
    }
}

export function drawPattern(shapes: Record<string, Polygon>, g: SVGElement) {

    const colors = ['#996e0a', '#285574', '#000000', '#13563d'];

    let startIndex = 0;
    for (let y = 0; y < 10; y++) {
        for (let x = 0; x < 10; x++) {
            const dx = (x * 1) + ((y % 2) * 0.5);
            const dy = y * 0.5;
            let colorIndex = (startIndex + x) % colors.length;
            for (const [_, shape] of Object.entries(shapes)) {
                const translated = translatePolygon(shape, {x: dx, y: dy})
                drawPolygon(translated, g, colors[colorIndex], 'grey')
            }
            colorIndex++;
        }
        startIndex += (y % 2) == 0 ? 2 : 1;
    }
}
