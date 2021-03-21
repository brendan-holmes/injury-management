import { MouseEventHandler } from 'react';
import './addButton.css';

interface AddButtonProps {
    size: number;
    handleOnClick: MouseEventHandler<HTMLDivElement>;
}

export const AddButton = (props: AddButtonProps) => {
    const d = props.size;
    const lw = 2;
    const r = d/2;

    return (
        <div className="circle" onClick={props.handleOnClick}>
            <svg className="circle-icon" viewBox={`0 0 ${d} ${d}`} width={`${d}`} height={`${d}`}>
                <line x1={`${lw}`} x2={`${d-lw}`} y1={`${r}`} y2={`${r}`} stroke-width={`${lw}`} stroke-linecap="round"/>
                <line x1={`${r}`} x2={`${r}`} y1={`${lw}`} y2={`${d-lw}`} stroke-width={`${lw}`} stroke-linecap="round"/>
            </svg>
        </div>
    );
}