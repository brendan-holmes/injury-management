import './Modal.css';

interface ModalProps {
    handleCloseWindow(): void;
    children: any;
}

export const Modal = (props: ModalProps) => {
    return (
        <>
            <div className="modal-background" onClick={props.handleCloseWindow}>
            </div>
            <div className="modal">
                {props.children}   
            </div>
        </>
    );
}