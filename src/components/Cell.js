import { DateModel as Date } from '../models/DateModel';
import React from 'react'
import { getCellClassName } from '../utils/borderClassNames'

export const Cell = ({ value, coord, onClickEmptyCell, board }) => {
    const date = Date.today();
    const currentDate = date.getDateString();
    const currentMonth = date.getMonthString();
    const currentDayOfWeek = date.getDayOfWeekString();

    const isCurrentDateCell = value[0] === currentDate || value[0] === currentMonth || value[0] === currentDayOfWeek;
    const isValidCell = value[1] === 0 || isCurrentDateCell;

    let displayValue = isValidCell || isCurrentDateCell ? value[0] : ''

    const cellClassName = getCellClassName(
        board.map(row => row.map(x => x[1])),
        value[1],
        coord[0],
        coord[1],
        isCurrentDateCell
    )

    const onClick = () => {
        onClickEmptyCell(value, coord[0], coord[1])
    }

    return (
        <div key={value} onClick={onClick} className={cellClassName}>
            {displayValue}
        </div>
    )
}
