import './injuryForm.css';
import { AddButton } from './AddButton';
import { api } from '../api';
import { useState } from 'react';
import { Coordinates2D } from '../types';
import { InjuryField } from './InjuryField';

interface InjuryFormProps {
    setIsEditMode(value: boolean): void;
    userSelectionCoords: Coordinates2D | null;
    isLoggedIn: boolean;
    isEditMode: boolean;
    reloadInjuries(): void;
}

export const InjuryForm = (props: InjuryFormProps) => {

    const [formValues, setFormValues] = useState({
        bodyPart: '',
        side: '',
        painLevel: '',
        firstOccurrence: '',
        frequencyOfSymptoms: '',
        cause: '',
        treatment: '',
        triggers: '',
    });

    const handleCloseForm = () => { props.setIsEditMode(false) };
    const handleSubmitForm = (e: any) => { 
        if (formValues.bodyPart !== '' && props.userSelectionCoords !== undefined && props.userSelectionCoords !== null) {
            api.postInjury({
                bodyPart: formValues.bodyPart,
                bodyDiagramCoordinates: props.userSelectionCoords,
                side: formValues.side,
                painLevel: formValues.painLevel,
                firstOccurrence: new Date(formValues.firstOccurrence),
                frequencyOfSymptoms: formValues.frequencyOfSymptoms,
                cause: formValues.cause,
                treatment: formValues.treatment,
                triggers: formValues.triggers,
            }).then( () => props.setIsEditMode(false) );    
        } else {
            alert("Please add body part and location on diagram.")
        }
        props.reloadInjuries();
    };

    const handleAddButtonClicked = () => {
        if (props.isLoggedIn) {   
            props.setIsEditMode(true)
        } else {
            alert("Please log in to add new injury.")
        }
    };

    const addButton = props.isEditMode ? null : <AddButton size={16} handleOnClick={handleAddButtonClicked} />;
    const form = props.isEditMode ? 
        <>
            <form className="injury-form">
                <button className="cancel" onClick={handleCloseForm}>✖</button>

                <label>
                    <span className="field-label">Location</span>
                    <p className={`field-text ${props.userSelectionCoords === null ? "red" : "green"}`}>
                        {props.userSelectionCoords === null ? "Select on diagram" : "Selected"}
                    </p>
                </label>

                <InjuryField value={formValues.bodyPart} handleChange={(newValue) => setFormValues({...formValues, bodyPart: newValue} as any)}>Body part </InjuryField>
                <InjuryField value={formValues.side} handleChange={(newValue) => setFormValues({...formValues, side: newValue} as any)}>Side </InjuryField>
                <InjuryField value={formValues.painLevel} handleChange={(newValue) => setFormValues({...formValues, painLevel: newValue} as any)}>Pain level </InjuryField>
                <InjuryField value={formValues.firstOccurrence.toString()} type="date" handleChange={newValue => setFormValues({...formValues, firstOccurred: newValue.toString()} as any)}>First occurred</InjuryField>
                <InjuryField value={formValues.frequencyOfSymptoms} handleChange={(newValue) => setFormValues({...formValues, frequencyOfSymptoms: newValue} as any)}>Frequency of symptoms </InjuryField>
                <InjuryField value={formValues.cause} handleChange={(newValue) => setFormValues({...formValues, cause: newValue} as any)}>Cause </InjuryField>
                <InjuryField value={formValues.treatment} handleChange={(newValue) => setFormValues({...formValues, treatment: newValue} as any)}>Treatment </InjuryField>
                <InjuryField value={formValues.triggers} handleChange={(newValue) => setFormValues({...formValues, triggers: newValue} as any)}>Triggers </InjuryField>

                <button className="submit" onClick={handleSubmitForm}>Save 💪</button>
            </form>
        </> : null;

    return (
        <div className="injury-form-container">
            {addButton}
            {form}
        </div>
    );
  };