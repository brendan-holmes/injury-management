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

    // update field states
    const [newSide, setNewSide] = useState(props.injury.side);
    const [newPainLevel, setNewPainLevel] = useState(props.injury.painLevel);
    const [newFirstOccurrence, setNewFirstOccurrence] = useState(props.injury.firstOccurrence);
    const [newFrequencyOfSymptoms, setNewFrequencyOfSymptoms] = useState(props.injury.frequencyOfSymptoms);
    const [newCause, setNewCause] = useState(props.injury.cause);
    const [newTreatment, setNewTreatment] = useState(props.injury.treatment);
    const [newTriggers, setNewTriggers] = useState(props.injury.triggers);
    
    const handleDeleteInjury = () => {
        if (props.injury.injuryId) {
            api.deleteInjury(props.injury.injuryId)
                .then(() => props.reloadInjuries());
        }
    };

    // todo fix - enumerate the states and the other parts
    const handleSubmitUpdateInjury = () => {
        const newInjury: Injury = {
            injuryId: props.injury.injuryId,
            bodyDiagramCoordinates: props.injury.bodyDiagramCoordinates,
            created: props.injury.created,
            bodyPart: props.injury.bodyPart,
            side: newSide,
            painLevel: newPainLevel,
            firstOccurrence: newFirstOccurrence,
            frequencyOfSymptoms: newFrequencyOfSymptoms,
            cause: newCause,
            treatment: newTreatment,
            triggers: newTriggers
        }
        if (props.injury.injuryId) {
            api.updateInjury(props.injury.injuryId, newInjury)
                .then(() => props.reloadInjuries());
        }
        setIsInUpdateMode(false)
    };

    const injuryFields = !isInUpdateMode ? 
        <> 
            <p className='injury-content'><span className='injury-content-label'>Side: </span>{props.injury.side}</p> 
            <p className='injury-content'><span className='injury-content-label'>Pain level: </span>{props.injury.painLevel}</p> 
            <p className='injury-content'><span className='injury-content-label'>First occurred: </span>{props.injury.firstOccurrence}</p> 
            <p className='injury-content'><span className='injury-content-label'>Frequency of symptoms: </span>{props.injury.frequencyOfSymptoms}</p> 
            <p className='injury-content'><span className='injury-content-label'>Cause: </span>{props.injury.cause}</p> 
            <p className='injury-content'><span className='injury-content-label'>Treatment: </span>{props.injury.treatment}</p> 
            <p className='injury-content'><span className='injury-content-label'>Triggers: </span>{props.injury.triggers}</p> 
        </>
        : null;

    const injuryButtons = !isInUpdateMode ? 
        <span>
            <FontAwesomeIcon className={'injury-button'} icon={faTrashAlt} onClick={handleDeleteInjury}/>
            <FontAwesomeIcon className={'injury-button'} icon={faPencilAlt} onClick={() => setIsInUpdateMode(true)}/>
        </span> : null;

    const updateSubForm = isInUpdateMode ?
        <>
            <input className='injury-update-field' value={newSide} onChange={event => setNewSide(event.target.value)}/>
            <input className='injury-update-field' value={newPainLevel} onChange={event => setNewPainLevel(event.target.value)}/>
            <input className='injury-update-field' value={newFirstOccurrence.toString()} onChange={event => setNewFirstOccurrence(new Date(event.target.value))}/>
            <input className='injury-update-field' value={newFrequencyOfSymptoms} onChange={event => setNewFrequencyOfSymptoms(event.target.value)}/>
            <input className='injury-update-field' value={newCause} onChange={event => setNewCause(event.target.value)}/>
            <input className='injury-update-field' value={newTreatment} onChange={event => setNewTreatment(event.target.value)}/>
            <input className='injury-update-field' value={newTriggers} onChange={event => setNewTriggers(event.target.value)}/>
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