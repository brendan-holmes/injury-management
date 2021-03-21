interface ModalFormFieldProps {
  type: string;
  fieldName: string;
  value: string;
  index: number;
  handleChange(value: string, index: number): void
}

export const ModalFormField = (props: ModalFormFieldProps) => {
    const type = props.type ? props.type : "text"
    
    return (
      <label>
        {props.fieldName}
        <p className="field-error" style={{color:'red'}}>{props.value === '' ? '!' : ''}</p>
        <input className="u-full-width" type={type} value={props.value} onChange={event => props.handleChange(event.target.value, props.index)} />
      </label>
    )
  }