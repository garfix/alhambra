import { moveLight, moveLightWithMouse } from "./animation";
import { translatePolygon } from "./lib/math";
import { designShapes } from "./patterns/pattern1";
import type { Polygon } from "./lib/types";
import { clearView, drawPolygon } from "./lib/view";

export function run() {
    const view = document.getElementById('view');
    const light = document.getElementById('light1')

    if (view instanceof SVGSVGElement) {
        const shapes = designShapes(view, true)

        clearView(view, '#f1ebdf');

        drawShapes(shapes, view)

        moveLight(light, true)
        moveLightWithMouse(light, view)
                
    } else {
        throw new Error("HTML element not found: view");
    }
}

function drawShapes(shapes: Record<string, Polygon>, view: SVGSVGElement) {

    const colors = ['#996e0a', '#285574', '#000000', '#13563d'];

    // create defs
    const g = document.getElementById("group1");
    g.setAttribute("filter", "url(#filter)");
    view.append(g)

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

