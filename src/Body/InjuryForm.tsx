import './injuryForm.css';
import { AddButton } from './AddButton';
import { api } from '../api';
import { useState } from 'react';
import { arrayUtils } from '../arrayUtils';
import { Coordinates2D } from '../types';

interface InjuryFormProps {
    setIsEditMode(value: boolean): void;
    userSelectionCoords: Coordinates2D | null;
    isLoggedIn: boolean;
    isEditMode: boolean;
}

export const InjuryForm = (props: InjuryFormProps) => {

    const fieldNames = [
        "Body Part",
        "Side",
        "Pain level",
        "First occured", 
        "Triggers",
        "Frequency",
        "Affected muscle(s)",
        "Affected bone(s)",
        "Physio exercises"]

    const [formValues, setFormValues] = useState(fieldNames.map(() => ''));

    const handleChange = (value: string, index: number) => {
        setFormValues(arrayUtils.replace(formValues, value, index));
      }

    const handleCloseForm = () => { props.setIsEditMode(false) };
    const handleSubmitForm = () => { 
        if (formValues[0] !== '' && undefined !== props.userSelectionCoords && props.userSelectionCoords !== null) {
            api.postInjury({
                bodyPart: formValues[0], //bodyPart,
                bodyDiagramCoordinates: props.userSelectionCoords,
            }).then( () => props.setIsEditMode(false) );    
        } else {
            alert("Please add description and location on diagram.")
        }
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

                {fieldNames.map((fieldName, index) => 
                    <label key={fieldName}>
                        <span className="field-label">{fieldName}</span>
                        <input onChange={event => handleChange(event.target.value, index)}/>
                    </label>
                )}
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