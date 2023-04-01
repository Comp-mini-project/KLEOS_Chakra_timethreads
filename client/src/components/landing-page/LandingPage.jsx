import React, { useState, useEffect } from 'react';
import { themeChange } from 'theme-change';
import { useSelector } from 'react-redux';
import GoogleOneTapLogin from '../../features/user/GoogleOneTapLogin';
import Loading from '../../features/loading/Loading';
import ThemeSwitcher from '../utillity/ThemeSwitcher';

const themeImages = {
    lavender: '../../src/assets/circuit-primary.svg',
    light: '../../src/assets/circuit-light.svg',
    dark: '../../src/assets/circuit-dark.svg',
    cupcake: '../../src/assets/circuit-cupcake.svg',
    lemonade: '../../src/assets/circuit-lemonade.svg',
};

export default function LandingPage() {
    const theme = useSelector((state) => state.theme.value);

    useEffect(() => {
        themeChange(false);
    }, []);

    const [backgroundImage, setBackgroundImage] = useState(
        'url(../../src/assets/circuit-primary.svg)'
    );

    useEffect(() => {
        setBackgroundImage(`url(${themeImages[theme]})`);
    }, [theme]);

    return (
        <div
            className="flex flex-col"
            style={{
                height: '100vh',
                width: '100vw',
                background: `linear-gradient(to right, rgba(0 0 0 / 0.7) 0%, rgba(0 0 0 / 0.2)  100%), url(${themeImages[theme]}) no-repeat center center / cover fixed `,
            }}
        >
            <Loading />
            {/* Navbar */}
            <div className="navbar">
                <div className="flex-1">
                    <a className="btn btn-ghost normal-case text-xl text-primary">
                        TimeThreads
                    </a>
                </div>
                <div className="flex-none">
                    <ThemeSwitcher />
                </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-row justify-center items-center h-full">
                <div className="flex-1 justify-center items-center">
                    {/* Logo */}
                </div>
                <div className="flex-1 flex flex-col justify-center items-center">
                    <div className="m-4 text-center">
                        <h1 className="text-6xl font-bold">TimeThreads</h1>
                        <h2 className="text-2xl font-bold text-accent">
                            Much more than Google Calendar
                        </h2>
                    </div>
                    <div>
                        <GoogleOneTapLogin />
                    </div>
                </div>
            </div>
        </div>
    );
}
