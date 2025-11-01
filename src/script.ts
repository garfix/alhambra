import { moveLight, moveLightWithMouse } from "./animation";
import { designShapes, drawPattern } from "./patterns/pattern1";
import { clearView } from "./lib/view";
import { designShapes2 } from "./patterns/pattern2";

export function run() {
    const view = document.getElementById("view");
    const light = document.getElementById("light1");
    const mainGroup = document.getElementById("group1");
    const background = document.getElementById("background");

    const BG_COLOR = "#f0f0f0";

    if (view instanceof SVGSVGElement && mainGroup instanceof SVGGElement && background instanceof SVGGElement) {
        clearView(view, background, mainGroup, BG_COLOR);

        const shapes = designShapes(mainGroup, true);

        // return;

        clearView(view, background, mainGroup, BG_COLOR);

        drawPattern(shapes, mainGroup);

        moveLight(light, true);
        moveLightWithMouse(light, view);
    } else {
        throw new Error("HTML elements not found");
    }
}
