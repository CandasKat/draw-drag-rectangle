let c = document.getElementById('canvas');
let drawButton = document.getElementById('draw');
let dragButton = document.getElementById('drag');
let output = document.getElementById('output');
let deleteButton = document.getElementById('delete');

c.width = window.innerWidth - 200;
c.height = window.innerHeight - 200;
let ctx = c.getContext('2d');
let draw = false;
let mouseX = 0;
let mouseY = 0;
let lastMouseX = 0;
let lastMouseY = 0;
let canvasX = c.offsetLeft;
let canvasY = c.offsetTop;
let rectId = 0;

let drag = false;
let isDrawable = false;
let isDraggable = false;
let isDeleted = false;
let rectangles = [];
let selectedRectangle = null;

ctx.strokeStyle = 'red';
ctx.lineWidth = 2;

let offsetx;
let offsety;

let getOffset = () => {
  let canvasOffsets = c.getBoundingClientRect();
  offsetx = canvasOffsets.left;
  offsety = canvasOffsets.top;
};

window.onscroll = () => {
  getOffset();
};
window.onresize = () => {
  getOffset();
};
c.onresize = () => {
  getOffset();
};

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
  isDeleted = true;
});

let isMouseInRect = function (x, y, shape) {
  let shapeLeft = shape.x;
  let shapeRight = shape.x + shape.width;
  let shapeTop = shape.y;
  let shapeBottom = shape.y + shape.height;

  if (x > shapeLeft && x < shapeRight && y > shapeTop && y < shapeBottom) {
    return true;
  }
  return false;
};

// drawing shapes
c.addEventListener('mousedown', (e) => {
  e.preventDefault();
  mouseX = parseInt(e.pageX - canvasX);
  mouseY = parseInt(e.pageY - canvasY);
  draw = true;
  rectId++;

  if (isDraggable) {
    let index = 0;
    for (let shape of rectangles) {
      if (isMouseInRect(mouseX, mouseY, shape)) {
        currentShapeIndex = index;
        drag = true;
        selectedRectangle = shape;
      }
      index++;
    }
  }
});

c.addEventListener('mouseup', (e) => {
  e.preventDefault();
  draw = false;
  drag = false;
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
  e.preventDefault();
  lastMouseX = parseInt(e.pageX - canvasX);
  lastMouseY = parseInt(e.pageY - canvasY);

  if (draw && isDrawable) {
    drawShape();
  }
  if (isDraggable && drag) {
    dragElements();
  }
  output.innerHTML = `last: ${mouseX}, ${mouseY} <br/>current: ${lastMouseX}, ${mouseY}<br/>isDrawable: ${isDrawable}<br/>isDraggable: ${isDraggable} `;
});

function drawShape() {
  let width = lastMouseX - mouseX;
  let height = lastMouseY - mouseY;
  ctx.fillRect(mouseX, mouseY, width, height);
  ctx.stroke();
}

function dragElements() {
  if (!isDeleted) {
    rectangles.forEach((rectangle) => {
      ctx.fillRect(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
      ctx.stroke();
    });
  }
  let currentShape = rectangles[currentShapeIndex];
  ctx.clearRect(
    currentShape.x,
    currentShape.y,
    currentShape.width,
    currentShape.height
  );
  currentShape.x = lastMouseX;
  currentShape.y = lastMouseY;

  rectangles.forEach((rectangle) => {
    if (rectangle === selectedRectangle) {
      ctx.fillRect(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
      ctx.stroke();
    }
  });
}
