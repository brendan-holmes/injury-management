import { Modal } from './Modal'
import './Login.css';
import { api } from '../api';

interface LoginProps {
    handleSuccessfulLogin(userName: string): void;
    handleCloseWindow(): void;
    goToRegisterWindow(): void;
}

export const Login = (props: LoginProps) => {
    const handleSubmit = (fieldValues: string[]) => {
        if (fieldValues !== undefined && fieldValues.length === 2) {
            api.login(fieldValues[0], fieldValues[1])
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
    }

    return (    
        < Modal 
            handleCloseWindow={props.handleCloseWindow}
            heading="Login"
            fieldNames = {["Email", "Password"]}
            buttonText="Login 💪"
            bottomText="Create an account"
            onClickBottomText={props.goToRegisterWindow}
            handleSubmit={handleSubmit}
            />
    );
}