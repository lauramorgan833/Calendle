// import { DateModel as Date } from '../models/DateModel';
import { findWinner } from '../utils/winLogic';
import React, { useEffect, useState } from 'react';
import { Board } from './Board';
import { Shape } from './Shape';
import { ShapeTransform } from './ShapeTransform';
import { createGrid, ShapeNames, SHAPES } from '../lib/common';
import useCalendleState from '../hooks/useCalendleState';
// import { ThemeContext } from '..';
import { CalendleStatistics } from '../models/CalendleStatistics';
import { upsert_solution } from '../api/mongodb/upsert_solution.js';
export const Game = ({ setStatsDialogVisible }) => {
    const [state, setState] = useCalendleState();
    const { date, board, count, winner, currentShape, placedShapes, remainingShapes } = state;
    const [shapes, setShapes] = useState(SHAPES);
    // const { setTheme } = useContext(ThemeContext);
    const [isLandscape, setIsLandscape] = useState(window.innerWidth > window.innerHeight);

    // create empty objects
    const [statistics] = useState(new CalendleStatistics());

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

    useEffect(() => {
        if (!winner && placedShapes.length > 0) {
            if (findWinner(placedShapes, remainingShapes, board)) {
                onWin();
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [placedShapes]);

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

    const onWin = () => {
        setState(prev => ({ ...prev, winner: true }));
        statistics.onWin(date, count);
        setStatsDialogVisible(true);
        upsert_solution(date.toString(), board);
    };

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

    const onSelectShape = shapeName => {
        if (!winner) {
            setState(prev => ({ ...prev, currentShape: shapeName }));
        }
    };

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
