import bodyImage from './body-front-and-back.png';
import Canvas from './Canvas.js';
import { useState } from "react";
import drawUtils from './drawUtils';

const Diagram = () => {

    const [injuryCoords, setInjuryCoords] = useState([]);

    const drawCanvas = (ctx) => {
        console.log("Draw Canvas");
        drawUtils.clearCanvas(ctx);

        if (undefined !== injuryCoords && injuryCoords.length > 0) {   
            injuryCoords.forEach((injuryCoord) => {
                drawUtils.drawMarker(ctx, injuryCoord);
            });
        }
      }

    return (
        <div className="canvas-stack" id="canvas-stack">
            <div className="canvas-layer">
                <div className="canvas-container">
                    <img src={bodyImage} alt="Diagram of body"/>
                </div>
            </div>
            <div className="canvas-layer">
                <div className="canvas-container">
                    <Canvas draw={drawCanvas} onClick={e => handleCanvasClick(e, injuryCoords, setInjuryCoords)}/>
                </div>
            </div>
            <div id="canvas-spacer" style={{width:'450px', height:'550px'}}></div>
        </div>
        );
    }

    const handleCanvasClick = (e, injuryCoords, setInjuryCoords) => {
        const rect = e.target.getBoundingClientRect();
        const mouseX = e.clientX - rect.left; //x position within the element.
        const mouseY = e.clientY - rect.top;  //y position within the element.
        const userSelectionCoords = {x: mouseX, y: mouseY};
        // console.log(`Mouse clicked. Coords: {x: ${mouseX}, y: ${mouseY}}`);
        const newArray = [...injuryCoords, ...[userSelectionCoords]];
        setInjuryCoords(newArray);
        }

export default Diagram;