import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { themeChange } from 'theme-change';

// Theme Icons
import { BsFillSunFill } from 'react-icons/bs';
import { MdDarkMode } from 'react-icons/md';
import { GiCupcake } from 'react-icons/gi';
import { FaLemon } from 'react-icons/fa';
import { GiFlowerEmblem } from 'react-icons/gi';

// Actions
import { setThemeAction } from '../../features/theme/themeSlice';

export default function ThemeSwticher() {
    const dispatch = useDispatch();
    const [theme, setTheme] = useState(window.localStorage.getItem('theme'));

    useEffect(() => {
        themeChange(false);
        dispatch(setThemeAction(theme));
    }, []);

    useEffect(() => {
        themeChange(theme);
        dispatch(setThemeAction(theme));
        themeChange(theme);
    }, [theme]);

    const handleChangeTheme = (e) => {
        const newTheme = e.target.value;
        setTheme(newTheme);
    };

    const themes = {
        lavender: {
            name: 'lavender',
            icon: <GiFlowerEmblem size={26} />,
            displayName: 'Lavender',
        },
        light: {
            name: 'light',
            icon: <BsFillSunFill size={26} />,
            displayName: 'Light',
        },
        dark: {
            name: 'dark',
            icon: <MdDarkMode size={26} />,
            displayName: 'Dark',
        },
        cupcake: {
            name: 'cupcake',
            icon: <GiCupcake size={26} />,
            displayName: 'Cupcake',
        },
        lemonade: {
            name: 'lemonade',
            icon: <FaLemon size={23} />,
            displayName: 'Lemonade',
        },
    };

    return (
        <div className="flex flex-row items-center">
            <div className="p-2">{themes[theme].icon}</div>
            {/* Select theme */}
            <div className="grow">
                <select
                    data-choose-theme
                    className="select select-primary w-full"
                    value={theme}
                    onChange={handleChangeTheme}
                >
                    {Object.keys(themes).map((key) => (
                        <option key={key} value={themes[key].name}>
                            {themes[key].displayName}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}
