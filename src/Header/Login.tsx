import './Login.css';
import { api } from '../api';
import { ModalFormField } from './ModalFormField';
import React, { useState } from 'react';
import { Modal } from './Modal';

interface LoginProps {
    handleSuccessfulLogin(userName: string): void;
    handleCloseWindow(): void;
    goToRegisterWindow(): void;
}

export const Login = (props: LoginProps) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = () => {
        if (email !== '' && password !== '') {
            api.login(email, password)
                .then((response: Response) => response.json())
                .then((data: any) => {
                    if (data.userName) {
                        props.handleSuccessfulLogin(data.userName);
                    } else {
                        console.log(`Unable to login. ${data.message}`);
                    }
                }).catch((error: Error) => console.log(error));
        }
        else {
            console.log("Error submitting login form data.");
        }
    };

    return (   
        <Modal handleCloseWindow={props.handleCloseWindow}>
            <span className="close-button" onClick={props.handleCloseWindow}>&times;</span>
            <h2>Login</h2>
            
            <form onSubmit={handleSubmit}>
                <ModalFormField type="text" key={"email"} value={email} handleChange={setEmail}>Email</ModalFormField>
                <ModalFormField type="password" key={"password"} value={password} handleChange={setPassword}>Password</ModalFormField>
                <button>Login 💪</button>
            </form>

            <p className="bottom-text" onClick={props.goToRegisterWindow}>Create an account</p>    
        </ Modal >
    );
}