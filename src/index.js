import React from 'react';
import { createRoot } from 'react-dom/client';
import './layout/main.css'; // Import the CSS file
import { Game } from './components/Game';
import { Header } from './components/Header';

const Home = () => {
    const date = new Date();

    const [statsDialogVisible, setStatsDialogVisible] = React.useState(false);
    
    return (
        <>
            <Header statsDialogVisible={statsDialogVisible} setStatsDialogVisible={setStatsDialogVisible} />
            <Game key={date.toDateString()} setStatsDialogVisible={setStatsDialogVisible}/>
        </>
    );
};

const container = document.getElementById('root');
const root = createRoot(container);

const render = (Component) => {
    root.render(
        <React.StrictMode>
            <Component />
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
