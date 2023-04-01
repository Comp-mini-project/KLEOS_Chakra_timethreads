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
                background: backgroundImage,
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
                    <ThemeSwitcher />
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col justify-center items-center">
                <GoogleOneTapLogin />
            </div>
        </div>
    );
}
