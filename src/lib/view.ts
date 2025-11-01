import type { Circle, Diamond, LinePiece, Polygon, projection as Projection } from "./types";

export function drawLinePieces(linePieces: LinePiece[], g: SVGGElement, project: Projection) {
    for (const piece of linePieces) {
        const l = document.createElementNS("http://www.w3.org/2000/svg", "line");
        l.setAttribute("x1", "" + project(piece.a.x, "x"));
        l.setAttribute("y1", "" + project(piece.a.y, "y"));
        l.setAttribute("x2", "" + project(piece.b.x, "x"));
        l.setAttribute("y2", "" + project(piece.b.y, "y"));
        l.setAttribute("stroke", "#000000");
        l.setAttribute("stroke-width", "1");
        g.append(l);
    }
}

export function drawCircles(circles: Circle[], g: SVGGElement, project: Projection) {
    for (const circle of circles) {
        const c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        c.setAttribute("r", "" + project(circle.radius, "abs"));
        c.setAttribute("cx", "" + project(circle.center.x, "x"));
        c.setAttribute("cy", "" + project(circle.center.y, "y"));
        c.setAttribute("stroke", "#000000");
        c.setAttribute("fill", "none");
        c.setAttribute("stroke-width", "1");
        c.setAttribute("filter", "url(#filter)");
        g.append(c);
    }
}

export function drawDiamonds(diamonds: Diamond[], g: SVGGElement, project: Projection) {
    for (const diamond of diamonds) {
        const p = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        p.setAttribute(
            "points",
            [
                [project(diamond.top.x, "x"), project(diamond.top.y, "y")].join(","),
                [project(diamond.right.x, "x"), project(diamond.right.y, "y")].join(","),
                [project(diamond.bottom.x, "x"), project(diamond.bottom.y, "y")].join(","),
                [project(diamond.left.x, "x"), project(diamond.left.y, "y")].join(","),
            ].join(" ")
        );
        p.setAttribute("stroke", "#000000");
        p.setAttribute("fill", "none");
        p.setAttribute("stroke-width", "1");
        g.append(p);
    }
}

export function drawPolygon(polygon: Polygon, g: SVGGElement, project: Projection, fillColor: string = "none", strokeColor = "#00ff00") {
    const p = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    p.setAttribute("points", polygon.points.map((p) => [project(p.x, "x"), project(p.y, "y")].join(",")).join(" "));
    p.setAttribute("stroke", strokeColor);
    p.setAttribute("fill", fillColor);
    p.setAttribute("stroke-width", "1");
    g.append(p);
}

export function clearView(view: SVGSVGElement, background: SVGGElement, g: SVGGElement, color: string) {
    const w = view.viewBox.baseVal.width || view.clientWidth || view.getAttribute("width");
    const h = view.viewBox.baseVal.height || view.clientHeight || view.getAttribute("height");

    // wipe contents
    g.innerHTML = "";
    background.innerHTML = "";

    // create background rect covering the SVG coordinate system
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("x", "0");
    rect.setAttribute("y", "0");
    rect.setAttribute("width", "" + w);
    rect.setAttribute("height", "" + h);
    rect.setAttribute("fill", color);
    background.appendChild(rect);
}
