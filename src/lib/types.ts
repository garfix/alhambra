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

// a square on its side
export type Diamond = {
    top: Point;
    right: Point;
    bottom: Point;
    left: Point;
};

export type Polygon = {
    points: Point[];
};

export type CoordinateType = "x" | "y" | "abs";

export type projection = (ordinate: number, type: CoordinateType) => number;
