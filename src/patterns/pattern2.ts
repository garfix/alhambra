import type { LinePiece, Polygon } from "../lib/types";
import { drawLinePieces } from "../lib/view";

function createCrossLines() {
    const linePieces: LinePiece[] = [
        {
            a: { x: 0.5, y: 0 },
            b: { x: 0.5, y: 1 },
        },
        {
            a: { x: 0, y: 0.5 },
            b: { x: 1, y: 0.5 },
        },
    ];
    return linePieces;
}

export function designShapes2(g: SVGGElement, draw: boolean): Record<string, Polygon> {
    const crossLines = createCrossLines();

    if (draw) {
        drawLinePieces(crossLines, g);
    }

    return {};
}
