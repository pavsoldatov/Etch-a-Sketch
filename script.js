let gridSizeElement = document.querySelector(".settings__grid-size");
let label = document.querySelector(".settings > label");

gridSizeElement.addEventListener("change", (e) => {
  let gridSizeValue = e.target.value;

  addCSS(sketchGrid, {
    gridTemplateRows: `repeat(${gridSizeValue}, 1fr)`,
    gridTemplateColumns: `repeat(${gridSizeValue}, 1fr)`,
  });
  label.innerText = `${gridSizeValue} x ${gridSizeValue}`
  sketchGrid.append(square);

  console.log(gridSizeValue);
});

function addCSS(element, style) {
  for (let property in style) {
    console.log(style);
    element.style[property] = style[property];
  }
}

let square = document.createElement("div");
addCSS(square, {
  border: `1px #222 solid`,
  backgroundColor: `lightblue`,
});

let sketchGrid = document.querySelector(".sketch-grid");
addCSS(sketchGrid, {
  boxShadow: `0 0 8px 8px #9f9f9f`,
  border: `2px red solid`,
  width: "512px",
  height: "512px",
  display: "grid",
});
