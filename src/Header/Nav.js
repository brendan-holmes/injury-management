import { useState, useEffect } from 'react';
import api from '../api.js';
import Login from './Login.js';
import Register from './Register.js';
import './nav.css';

const Nav = (props) => {
    
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);

    const handleGoToRegisterWindow = () => { setIsLoggingIn(false); setIsRegistering(true) };
    const handleGoToLoginWindow = () => { setIsLoggingIn(true); setIsRegistering(false) };
    const handleCloseWindow = () => { setIsLoggingIn(false); setIsRegistering(false) };
    const handleSuccessfulLogin = (userName) => { setIsLoggingIn(false); props.setIsLoggedIn(true); props.setUserName(userName); };
    const handleSuccessfulRegistration = () => { console.log("Successfully created new account."); setIsLoggingIn(true); setIsRegistering(false); }
    const handleSuccessfulLogOut = () => { props.setIsLoggedIn(false); props.setUserName(''); };
    
    const loginModal = !props.isLoggedIn && isLoggingIn ? <Login 
                                        handleCloseWindow={handleCloseWindow} 
                                        goToRegisterWindow={handleGoToRegisterWindow} 
                                        handleSuccessfulLogin={handleSuccessfulLogin}
                                        /> : null;
    const registerModal = isRegistering ? <Register 
                                        handleCloseWindow={handleCloseWindow} 
                                        goToLoginWindow={handleGoToLoginWindow}
                                        handleSuccessfulRegistration={handleSuccessfulRegistration}
                                        /> : null;

    const checkLoggedIn = () => {
        api.checkLoggedIn()
            .then(response => { 
                response.json()
                    .then(data => {
                        console.log(data.message);
                        if (data.userName) {
                            handleSuccessfulLogin(data.userName);
                        } else {
                            handleSuccessfulLogOut();
                        }
                    })
            }).catch(error => console.log(error));
    };

    // Only check if user is already logged in on initialization
    useEffect(checkLoggedIn, []);

    return (
        <div className="nav">
            <p className="nav-item title">Aegle: Injury Management</p>
            <p className="nav-item signed-in">{ props.isLoggedIn ? `${props.userName}` : 'Not signed in'}</p> 
            <button className="nav-item" onClick={
                props.isLoggedIn 
                    ? () => api.logOut().then(isSuccess => {isSuccess ? handleSuccessfulLogOut(isSuccess) : alert('Unable to logout at this time.')}) 
                    : () => setIsLoggingIn(true)
                }>
                { props.isLoggedIn ? 'Log out' : 'Login'}
            </button>

            {loginModal}
            {registerModal}
        </div>
    );
}

export default Nav;

