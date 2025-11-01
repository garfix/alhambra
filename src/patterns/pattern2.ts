import type { CoordinateType, LinePiece, Polygon, Circle } from "../lib/types";
import { drawCircles, drawLinePieces } from "../lib/view";

function createCrossLines(radius: number) {
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
    const crossLines = createCrossLines(radius);
    const circle = createCircle(radius);

    if (draw) {
        drawLinePieces(crossLines, g, project);
        drawCircles([circle], g, project);
    }

    return {};
}
