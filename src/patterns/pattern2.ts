import { calculatePiecePieceIntersection, calculateLinePieceCenter, calculatePointMean } from "../lib/math";
import type { CoordinateType, LinePiece, Polygon, Circle, Square, Diamond } from "../lib/types";
import { drawCircles, drawDiamonds, drawLinePieces, drawSquares } from "../lib/view";

function createPlusLines(radius: number): LinePiece[] {
    return [
        {
            a: { x: -radius, y: 0 },
            b: { x: radius, y: 0 },
        },
        {
            a: { x: 0, y: -radius },
            b: { x: 0, y: radius },
        },
    ];
}

function createCircle(r: number): Circle {
    return {
        center: { x: 0, y: 0 },
        radius: r,
    };
}

function createExLines(): LinePiece[] {
    return [
        // ascender
        {
            a: { x: -0.5, y: -0.5 },
            b: { x: 0.5, y: 0.5 },
        },
        // descender
        {
            a: { x: -0.5, y: 0.5 },
            b: { x: 0.5, y: -0.5 },
        },
    ];
}

function createSquare(): Square {
    return {
        top: { a: { x: -0.5, y: 0.5 }, b: { x: 0.5, y: 0.5 } },
        left: { a: { x: -0.5, y: 0.5 }, b: { x: -0.5, y: -0.5 } },
        bottom: { a: { x: -0.5, y: -0.5 }, b: { x: 0.5, y: -0.5 } },
        right: { a: { x: 0.5, y: 0.5 }, b: { x: 0.5, y: -0.5 } },
    };
}

function createSquareB(exLines: LinePiece[], diamond: Diamond): Square {
    const [ascender, descender] = exLines;
    const topLeft = calculatePiecePieceIntersection(descender, { a: diamond.left, b: diamond.top });
    const topRight = calculatePiecePieceIntersection(ascender, { a: diamond.top, b: diamond.right });
    const bottomRight = calculatePiecePieceIntersection(descender, { a: diamond.right, b: diamond.bottom });
    const bottomLeft = calculatePiecePieceIntersection(ascender, { a: diamond.bottom, b: diamond.left });

    return {
        top: { a: topLeft, b: topRight },
        right: { a: topRight, b: bottomRight },
        bottom: { a: bottomLeft, b: bottomRight },
        left: { a: bottomLeft, b: topLeft },
    };
}

function createDiamond(r: number): Diamond {
    return {
        top: { x: 0, y: r },
        left: { x: -r, y: 0 },
        bottom: { x: 0, y: -r },
        right: { x: r, y: 0 },
    };
}

function createDiamondB(square: Square): Diamond {
    return {
        top: calculateLinePieceCenter(square.top),
        left: calculatePointMean(square.top.a, square.bottom.a),
        bottom: calculateLinePieceCenter(square.bottom),
        right: calculatePointMean(square.top.b, square.bottom.b),
    };
}

function createHorizontals2(square: Square, innerDiamond: Diamond, outerDiamond: Diamond): LinePiece[] {
    const FAR_AWAY = 1000;
    const left1 = calculatePiecePieceIntersection({ a: innerDiamond.top, b: innerDiamond.left }, square.left);
    const tooHor1 = { a: { x: -FAR_AWAY, y: left1.y }, b: { x: FAR_AWAY, y: left1.y } };
    const leftA = calculatePiecePieceIntersection({ a: outerDiamond.top, b: outerDiamond.left }, tooHor1);
    const rightA = calculatePiecePieceIntersection({ a: outerDiamond.top, b: outerDiamond.right }, tooHor1);

    const left2 = calculatePiecePieceIntersection({ a: innerDiamond.bottom, b: innerDiamond.left }, square.left);
    const tooHor2 = { a: { x: -FAR_AWAY, y: left2.y }, b: { x: FAR_AWAY, y: left2.y } };
    const leftB = calculatePiecePieceIntersection({ a: outerDiamond.bottom, b: outerDiamond.left }, tooHor2);
    const rightB = calculatePiecePieceIntersection({ a: outerDiamond.bottom, b: outerDiamond.right }, tooHor2);
    return [
        { a: leftA, b: rightA },
        { a: leftB, b: rightB },
    ];
}

function createVerticals2(square: Square, innerDiamond: Diamond, outerDiamond: Diamond): LinePiece[] {
    const FAR_AWAY = 1000;
    const top1 = calculatePiecePieceIntersection({ a: innerDiamond.left, b: innerDiamond.top }, square.top);
    const tooVer1 = { a: { x: top1.x, y: FAR_AWAY }, b: { x: top1.x, y: -FAR_AWAY } };
    const topA = calculatePiecePieceIntersection({ a: outerDiamond.left, b: outerDiamond.top }, tooVer1);
    const bottomA = calculatePiecePieceIntersection({ a: outerDiamond.left, b: outerDiamond.bottom }, tooVer1);

    const top2 = calculatePiecePieceIntersection({ a: innerDiamond.right, b: innerDiamond.top }, square.top);
    const tooVer2 = { a: { x: top2.x, y: FAR_AWAY }, b: { x: top2.x, y: -FAR_AWAY } };
    const topB = calculatePiecePieceIntersection({ a: outerDiamond.right, b: outerDiamond.top }, tooVer2);
    const bottomB = calculatePiecePieceIntersection({ a: outerDiamond.right, b: outerDiamond.bottom }, tooVer2);
    return [
        { a: topA, b: bottomA },
        { a: topB, b: bottomB },
    ];
}

export function designShapes2(g: SVGGElement, draw: boolean): Record<string, Polygon> {
    const project = (ordinate: number, type: CoordinateType) => {
        const c = 353;
        switch (type) {
            case "abs":
                return c * ordinate;
            case "x":
                return 260 + c * ordinate;
            case "y":
                return 260 - c * ordinate;
        }
    };

    const radius = Math.sqrt(0.5 * 0.5 + 0.5 * 0.5);
    const plus = createPlusLines(radius);
    const circle = createCircle(radius);
    const exLines = createExLines();
    const square1 = createSquare();
    const diamond = createDiamond(radius);
    const square2 = createSquareB(exLines, diamond);
    const diamond2 = createDiamondB(square1);
    const square3 = createSquareB(exLines, diamond2);
    const diamond3 = createDiamondB(square2);
    const square4 = createSquareB(exLines, diamond3);
    const diamond4 = createDiamondB(square3);
    const horizontals2 = createHorizontals2(square4, diamond4, diamond);
    const verticals2 = createVerticals2(square4, diamond4, diamond);

    if (draw) {
        drawLinePieces(plus, g, project);
        drawCircles([circle], g, project);
        drawLinePieces(exLines, g, project);
        drawSquares([square1], g, project);
        drawDiamonds([diamond], g, project);
        drawSquares([square2], g, project);
        drawDiamonds([diamond2], g, project);
        drawSquares([square3], g, project);
        drawDiamonds([diamond3], g, project);
        drawSquares([square4], g, project);
        drawDiamonds([diamond4], g, project);
        drawLinePieces(horizontals2, g, project);
        drawLinePieces(verticals2, g, project);
    }

    return {};
}
