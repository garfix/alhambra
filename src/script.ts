import { moveLight, moveLightWithMouse } from "./animation";
import { designShapes, drawPattern } from "./patterns/pattern1";
import { clearView } from "./lib/view";

export function run() {
    const view = document.getElementById('view');
    const light = document.getElementById('light1')
    const g = document.getElementById("group1");

    if (view instanceof SVGSVGElement) {
        const shapes = designShapes(view, true)

        clearView(view, '#f1ebdf');

        g.setAttribute("filter", "url(#filter)");
        view.append(g)

        drawPattern(shapes, g)

        moveLight(light, true)
        moveLightWithMouse(light, view)
                
    } else {
        throw new Error("HTML element not found: view");
    }
}

