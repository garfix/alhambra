import type { Circle, LinePiece, Point } from "./types";

export function calculatePiecePieceIntersection(p1: LinePiece, p2: LinePiece): Point {
    // p1, p2 define line 1; p3, p4 define line 2
    const x1 = p1.a.x, y1 = p1.a.y;
    const x2 = p1.b.x, y2 = p1.b.y;
    const x3 = p2.a.x, y3 = p2.a.y;
    const x4 = p2.b.x, y4 = p2.b.y;

    // Calculate the determinant
    const denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    if (denom === 0) throw new Error("parallel lines"); // Lines are parallel or coincident

    // Intersection coordinates
    const px = ((x1*y2 - y1*x2)*(x3 - x4) - (x1 - x2)*(x3*y4 - y3*x4)) / denom;
    const py = ((x1*y2 - y1*x2)*(y3 - y4) - (y1 - y2)*(x3*y4 - y3*x4)) / denom;

    return { x: px, y: py };
}

// Results are ordered by x values
export function calculatePieceCircleIntersections(piece: LinePiece, circle: Circle, sortDir: 'hor'|'ver'): Point[] {
    const { center, radius } = circle;
    const a = piece.a;
    const b = piece.b;

    // Direction vector of the line segment
    const dx = b.x - a.x;
    const dy = b.y - a.y;

    // Compute coefficients of the quadratic equation
    const fx = a.x - center.x;
    const fy = a.y - center.y;

    const A = dx * dx + dy * dy;
    const B = 2 * (fx * dx + fy * dy);
    const C = fx * fx + fy * fy - radius * radius;

    const discriminant = B * B - 4 * A * C;

    // No intersection
    if (discriminant < 0) {
        return [];
    }

    // One or two intersections
    const results = [];
    const sqrtD = Math.sqrt(discriminant);

    // Compute t values (parametric position on the line)
    const t1 = (-B + sqrtD) / (2 * A);
    const t2 = (-B - sqrtD) / (2 * A);

    // Only count intersections that lie within the segment [0, 1]
    if (t1 >= 0 && t1 <= 1) {
        results.push({ x: a.x + t1 * dx, y: a.y + t1 * dy });
    }
    if (t2 >= 0 && t2 <= 1 && discriminant !== 0) {
        results.push({ x: a.x + t2 * dx, y: a.y + t2 * dy });
    }

    if (sortDir == 'hor') {
        results.sort((a: Point, b: Point) => a.x < b.x ? -1 : 1);
    } else {
        results.sort((a: Point, b: Point) => a.y < b.y ? -1 : 1);
    }

    return results
}

export function calculateDistance(point1: Point, point2: Point) {
    const dx = point2.x - point1.x;
    const dy = point2.y - point1.y;
    return Math.sqrt(dx * dx + dy * dy);
}
