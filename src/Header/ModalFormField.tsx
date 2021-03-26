interface ModalFormFieldProps {
  type: string;
  value: string;
  handleChange(value: string): void;
  children: any;
}

export const ModalFormField = (props: ModalFormFieldProps) => {
    const type = props.type ? props.type : "text"
    
    return (
      <label>
        {props.children}
        <p className="field-error" style={{color:'red'}}>{props.value === '' ? '!' : ''}</p>
        <input className="u-full-width" type={type} value={props.value} onChange={event => props.handleChange(event.target.value)} />
      </label>
    )
  }