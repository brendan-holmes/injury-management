import {InjuryComponent} from './InjuryComponent.js';

export class BodyDiagram {
    constructor(api) {
        this.api = api;
        this.init();
        this.initCanvas();
        this.initForm();
        this.initInjuryList();
        this.injuries = [];
    }

    init() {
        this.loadingElement = document.querySelector('.loading');
        this.injuriesElement = document.querySelector('.injuries');

        this.showLoadingElement = () => this.loadingElement.style.display = '';
        this.hideLoadingElement = () => this.loadingElement.style.display = 'none';
    }

    initForm (){
        this.showForm = () => form.style.display = '';
        this.hideForm = () => form.style.display = 'none';
        this.form = document.querySelector('.injury-form');
        const form = document.querySelector('.injury-form');
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            const formData = new FormData(form);

            // Use logged in name instead of label name
            const name = formData.get('name');
            const content = formData.get('content');
            const bodyDiagramCoordinates = JSON.parse(sessionStorage.getItem('body-diagram-coordinates'));

            const injury = {
                name,
                content,
                bodyDiagramCoordinates
            };

            this.hideForm();
            this.showLoadingElement();

            console.log('Posting injury...');

            this.api.postInjury(injury)
                .then(createdInjury => {
                    console.log(JSON.stringify(createdInjury));
                    form.reset();
                    this.showForm();
                    this.listAllInjuries();
                });
        });
        this.showForm();
    }

    initInjuryList() {
        this.showLoadingElement();
        this.listAllInjuries();
    }

    initCanvas() {
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
        
        this.canvasDrawLayer = document.querySelector("#canvas-draw-layer");
        this.canvasDrawLayer.addEventListener("click", (e) => {
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

        this.canvasDrawCtx = this.canvasDrawLayer.getContext("2d");
    }
    
    drawCircle(centreCoord, radius) {
        const ctx = this.canvasDrawCtx;
        ctx.beginPath();
        ctx.arc(centreCoord.x, centreCoord.y, radius, 0, 2 * Math.PI);
        ctx.fillStyle = "rgba(255,0,0,0.1)";
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'red';
        ctx.fill();
        ctx.stroke();
    }
    
    drawPoint(centreCoord) {
        const ctx = this.canvasDrawCtx;
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
        const ctx = this.canvasDrawCtx;
        ctx.clearRect(0, 0, this.canvasDrawLayer.width, this.canvasDrawLayer.height)
    }

    drawInjuries(injuries) {
        this.clearCanvas(this.canvasDrawLayer)
        injuries.forEach(injury => {
            this.drawMarker(injury.bodyDiagramCoordinates)
        });
    }

    listAllInjuries () {
        this.injuriesElement.innerHTML = '';
        this.api.getAllInjuries()        
            .then(injuries => {
                this.injuries = injuries;
                this.hideLoadingElement();
                injuries.reverse();
                injuries.forEach(injury => {
                    this.injuriesElement.append(new InjuryComponent(injury, this.api, this.listAllInjuries, (injury) => {this.hideMarkerById(injury)}).getElement());
                });
                this.drawInjuries(this.injuries);
            });
    }

    hideMarkerById(injuryId) {
        console.log(`this.injuries in hideMarkerById: ${this.injuries}`);
        if (this.injuries) {
            this.clearCanvas();
            this.injuries = this.injuries.filter(injury => injury.injuryId !== injuryId);
            this.drawInjuries(this.injuries);
        }
    }
}