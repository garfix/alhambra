export function moveLight(light: SVGFESpecularLightingElement, ltr: boolean) {
    let newX = parseInt(light.getAttribute("x") as string);

    if (ltr) {
        newX += 1;
    } else {
        newX -= 1;
    }

    if (ltr && newX > 510) {
        newX = 510;
        ltr = false;
    } else if (!ltr && newX < 10) {
        newX = 10;
        ltr = true;
    }

    light.setAttribute("x", "" + newX);

    requestAnimationFrame(() => {
        moveLight(light, ltr);
    });
}

export function moveLightWithMouse(light: SVGFESpecularLightingElement, view: SVGSVGElement) {
    view.addEventListener("mousemove", (e) => {
        const rect = view.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        // Keep z constant, or you can vary it for depth effect
        const z = 150;

        light.setAttribute("x", x);
        light.setAttribute("y", y);
        light.setAttribute("z", z);
    });
}
