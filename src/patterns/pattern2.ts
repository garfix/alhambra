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
        {
            a: { x: -0.5, y: -0.5 },
            b: { x: 0.5, y: 0.5 },
        },
        {
            a: { x: 0.5, y: -0.5 },
            b: { x: -0.5, y: 0.5 },
        },
    ];
}

function createSquare(): Square {
    return {
        top: { a: { x: -0.5, y: -0.5 }, b: { x: 0.5, y: -0.5 } },
        bottom: { a: { x: -0.5, y: 0.5 }, b: { x: 0.5, y: 0.5 } },
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

export function designShapes2(g: SVGGElement, draw: boolean): Record<string, Polygon> {
    const project = (ordinate: number, type: CoordinateType) => {
        const c = 353;
        switch (type) {
            case "abs":
                return c * ordinate;
            case "x":
            case "y":
                return 260 - c * ordinate;
        }
    };

    const radius = Math.sqrt(0.5 * 0.5 + 0.5 * 0.5);
    const plus = createPlusLines(radius);
    const circle = createCircle(radius);
    const exLines = createExLines();
    const square = createSquare();
    const diamond = createDiamond(radius);

    if (draw) {
        drawLinePieces(plus, g, project);
        drawCircles([circle], g, project);
        drawLinePieces(exLines, g, project);
        drawSquares([square], g, project);
        drawDiamonds([diamond], g, project);
    }

    return {};
}
