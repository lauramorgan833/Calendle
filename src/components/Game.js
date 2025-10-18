import { DateModel as Date } from '../models/DateModel';
import { findWinner } from '../utils/winLogic';
import React, { useEffect, useState, useContext } from 'react';
import { Board } from './Board';
import { Shape } from './Shape';
import { ShapeTransform } from './ShapeTransform';
import { createGrid, ShapeNames, SHAPES } from '../lib/common';
import { ThemeContext } from '..';
import { CalendleStatistics } from '../models/CalendleStatistics';
import { CalendleState } from '../models/CalendleState';
import { upsert_solution } from '../api/mongodb/upsert_solution.js';


export const Game = ({ setStatsDialogVisible }) => {
    const [date, setDate] = useState(Date.today());
    const [board, setBoard] = useState([]);
    const [count, setCount] = useState(0);
    const [winner, setWinner] = useState(false);
    const [currentShape, setCurrentShape] = useState('');
    const [placedShapes, setPlacedShapes] = useState([]);
    const [shapes, setShapes] = useState(SHAPES);
    const [remainingShapes, setRemainingShapes] = useState(ShapeNames);
    const { setTheme } = useContext(ThemeContext);
    const [isLandscape, setIsLandscape] = useState(window.innerWidth > window.innerHeight);

    // create empty objects
    const [statistics] = useState(new CalendleStatistics());
    const [gameState] = useState(new CalendleState());

    useEffect(() => {
        const handleResize = () => {
            setIsLandscape(window.innerWidth > window.innerHeight);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        const today = Date.today();
        setDate(today);

        // initialize from LocalStorage
        statistics.initialize();
        gameState.initialize();

        if (gameState.DarkMode) {
            setTheme(gameState.DarkMode);
        }

        // if new day or empty board - reset game board and game state
        if (!Date.today().equals(gameState.Date)
            || (gameState.Count === 0 && gameState.Board.length === 0 && gameState.PlacedShapes.length === 0)) {
            setBoard(createGrid());
            gameState.reset();

            // update streak - if last win date != yesterday, reset current streak
            if (statistics.LastWinDate !== Date.getYesterdayDateString(date)) {
                statistics.resetCurrentStreak().update();
            }
        } else {
            // set board, count, winner from gameState
            setBoard(gameState.Board.length > 0 ? gameState.Board : createGrid());
            setCount(gameState.Count);
            setWinner(gameState.Winner);
            setPlacedShapes(gameState.PlacedShapes);
            setRemainingShapes(ShapeNames.filter(x => !gameState.PlacedShapes.includes(x)));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        // if first shaped placed today, increment games played
        if (count === 1 && gameState.Count === 0) {
            statistics.incrementGamesPlayed().update();
        }

        // when shape is placed, update game state
        if (count > 0 && gameState.Count !== count) {
            gameState.incrementCount()
                .setBoard(board)
                .setPlacedShapes(placedShapes)
                .update();
        }
        // update game state if piece is removed
        else if (count > 0 && placedShapes.length !== gameState.PlacedShapes.length) {
            gameState.setWinner(winner)
                .setBoard(board)
                .setPlacedShapes(placedShapes)
                .update();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [count, placedShapes]);

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
            setBoard(createGrid());
            setPlacedShapes([]);
            setRemainingShapes(ShapeNames);
            setWinner(false);
            setCurrentShape('');
            winner && setCount(0);
        }
    };

    const onWin = () => {
        // on win - set state and update stats
        setWinner(true);
        statistics.onWin(date, count);
        gameState.onWin();
        setStatsDialogVisible(true);
        upsert_solution(date.toString(), board);
    };


    const placeShape = () => {
        if (!winner && currentShape) {
            setPlacedShapes([...placedShapes, currentShape]);
            const remainingShapes_copy = [...remainingShapes];
            const i = remainingShapes_copy.findIndex(val => val === currentShape);
            remainingShapes_copy.splice(i, 1);
            setRemainingShapes(remainingShapes_copy);
            setCount(count + 1);
            setCurrentShape('');
        }
    };

    const onSelectShape = shapeName => {
        if (!winner) {

            // set new shape
            setCurrentShape(shapeName);
        }
    };

    const removeShape = shapeName => {
        if (!winner) {
            const placedShapes_copy = [...placedShapes];
            const i = placedShapes_copy.findIndex(val => val === shapeName);
            placedShapes_copy.splice(i, 1);
            setPlacedShapes(placedShapes_copy);

            const remainingShapes_copy = [...remainingShapes];
            remainingShapes_copy.push(shapeName);
            setRemainingShapes(remainingShapes_copy);
            setCurrentShape('');
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
                        updateBoard={setBoard}
                        onRemoveShape={removeShape}
                        setCurrentShape={setCurrentShape}
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
