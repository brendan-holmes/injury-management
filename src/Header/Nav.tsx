import { useState, useEffect } from 'react';
import { api } from '../api';
import { Login } from './Login';
import { Register } from './Register';
import './nav.css';
import { Modal } from './Modal';

interface NavProps {
    setIsLoggedIn(isLoggedIn: boolean): void;
    setUserName(userName: string): void;
    isLoggedIn: boolean;
    userName: string;
}

export const Nav = (props: NavProps) => {
    
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);

    const handleGoToRegisterWindow = () => { setIsLoggingIn(false); setIsRegistering(true) };
    const handleGoToLoginWindow = () => { setIsLoggingIn(true); setIsRegistering(false) };
    const handleCloseWindow = () => { setIsLoggingIn(false); setIsRegistering(false) };
    const handleSuccessfulLogin = (userName: string) => { setIsLoggingIn(false); props.setIsLoggedIn(true); props.setUserName(userName); };
    const handleSuccessfulRegistration = () => { console.log("Successfully created new account."); setIsLoggingIn(true); setIsRegistering(false); }
    const handleSuccessfulLogOut = () => { props.setIsLoggedIn(false); props.setUserName(''); };
    const showLogin = !props.isLoggedIn && isLoggingIn;
    const showRegistration = isRegistering;
    const handleLogInOutButtonClick = () => {
        if (props.isLoggedIn) {
            api.logOut()
                .then((response: Response) => {response.ok ? handleSuccessfulLogOut() : console.log('Unable to logout at this time.')})
                .catch((error: Error) => {console.log(`Unable to logout at this time. ${error}`);
                });
        } else {
            setIsLoggingIn(true);
        }};

    const loginRegistrationWindow = 
        showLogin ? <Login handleCloseWindow={handleCloseWindow} goToRegisterWindow={handleGoToRegisterWindow} handleSuccessfulLogin={handleSuccessfulLogin}/> 
        : showRegistration ? <Register handleCloseWindow={handleCloseWindow} goToLoginWindow={handleGoToLoginWindow} handleSuccessfulRegistration={handleSuccessfulRegistration} /> 
            : null;

    const checkLoggedIn = () => {
        api.checkLoggedIn()
            .then((response: Response) => { 
                response.json()
                    .then((data: any) => {
                        console.log(data.message);
                        if (data.userName) {
                            handleSuccessfulLogin(data.userName);
                        } else {
                            handleSuccessfulLogOut();
                        }
                    })
            }).catch((error: Error) => console.log(error));
    };

    // Only check if user is already logged in on initialization
    useEffect(checkLoggedIn, []);

    return (
        <div className="nav">
            <p className="nav-item title">Aegle: Injury Management</p>
            
            <p className="nav-item signed-in">{ props.isLoggedIn ? `${props.userName}` : 'Not signed in'}</p> 
            
            <button className="nav-item" onClick={handleLogInOutButtonClick}>
                { props.isLoggedIn ? 'Log out' : 'Login'}
            </button>

            {loginRegistrationWindow}
        </div>
    );
}
