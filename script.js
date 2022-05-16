const gridSizeElement = document.querySelector(".settings__grid-size-input");
const sketchGrid = document.querySelector(".sketch-grid");
const gridSizeInput = document.querySelector(".settings__grid-size-input");
const gridSizeLabel = document.querySelector(".settings__grid-label");
const gridSquare = document.createElement("div");
const defaultGridSize = Number(
  document.querySelector(".settings__grid-size-input").value
);

function addCSS(element, style) {
  for (let property in style) element.style[property] = style[property];
}

// adds css for default grid appearing on load
addCSS(sketchGrid, {
  gridTemplateRows: `repeat(${gridSizeInput.value}, 1fr)`,
  gridTemplateColumns: `repeat(${gridSizeInput.value}, 1fr)`,
});

// populate squares across the grid and draw borders
function generateGrid(grid, square, size) {
  const children = grid.children;
  const borderStyle = "1px solid #555";

  for (let i = 1; i <= size * size; i++) {
    square = document.createElement("div");
    grid.append(square);
    square.style.cssText = `border-left: ${borderStyle}; border-top: ${borderStyle};`;
  } // borders for every last element in a row
  for (let i = 1; i <= size * size; i += size) {
    children[i + size - 2].style.cssText += `border-right: ${borderStyle}`;
  } // borders only for elements in the last row
  for (let i = children.length - 1; i >= children.length - size; i--) {
    children[i].style.cssText += `border-bottom: ${borderStyle}`;
  }
}

// function call so it populates squares into the grid on page load
generateGrid(sketchGrid, gridSquare, defaultGridSize);

// update grid size on input change
gridSizeElement.addEventListener("change", (e) => {
  const gridSizeValue = Number(e.target.value);

  addCSS(sketchGrid, {
    gridTemplateRows: `repeat(${gridSizeValue}, 1fr)`,
    gridTemplateColumns: `repeat(${gridSizeValue}, 1fr)`,
  });

  gridSizeLabel.innerText = `${gridSizeValue} x ${gridSizeValue}`;
  sketchGrid.innerHTML = "";
  generateGrid(sketchGrid, gridSquare, gridSizeValue);
});
