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
const colorFillBtn = document.querySelector(".settings__color-fill-button");
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

let buttons = [rainbowModeBtn, eraserBtn, colorFillBtn];
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
colorFillBtn.onclick = (e) => {
  colorFillBtn.classList.toggle("toggled");
  Array.from(e.target.classList).includes("toggled")
    ? (currentMode = "colorFill")
    : (currentMode = "singleColor");
};

function paint(e) {
  console.log(currentMode);

  if (e.type === "mousedown") isDrawing = true;
  else if (e.type === "mouseup") isDrawing = false;
  if (isDrawing === false) return;

  if (currentMode === "singleColor") {
    e.target.style.backgroundColor = `${colorInput.value}`;
  } else if (currentMode === "randomColor") {
    e.target.style.backgroundColor = `${generateRandomHex()}`;
  } else if (currentMode === "eraser") {
    e.target.style.backgroundColor = "#fff";
  } else if (currentMode === "colorFill") {
    let squares = e.target.parentElement.children;
    let startEl = e.target;
    let oldColor = e.target.style.backgroundColor;
    let fillColor = hexToRGB(colorInput.value);
    floodFIll(e.target, oldColor, fillColor);
  }
}

function floodFIll(square, oldColor, fillColor) {
  hexToRGB(fillColor);

  if (oldColor !== fillColor) {
    getCoordinates(square);
    square.style.backgroundColor = fillColor;
  }
}

function getCoordinates(target) {
  let gridArr = Array.from(target.parentElement.children);
  let width = parseInt(window.getComputedStyle(sketchGrid).width);
  let height = parseInt(window.getComputedStyle(sketchGrid).height);

  let x = Math.floor(
    gridArr.indexOf(target) /
    (width / (width / gridSizeInput.value))
  );
  let y =
    gridArr.indexOf(target) %
    Math.floor(height / (height / gridSizeInput.value));
  console.log([x,y])

  /*Here lies the body of a function I had spent days to make work properly.
    It died as it lived: (1)returning correct results, and (2)overflowing my stack.
    Days without sleep, spent in agony from infinite loops,
    eventually gave rise to this power-hungry piece of code...
    Arrays were pushed inside arrays, nested loops were running relentlessly,
    until one day Stackoverflow unveiled to me the magic of math, which I
    happily stole. Rest in peace my arrays - memories of this ham-fisted attempt
    will stay with me for a long while.

    On a serious note, below is the function I might be using to check
    whether the x-y coordinates are returning the correct result.
    Although inefficient, it is reliable.
    It is far too resource-intensive due to many loops and
    array manipulations on every call.
    For this reason, I resorted to the code above, which I kindly borrowed from
    Stackoverflow.

    let colsArr = [];
    let rowsArr = [];
    
    for (let i = 0; i < gridArr.length; i += gridSize) {
      let array = [];
      let temp = i;
      let newRowIndex = i + gridSize - 1;
      for (let i = temp; i <= newRowIndex; i++) {
        array.push(gridArr[i]);
      }
      rowsArr.push(array);
    }

    for (let i = 0; i < gridSize; i++) {
      let array = [];
      let temp = i;
      for (let i = temp; i < gridArr.length; i += gridSize) {
        array.push(gridArr[i]);
      }
      colsArr.push(array);
    }

    let x = rowsArr.findIndex((arr) => arr.includes(target));
    let y = colsArr.findIndex((arr) => arr.includes(target));
  */
}

function rgbToHex(string) {
  let rgb = string.replace("rgb", "").replace("(", "").replace(")", "");
  let rgbArr = rgb.split(", ");
  r = (+rgbArr[0]).toString(16);
  g = (+rgbArr[1]).toString(16);
  b = (+rgbArr[2]).toString(16);

  if (r.length == 1) r = "0" + r;
  if (g.length == 1) g = "0" + g;
  if (b.length == 1) b = "0" + b;

  return "#" + r + g + b;
}

function hexToRGB(hex) {
  let r = parseInt(hex[1] + hex[2], 16);
  let g = parseInt(hex[3] + hex[4], 16);
  let b = parseInt(hex[5] + hex[6], 16);

  return `rgb(${r}, ${g}, ${b})`;
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
}

populateSquares(sketchGrid, gridSize);

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

// update grid size on input change
function updateGrid(e) {
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
  console.log(e);
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

const generateRandomHex = () =>
  `#${(Math.random() * 0xfffff * 1000000).toString(16).slice(0, 6)}`;
