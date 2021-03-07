import dateUtils from './dateUtils.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt, faPencilAlt } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react';
import './injury.css';
import api from '../api.js';

const Injury = (props) => {

    const [isInUpdateMode, setIsInUpdateMode] = useState(false); 
    const [newBodyPart, setNewBodyPart] = useState(props.injury.bodyPart);
    
    const handleDeleteInjury = () => {
        api.deleteInjury(props.injury.injuryId)
            .then(() => props.reloadInjuries());
    };

    const handleSubmitUpdateInjury = () => {
        const newInjury = {
            bodyPart: newBodyPart,
            bodyDiagramCoordinates: props.injury.bodyDiagramCoordinates,
            created: props.injury.created
        }
        api.updateInjury(props.injury.injuryId, newInjury)
            .then(() => props.reloadInjuries());
        setIsInUpdateMode(false)
    };

    const injuryFields = !isInUpdateMode ? 
        <>
            <p className='injury-content'>Field Placeholder</p> 
        </>
        : null;

    const injuryButtons = !isInUpdateMode ? 
        <span>
            <FontAwesomeIcon className={'injury-button'} icon={faTrashAlt} onClick={handleDeleteInjury}/>
            <FontAwesomeIcon className={'injury-button'} icon={faPencilAlt} onClick={() => setIsInUpdateMode(true)}/>
        </span> : null;

    const updateSubForm = isInUpdateMode ?
        <>
            <input className='injury-update-field' value={newBodyPart} onChange={event => setNewBodyPart(event.target.value)}/>
            <span>
                <button className='injury-edit-button' onClick={handleSubmitUpdateInjury}>OK</button>
                <button className='injury-edit-button' onClick={() => setIsInUpdateMode(false)}>Cancel</button>
            </span>
        </> : null;

    return (
        <div className='injury'>
            <>
                <p className='injury-header-item injury-header-bold'>{props.injury.bodyPart}</p>
                <p className='injury-header-item injury-header-grey'> · </p>
                <p className='injury-header-item injury-header-grey'>{dateUtils.formatDate(new Date(props.injury.created))}</p>
            </>
            {injuryFields}
            {injuryButtons}
            {updateSubForm}
        </div>
    );
}

export default Injury;