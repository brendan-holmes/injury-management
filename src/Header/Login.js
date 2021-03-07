import Modal from './Modal.js'
import './Login.css';
import api from '../api.js';

const Login = (props) => {
    const handleSubmit = (fieldValues) => {
        if (fieldValues !== undefined && fieldValues.length === 2) {
            api.login(fieldValues[0], fieldValues[1])
                .then(response => response.json())
                .then(data => {
                    if (data.userName) {
                        props.handleSuccessfulLogin(data.userName);
                    } else {
                        console.log(`Unable to login. ${data.message}`);
                    }
                }).catch(error => console.log(error));
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

export default Login;