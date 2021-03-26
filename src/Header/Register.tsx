import { Modal } from './Modal'
import './Login.css';
import { api } from '../api';
import { ModalFormField } from './ModalFormField';
import { useState } from 'react';

interface RegisterProps {
    handleSuccessfulRegistration(): void; 
    handleCloseWindow(): void;
    goToLoginWindow(): void;
}

export const Register = (props: RegisterProps) => {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = () => {
        if (name !== '' && email !== '' && password !== '') {
            api.register(name, email, password)
                .then((response: Response) => { if (response.ok) {
                    response.json().then( (data: any) => {
                    props.handleSuccessfulRegistration();
                    console.log(data.message);
                    });
                } else {
                    response.json().then( (data: any) => {
                        console.log(data.message);
                        alert("Error registering user");
                    })
                }}).catch((error: Error) => console.log(error));
        }
        else {
            console.log("Error submitting register form data.");
        }
    }

    return (   
        <Modal handleCloseWindow={props.handleCloseWindow}>
            <span className="close-button" onClick={props.handleCloseWindow}>&times;</span>
            <h2>Create an account</h2>
            
            <form onSubmit={handleSubmit}>
                <ModalFormField type="text" key={"name"} value={name} handleChange={setName}>Name</ModalFormField>
                <ModalFormField type="text" key={"email"} value={email} handleChange={setEmail}>Email</ModalFormField>
                <ModalFormField type="password" key={"password"} value={password} handleChange={setPassword}>Password</ModalFormField>
                <button>Create Account 💪</button>
            </form>

            <p className="bottom-text" onClick={props.goToLoginWindow}>Already have an account? Login here</p>
        </ Modal >
    );
}