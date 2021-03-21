import { useState } from 'react';
import './Modal.css';
import { ModalFormField } from './ModalFormField';
import { arrayUtils } from '../arrayUtils';

interface ModalFormProps {
  fieldNames: string[];
  handleSubmit(formValues: string[]): void; 
  buttonText: string;
} 

export const ModalForm = (props: ModalFormProps) => {

  const [formValues, setFormValues] = useState(props.fieldNames.map(() => ''));

  const handleChange = (value: string, index: number) => {
    setFormValues(arrayUtils.replace(formValues, value, index));
  }

  const handleSubmit = (event: any) => {
    if (formValues.some((value: string) => value === '')) {
      alert('One or more fields are empty!');  
    } else {
      props.handleSubmit(formValues);
      event.preventDefault();
    }
  }

  const fields = props.fieldNames.map((fieldName: string, index: number) =>
      <ModalFormField type={fieldName.toUpperCase() === "password".toUpperCase() ? "password" : "text"} key={fieldName} index={index} fieldName={fieldName} value={formValues[index]} handleChange={handleChange} />
  );

  return (
    <form onSubmit={handleSubmit}>
      {fields}
      <button>{props.buttonText}</button>
    </form>
  )
}