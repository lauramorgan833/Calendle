import React, { createContext, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/main.css'; // Import the CSS file
import './styles/borders.css'; // Import the CSS file
import { Game } from './components/Game';
import { Header } from './components/Header/Header';
import { AdvancedModeProvider } from './context/AdvancedModeContext';

export const ThemeContext = createContext();

const Home = () => {
    const date = new Date();
    const [statsDialogVisible, setStatsDialogVisible] = React.useState(false);
    const [theme, setTheme] = useState('light');

    useEffect(() => {
        document.body.className = theme;
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            <Header statsDialogVisible={statsDialogVisible} setStatsDialogVisible={setStatsDialogVisible} />
            <Game key={date.toDateString()} setStatsDialogVisible={setStatsDialogVisible}/>
        </ThemeContext.Provider>
    );
};

const container = document.getElementById('root');
const root = createRoot(container);

const render = (Component) => {
    root.render(
        <React.StrictMode>
            <AdvancedModeProvider>
                <Component />
            </AdvancedModeProvider>
        </React.StrictMode>
    );
};

render(Home);

if (module.hot) {
    module.hot.accept('./components/Game', () => {
        const NextApp = require('./components/Game').default;
        render(NextApp);
    });
}
