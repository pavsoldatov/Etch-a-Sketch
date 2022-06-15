# Etch-a-Sketch

A browser version of something between a sketchpad and an Etch-A-Sketch.
Desktop only.

## What I learned:

1. Implemented color fill algorithm using a queue:
   - implemented a function to convert the grid into a 2D matrix
   - improved performance (from 5500ms to 80ms) of color fill by:
     - painting the neighboring div immediately after it is pushed to the queue,
     - finding x-y coordinates of a neighbor only once, when the colorFill mode is selected, and traversing from there (instead of finding x-y coordinates of a neighbor on every iteration),
     - converting the grid into a 2D matrix only when the grid size is changed,
     - avoiding read-writes for CSS computed styles on `getCoordinates()` call,
     - using objects to pass x-y coordinates on to other function calls instead of finding coordinates for each individual neighbor shifted from queue.
2. Gained some basic idea of how certain data structures (stack, queue) can be managed in JS (FIFO - `queue.push()`/`queue.shift()` and LIFO - `stack.push()`/`stack.pop()`) to avoid stack overflow when implementing algos such as floodfill.
3. Improved understanding of nested loops and how to traverse 2D arrays.
4. Got some more experience with the BEM naming convention.
