import { useState, useEffect } from 'react';

const STAT_KEY = 'calendleStatistics';

// Default statistics structure
const defaultStats = {
    GamesPlayed: 0,
    GamesWon: 0,
    CurrentStreak: 0,
    MaxStreak: 0,
    LastWinDate: '',
    WinValues: [], // e.g., moves or other win metrics
    ScoresByDate: {}, // { 'YYYY-MM-DD': score }
    BestScore: null,
};

// Custom hook to manage Calendle app statistics
export default function useCalendleStatistics() {
    // Load stats from localStorage or use defaults
    const getInitialStats = () => {
        const saved = localStorage.getItem(STAT_KEY);
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                return { ...defaultStats };
            }
        }
        return { ...defaultStats };
    };

    const [stats, setStats] = useState(getInitialStats);

    // Sync stats to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem(STAT_KEY, JSON.stringify(stats));
    }, [stats]);

    // Increment games played
    const incrementGamesPlayed = () => {
        setStats(prev => ({ ...prev, GamesPlayed: prev.GamesPlayed + 1 }));
    };

    // Increment games won and update streaks, and record score only for wins
    const incrementGamesWon = (winDate, winValue, score) => {
        setStats(prev => {
            const isNewDay = prev.LastWinDate !== winDate;
            const newStreak = isNewDay ? prev.CurrentStreak + 1 : prev.CurrentStreak;
            // Only record score for won games
            let newScoresByDate = { ...prev.ScoresByDate };
            let newBestScore = prev.BestScore;
            if (score !== undefined && score !== null) {
                newScoresByDate[winDate] = score;
                newBestScore = prev.BestScore === null ? score : Math.max(prev.BestScore, score);
            }
            return {
                ...prev,
                GamesWon: prev.GamesWon + 1,
                CurrentStreak: newStreak,
                MaxStreak: Math.max(prev.MaxStreak, newStreak),
                LastWinDate: winDate,
                WinValues: winValue !== undefined ? [...prev.WinValues, winValue] : prev.WinValues,
                ScoresByDate: newScoresByDate,
                BestScore: newBestScore,
            };
        });
    };

    // Reset current streak (e.g., if a day is missed)
    const resetCurrentStreak = () => {
        setStats(prev => ({ ...prev, CurrentStreak: 0 }));
    };

    // Get win rate
    const getWinRate = () => {
        return stats.GamesPlayed > 0 ? (stats.GamesWon / stats.GamesPlayed) * 100 : 0;
    };

    // Get average score (only for won games)
    const getAverageScore = () => {
        const scores = Object.values(stats.ScoresByDate);
        const numScores = scores.length;
        const total = scores.reduce((sum, val) => sum + val, 0);
        return numScores > 0 ? total / numScores : 0;
    };

    // Get best score
    const getBestScore = () => {
        return stats.BestScore;
    };

    // Get scores by date
    const getScoresByDate = () => {
        return stats.ScoresByDate;
    };

    return {
        stats,
        incrementGamesPlayed,
        incrementGamesWon,
        resetCurrentStreak,
        getWinRate,
        getAverageScore,
        getBestScore,
        getScoresByDate,
        setStats, // Expose setter for advanced use
    };
}
