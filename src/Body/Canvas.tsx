import { useCanvas } from './useCanvas';
import './canvas.css';

interface CanvasProps {
  draw(ctx: CanvasRenderingContext2D): void; 
  handleCanvasClick(event: Event): void;
}

export const Canvas = (props: CanvasProps) => {  

  const canvasRef = useCanvas(props.draw);

  return <canvas ref={canvasRef} onClick={(e: any) => props.handleCanvasClick(e)}/>
}