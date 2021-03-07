import './Modal.css';
import ModalForm from './ModalForm.js'

const Modal = (props) => {
    return (
        <>
            <div className="modal-background" onClick={props.handleCloseWindow}>
            </div>
            <div className="modal">
                <span className="close-button" onClick={props.handleCloseWindow}>&times;</span>
                <h2>{props.heading}</h2>
                <ModalForm 
                    fieldNames={props.fieldNames} 
                    buttonText={props.buttonText} 
                    handleSubmit={props.handleSubmit}
                    />
                
                <p className="bottom-text" onClick={props.onClickBottomText}>{props.bottomText}</p>              
            </div>
        </>
    );
}



export default Modal;