interface InjuryFieldProps {
    value: string;
    children: any;
    handleChange(value: string): void;
    type?: string;
}

export const InjuryField = (props: InjuryFieldProps) => {
  return (
    <label>
        <span className="field-label">{props.children}</span>
        <input value={props.value} type={props.type ? props.type : 'text'} onChange={event => props.handleChange(event.target.value)}/>
    </label>
  );
}