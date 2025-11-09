import { calculatePiecePieceIntersection, calculateLinePieceCenter, calculatePointMean, createDiamond, extendLinePiece } from "../lib/math";
import type { CoordinateType, LinePiece, Polygon, Circle, Square, Diamond, Point } from "../lib/types";
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

function createSquareA(): Square {
    return {
        top: { a: { x: -0.5, y: 0.5 }, b: { x: 0.5, y: 0.5 } },
        left: { a: { x: -0.5, y: 0.5 }, b: { x: -0.5, y: -0.5 } },
        bottom: { a: { x: -0.5, y: -0.5 }, b: { x: 0.5, y: -0.5 } },
        right: { a: { x: 0.5, y: 0.5 }, b: { x: 0.5, y: -0.5 } },
    };
}

function createSquareB(exLines: LinePiece[], diamond: Diamond): Square {
    const [ascender, descender] = exLines;
    const topLeft = calculatePiecePieceIntersection(descender, diamond.topLeft);
    const topRight = calculatePiecePieceIntersection(ascender, diamond.topRight);
    const bottomRight = calculatePiecePieceIntersection(descender, diamond.bottomRight);
    const bottomLeft = calculatePiecePieceIntersection(ascender, diamond.bottomLeft);

    return {
        top: { a: topLeft, b: topRight },
        right: { a: topRight, b: bottomRight },
        bottom: { a: bottomLeft, b: bottomRight },
        left: { a: bottomLeft, b: topLeft },
    };
}

function createDiamondA(r: number): Diamond {
    return createDiamond({ x: 0, y: r }, { x: -r, y: 0 }, { x: 0, y: -r }, { x: r, y: 0 });
}

function createDiamondB(square: Square): Diamond {
    return createDiamond(
        calculateLinePieceCenter(square.top),
        calculatePointMean(square.top.a, square.bottom.a),
        calculateLinePieceCenter(square.bottom),
        calculatePointMean(square.top.b, square.bottom.b)
    );
}

function createSecondaryHorizontals(square: Square, innerDiamond: Diamond, outerDiamond: Diamond): LinePiece[] {
    const left1 = calculatePiecePieceIntersection(innerDiamond.topLeft, square.left);
    const right1 = calculatePiecePieceIntersection(innerDiamond.topRight, square.right);
    const hor1 = extendLinePiece({ a: left1, b: right1 }, outerDiamond.topLeft, outerDiamond.topRight);

    const left2 = calculatePiecePieceIntersection(innerDiamond.bottomLeft, square.left);
    const right2 = calculatePiecePieceIntersection(innerDiamond.bottomRight, square.right);
    const hor2 = extendLinePiece({ a: left2, b: right2 }, outerDiamond.bottomLeft, outerDiamond.bottomRight);
    return [hor1, hor2];
}

function createSecondaryVerticals(square: Square, innerDiamond: Diamond, outerDiamond: Diamond): LinePiece[] {
    const top1 = calculatePiecePieceIntersection(innerDiamond.topLeft, square.top);
    const bottom1 = calculatePiecePieceIntersection(innerDiamond.bottomLeft, square.bottom);
    const ver1 = extendLinePiece({ a: top1, b: bottom1 }, outerDiamond.topLeft, outerDiamond.bottomLeft);

    const top2 = calculatePiecePieceIntersection(innerDiamond.topRight, square.top);
    const bottom2 = calculatePiecePieceIntersection(innerDiamond.bottomRight, square.bottom);
    const ver2 = extendLinePiece({ a: top2, b: bottom2 }, outerDiamond.topRight, outerDiamond.bottomRight);
    return [ver1, ver2];
}

function createSecondaryDescenders(square: Square, innerDiamond: Diamond, outerSquare: Square): LinePiece[] {
    const top1 = calculatePiecePieceIntersection(innerDiamond.topLeft, square.top);
    const bottom1 = calculatePiecePieceIntersection(innerDiamond.bottomRight, square.right);
    const desc1 = extendLinePiece({ a: top1, b: bottom1 }, outerSquare.top, outerSquare.right);

    const top2 = calculatePiecePieceIntersection(innerDiamond.topLeft, square.left);
    const bottom2 = calculatePiecePieceIntersection(innerDiamond.bottomRight, square.bottom);
    const desc2 = extendLinePiece({ a: top2, b: bottom2 }, outerSquare.left, outerSquare.bottom);
    return [desc1, desc2];
}

function createSecondaryAscenders(square: Square, innerDiamond: Diamond, outerSquare: Square): LinePiece[] {
    const top1 = calculatePiecePieceIntersection(innerDiamond.topRight, square.top);
    const bottom1 = calculatePiecePieceIntersection(innerDiamond.bottomLeft, square.left);
    const asc1 = extendLinePiece({ a: top1, b: bottom1 }, outerSquare.top, outerSquare.left);

    const top2 = calculatePiecePieceIntersection(innerDiamond.topRight, square.right);
    const bottom2 = calculatePiecePieceIntersection(innerDiamond.bottomLeft, square.bottom);
    const asc2 = extendLinePiece({ a: top2, b: bottom2 }, outerSquare.right, outerSquare.bottom);
    return [asc1, asc2];
}

