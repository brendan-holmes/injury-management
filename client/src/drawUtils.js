const drawUtils = {
    addMarker: (ctx, coords) => {
        drawUtils.clearCanvas(ctx);
    
        // if (this.currentMarkers === null) {
        //     this.currentMarkers = [];
        // }
        // this.currentMarkers.forEach(marker => {
        //     this.drawMarker(marker);
        // });
    
        drawUtils.drawMarker(ctx, coords);
    },

    clearCanvas: (ctx) => {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    },

    drawMarker: (ctx, coords) => {
        drawUtils.drawPoint(ctx, coords);
        drawUtils.drawCircle(ctx, coords);
    },

    drawCircle: (ctx, centreCoord, radius=20) => {
        ctx.beginPath();
        ctx.arc(centreCoord.x, centreCoord.y, radius, 0, 2 * Math.PI);
        ctx.fillStyle = "rgba(255,0,0,0.1)";
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'red';
        ctx.fill();
        ctx.stroke();
    },
    
    drawPoint: (ctx, centreCoord) => {
        ctx.beginPath();
        let radius = 2;
        ctx.arc(centreCoord.x, centreCoord.y, radius, 0, 2 * Math.PI);
        ctx.fillStyle = 'red';
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'red';
        ctx.fill();
        ctx.stroke();
    }
}

export default drawUtils;