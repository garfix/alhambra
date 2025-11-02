import type { CoordinateType, LinePiece, Polygon, Circle } from "../lib/types";
import { drawCircles, drawLinePieces } from "../lib/view";

function createPlusLines(radius: number) {
    const linePieces: LinePiece[] = [
        {
            a: { x: -radius, y: 0 },
            b: { x: radius, y: 0 },
        },
        {
            a: { x: 0, y: -radius },
            b: { x: 0, y: radius },
        },
    ];
    return linePieces;
}

function createCircle(r: number): Circle {
    return {
        center: { x: 0, y: 0 },
        radius: r,
    };
}

function createExLines() {
    const linePieces: LinePiece[] = [
        {
            a: { x: -0.5, y: -0.5 },
            b: { x: 0.5, y: 0.5 },
        },
        {
            a: { x: 0.5, y: -0.5 },
            b: { x: -0.5, y: 0.5 },
        },
    ];
    return linePieces;
}

export function designShapes2(g: SVGGElement, draw: boolean): Record<string, Polygon> {
    const project = (ordinate: number, type: CoordinateType) => {
        const c = 353;
        switch (type) {
            case "abs":
                return c * ordinate;
            case "x":
            case "y":
                return 260 + c * ordinate;
        }
    };

    const radius = Math.sqrt(0.5 * 0.5 + 0.5 * 0.5);
    const plus = createPlusLines(radius);
    const circle = createCircle(radius);
    const exLines = createExLines();

    if (draw) {
        drawLinePieces(plus, g, project);
        drawCircles([circle], g, project);
        drawLinePieces(exLines, g, project);
    }

    return {};
}