/** hor, ver, desc, asc */
function createCaps(linePiecePairs: LinePiece[][]): LinePiece[] {
    const caps = [];
    for (const pair of linePiecePairs) {
        caps.push({
            a: pair[0].a,
            b: pair[1].a,
        });
        caps.push({
            a: pair[0].b,
            b: pair[1].b,
        });
    }
    return caps;
}

function createSecondarySquare1Lines(square1: Square, secondaryPairs: LinePiece[][], diamond2: Diamond): LinePiece[] {
    return [
        // top
        extendLinePiece(
            {
                a: calculatePiecePieceIntersection(diamond2.topLeft, secondaryPairs[1][0]),
                b: calculatePiecePieceIntersection(diamond2.topRight, secondaryPairs[1][1]),
            },
            square1.left,
            square1.right
        ),
        // bottom
        extendLinePiece(
            {
                a: calculatePiecePieceIntersection(diamond2.bottomLeft, secondaryPairs[1][0]),
                b: calculatePiecePieceIntersection(diamond2.bottomRight, secondaryPairs[1][1]),
            },
            square1.left,
            square1.right
        ),
        // left
        extendLinePiece(
            {
                a: calculatePiecePieceIntersection(diamond2.topLeft, secondaryPairs[0][0]),
                b: calculatePiecePieceIntersection(diamond2.bottomLeft, secondaryPairs[0][1]),
            },
            square1.top,
            square1.bottom
        ),
        // right
        extendLinePiece(
            {
                a: calculatePiecePieceIntersection(diamond2.topRight, secondaryPairs[0][0]),
                b: calculatePiecePieceIntersection(diamond2.bottomRight, secondaryPairs[0][1]),
            },
            square1.top,
            square1.bottom
        ),
    ];
}

function createSecondaryDiamond1Lines(diamond1: Diamond, secondaryPairs: LinePiece[][], square2: Square): LinePiece[] {
    return [
        // top left
        extendLinePiece(
            {
                a: calculatePiecePieceIntersection(square2.top, secondaryPairs[2][0]),
                b: calculatePiecePieceIntersection(square2.left, secondaryPairs[2][1]),
            },
            diamond1.topRight,
            diamond1.bottomLeft
        ),
        // top right
        extendLinePiece(
            {
                a: calculatePiecePieceIntersection(square2.top, secondaryPairs[3][0]),
                b: calculatePiecePieceIntersection(square2.right, secondaryPairs[3][1]),
            },
            diamond1.topLeft,
            diamond1.bottomRight
        ),
        // bottom left
        extendLinePiece(
            {
                a: calculatePiecePieceIntersection(square2.left, secondaryPairs[3][0]),
                b: calculatePiecePieceIntersection(square2.bottom, secondaryPairs[3][1]),
            },
            diamond1.topLeft,
            diamond1.bottomRight
        ),
        // bottom right
        extendLinePiece(
            {
                a: calculatePiecePieceIntersection(square2.right, secondaryPairs[2][0]),
                b: calculatePiecePieceIntersection(square2.bottom, secondaryPairs[2][1]),
            },
            diamond1.topRight,
            diamond1.bottomLeft
        ),
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
    const ex = createExLines();
    const square1 = createSquareA();
    const diamond1 = createDiamondA(radius);
    const square2 = createSquareB(ex, diamond1);
    const diamond2 = createDiamondB(square1);
    const square3 = createSquareB(ex, diamond2);
    const diamond3 = createDiamondB(square2);
    const square4 = createSquareB(ex, diamond3);
    const diamond4 = createDiamondB(square3);
    const secondaryHorizontals = createSecondaryHorizontals(square4, diamond4, diamond1);
    const secondaryVerticals = createSecondaryVerticals(square4, diamond4, diamond1);
    const secondaryDescenders = createSecondaryDescenders(square4, diamond4, square1);
    const secondaryAscenders = createSecondaryAscenders(square4, diamond4, square1);
    const secondaryPairs = [secondaryHorizontals, secondaryVerticals, secondaryDescenders, secondaryAscenders];
    const caps = createCaps(secondaryPairs);
    const secondarySquare1 = createSecondarySquare1Lines(square1, secondaryPairs, diamond2);
    const secondaryDiamond1 = createSecondaryDiamond1Lines(diamond1, secondaryPairs, square2);

    if (draw) {
        drawLinePieces(plus, g, project);
        drawCircles([circle], g, project);
        drawLinePieces(ex, g, project);
        drawSquares([square1], g, project);
        drawDiamonds([diamond1], g, project);
        drawSquares([square2], g, project);
        drawDiamonds([diamond2], g, project);
        drawSquares([square3], g, project);
        drawDiamonds([diamond3], g, project);
        drawSquares([square4], g, project);
        drawDiamonds([diamond4], g, project);
        drawLinePieces(secondaryHorizontals, g, project);
        drawLinePieces(secondaryVerticals, g, project);
        drawLinePieces(secondaryDescenders, g, project);
        drawLinePieces(secondaryAscenders, g, project);
        drawLinePieces(caps, g, project);
        drawLinePieces(secondarySquare1, g, project);
        drawLinePieces(secondaryDiamond1, g, project);
    }

    return {};
}
