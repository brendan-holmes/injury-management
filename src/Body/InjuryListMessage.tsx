interface InjuryListMessageProps {
    message: string;
}

export const InjuryListMessage = (props: InjuryListMessageProps) => {
    return (
        <div>
            <p>
                {props.message}
            </p>
        </div>
    );
};