export type Point = {
    x: number;
    y: number;
};

export type LinePiece = {
    a: Point;
    b: Point;
};

export type Circle = {
    center: Point;
    radius: number;
};

export type Square = {
    top: LinePiece;
    right: LinePiece;
    bottom: LinePiece;
    left: LinePiece;
};

// a square on its side
export type Diamond = {
    top: Point;
    right: Point;
    bottom: Point;
    left: Point;
    topLeft: LinePiece;
    topRight: LinePiece;
    bottomLeft: LinePiece;
    bottomRight: LinePiece;
};

export type Polygon = {
    points: Point[];
};

export type CoordinateType = "x" | "y" | "abs";

/** Project the coordinates that are in the [0..1] range, or in the [-1..1] range to pixels on the canvas */
export type projection = (ordinate: number, type: CoordinateType) => number;
