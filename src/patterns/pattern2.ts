import { calculatePiecePieceIntersection, calculateLinePieceCenter, calculatePointMean, createDiamond, extendLinePiece } from "../lib/math";
import type { CoordinateType, LinePiece, Polygon, Circle, Square, Diamond, Point, DirectedPieces } from "../lib/types";
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
function createCaps(linePiecePairs: DirectedPieces): DirectedPieces {
    const caps = Object.fromEntries(
        Object.entries(linePiecePairs).map(([key, pair]) => {
            return [
                key,
                [
                    {
                        a: pair[0].a,
                        b: pair[1].a,
                    },
                    {
                        a: pair[0].b,
                        b: pair[1].b,
                    },
                ],
            ];
        })
    ) as DirectedPieces;
    return caps;
}

function createSecondarySquare1Lines(square1: Square, secondaryPairs: DirectedPieces, diamond2: Diamond): LinePiece[] {
    return [
        // top
        extendLinePiece(
            {
                a: calculatePiecePieceIntersection(diamond2.topLeft, secondaryPairs.ver[0]),
                b: calculatePiecePieceIntersection(diamond2.topRight, secondaryPairs.ver[1]),
            },
            square1.left,
            square1.right
        ),
        // bottom
        extendLinePiece(
            {
                a: calculatePiecePieceIntersection(diamond2.bottomLeft, secondaryPairs.ver[0]),
                b: calculatePiecePieceIntersection(diamond2.bottomRight, secondaryPairs.ver[1]),
            },
            square1.left,
            square1.right
        ),
        // left
        extendLinePiece(
            {
                a: calculatePiecePieceIntersection(diamond2.topLeft, secondaryPairs.hor[0]),
                b: calculatePiecePieceIntersection(diamond2.bottomLeft, secondaryPairs.hor[1]),
            },
            square1.top,
            square1.bottom
        ),
        // right
        extendLinePiece(
            {
                a: calculatePiecePieceIntersection(diamond2.topRight, secondaryPairs.hor[0]),
                b: calculatePiecePieceIntersection(diamond2.bottomRight, secondaryPairs.hor[1]),
            },
            square1.top,
            square1.bottom
        ),
    ];
}

function createSecondaryDiamond1Lines(diamond1: Diamond, secondaryPairs: DirectedPieces, square2: Square): LinePiece[] {
    return [
        // top left
        extendLinePiece(
            {
                a: calculatePiecePieceIntersection(square2.top, secondaryPairs.desc[0]),
                b: calculatePiecePieceIntersection(square2.left, secondaryPairs.desc[1]),
            },
            diamond1.topRight,
            diamond1.bottomLeft
        ),
        // top right
        extendLinePiece(
            {
                a: calculatePiecePieceIntersection(square2.top, secondaryPairs.asc[0]),
                b: calculatePiecePieceIntersection(square2.right, secondaryPairs.asc[1]),
            },
            diamond1.topLeft,
            diamond1.bottomRight
        ),
        // bottom left
        extendLinePiece(
            {
                a: calculatePiecePieceIntersection(square2.left, secondaryPairs.asc[0]),
                b: calculatePiecePieceIntersection(square2.bottom, secondaryPairs.asc[1]),
            },
            diamond1.topLeft,
            diamond1.bottomRight
        ),
        // bottom right
        extendLinePiece(
            {
                a: calculatePiecePieceIntersection(square2.right, secondaryPairs.desc[0]),
                b: calculatePiecePieceIntersection(square2.bottom, secondaryPairs.desc[1]),
            },
            diamond1.topRight,
            diamond1.bottomLeft
        ),
    ];
}

