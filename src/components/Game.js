




import useCalendleStatistics from '../hooks/useCalendleStatistics'; // Statistics hook
// Main game component for Calendle
import { findWinner } from '../utils/winLogic'; // Utility to check for a win
import React, { useEffect, useState } from 'react'; // React core
import { Board } from './Board'; // Board UI
import { Shape } from './Shape'; // Shape UI
import { ShapeTransform } from './ShapeTransform'; // Shape rotation UI
import { createGrid, ShapeNames, SHAPES } from '../lib/common'; // Game constants/utilities
import useCalendleState from '../hooks/useCalendleState'; // Custom hook for state/localStorage
import { upsert_solution } from '../api/mongodb/upsert_solution.js'; // DB sync
// Game component manages all game state and UI
export const Game = ({ setStatsDialogVisible }) => {
    // Main game state from custom hook
    const [state, setState] = useCalendleState();
    const { date, board, count, winner, currentShape, placedShapes, remainingShapes } = state;
    // Shapes state for UI
    const [shapes, setShapes] = useState(SHAPES);
    // Track orientation for responsive UI
    const [isLandscape, setIsLandscape] = useState(window.innerWidth > window.innerHeight);

    // Track the last rendered date to detect date changes
    const [lastRenderedDate, setLastRenderedDate] = useState(date.toString());

    // Reset the board if the date has changed (e.g., after midnight)
    useEffect(() => {
        const currentDateString = date.toString();
        if (lastRenderedDate !== currentDateString) {
            setState(prev => ({
                ...prev,
                board: createGrid(),
                placedShapes: [],
                remainingShapes: [...ShapeNames],
                winner: false,
                currentShape: '',
                count: 0
            }));
            setLastRenderedDate(currentDateString);
        }
    }, [date, lastRenderedDate, setState]);

    // Statistics hook
    const { incrementGamesPlayed, incrementGamesWon } = useCalendleStatistics();

    // Listen for window resize to update orientation
    useEffect(() => {
        const handleResize = () => {
            setIsLandscape(window.innerWidth > window.innerHeight);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // State and localStorage logic is now handled by useCalendleState

    // Check for win after every shape placement
    useEffect(() => {
        if (!winner && placedShapes.length > 0) {
            if (findWinner(placedShapes, remainingShapes, board)) {
                onWin();
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [placedShapes]);

    // Reset the game state to initial values
    const reset = () => {
        if (!winner) {
            setState(prev => ({
                ...prev,
                board: createGrid(),
                placedShapes: [],
                remainingShapes: [...ShapeNames],
                winner: false,
                currentShape: '',
                count: 0
            }));
        }
    };

    // Handle win: update state, stats, and DB
    const onWin = () => {
        setState(prev => ({ ...prev, winner: true }));
        // Update statistics for a win
        incrementGamesPlayed();
        incrementGamesWon(date.toString(), count, count); // winDate, winValue, score
        setStatsDialogVisible(true);
        upsert_solution(date.toString(), board);
    };

    // Place a shape on the board and update state
    const placeShape = (startX, startY, shapeMatrix) => {
        if (!winner && currentShape) {
            setState(prev => {
                // Deep copy the board
                const boardCopy = prev.board.map(row => row.map(cell => [...cell]));
                // Apply shapeMatrix to boardCopy
                shapeMatrix.forEach((row, x) => {
                    row.forEach((val, y) => {
                        if (val) {
                            const newX = startX + x;
                            const newY = startY + y;
                            if (boardCopy[newX] && boardCopy[newX][newY]) {
                                boardCopy[newX][newY][1] = val;
                            }
                        }
                    });
                });
                const newPlacedShapes = [...prev.placedShapes, prev.currentShape];
                const newRemainingShapes = prev.remainingShapes.filter(val => val !== prev.currentShape);
                return {
                    ...prev,
                    board: boardCopy,
                    placedShapes: newPlacedShapes,
                    remainingShapes: newRemainingShapes,
                    count: prev.count + 1,
                    currentShape: ''
                };
            });
        }
    };

    // Select a shape for placement
    const onSelectShape = shapeName => {
        if (!winner) {
            setState(prev => ({ ...prev, currentShape: shapeName }));
        }
    };

    // Remove a shape from the board and update state
    const removeShape = shapeName => {
        if (!winner) {
            setState(prev => {
                const placedShapes_copy = prev.placedShapes.filter(val => val !== shapeName);
                const remainingShapes_copy = [...prev.remainingShapes, shapeName];
                // Remove shape from board
                let boardCopy = prev.board.map(row => row.map(cell => [...cell]));
                boardCopy = boardCopy.map(row =>
                    row.map(cell => cell[1] === shapeName ? [cell[0], 0] : cell)
                );
                // If all shapes are removed, reset the board
                const shouldResetBoard = placedShapes_copy.length === 0;
                return {
                    ...prev,
                    placedShapes: placedShapes_copy,
                    remainingShapes: remainingShapes_copy,
                    currentShape: '',
                    board: shouldResetBoard ? createGrid() : boardCopy
                };
            });
        }
    };


    return (
        <div id={'game'} className='game'>
            <h1 className={winner && 'winner'}>{count} moves</h1>
            <div className="boardContainer">
                <div className="board">
                    <Board
                        date={date}
                        board={board}
                        currentShape={currentShape}
                        onPlaceShape={placeShape}
                        shapes={shapes}
                        onRemoveShape={removeShape}
                        winner={winner}
                    />
                </div>
                <div className="rightContentContainer">
                    <div className="buttonContainer">
                        <div>
                            <button className={"resetButton"} onClick={reset}>Reset</button>
                        </div>
                        <ShapeTransform
                            currentShape={currentShape}
                            shapes={shapes}
                            setShapes={setShapes}
                            winner={winner}
                        />
                    </div>
                    {isLandscape && <div className="shapesContainer">
                        {remainingShapes.map(name => {
                            return (
                                <Shape
                                    key={name}
                                    shapes={shapes}
                                    shapeName={name}
                                    setCurrentShape={onSelectShape}
                                    currentShape={currentShape}
                                />
                            );
                        })}
                    </div>
                    }
                </div>
            </div>
            <ul id="movies"></ul>

            {!isLandscape && <div className="shapesContainer">
                {remainingShapes.map(name => {
                    return (
                        <Shape
                            key={name}
                            shapes={shapes}
                            shapeName={name}
                            setCurrentShape={onSelectShape}
                            currentShape={currentShape}
                        />
                    );
                })}
            </div>
            }
        </div>
    );
};
