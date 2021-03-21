import { Modal } from './Modal'
import './Login.css';
import { api } from '../api';

interface RegisterProps {
    handleSuccessfulRegistration(): void; 
    handleCloseWindow(): void;
    goToLoginWindow(): void;
}

export const Register = (props: RegisterProps) => {

    const handleSubmit = (fieldValues: string[]) => {
        if (fieldValues !== undefined && fieldValues.length === 3) {
            api.register(fieldValues[0], fieldValues[1], fieldValues[1])
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
        <Modal 
            handleCloseWindow={props.handleCloseWindow}
            heading="Create an account"
            fieldNames = {["Name", "Email", "Password"]}
            buttonText="Create Account 💪"
            bottomText="Already have an account? Login here"
            onClickBottomText={props.goToLoginWindow}
            handleSubmit={handleSubmit}
            />
    );
}