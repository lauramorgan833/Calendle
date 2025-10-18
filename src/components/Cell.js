import { DateModel as Date } from '../models/DateModel';
import React from 'react';
import { getCellClassName } from '../utils/borderClassNames';

export const Cell = ({ value, coord, onClickEmptyCell, board }) => {
    // Get today's date info for highlighting
    const date = Date.today();
    const currentDate = date.getDateString();
    const currentMonth = date.getMonthString();
    const currentDayOfWeek = date.getDayOfWeekString();

    // Determine if this cell is a special cell (today, month, or day of week)
    const isCurrentDateCell = value[0] === currentDate || value[0] === currentMonth || value[0] === currentDayOfWeek;
    // Valid cell if empty or is a special cell
    const isValidCell = value[1] === 0 || isCurrentDateCell;

    // Only display value if valid or special
    let displayValue = isValidCell || isCurrentDateCell ? value[0] : '';

    // Compute cell CSS class for borders and highlights
    const cellClassName = getCellClassName(
        board.map(row => row.map(x => x[1])),
        value[1],
        coord[0],
        coord[1],
        isCurrentDateCell
    );

    // Handle cell click
    const onClick = () => {
        onClickEmptyCell(value, coord[0], coord[1]);
    };

    // Render the cell
    return (
        <div key={value} onClick={onClick} className={cellClassName}>
            {displayValue}
        </div>
    );
}
