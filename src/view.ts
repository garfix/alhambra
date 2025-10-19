import type { Circle, Diamond, Polygon } from "./types";

export function drawLinePieces(linePieces: LinePiece[], view: HTMLElement) {
    for (const piece of linePieces) {
        const l = document.createElementNS("http://www.w3.org/2000/svg", "line");
        l.setAttribute("x1", project(piece.a.x));
        l.setAttribute("y1", project(piece.a.y));
        l.setAttribute("x2", project(piece.b.x));
        l.setAttribute("y2", project(piece.b.y));
        l.setAttribute("stroke", "#000000");
        l.setAttribute("stroke-width", "1");
        view.append(l)
    }
}

export function drawCircles(circles: Circle[], view: HTMLElement) {
    for (const circle of circles) {
        const c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        c.setAttribute("r", project(circle.radius, false));
        c.setAttribute("cx", project(circle.center.x));
        c.setAttribute("cy", project(circle.center.y));
        c.setAttribute("stroke", "#000000");
        c.setAttribute("fill", "none");
        c.setAttribute("stroke-width", "1");
        view.append(c)
    }
}

export function drawDiamonds(diamonds: Diamond[], view: HTMLElement) {
    for (const diamond of diamonds) {
        const p = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        p.setAttribute("points", [
            [project(diamond.top.x), project(diamond.top.y)].join(","),
            [project(diamond.right.x), project(diamond.right.y)].join(","),
            [project(diamond.bottom.x), project(diamond.bottom.y)].join(","),
            [project(diamond.left.x), project(diamond.left.y)].join(","),
        ].join(" "));
        p.setAttribute("stroke", "#000000");
        p.setAttribute("fill", "none");
        p.setAttribute("stroke-width", "1");
        view.append(p)
    }
}

export function drawPolygon(polygon: Polygon, view: HTMLElement, fillColor: string = 'none', strokeColor = '#00ff00') {
    const p = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    p.setAttribute("points", polygon.points.map(p => [project(p.x), project(p.y)].join(",")).join(" "));
    p.setAttribute("stroke", strokeColor);
    p.setAttribute("fill", fillColor);
    p.setAttribute("stroke-width", "3");
    view.append(p)
}

export function clearView(view: HTMLElement|SVGElement, color: string) {
    const w = view.viewBox.baseVal.width || view.clientWidth || view.getAttribute('width');
    const h = view.viewBox.baseVal.height || view.clientHeight || view.getAttribute('height');

    // wipe contents
    view.innerHTML = '';

    // create background rect covering the SVG coordinate system
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', '0');
    rect.setAttribute('y', '0');
    rect.setAttribute('width', w);
    rect.setAttribute('height', h);
    rect.setAttribute('fill', color);
    view.appendChild(rect);
}

function project(ordinate: number, useOffset: boolean = true): string {
    const offset = useOffset ? 10 : 0;
    return "" + ((ordinate * 500) + offset)
}
