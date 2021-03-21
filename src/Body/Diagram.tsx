import bodyImage from '../body-front-and-back.png';
import { Canvas } from './Canvas';
import { drawUtils } from './drawUtils';
import { useState, useEffect } from 'react';
import { Coordinates2D, Injury } from '../types';

interface DiagramProps {
    userSelectionCoords: Coordinates2D | null;
    injuries: Injury[];
    isEditMode: boolean;
    isLoggedIn: boolean;
    setUserSelectionCoords(userSelectionCoords: any): void;
}

export const Diagram = (props: DiagramProps) => {
    const [injuryCoords, setInjuryCoords] = useState([]);

    const drawCanvas = (ctx: CanvasRenderingContext2D) => {
        drawUtils.clearCanvas(ctx);

        if (undefined !== props.injuries) {
            var injuriesToDraw: any[] = injuryCoords;
            if (props.userSelectionCoords !== null) {
                injuriesToDraw = [...injuryCoords, ...[props.userSelectionCoords]];
            }   
            injuriesToDraw.forEach((coord) => {
                drawUtils.drawMarker(ctx, coord);
            });
        };
    };

    const handleCanvasClick = (e: any) => {
        // if is logged in
        if (props.isEditMode && props.isLoggedIn) {   
            const rect = e.target.getBoundingClientRect();
            const mouseX = e.clientX - rect.left; //x position within the element.
            const mouseY = e.clientY - rect.top;  //y position within the element.
            const coords = {x: mouseX, y: mouseY};
            props.setUserSelectionCoords(coords);
        }
    };

    useEffect(() => {setInjuryCoords(props.injuries.map((injury: Injury) => injury.bodyDiagramCoordinates) as any)}, [props.injuries]);
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
                    <Canvas draw={drawCanvas} handleCanvasClick={handleCanvasClick}/>
                </div>
            </div>
            <div id="canvas-spacer" style={{width:'450px', height:'550px'}}></div>
        </div>
        );
    }