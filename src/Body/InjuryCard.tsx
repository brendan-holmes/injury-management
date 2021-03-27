import { dateUtils } from './dateUtils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt, faPencilAlt } from '@fortawesome/free-solid-svg-icons'
import React, { useState } from 'react';
import './injuryCard.css';
import { api } from '../api';
import { Injury } from '../types';
import { InjuryField } from './InjuryField';

export interface InjuryCardProps {
    injury: Injury;
    reloadInjuries(): void;
}

export const InjuryCard = (props: InjuryCardProps) => {

    const [isInUpdateMode, setIsInUpdateMode] = useState(false); 

    // update field states
    const [newFormValues, setNewFormValues] = useState({
        side: props.injury.side,
        painLevel: props.injury.painLevel,
        firstOccurred: props.injury.firstOccurrence,
        frequencyOfSymptoms: props.injury.frequencyOfSymptoms,
        cause: props.injury.cause,
        treatment: props.injury.treatment,
        triggers: props.injury.triggers,
    });
    
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
            side: newFormValues.side,
            painLevel: newFormValues.painLevel,
            firstOccurrence: new Date(newFormValues.firstOccurred),
            frequencyOfSymptoms: newFormValues.frequencyOfSymptoms,
            cause: newFormValues.cause,
            treatment: newFormValues.treatment,
            triggers: newFormValues.triggers
        }
        if (props.injury.injuryId) {
            api.updateInjury(props.injury.injuryId, newInjury)
                .then(() => props.reloadInjuries());
        }
        setIsInUpdateMode(false)
    };

    const injuryFields = !isInUpdateMode ? 
        <> 
            <p className='injury-content'><span className='injury-content-label'>Side </span>{props.injury.side}</p> 
            <p className='injury-content'><span className='injury-content-label'>Pain level </span>{props.injury.painLevel}</p> 
            <p className='injury-content'><span className='injury-content-label'>First occurred </span>{props.injury.firstOccurrence}</p> 
            <p className='injury-content'><span className='injury-content-label'>Frequency of symptoms </span>{props.injury.frequencyOfSymptoms}</p> 
            <p className='injury-content'><span className='injury-content-label'>Cause </span>{props.injury.cause}</p> 
            <p className='injury-content'><span className='injury-content-label'>Treatment </span>{props.injury.treatment}</p> 
            <p className='injury-content'><span className='injury-content-label'>Triggers </span>{props.injury.triggers}</p> 
        </>
        : null;

    const injuryButtons = !isInUpdateMode ? 
        <span>
            <FontAwesomeIcon className={'injury-button'} icon={faTrashAlt} onClick={handleDeleteInjury}/>
            <FontAwesomeIcon className={'injury-button'} icon={faPencilAlt} onClick={() => setIsInUpdateMode(true)}/>
        </span> : null;

    const updateSubForm = isInUpdateMode ?
        <>
            <InjuryField value={newFormValues.side} handleChange={newValue => setNewFormValues({...newFormValues, side: newValue} as any)}>Side</InjuryField>
            <InjuryField value={newFormValues.painLevel} handleChange={newValue => setNewFormValues({...newFormValues, painLevel: newValue} as any)}>Pain level</InjuryField>
            <InjuryField value={newFormValues.firstOccurred.toString()} type="date" handleChange={newValue => setNewFormValues({...newFormValues, firstOccurred: newValue.toString()} as any)}>First occurred</InjuryField>
            <InjuryField value={newFormValues.frequencyOfSymptoms} handleChange={newValue => setNewFormValues({...newFormValues, frequencyOfSymptoms: newValue} as any)}>Frequency of symptoms</InjuryField>
            <InjuryField value={newFormValues.cause} handleChange={newValue => setNewFormValues({...newFormValues, cause: newValue} as any)}>Cause</InjuryField>
            <InjuryField value={newFormValues.treatment} handleChange={newValue => setNewFormValues({...newFormValues, treatment: newValue} as any)}>Treatment</InjuryField>
            <InjuryField value={newFormValues.triggers} handleChange={newValue => setNewFormValues({...newFormValues, triggers: newValue} as any)}>Triggers</InjuryField>
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