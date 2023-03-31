import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';

// Actions
import { signIn, signOut } from './features/user/userSlice';

// Routes
import LandingPage from './components/landing-page/LandingPage';
import Home from './components/home/Home';

// Components
import ProtectedRoute from './components/ProtectedRoute';

import './App.css';

export default function App() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const user = useSelector((state) => state.user);

    useEffect(() => {
        const token = window.localStorage.getItem('timelineApp');
        if (token) {
            const decodedToken = jwtDecode(token);

            // Add token as a property to the decoded token
            decodedToken.token = token;

            // Check if token is expired
            if (decodedToken.exp * 1000 < Date.now()) {
                dispatch(signOut());
                navigate('/');
            } else {
                dispatch(signIn(decodedToken));
                navigate('/home');
            }
        }
    }, []);

    return (
        <React.Fragment>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route
                    path="/home"
                    element={
                        <ProtectedRoute>
                            <Home />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </React.Fragment>
    );
}
