import React, { useContext } from 'react';
import { ThemeContext } from '../../index';
import { InputSwitch } from 'primereact/inputswitch';
import './Settings.css'; // Import the CSS file for styling
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.css';
import 'primeicons/primeicons.css';
import { AdvancedModeContext } from '../../context/AdvancedModeContext';

export const Settings = () => {
    const { theme, setTheme } = useContext(ThemeContext);
    const { advancedMode, setAdvancedMode } = useContext(AdvancedModeContext);

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    return (
        <div className="settings-container">
            <div className="settings-item">
                <label htmlFor="theme-switch" className="theme-label">Dark Mode</label>
                <InputSwitch id="theme-switch" checked={theme === 'dark'} onChange={toggleTheme} />
            </div>
            <div className="settings-item">
                <label htmlFor="advanced-mode-switch" className="advanced-mode-label">Advanced Mode</label>
                <InputSwitch id="advanced-mode-switch" checked={advancedMode} onChange={() => setAdvancedMode(!advancedMode)} />
            </div>
            {/* Add more settings items here */}
        </div>
    );
};