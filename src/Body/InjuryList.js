import { useEffect } from 'react';
import Injury from './Injury.js';
import './injuryList.css';
import InjuryListMessage from './InjuryListMessage.js';

const InjuryList = (props) => {
    return (
        <div className='injuries'>
            {!props.isLoggedIn ? <InjuryListMessage message={"Please log in to show saved injuries"}/>
                : props.injuries.length < 0 ? <InjuryListMessage message={"You have no saved injuries. Use the button above to get started or go and kick some butt, you machine!"}/>
                    : props.injuries.map(injury => <Injury key={injury.injuryId.toString()} injury={injury} reloadInjuries={props.reloadInjuries}/>)}
        </div>
    );
}

export default InjuryList;

