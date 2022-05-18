const sketchGrid = document.querySelector(".sketch-grid");
const gridSizeInput = document.querySelector(".settings__grid-size-input");
const gridSizeLabel = document.querySelector(".settings__grid-label");
const gridSquare = document.createElement("div");
const toggleGridButton = document.querySelector(
  ".settings__toggle-grid-button"
);
let gridSize = Number(
  document.querySelector(".settings__grid-size-input").value
);
let borderStyle = "1px solid #555";


function addCSS(element, style) {
  for (let property in style) element.style[property] = style[property];
}

// add css for default grid appearing on load
addCSS(sketchGrid, {
  gridTemplateRows: `repeat(${gridSizeInput.value}, 1fr)`,
  gridTemplateColumns: `repeat(${gridSizeInput.value}, 1fr)`,
});

// populate squares into the grid on page load
generateGrid(sketchGrid, gridSize);


function generateGrid(parent, size) {
  const children = parent.children;
  for (let i = 0; i < size * size; i++) {
    square = document.createElement("div");
    parent.append(square);
  }
  for (let i = 0; i < size * size; i++) {
    children[i].style.cssText += `border-left: ${borderStyle}; border-top: ${borderStyle};`;
  }
  for (let i = 1; i <= size * size; i += size) {
    children[i + size - 2].style.cssText += `border-right: ${borderStyle}`;
  }
  for (let i = children.length - 1; i >= children.length - size; i--) {
    children[i].style.cssText += `border-bottom: ${borderStyle}`;
  }
}

// update grid size on input change
gridSizeInput.addEventListener("change", updateGrid);

function updateGrid (e) {
  gridSize = Number(e.target.value);
  e.target.setAttribute("value", `${gridSize}`)

  addCSS(sketchGrid, {
    gridTemplateRows: `repeat(${gridSize}, 1fr)`,
    gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
  });

  gridSizeLabel.innerText = `${gridSize} x ${gridSize}`;
  sketchGrid.innerHTML = "";
  generateGrid(sketchGrid, gridSize);
}


toggleGridButton.addEventListener("click", toggleGrid);

function toggleGrid(e) {
  e.target.classList.toggle("toggled");
  size = gridSize
  const children = sketchGrid.children;
  if (Array.from(e.target.classList).includes("toggled")) {
    borderStyle = "none";
  } else {
    borderStyle = "1px solid #555";
  }
  for (let i = 0; i < size * size; i++) {
    children[i].style.cssText += `border-left: ${borderStyle}; border-top: ${borderStyle};`;
  }
  for (let i = 1; i <= size * size; i += size) {
    children[i + size - 2].style.cssText += `border-right: ${borderStyle}`;
  }
  for (let i = children.length - 1; i >= children.length - size; i--) {
    children[i].style.cssText += `border-bottom: ${borderStyle}`;
  }
}