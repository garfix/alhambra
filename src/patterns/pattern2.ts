import { calculatePiecePieceIntersection, calculateLinePieceCenter, calculatePointMean, createDiamond } from "../lib/math";
import type { CoordinateType, LinePiece, Polygon, Circle, Square, Diamond, Point } from "../lib/types";
import { drawCircles, drawDiamonds, drawLinePieces, drawSquares } from "../lib/view";

const FAR_AWAY = 1000;

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
    const tooHor1 = { a: { x: -FAR_AWAY, y: left1.y }, b: { x: FAR_AWAY, y: left1.y } };
    const leftA = calculatePiecePieceIntersection(outerDiamond.topLeft, tooHor1);
    const rightA = calculatePiecePieceIntersection(outerDiamond.topRight, tooHor1);

    const left2 = calculatePiecePieceIntersection(innerDiamond.bottomLeft, square.left);
    const tooHor2 = { a: { x: -FAR_AWAY, y: left2.y }, b: { x: FAR_AWAY, y: left2.y } };
    const leftB = calculatePiecePieceIntersection(outerDiamond.bottomLeft, tooHor2);
    const rightB = calculatePiecePieceIntersection(outerDiamond.bottomRight, tooHor2);
    return [
        { a: leftA, b: rightA },
        { a: leftB, b: rightB },
    ];
}

function createSecondaryVerticals(square: Square, innerDiamond: Diamond, outerDiamond: Diamond): LinePiece[] {
    const top1 = calculatePiecePieceIntersection(innerDiamond.topLeft, square.top);
    const tooVer1 = { a: { x: top1.x, y: FAR_AWAY }, b: { x: top1.x, y: -FAR_AWAY } };
    const topA = calculatePiecePieceIntersection(outerDiamond.topLeft, tooVer1);
    const bottomA = calculatePiecePieceIntersection(outerDiamond.bottomLeft, tooVer1);

    const top2 = calculatePiecePieceIntersection(innerDiamond.topRight, square.top);
    const tooVer2 = { a: { x: top2.x, y: FAR_AWAY }, b: { x: top2.x, y: -FAR_AWAY } };
    const topB = calculatePiecePieceIntersection(outerDiamond.topRight, tooVer2);
    const bottomB = calculatePiecePieceIntersection(outerDiamond.bottomRight, tooVer2);
    return [
        { a: topA, b: bottomA },
        { a: topB, b: bottomB },
    ];
}

function createSecondaryDescenders(square: Square, innerDiamond: Diamond, outerSquare: Square): LinePiece[] {
    const top1 = calculatePiecePieceIntersection(innerDiamond.topLeft, square.top);
    const bottom1 = calculatePiecePieceIntersection(innerDiamond.bottomRight, square.right);
    const tooDia1 = { a: { x: top1.x - FAR_AWAY, y: top1.y + FAR_AWAY }, b: { x: bottom1.x + FAR_AWAY, y: bottom1.y - FAR_AWAY } };
    const topA = calculatePiecePieceIntersection(outerSquare.top, tooDia1);
    const bottomA = calculatePiecePieceIntersection(outerSquare.right, tooDia1);

    const top2 = calculatePiecePieceIntersection(innerDiamond.topLeft, square.left);
    const bottom2 = calculatePiecePieceIntersection(innerDiamond.bottomRight, square.bottom);
    const tooDia2 = { a: { x: top2.x - FAR_AWAY, y: top2.y + FAR_AWAY }, b: { x: bottom2.x + FAR_AWAY, y: bottom2.y - FAR_AWAY } };
    const topB = calculatePiecePieceIntersection(outerSquare.left, tooDia2);
    const bottomB = calculatePiecePieceIntersection(outerSquare.bottom, tooDia2);
    return [
        { a: topA, b: bottomA },
        { a: topB, b: bottomB },
    ];
}

function createSecondaryAscenders(square: Square, innerDiamond: Diamond, outerSquare: Square): LinePiece[] {
    const top1 = calculatePiecePieceIntersection(innerDiamond.topRight, square.top);
    const bottom1 = calculatePiecePieceIntersection(innerDiamond.bottomLeft, square.left);
    const tooDia1 = { a: { x: top1.x - FAR_AWAY, y: top1.y - FAR_AWAY }, b: { x: bottom1.x + FAR_AWAY, y: bottom1.y + FAR_AWAY } };
    const topA = calculatePiecePieceIntersection(outerSquare.top, tooDia1);
    const bottomA = calculatePiecePieceIntersection(outerSquare.left, tooDia1);

    const top2 = calculatePiecePieceIntersection(innerDiamond.topRight, square.right);
    const bottom2 = calculatePiecePieceIntersection(innerDiamond.bottomLeft, square.bottom);
    const tooDia2 = { a: { x: top2.x - FAR_AWAY, y: top2.y - FAR_AWAY }, b: { x: bottom2.x + FAR_AWAY, y: bottom2.y + FAR_AWAY } };
    const topB = calculatePiecePieceIntersection(outerSquare.right, tooDia2);
    const bottomB = calculatePiecePieceIntersection(outerSquare.bottom, tooDia2);
    return [
        { a: topA, b: bottomA },
        { a: topB, b: bottomB },
    ];
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

function createSecondarySquare1Lines(
    square: Square,
    linePiecePairs: LinePiece[][],
    secondarySquare: Square,
    secondaryDiamond: Diamond
): LinePiece[] {}

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
    const secondarySquare1 = createSecondarySquare1Lines(square1, secondaryPairs);

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
        // drawLinePieces(secondarySquare1, g, project);
    }

    return {};
}
