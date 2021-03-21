import { dateUtils } from './dateUtils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt, faPencilAlt } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react';
import './injuryCard.css';
import { api } from '../api';
import { Injury } from '../types';

export interface InjuryCardProps {
    injury: Injury;
    reloadInjuries(): void;
}

export const InjuryCard = (props: InjuryCardProps) => {

    const [isInUpdateMode, setIsInUpdateMode] = useState(false); 
    const [newBodyPart, setNewBodyPart] = useState(props.injury.bodyPart);
    
    const handleDeleteInjury = () => {
        if (props.injury.injuryId) {
            api.deleteInjury(props.injury.injuryId)
                .then(() => props.reloadInjuries());
        }
    };

    const handleSubmitUpdateInjury = () => {
        const newInjury: Injury = {
            injuryId: props.injury.injuryId,
            bodyPart: newBodyPart,
            bodyDiagramCoordinates: props.injury.bodyDiagramCoordinates,
            created: props.injury.created
        }
        if (props.injury.injuryId) {
            api.updateInjury(props.injury.injuryId, newInjury)
                .then(() => props.reloadInjuries());
        }
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
    
    const dateString = () => {
        if (props.injury.created !== undefined) {
            return dateUtils.formatDate(new Date(props.injury.created));
        }

        return '00:00:00'; // default date string when cannot get date.
    }

    return (
        <div className='injury'>
            <>
                <p className='injury-header-item injury-header-bold'>{props.injury.bodyPart}</p>
                <p className='injury-header-item injury-header-grey'> · </p>
                <p className='injury-header-item injury-header-grey'>{dateString()}</p>
            </>
            {injuryFields}
            {injuryButtons}
            {updateSubForm}
        </div>
    );
}

export default InjuryCard;