# Etch-a-Sketch

A browser version of something between a sketchpad and an Etch-A-Sketch.

## What I learned

Implemented color fill algorithm using a queue:
(a) implemented a function to convert the grid into a 2D matrix with
(b) improved performance (from 8000ms to 80ms) of color fill by:
    - painting the neighboring div immediately after it is pushed to the queue,
    - finding x-y coordinates of a neighbor only once when the colorFill mode is selected and traversing from there (instead of finding x-y coordinates on every loop iteration),
    - converting the grid into a 2D matrix only once when the colorFill mode is selected to update the matrix size and nothing else,
    - minimizing read-writes for CSS computed styles on getCoordinates call,
    - using objects to pass on x-y coordinates to other function calls instead of finding coordinates for each individual neighbor inside the while loop.
Learnt the BEM naming convention.
Drew square borders (toggle grid) without overlapping adjacent borders.