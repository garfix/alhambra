This project celebrates the wonderful patterns of the Alhambra. These patterns are calculated with JavaScript and drawn using SVG in the browser. 

This was made possible by the analytical work of Manuel Martinez Vela. See his [YouTube channel](https://www.youtube.com/playlist?list=PLHG5uxhiqH9X3a2ryA4rtvRSP-6zDpsJY)

To draw a pattern we first need to calculate the points of the basic shapes. Then we copy, move and rotate these shapes, color them, and put them in their position. A shape is simply a polygon. Several shapes together form a pattern unit. The pattern itself is formed by filling up a space with pattern units.

## The "design" phase

In this phase we draw line pieces, circles, and squares to help us find coordinates. These elements are also drawn on the canvas so that we can visually inspect the work for errors. We calculate intersections between them to find the points of the basic shapes. The product of this phase is a basic set of named polygons. The coordinates of the points of the shapes lie in the range [0.0 ... 1.0, 0.0 ... 1.0].

## The drawing phase

When drawing the shapes, they are colored, multiplied, rotated, and moved into place.

