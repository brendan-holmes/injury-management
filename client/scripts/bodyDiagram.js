export class BodyDiagram {
    constructor() {
        const imgSrc = "https://i.pinimg.com/originals/d1/57/26/d157261126e10cd2c3e020aad78b6d1e.jpg";
        const imgWidth = 618;
        const imgHeight = 515;
        
        const canvasElements = document.querySelectorAll("canvas");
        
        canvasElements.forEach(canvasElement => {   
            canvasElement.width  = imgWidth; // html property, so needs to be an int
            canvasElement.height = imgHeight;
        });
        
        const canvasSpacer = document.querySelector("#canvas-spacer");
        canvasSpacer.style.width  = `${imgWidth}px`; // css property, so needs to be a string
        canvasSpacer.style.height = `${imgHeight}px`;
        
        this.drawImage(imgSrc);
        
        const canvasDrawLayer = document.querySelector("#canvas-draw-layer");
        canvasDrawLayer.addEventListener("click", (e) => {
            //this.clearCanvas(canvasDrawLayer);
        
            const rect = e.target.getBoundingClientRect();
            const mouseX = e.clientX - rect.left; //x position within the element.
            const mouseY = e.clientY - rect.top;  //y position within the element.
            const coords = {x: mouseX, y: mouseY};
            console.log(`Mouse clicked. Coords: {x: ${mouseX}, y: ${mouseY}}`);
            console.log(JSON.stringify(coords));
            sessionStorage.setItem('body-diagram-coordinates', JSON.stringify(coords));
        
            this.drawMarker(coords);
        });
    }
    
    drawCircle(centreCoord, radius) {
        const canvasDrawLayer = document.querySelector("#canvas-draw-layer");
        const ctx = canvasDrawLayer.getContext("2d");
        ctx.beginPath();
        ctx.arc(centreCoord.x, centreCoord.y, radius, 0, 2 * Math.PI);
        ctx.fillStyle = "rgba(255,0,0,0.1)";
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'red';
        ctx.fill();
        ctx.stroke();
    }
    
    // Just a small, filled circle
    drawPoint(centreCoord) {
        const canvasDrawLayer = document.querySelector("#canvas-draw-layer");
        const ctx = canvasDrawLayer.getContext("2d");
        ctx.beginPath();
        let radius = 2;
        ctx.arc(centreCoord.x, centreCoord.y, radius, 0, 2 * Math.PI);
        ctx.fillStyle = 'red';
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'red';
        ctx.fill();
        ctx.stroke();
    }
    
    drawImage(imgSrc) {
        const canvasDiagramLayer = document.querySelector("#canvas-diagram-layer");
        const ctx = canvasDiagramLayer.getContext("2d");
        var logoImg = new Image();
        logoImg.onload = () => ctx.drawImage(logoImg, 0, 0);
        logoImg.src = imgSrc;
    }

    drawMarker(coords) {
        this.drawPoint(coords, 2, true)
        this.drawCircle(coords, 20)
    }
    
    clearCanvas(canvas) {
        const canvasDrawLayer = document.querySelector("#canvas-draw-layer");
        const ctx = canvasDrawLayer.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
}