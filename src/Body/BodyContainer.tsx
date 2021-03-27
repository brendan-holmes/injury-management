import { Diagram } from './Diagram';
import { InjuryForm } from './InjuryForm';
import { InjuryList } from './InjuryList';
import { useEffect, useState } from 'react';
import { api } from '../api';
import { Injury } from '../types';

interface BodyContainerProps {
    isLoggedIn: boolean;
}

export const BodyContainer = (props: BodyContainerProps) => {
    const [injuries, setInjuries] = useState([]);
    const [userSelectionCoords, setUserSelectionCoords] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);

    const getInjuries = () => {
        if (props.isLoggedIn) {            
            api.getAllInjuries().then((injuries: Injury[]) => 
                {
                    setInjuries(injuries as any);
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
            <InjuryForm isEditMode={isEditMode} setIsEditMode={setIsEditMode} isLoggedIn={props.isLoggedIn} userSelectionCoords={userSelectionCoords} reloadInjuries={getInjuries}/>
            <InjuryList isLoggedIn={props.isLoggedIn} injuries={injuries} reloadInjuries={getInjuries}/>
        </>
    );
}