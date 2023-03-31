import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// Components
import ProtectedRoute from './components/ProtectedRoute';

import './App.css';

export default function App() {
    const navigate = useNavigate();

    const user = useSelector((state) => state.user);

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
