let imgSrc = "https://i.pinimg.com/originals/d1/57/26/d157261126e10cd2c3e020aad78b6d1e.jpg";
let imgWidth = 618;
let imgHeight = 515;

var canvas = document.getElementById("canvas1");
canvas.width  = imgWidth;
canvas.height = imgHeight;

var ctx = canvas.getContext("2d");
drawImage(ctx, imgSrc);

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
    logoImg.onload = () => ctx.drawImage(logoImg, 10, 10);
    logoImg.src = imgSrc;
}

canvas.addEventListener("click", (e) => {
    var ctx = canvas.getContext("2d");
    var rect = e.target.getBoundingClientRect();
    var mouseX = e.clientX - rect.left; //x position within the element.
    var mouseY = e.clientY - rect.top;  //y position within the element.
    console.log(`Mouse clicked. Coords: {x: ${mouseX}, y: ${mouseY}}`);

    drawPoint(ctx, {x: mouseX, y: mouseY}, 2, true)
    drawCircle(ctx, {x: mouseX, y: mouseY}, 20);
});