const sketchGrid = document.querySelector(".sketch-grid");
const gridSizeInput = document.querySelector(".settings__grid-size-input");
const gridSizeLabel = document.querySelector(".settings__grid-size-label");
const gridSquare = document.createElement("div");
const toggleGridButton = document.querySelector(
  ".settings__toggle-grid-button"
);
const clearGridBtn = document.querySelector(".settings__clear-grid-button");
const rainbowModeBtn = document.querySelector(".settings__random-mode-button");
const eraserBtn = document.querySelector(".settings__eraser-button");
let gridSize = Number(
  document.querySelector(".settings__grid-size-input").value
);
let borderStyle = "1px solid #979797";
let colorInput = document.querySelector(".settings__color");

function addCSS(element, style) {
  for (let property in style) element.style[property] = style[property];
}

// css for default grid appearing on load
addCSS(sketchGrid, {
  gridTemplateRows: `repeat(${gridSizeInput.value}, 1fr)`,
  gridTemplateColumns: `repeat(${gridSizeInput.value}, 1fr)`,
});

let x = 0;
let y = 0;
let isDrawing = false;
let currentMode = "singleColor";
document.body.onmousedown = () => (isDrawing = true);
document.body.onmouseup = () => (isDrawing = false);
rainbowModeBtn.onclick = (e) => {
  rainbowModeBtn.classList.toggle("toggled");
  Array.from(e.target.classList).includes("toggled")
    ? (currentMode = "randomColor")
    : (currentMode = "singleColor");
};
eraserBtn.onclick = (e) => {
  eraserBtn.classList.toggle("toggled");
  Array.from(e.target.classList).includes("toggled")
    ? (currentMode = "eraser")
    : (currentMode = "singleColor");
};

function paint(e) {
  // console.log(e.offsetX, e.offsetY);
  console.log(currentMode);

  if (e.type === "mousedown") isDrawing = true;
  if (e.type === "mouseup") isDrawing = false;
  if (isDrawing === false) return;
  if (currentMode === "singleColor") {
    e.target.style.backgroundColor = `${colorInput.value}`;
  }
  if (currentMode === "randomColor") {
    e.target.style.backgroundColor = `${generateRandomHex()}`;
  }
  if (currentMode === "eraser") {
    e.target.style.backgroundColor = "#fff";
  }
}

function populateSquares(parent, size) {
  for (let i = 0; i < size * size; i++) {
    square = document.createElement("div");
    square.style.cssText += "user-select: none";
    ["mousedown", "mouseover", "mouseup"].forEach((eventType) =>
      square.addEventListener(eventType, paint)
    );
    parent.append(square);
  }
  drawGrid(parent.children, size);
}

function drawGrid(array, size) {
  for (let i = 0; i < size * size; i++) {
    array[
      i
    ].style.cssText += `border-left: ${borderStyle}; border-top: ${borderStyle}`;
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
  console.log(e);
  e.target.setAttribute("value", `${e.target.value}`);
  colorInput.value = e.target.value;
}
colorInput.addEventListener("input", chooseColor);

function clearGrid() {
  for (let i = 0; i < gridSize * gridSize; i++) {
    sketchGrid.children[i].style.cssText += `background: none;`;
  }
}
clearGridBtn.addEventListener("click", clearGrid);

const generateRandomHex = () =>
  `#${(Math.random() * 0xfffff * 1000000).toString(16).slice(0, 6)}`;
