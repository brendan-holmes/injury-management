const ModalFormField = (props) => {
    const type = props.type ? props.type : "text"
    
    return (
      <label>
        {props.fieldName}
        <p className="field-error" style={{color:'red'}}>{props.value === '' ? '!' : ''}</p>
        <input className="u-full-width" type={type} value={props.value} onChange={event => props.handleChange(event.target.value, props.index)} />
      </label>
    )
  }

export default ModalFormField;