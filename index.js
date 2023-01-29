let c = document.getElementById('canvas');
let drawButton = document.getElementById('draw');
let dragButton = document.getElementById('drag');
let output = document.getElementById('output');
let deleteButton = document.getElementById('delete');

c.width = window.innerWidth - 50;
c.height = window.innerHeight - 120;
let ctx = c.getContext('2d');
let draw = false;
let mouseX = 0;
let mouseY = 0;
let lastMouseX = 0;
let lastMouseY = 0;
let canvasX = c.offsetLeft;
let canvasY = c.offsetTop;
let dataUrl = null;
let rectId = 0;

let isDrawable = false;
let isDraggable = false;
let rectangles = [];
let selectedRectangle = null;

ctx.clearRect(0, 0, c.width, c.height);
ctx.strokeStyle = 'black';
ctx.lineWidth = 2;

drawButton.addEventListener('click', (e) => {
  isDrawable = true;
  isDraggable = false;
});

dragButton.addEventListener('click', (e) => {
  isDraggable = true;
  isDrawable = false;
});

deleteButton.addEventListener('click', (e) => {
  ctx.clearRect(0, 0, c.width, c.height);
  isDraggable = false;
  isDrawable = false;
});

// drawing shapes
c.addEventListener('mousedown', (e) => {
  mouseX = parseInt(e.pageX - canvasX);
  mouseY = parseInt(e.pageY - canvasY);
  ctx.beginPath();
  draw = true;

  rectId++;
});

c.addEventListener('mouseup', (e) => {
  draw = false;
  if (isDrawable) {
    let width = lastMouseX - mouseX;
    let height = lastMouseY - mouseY;
    let id = rectangles.length + 1;
    let rectangle = { id, x: mouseX, y: mouseY, width, height };
    rectangles.push(rectangle);
    selectedRectangle = rectangle;
  }
});

c.addEventListener('mousemove', (e) => {
  lastMouseX = parseInt(e.pageX - canvasX);
  lastMouseY = parseInt(e.pageY - canvasY);
  if (draw && isDrawable) {
    let width = lastMouseX - mouseX;
    let height = lastMouseY - mouseY;
    ctx.rect(mouseX, mouseY, width, height);
    ctx.fill();
    ctx.stroke();
  }
  output.innerHTML = `last: ${mouseX}, ${mouseY} <br/>current: ${lastMouseX}, ${lastMouseY}<br/>isDrawable: ${isDrawable}<br/>isDraggable: ${isDraggable} `;
});
