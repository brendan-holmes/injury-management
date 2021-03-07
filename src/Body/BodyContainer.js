import Diagram from './Diagram.js';
import InjuryForm from './InjuryForm.js';
import InjuryList from './InjuryList.js';
import { useEffect, useState } from 'react';
import api from '../api.js';

const BodyContainer = (props) => {
    const [injuries, setInjuries] = useState([]);
    const [userSelectionCoords, setUserSelectionCoords] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);

    const getInjuries = () => {
        if (props.isLoggedIn) {            
            api.getAllInjuries().then(injuries => 
                {
                    setInjuries(injuries);
                }
            );
        } else {
            setInjuries([]);
        }
    }

    useEffect(getInjuries, [props.isLoggedIn]);

    return (
        <>
            <Diagram isEditMode={isEditMode} injuries={injuries} isLoggedIn={props.isLoggedIn} userSelectionCoords={userSelectionCoords} setUserSelectionCoords={setUserSelectionCoords}/>
            <InjuryForm isEditMode={isEditMode} setIsEditMode={setIsEditMode} isLoggedIn={props.isLoggedIn} userSelectionCoords={userSelectionCoords}/>
            <InjuryList isLoggedIn={props.isLoggedIn} injuries={injuries} reloadInjuries={getInjuries}/>
        </>
    );
}

export default BodyContainer;