function createStitches(
    secondaryPairs: DirectedPieces,
    innerSquare: Square,
    innerDiamond: Diamond,
    outerSquare: Square,
    outerDiamond: Diamond
): LinePiece[] {
    return [
        // top
        {
            a: calculatePiecePieceIntersection(outerSquare.top, secondaryPairs.ver[0]),
            b: calculatePiecePieceIntersection(innerSquare.top, secondaryPairs.desc[0]),
        },
        {
            a: calculatePiecePieceIntersection(outerSquare.top, secondaryPairs.ver[1]),
            b: calculatePiecePieceIntersection(innerSquare.top, secondaryPairs.asc[0]),
        },
        // top right
        {
            a: calculatePiecePieceIntersection(outerDiamond.topRight, secondaryPairs.asc[0]),
            b: calculatePiecePieceIntersection(innerDiamond.topRight, secondaryPairs.ver[1]),
        },
        {
            a: calculatePiecePieceIntersection(outerDiamond.topRight, secondaryPairs.asc[1]),
            b: calculatePiecePieceIntersection(innerDiamond.topRight, secondaryPairs.hor[0]),
        },
        // right
        {
            a: calculatePiecePieceIntersection(outerSquare.right, secondaryPairs.hor[0]),
            b: calculatePiecePieceIntersection(innerSquare.right, secondaryPairs.asc[1]),
        },
        {
            a: calculatePiecePieceIntersection(outerSquare.right, secondaryPairs.hor[1]),
            b: calculatePiecePieceIntersection(innerSquare.right, secondaryPairs.desc[0]),
        },
        // bottom right
        {
            a: calculatePiecePieceIntersection(outerDiamond.bottomRight, secondaryPairs.desc[0]),
            b: calculatePiecePieceIntersection(innerDiamond.bottomRight, secondaryPairs.hor[1]),
        },
        {
            a: calculatePiecePieceIntersection(outerDiamond.bottomRight, secondaryPairs.desc[1]),
            b: calculatePiecePieceIntersection(innerDiamond.bottomRight, secondaryPairs.ver[1]),
        },
        // bottom
        {
            a: calculatePiecePieceIntersection(outerSquare.bottom, secondaryPairs.ver[1]),
            b: calculatePiecePieceIntersection(innerSquare.bottom, secondaryPairs.desc[1]),
        },
        {
            a: calculatePiecePieceIntersection(outerSquare.bottom, secondaryPairs.ver[0]),
            b: calculatePiecePieceIntersection(innerSquare.bottom, secondaryPairs.asc[1]),
        },
        // bottom left
        {
            a: calculatePiecePieceIntersection(outerDiamond.bottomLeft, secondaryPairs.asc[1]),
            b: calculatePiecePieceIntersection(innerDiamond.bottomLeft, secondaryPairs.ver[0]),
        },
        {
            a: calculatePiecePieceIntersection(outerDiamond.bottomLeft, secondaryPairs.asc[0]),
            b: calculatePiecePieceIntersection(innerDiamond.bottomLeft, secondaryPairs.hor[1]),
        },
        // left
        {
            a: calculatePiecePieceIntersection(outerSquare.left, secondaryPairs.hor[1]),
            b: calculatePiecePieceIntersection(innerSquare.left, secondaryPairs.asc[0]),
        },
        {
            a: calculatePiecePieceIntersection(outerSquare.left, secondaryPairs.hor[0]),
            b: calculatePiecePieceIntersection(innerSquare.left, secondaryPairs.desc[1]),
        },
        // top left
        {
            a: calculatePiecePieceIntersection(outerDiamond.topLeft, secondaryPairs.desc[1]),
            b: calculatePiecePieceIntersection(innerDiamond.topLeft, secondaryPairs.hor[0]),
        },
        {
            a: calculatePiecePieceIntersection(outerDiamond.topLeft, secondaryPairs.desc[0]),
            b: calculatePiecePieceIntersection(innerDiamond.topLeft, secondaryPairs.ver[0]),
        },
    ];
}

function createTertiaryLines(caps: DirectedPieces, squareLines: LinePiece[], diamondLines: LinePiece[]) {
    return [
        // horizontal
        {
            a: calculatePiecePieceIntersection(caps.hor[0], diamondLines[2]),
            b: calculatePiecePieceIntersection(caps.hor[1], diamondLines[3]),
        },
        {
            a: calculatePiecePieceIntersection(caps.hor[0], diamondLines[0]),
            b: calculatePiecePieceIntersection(caps.hor[1], diamondLines[1]),
        },
        // vertical
        {
            a: calculatePiecePieceIntersection(caps.ver[0], diamondLines[1]),
            b: calculatePiecePieceIntersection(caps.ver[1], diamondLines[3]),
        },
        {
            a: calculatePiecePieceIntersection(caps.ver[0], diamondLines[0]),
            b: calculatePiecePieceIntersection(caps.ver[1], diamondLines[2]),
        },
        // descending
        {
            a: calculatePiecePieceIntersection(caps.desc[0], squareLines[2]),
            b: calculatePiecePieceIntersection(caps.desc[1], squareLines[1]),
        },
        {
            a: calculatePiecePieceIntersection(caps.desc[0], squareLines[0]),
            b: calculatePiecePieceIntersection(caps.desc[1], squareLines[3]),
        },
        // ascending
        {
            a: calculatePiecePieceIntersection(caps.asc[1], squareLines[1]),
            b: calculatePiecePieceIntersection(caps.asc[0], squareLines[3]),
        },
        {
            a: calculatePiecePieceIntersection(caps.asc[1], squareLines[2]),
            b: calculatePiecePieceIntersection(caps.asc[0], squareLines[0]),
        },
    ];
}

