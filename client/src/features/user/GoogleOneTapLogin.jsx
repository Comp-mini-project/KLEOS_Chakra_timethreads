import React, { useRef, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';

// Icons
import { FaGoogle } from 'react-icons/fa';

// Redux
import { startLoading, stopLoading } from '../loading/loadingSlice';
import { signIn } from './userSlice';

const GoogleOneTapLogin = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const googleButton = useRef(null);

    const [displayType, setDisplayType] = useState('flex');
    const [gBtnDisplay, setGBtnDisplay] = useState('none');

    const handleResponse = async (response) => {
        dispatch(startLoading());
        const token = response.credential;
        const {
            sub: uid,
            email,
            name: displayName,
            picture: photoUrl,
        } = jwtDecode(token);
        const config = {
            headers: {
                'Content-type': 'application/json',
            },
        };

        await axios
            .post(
                `${import.meta.env.VITE_SERVER_URL}/api/user/googleSignUp`,
                {
                    uid,
                    email,
                    displayName,
                    photoUrl,
                },
                config
            )
            .then((result) => {
                const user = result.data.result;
                dispatch(signIn(user));
                navigate('/home');
            })
            .catch((err) => {
                console.log(err);
                alert('Something went wrong, please try again later.');
            });
        dispatch(stopLoading());
    };

    const handleGoogleLogIn = () => {
        try {
            window.google.accounts.id.initialize({
                client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
                ux_mode: 'popup',
                callback: handleResponse,
            });
            window.google.accounts.id.renderButton(googleButton.current, {
                theme: 'outline',
                size: 'large',
                width: 280,
                text: 'continue_with',
            });
            window.google.accounts.id.prompt((notification) => {
                if (notification.isNotDisplayed()) {
                    setDisplayType('none');
                    setGBtnDisplay('flex');
                    alert('Please allow Third Party Cookies');
                }
                if (
                    notification.isSkippedMoment() ||
                    notification.isDismissedMoment()
                ) {
                    setDisplayType('none');
                    setGBtnDisplay('flex');
                }
            });
        } catch (error) {
            alert('Log In Failed. Please try again');
        }
    };

    return (
        <React.Fragment>
            <button
                className="btn btn-secondary rounded-full"
                style={{
                    display: displayType,
                    width: 'fit-content',
                }}
                onClick={handleGoogleLogIn}
            >
                <FaGoogle className="mr-2" />
                Login with Google
            </button>
            <div style={{ display: gBtnDisplay }} ref={googleButton}></div>
        </React.Fragment>
    );
};

export default GoogleOneTapLogin;
