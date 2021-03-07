import Modal from './Modal.js'
import './Login.css';
import api from '../api.js';

const Register = (props) => {

    const handleSubmit = (fieldValues) => {
        if (fieldValues !== undefined && fieldValues.length === 3) {
            api.register(fieldValues[0], fieldValues[1], fieldValues[1])
                .then(response => { if (response.ok) {
                    response.json().then( data => {
                    props.handleSuccessfulRegistration();
                    console.log(data.message);
                    });
                } else {
                    response.json().then( data => {
                        console.log(data.message);
                        alert("Error registering user");
                    })
                }}).catch(error => console.log(error));
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

export default Register;