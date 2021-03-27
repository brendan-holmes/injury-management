import { InjuryCard } from './InjuryCard';
import './injuryList.css';
import { InjuryListMessage } from './InjuryListMessage';
import { Injury } from '../types';

interface InjuryListProps {
    isLoggedIn: boolean;
    injuries: Injury[];
    reloadInjuries(): void;
}

export const InjuryList = (props: InjuryListProps) => {
    const injuries = props.injuries.reverse();

    return (
        <div className='injuries'>
            {!props.isLoggedIn ? <InjuryListMessage message={"Please log in to show saved injuries"}/>
                : injuries.length < 0 ? <InjuryListMessage message={"You have no saved injuries. Use the button above to get started or go and kick some butt, you machine!"}/>
                    : injuries.map((injury: Injury, index: number) => <InjuryCard key={injury.injuryId ? injury.injuryId.toString() : index} injury={injury} reloadInjuries={props.reloadInjuries}/>)}
        </div>
    );
}
