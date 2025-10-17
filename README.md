Groups of points: A, B, C
Each group is a 2D of matrix of points, for easier comprehension.

    A B C
    D E F
    G H I

To draw group C, use set A and B

Draw polygons based on the groups of points.

Each coordinate is a combination of 2 numbers, each in the range [0.0, 1.0].

Symmetrieen: 
- rotationeel
- spiegel

Give every coordinate found a distinct label. Shapes (polygons) are formed by making a list of labels.

Lines may be drawn on top of polygons, possibly overlapping them.

Draw each shape and line-piece only once. Then use symmetry to draw the others.

Question: is it possible to draw a line piece without borders at the end pieces?

Steps

1. pick a minimal set of polygons and line pieces that contains no inner symmetry (basic set)
2. draw the basic set
3. creates symmetries of the basic set to draw the rest

From the basic set, determine for each point how it is calculated.

Based on https://www.youtube.com/watch?v=dxYAKI028YI&list=PLHG5uxhiqH9X3a2ryA4rtvRSP-6zDpsJY&index=1
