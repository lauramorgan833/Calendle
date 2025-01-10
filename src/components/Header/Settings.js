import React, { useContext } from 'react';
import { ThemeContext } from '../../index';

export const Settings = () => {
    const { theme, setTheme } = useContext(ThemeContext);

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    return (
        <div>
            <button onClick={toggleTheme}>
                Toggle Theme
            </button>
        </div>
    );
};