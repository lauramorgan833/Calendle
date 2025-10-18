
import React from 'react';
import useCalendleStatistics from '../../hooks/useCalendleStatistics';

// Stats component displays overall and current game statistics
export const Stats = () => {
    // Use statistics from the hook
    const { stats, getWinRate } = useCalendleStatistics();
    const winPercent = Math.round(getWinRate()) || 0;

    return (
        <div>
            {/* Beta feature notice */}
            <p><b>This is a beta feature</b></p>

            {/* Overall statistics */}
            <p>Games played: {stats.GamesPlayed}</p>
            <p>Games won: {stats.GamesWon}</p>
            <p>Win %: {winPercent}</p>
            <p>Current Streak: {stats.CurrentStreak}</p>
            <p>Max Streak: {stats.MaxStreak}</p>
            <p>Winning values: {stats.WinValues ? stats.WinValues.join(', ') : ''}</p>
            <br />

            {/* Current game statistics (to be implemented) */}
            <p><b>Current game</b></p>
            {/* TODO: Replace with live game state from useCalendleState or props */}
            <p>Count: {/* currentGame.Count */} {/* TODO: Update this line */}</p>
            <p>Has won: {/* currentGame.Winner?.toString() */} {/* TODO: Update this line */}</p>
        </div>
    )
}