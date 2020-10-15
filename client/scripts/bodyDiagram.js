let imgSrc = "https://i.pinimg.com/originals/d1/57/26/d157261126e10cd2c3e020aad78b6d1e.jpg";
let imgWidth = 618;
let imgHeight = 515;

var canvasElements = document.querySelectorAll("canvas");

canvasElements.forEach(canvasElement => {   
    canvasElement.width  = imgWidth; // html property, so needs to be an int
    canvasElement.height = imgHeight;
});

var canvasSpacer = document.querySelector("#canvas-spacer");
canvasSpacer.style.width  = `${imgWidth}px`; // css property, so needs to be a string
canvasSpacer.style.height = `${imgHeight}px`;

var canvasDiagramLayer = document.querySelector("#canvas-diagram-layer");
var diagramCtx = canvasDiagramLayer.getContext("2d");
drawImage(diagramCtx, imgSrc);

function drawCircle(ctx, centreCoord, radius) {
    ctx.beginPath();
    ctx.arc(centreCoord.x, centreCoord.y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = "rgba(255,0,0,0.1)";
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'red';
    ctx.fill();
    ctx.stroke();
}

// Just a small, filled circle
function drawPoint(ctx, centreCoord) {
    ctx.beginPath();
    let radius = 2;
    ctx.arc(centreCoord.x, centreCoord.y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = 'red';
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'red';
    ctx.fill();
    ctx.stroke();
}

function drawImage(ctx, imgSrc) {
    var logoImg = new Image();
    logoImg.onload = () => ctx.drawImage(logoImg, 0, 0);
    logoImg.src = imgSrc;
}

function clearCanvas(ctx, canvas) {
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height)
}

var canvasDrawLayer = document.querySelector("#canvas-draw-layer");
canvasDrawLayer.addEventListener("click", (e) => {
    var ctx = canvasDrawLayer.getContext("2d");
    clearCanvas(ctx, canvasDrawLayer);

    var rect = e.target.getBoundingClientRect();
    var mouseX = e.clientX - rect.left; //x position within the element.
    var mouseY = e.clientY - rect.top;  //y position within the element.
    console.log(`Mouse clicked. Coords: {x: ${mouseX}, y: ${mouseY}}`);

    drawPoint(ctx, {x: mouseX, y: mouseY}, 2, true)
    drawCircle(ctx, {x: mouseX, y: mouseY}, 20);
});