function createCrosses(
    tertiaryLines: LinePiece[],
    secondarySquare1: LinePiece[],
    square2: Square,
    secondaryDiamond1: LinePiece[],
    diamond2: Diamond
): LinePiece[] {
    return [
        // top
        {
            a: calculatePiecePieceIntersection(secondarySquare1[0], tertiaryLines[1 * 2 + 0]),
            b: calculatePiecePieceIntersection(square2.top, tertiaryLines[1 * 2 + 1]),
        },
        {
            a: calculatePiecePieceIntersection(secondarySquare1[0], tertiaryLines[1 * 2 + 1]),
            b: calculatePiecePieceIntersection(square2.top, tertiaryLines[1 * 2 + 0]),
        },
        // top right
        {
            a: calculatePiecePieceIntersection(secondaryDiamond1[1], tertiaryLines[3 * 2 + 0]),
            b: calculatePiecePieceIntersection(diamond2.topRight, tertiaryLines[3 * 2 + 1]),
        },
        {
            a: calculatePiecePieceIntersection(secondaryDiamond1[1], tertiaryLines[3 * 2 + 1]),
            b: calculatePiecePieceIntersection(diamond2.topRight, tertiaryLines[3 * 2 + 0]),
        },
        // right
        {
            a: calculatePiecePieceIntersection(secondarySquare1[3], tertiaryLines[0 * 2 + 0]),
            b: calculatePiecePieceIntersection(square2.right, tertiaryLines[0 * 2 + 1]),
        },
        {
            a: calculatePiecePieceIntersection(secondarySquare1[3], tertiaryLines[0 * 2 + 1]),
            b: calculatePiecePieceIntersection(square2.right, tertiaryLines[0 * 2 + 0]),
        },
        // bottom right
        {
            a: calculatePiecePieceIntersection(secondaryDiamond1[3], tertiaryLines[2 * 2 + 0]),
            b: calculatePiecePieceIntersection(diamond2.bottomRight, tertiaryLines[2 * 2 + 1]),
        },
        {
            a: calculatePiecePieceIntersection(secondaryDiamond1[3], tertiaryLines[2 * 2 + 1]),
            b: calculatePiecePieceIntersection(diamond2.bottomRight, tertiaryLines[2 * 2 + 0]),
        },
        // bottom
        {
            a: calculatePiecePieceIntersection(secondarySquare1[1], tertiaryLines[1 * 2 + 0]),
            b: calculatePiecePieceIntersection(square2.bottom, tertiaryLines[1 * 2 + 1]),
        },
        {
            a: calculatePiecePieceIntersection(secondarySquare1[1], tertiaryLines[1 * 2 + 1]),
            b: calculatePiecePieceIntersection(square2.bottom, tertiaryLines[1 * 2 + 0]),
        },
        // // bottom left
        {
            a: calculatePiecePieceIntersection(secondaryDiamond1[2], tertiaryLines[3 * 2 + 0]),
            b: calculatePiecePieceIntersection(diamond2.bottomLeft, tertiaryLines[3 * 2 + 1]),
        },
        {
            a: calculatePiecePieceIntersection(secondaryDiamond1[2], tertiaryLines[3 * 2 + 1]),
            b: calculatePiecePieceIntersection(diamond2.bottomLeft, tertiaryLines[3 * 2 + 0]),
        },
        // left
        {
            a: calculatePiecePieceIntersection(secondarySquare1[2], tertiaryLines[0 * 2 + 0]),
            b: calculatePiecePieceIntersection(square2.left, tertiaryLines[0 * 2 + 1]),
        },
        {
            a: calculatePiecePieceIntersection(secondarySquare1[2], tertiaryLines[0 * 2 + 1]),
            b: calculatePiecePieceIntersection(square2.left, tertiaryLines[0 * 2 + 0]),
        },
        // top left
        {
            a: calculatePiecePieceIntersection(secondaryDiamond1[0], tertiaryLines[2 * 2 + 0]),
            b: calculatePiecePieceIntersection(diamond2.topLeft, tertiaryLines[2 * 2 + 1]),
        },
        {
            a: calculatePiecePieceIntersection(secondaryDiamond1[0], tertiaryLines[2 * 2 + 1]),
            b: calculatePiecePieceIntersection(diamond2.topLeft, tertiaryLines[2 * 2 + 0]),
        },
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
    const secondaryPairs = { hor: secondaryHorizontals, ver: secondaryVerticals, desc: secondaryDescenders, asc: secondaryAscenders };
    const caps = createCaps(secondaryPairs);
    const secondarySquare1 = createSecondarySquare1Lines(square1, secondaryPairs, diamond2);
    const secondaryDiamond1 = createSecondaryDiamond1Lines(diamond1, secondaryPairs, square2);
    const stitches = createStitches(secondaryPairs, square3, diamond3, square1, diamond1);
    const tertiaryLines = createTertiaryLines(caps, secondarySquare1, secondaryDiamond1);
    const crosses = createCrosses(tertiaryLines, secondarySquare1, square2, secondaryDiamond1, diamond2);

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
        for (const pairs of Object.values(caps)) {
            drawLinePieces(pairs, g, project);
        }
        drawLinePieces(secondarySquare1, g, project);
        drawLinePieces(secondaryDiamond1, g, project);
        drawLinePieces(stitches, g, project);
        drawLinePieces(tertiaryLines, g, project);
        drawLinePieces(crosses, g, project);
    }

    return {};
}
