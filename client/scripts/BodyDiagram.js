import {InjuryComponent} from './InjuryComponent.js';

export class BodyDiagram {
    userSelectionCoords;
    currentMarkers;
    isInAddNewMode = false;

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
        this.form = document.querySelector('.injury-form');
        this.addNewInjuryButton = document.querySelector('#add-new-injury-button');
        this.cancelButton = document.querySelector('#form-cancel-button');

        this.showForm = () => this.form.style.display = '';
        this.hideForm = () => this.form.style.display = 'none';
        this.showAddNewInjuryButton = () => this.addNewInjuryButton.style.display = '';
        this.hideAddNewInjuryButton = () => this.addNewInjuryButton.style.display = 'none';
        
        this.form.addEventListener('submit', (event) => {
            event.preventDefault();
            const formData = new FormData(this.form);

            // Use logged in name instead of label name
            const name = formData.get('name');
            const content = formData.get('content');

            if (this.userSelectionCoords != null) {
                const injury = {
                    name: name,
                    content: content,
                    bodyDiagramCoordinates: this.userSelectionCoords
                };
    
                this.hideForm();
                this.showLoadingElement();
    
                this.api.postInjury(injury)
                    .then(createdInjury => {
                        console.log(JSON.stringify(createdInjury));
                        this.form.reset();
                        this.isInAddNewMode = false;
                        this.showAddNewInjuryButton();
                        this.listAllInjuries();
                    });
            }
            else {
                // todo: alert user that they need to select a point on the diagram
                console.log("Please associate the injury with a location on the diagram!");
            }
        });

        this.addNewInjuryButton.addEventListener('click', (event) => {
            this.isInAddNewMode = true;
            this.hideAddNewInjuryButton();
            this.showForm();
        });

        this.cancelButton.addEventListener('click', (event) => {
            this.isInAddNewMode = false;
            this.showAddNewInjuryButton();
            this.hideForm();

            // redraw
            this.listAllInjuries();
            this.form.reset();
            this.userSelectionCoords = null;
        })
        
        this.hideForm();
        this.showAddNewInjuryButton();
    }

    initInjuryList() {
        this.showLoadingElement();
        this.listAllInjuries();
    }

    initCanvas() {
        const imgSrc = '../resources/body-front-and-back.png';
        const imgWidth = 450;
        const imgHeight = 550;
        
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
            if (this.isInAddNewMode) {
                const rect = e.target.getBoundingClientRect();
                const mouseX = e.clientX - rect.left; //x position within the element.
                const mouseY = e.clientY - rect.top;  //y position within the element.
                this.userSelectionCoords = {x: mouseX, y: mouseY};
                console.log(`Mouse clicked. Coords: {x: ${mouseX}, y: ${mouseY}}`);    
                this.addMarker(this.userSelectionCoords);
            }        
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
        if (coords !== null) {
            this.drawPoint(coords, 2, true)
            this.drawCircle(coords, 20)    
        }
        else {
            console.log("[DEBUG] Cannot draw marker, coordinates are null.");
        }
    }
   
    clearCanvas(canvas) {
        const ctx = this.canvasDrawCtx;
        ctx.clearRect(0, 0, this.canvasDrawLayer.width, this.canvasDrawLayer.height)
    }

    drawInjuries(injuries) {
        this.clearCanvas(this.canvasDrawLayer);
        this.currentMarkers = [];
        injuries.forEach(injury => {
            this.currentMarkers.push(injury.bodyDiagramCoordinates);
        });

        this.currentMarkers.forEach(marker => {
            this.drawMarker(marker);
        });
    }

    addMarker(coords) {
        this.clearCanvas(this.canvasDrawLayer);

        if (this.currentMarkers === null) {
            this.currentMarkers = [];
        }
        this.currentMarkers.forEach(marker => {
            this.drawMarker(marker);
        });

        this.drawMarker(coords);
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