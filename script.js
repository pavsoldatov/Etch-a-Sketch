const sketchGrid = document.querySelector(".sketch-grid");
const gridSizeInput = document.querySelector(".settings__grid-size-input");
const toggleGridButton = document.querySelector(
  ".settings__toggle-grid-button"
);
const clearGridBtn = document.querySelector(".settings__clear-grid-button");
const rainbowBtn = {
  element: document.querySelector(".settings__random-mode-button"),
  mode: "randomColor",
};
const eraserBtn = {
  element: document.querySelector(".settings__eraser-button"),
  mode: "eraser",
};
const colorFillBtn = {
  element: document.querySelector(".settings__color-fill-button"),
  mode: "colorFill",
};
let gridSize = +document.querySelector(".settings__grid-size-input").value;
let borderStyle = "1px solid #979797";
let colorInput = document.querySelector(".settings__color");

let matrix2D;

function addCSS(element, style) {
  for (let property in style) element.style[property] = style[property];
}

// utility functions
addCSS(sketchGrid, {
  gridTemplateRows: `repeat(${gridSizeInput.value}, 1fr)`,
  gridTemplateColumns: `repeat(${gridSizeInput.value}, 1fr)`,
});

function rgbToHex(string) {
  let rgb = string.replace("rgb", "").replace("(", "").replace(")", "");
  let rgbArr = rgb.split(", ");
  r = (+rgbArr[0]).toString(16);
  g = (+rgbArr[1]).toString(16);
  b = (+rgbArr[2]).toString(16);

  if (r.length === 1) r = "0" + r;
  if (g.length === 1) g = "0" + g;
  if (b.length === 1) b = "0" + b;

  return "#" + r + g + b;
}

function hexToRGB(hex) {
  let r = parseInt(hex[1] + hex[2], 16);
  let g = parseInt(hex[3] + hex[4], 16);
  let b = parseInt(hex[5] + hex[6], 16);

  return `rgb(${r}, ${g}, ${b})`;
}

// modes and behavior
let isDrawing = false;
let currentMode = "singleColor";
document.body.onmousedown = () => (isDrawing = true);
document.body.onmouseup = () => (isDrawing = false);

// toggle buttons
const toggleObjects = [rainbowBtn, eraserBtn, colorFillBtn];
toggleObjects.forEach(
  (toggleObject) =>
    (toggleObject.element.onclick = (e) => {
      // adding and removing toggles so that only one button can be toggled
      const classes = Array.from(e.target.classList);
      const isToggled = classes.includes("toggled");
      toggleObjects.forEach((obj) => obj.element.classList.remove("toggled"));
      e.target.classList.toggle("toggled", !isToggled);

      // note: classList arrays on top and below differ due to isToggled
      Array.from(e.target.classList).includes("toggled")
        ? (currentMode = toggleObject.mode)
        : (currentMode = "singleColor");
    })
);

function paint(e) {
  console.log(currentMode);

  if (e.type === "mousedown") isDrawing = true;
  else if (e.type === "mouseup") isDrawing = false;
  if (isDrawing === false) return;

  if (currentMode === "singleColor") {
    e.target.style.backgroundColor = `${colorInput.value}`;
  } 
    else if (currentMode === "randomColor") {
    const random = generateRandomHex();
    e.target.style.backgroundColor = random;
    colorInput.setAttribute("value", random);
    colorInput.value = random;
  } 
    else if (currentMode === "eraser") {
    if (e.target.style.backgroundColor === "#fff") return;
    e.target.style.backgroundColor = "#fff";
  } 
    else if (currentMode === "colorFill") {
    const { rowsArr, colsArr } = matrix2D;
    const { x, y } = getCoordinates(e.target);
    const oldColor = e.target.style.backgroundColor;
    const newColor = hexToRGB(colorInput.value);

    floodFill(rowsArr, colsArr, x, y, oldColor, newColor);
  }
}

// finding neighbors for color fill
function findNeighbors(rows, cols, x, y, oldVal, newVal) {
  const possibleNeighbors = [
    { square: rows[y][x + 1], coordsX: x + 1, coordsY: y },
    { square: rows[y][x - 1], coordsX: x - 1, coordsY: y },
    { square: cols[x][y + 1], coordsX: x, coordsY: y + 1 },
    { square: cols[x][y - 1], coordsX: x, coordsY: y - 1 },
  ];

  const neighbors = [];
  for (possibleNeighbor of possibleNeighbors) {
    if (
      possibleNeighbor.square !== undefined &&
      possibleNeighbor.square.style.backgroundColor === oldVal &&
      possibleNeighbor.square.style.backgroundColor !== newVal
    ) {
      neighbors.push(possibleNeighbor);
    }
  }
  return neighbors;
}

function floodFill(rows, cols, x, y, oldColor, newColor) {
  if (newColor === oldColor) return;

  const queue = [];
  const coords = { coordsX: x, coordsY: y };
  queue.push(coords);

  while (queue.length > 0) {
    const { coordsX, coordsY } = queue.shift();
    const possibleNeighbors = findNeighbors(rows, cols, coordsX, coordsY, oldColor, newColor);

    for (const possibleNeighbor of possibleNeighbors) {
      queue.push(possibleNeighbor);
      possibleNeighbor.square.style.backgroundColor = newColor;
    }
  }
}

const generateRandomHex = () =>
  `#${(Math.random() * 0xfffff * 1000000).toString(16).slice(0, 6)}`;

function getCoordinates(target) {
  const gridArr = Array.from(target.parentElement.children);
  const width = 640;
  const height = 640;

  let x =
    gridArr.indexOf(target) %
    Math.floor(height / (height / gridSizeInput.value));
  let y = Math.floor(
    gridArr.indexOf(target) / (width / (width / gridSizeInput.value))
  );
  return { x, y };
}

function populateSquares(parent, size) {
  for (let i = 0; i < size * size; i++) {
    square = document.createElement("div");
    square.style.cssText += "user-select: none; background-color: #fff";
    ["mousedown", "mouseover", "mouseup"].forEach((eventType) =>
      square.addEventListener(eventType, paint)
    );
    parent.append(square);
  }
  drawGrid(parent.children, size);
  matrix2D = generateMatrix(parent.children, size);
}

populateSquares(sketchGrid, gridSize);

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

// update grid size on input change
function updateGrid(e) {
  const gridSizeLabel = document.querySelector(".settings__grid-size-label");
  gridSize = +e.target.value;
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
  e.target.setAttribute("value", `${e.target.value}`);
  colorInput.value = e.target.value;
}
colorInput.addEventListener("input", chooseColor);

function clearGrid() {
  for (let i = 0; i < gridSize * gridSize; i++) {
    sketchGrid.children[i].style.cssText += "background-color: #fff;";
  }
}
clearGridBtn.addEventListener("click", clearGrid);

function generateMatrix(array, size) {
  const colsArr = [];
  const rowsArr = [];

  for (let i = 0; i < array.length; i += size) {
    let arr = [];
    let temp = i;
    let newRowIndex = i + size - 1;
    for (let i = temp; i <= newRowIndex; i++) {
      arr.push(array[i]);
    }
    rowsArr.push(arr);
  }
  for (let i = 0; i < size; i++) {
    let arr = [];
    let temp = i;
    for (let i = temp; i < array.length; i += size) {
      arr.push(array[i]);
    }
    colsArr.push(arr);
  }
  return { rowsArr, colsArr };
}
