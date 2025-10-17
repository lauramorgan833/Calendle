import { DateModel as Date, DAYSOFWEEK, MONTHS } from '../models/DateModel.js';
export const ShapeNames = ['H', 'I', 'L', 'T', 'S', 'N', 'P', 'Z', 'V', 'F'];

export const InitialBoard = [
    [MONTHS[0], MONTHS[1], MONTHS[2], MONTHS[3], MONTHS[4], MONTHS[5], 'dead'],
    [MONTHS[6], MONTHS[7], MONTHS[8], MONTHS[9], MONTHS[10], MONTHS[11], 'dead'],
    ['1', '2', '3', '4', '5', '6', '7'],
    ['8', '9', '10', '11', '12', '13', '14'],
    ['15', '16', '17', '18', '19', '20', '21'],
    ['22', '23', '24', '25', '26', '27', '28'],
    ['29', '30', '31', DAYSOFWEEK[0], DAYSOFWEEK[1], DAYSOFWEEK[2], DAYSOFWEEK[3]],
    ['dead', 'dead', 'dead', 'dead', DAYSOFWEEK[4], DAYSOFWEEK[5], DAYSOFWEEK[6]],
];

export const SHAPES = {
    I: {
        matrix: [['I'], ['I'], ['I'], ['I']],
        size: 4,
    },
    L: {
        matrix: [
            ['L', 0, 0],
            ['L', 0, 0],
            ['L', 'L', 0],
        ],
        size: 4,
    },
    T: {
        matrix: [
            ['T', 'T', 'T'],
            [0, 'T', 0],
            [0, 'T', 0],
        ],
        size: 5,
    },
    S: {
        matrix: [
            ['S', 'S', 0],
            [0, 'S', 0],
            [0, 'S', 'S'],
        ],
        size: 5,
    },
    N: {
        matrix: [
            ['N', 'N', 'N'],
            ['N', 0, 'N'],
            [0, 0, 0],
        ],
        size: 5,
    },
    P: {
        matrix: [
            ['P', 'P'],
            ['P', 'P'],
            ['P', 0],
        ],
        size: 5,
    },
    Z: {
        matrix: [
            ['Z', 0],
            ['Z', 'Z'],
            [0, 'Z'],
        ],
        size: 4,
    },
    V: {
        matrix: [
            ['V', 0, 0],
            ['V', 0, 0],
            ['V', 'V', 'V'],
        ],
        size: 5,
    },
    F: {
        matrix: [
            ['F', 'F'],
            ['F', 0],
            ['F', 0],
            ['F', 0],
        ],
        size: 5,
    },
    H: {
        matrix: [
            ['H', 0],
            ['H', 'H'],
            [0, 'H'],
            [0, 'H'],
        ],
        size: 5,
    },
};

export const createGrid = () => {
    const date = Date.today();
    const currentDate = date.getDateString();
    const currentMonth = date.getMonthString();
    const currentDayOfWeek = date.getDayOfWeekString();
    const board = InitialBoard;
    return board.map(row =>
        row.map((cell, x) => {
            const isCurrentDate = cell === currentDate || cell === currentMonth || cell === currentDayOfWeek;
            const isDead = cell === 'dead';

            const val = isDead ? 'dead' : isCurrentDate ? -1 : 0;
            return [cell, val]
        })
    )
}