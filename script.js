const sketchGrid = document.querySelector(".sketch-grid");
const gridSizeInput = document.querySelector(".settings__grid-size-input");
const gridSizeLabel = document.querySelector(".settings__grid-size-label");
const gridSquare = document.createElement("div");
const toggleGridButton = document.querySelector(
  ".settings__toggle-grid-button"
);
let gridSize = Number(
  document.querySelector(".settings__grid-size-input").value
);
let borderStyle = "1px solid #979797";
let userSelectedColor = document.querySelector(".settings__color").value;

function addCSS(element, style) {
  for (let property in style) element.style[property] = style[property];
}

// css for default grid appearing on load
addCSS(sketchGrid, {
  gridTemplateRows: `repeat(${gridSizeInput.value}, 1fr)`,
  gridTemplateColumns: `repeat(${gridSizeInput.value}, 1fr)`,
});

function useSelectedColor(e) {
  e.target.style.backgroundColor = `${userSelectedColor}`;
}

function populateSquares(parent, size) {
  for (let i = 0; i < size * size; i++) {
    square = document.createElement("div");
    parent.append(square);
    square.style.cssText += "user-select: none";
    square.addEventListener("mousedown", useSelectedColor);
  }
  drawGrid(parent.children, size);
}

function drawGrid(array, size) {
  for (let i = 0; i < size * size; i++) {
    array[i].style.cssText += `border-left: ${borderStyle}; border-top: ${borderStyle}`;
  }
  for (let i = 0; i < size * size; i += size) {
    array[i + size - 1].style.cssText += `border-right: ${borderStyle}`;
  }
  for (let i = array.length - 1; i >= array.length - size; i--) {
    array[i].style.cssText += `border-bottom: ${borderStyle}`;
  }
}

populateSquares(sketchGrid, gridSize);

// update grid size on input change
function updateGrid(e) {
  gridSize = Number(e.target.value);
  e.target.setAttribute("value", `${gridSize}`);

  addCSS(sketchGrid, {
    gridTemplateRows: `repeat(${gridSize}, 1fr)`,
    gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
  });

  gridSizeLabel.innerText = `${gridSize} x ${gridSize}`;
  sketchGrid.innerHTML = "";
  populateSquares(sketchGrid, gridSize);
}
gridSizeInput.addEventListener("change", updateGrid);

function toggleGrid(e) {
  e.target.classList.toggle("toggled");
  Array.from(e.target.classList).includes("toggled")
    ? (borderStyle = "none")
    : (borderStyle = "1px solid #979797");

  drawGrid(sketchGrid.children, gridSize);
}
toggleGridButton.addEventListener("click", toggleGrid);

function chooseColor(e) {
  if (!e.target.matches(".settings__color")) return;
  e.target.setAttribute("value", `${e.target.value}`);
  userSelectedColor = e.target.value;
}
document.addEventListener("change", chooseColor);