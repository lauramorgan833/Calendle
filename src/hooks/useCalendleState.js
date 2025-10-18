import { useState, useEffect } from 'react';
import { DateModel } from '../models/DateModel';
import { ShapeNames, createGrid } from '../lib/common';

// Custom hook to manage Calendle game state and localStorage sync

export default function useCalendleState() {

    // Default state shape for a new game
    const defaultGameState = {
        date: DateModel.today(),
        count: 0,
        winner: false,
        board: createGrid(),
        placedShapes: [],
        remainingShapes: [...ShapeNames],
        currentShape: '',
        darkMode: false
    };

    // Load initial state from localStorage or set defaults
    const getInitialGameState = () => {
        const persistedGameState = localStorage.getItem('calendleState');
        if (persistedGameState) {
            try {
                return JSON.parse(persistedGameState);
            } catch (e) {
                // Fallback to default if corrupted
                return { ...defaultGameState };
            }
        }
        // Default state shape
        return { ...defaultGameState };
    };

    // Main game state and setter
    const [gameState, setGameState] = useState(() => getInitialGameState());

    // Sync game state to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('calendleState', JSON.stringify(gameState));
    }, [gameState]);

    // Reset state for a new day if the saved date is not today
    useEffect(() => {
        const today = DateModel.today().toString();
        if (gameState.date !== today) {
            setGameState(prev => ({
                ...prev,
                date: today,
                count: 0,
                winner: false,
                board: createGrid(),
                placedShapes: [],
                remainingShapes: [...ShapeNames],
                currentShape: '',
            }));
        }
    }, [gameState.date]);

    return [gameState, setGameState];
}
