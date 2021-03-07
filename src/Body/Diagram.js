import bodyImage from '../body-front-and-back.png';
import Canvas from './Canvas.js';
import drawUtils from './drawUtils.js';
import { useState, useEffect } from 'react';

const Diagram = (props) => {
    const [injuryCoords, setInjuryCoords] = useState([]);

    const drawCanvas = (ctx) => {
        drawUtils.clearCanvas(ctx);

        if (undefined !== props.injuries) {
            var injuriesToDraw = injuryCoords;
            if (props.userSelectionCoords !== null) {
                injuriesToDraw = [...injuryCoords, ...[props.userSelectionCoords]];
            }   
            injuriesToDraw.forEach((coord) => {
                drawUtils.drawMarker(ctx, coord);
            });
        };
    };

    const handleCanvasClick = (e) => {
        // if is logged in
        if (props.isEditMode && props.isLoggedIn) {   
            const rect = e.target.getBoundingClientRect();
            const mouseX = e.clientX - rect.left; //x position within the element.
            const mouseY = e.clientY - rect.top;  //y position within the element.
            const coords = {x: mouseX, y: mouseY};
            props.setUserSelectionCoords(coords);
        }
    };

    useEffect(() => {setInjuryCoords(props.injuries.map(injury => injury.bodyDiagramCoordinates))}, [props.injuries]);
    useEffect(() => {if (!props.isLoggedIn || !props.isEditMode) props.setUserSelectionCoords(null)}, [props.isLoggedIn, props.isEditMode]);

    return (
        <div className="canvas-stack" id="canvas-stack">
            <div className="canvas-layer">
                <div className="canvas-container">
                    <img src={bodyImage} alt="Diagram of body"/>
                </div>
            </div>
            <div className="canvas-layer">
                <div className="canvas-container">
                    <Canvas draw={drawCanvas} onClick={e => handleCanvasClick(e)}/>
                </div>
            </div>
            <div id="canvas-spacer" style={{width:'450px', height:'550px'}}></div>
        </div>
        );
    }

    

export default Diagram;