import React, { useState, useEffect } from 'react';
import { themeChange } from 'theme-change';
import GoogleOneTapLogin from '../../features/user/GoogleOneTapLogin';
import Loading from '../../features/loading/Loading';
import ThemeSwticher from '../ThemeSwticher';

export default function LandingPage() {
    useEffect(() => {
        themeChange(false);
    }, []);

    return (
        <div
            className="flex flex-col"
            style={{
                height: '100vh',
                width: '100vw',
                background:
                    'linear-gradient(116.82deg, rgba(2, 136, 209, 0.75) 0%, rgba(25, 118, 210, 0.75) 100%), url(../../src/assets/circuit-primary.svg)',
            }}
        >
            <Loading />
            {/* Navbar */}
            <div className="navbar">
                <div className="flex-1">
                    <a className="btn btn-ghost normal-case text-xl">
                        TimeThreads
                    </a>
                </div>
                <div className="flex-none">
                    <ThemeSwticher />
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col justify-center items-center">
                <GoogleOneTapLogin />
            </div>
        </div>
    );
}
