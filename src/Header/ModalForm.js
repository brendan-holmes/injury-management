import React, { useState } from 'react';
import './Modal.css';
import ModalFormField from './ModalFormField';
import arrayUtils from '../arrayUtils.js';

const LoginForm = (props) => {

  const [formValues, setFormValues] = useState(props.fieldNames.map(() => ''));

  const handleChange = (value, index) => {
    setFormValues(arrayUtils.replace(formValues, value, index));
  }

  const handleSubmit = (event) => {
    if (formValues.some(value => value === '')) {
      alert('One or more fields are empty!');  
    } else {
      props.handleSubmit(formValues);
      event.preventDefault();
    }
  }

  const fields = props.fieldNames.map((fieldName, index) =>
      <ModalFormField type={fieldName.toUpperCase() === "password".toUpperCase() ? "password" : "text"} key={fieldName} index={index} fieldName={fieldName} value={formValues[index]} handleChange={handleChange} />
  );

  return (
    <form onSubmit={handleSubmit}>
      {fields}
      <button>{props.buttonText}</button>
    </form>
  )
}

export default LoginForm;