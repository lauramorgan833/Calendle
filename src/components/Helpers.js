import { ShapeNames } from "../lib/common"

const getBorderClassName = (matrix, val, x, y, type) => {
    const directions = ['left', 'right', 'top', 'bottom']
    const directionCoords = {
        top: [-1, 0],
        bottom: [1, 0],
        left: [0, -1],
        right: [0, 1],
    }

    let borderClassName = ''

    directions.forEach(dir => {
        const rows = matrix.length
        const cols = matrix[0].length
        const newCoord = [x + directionCoords[dir][0], y + directionCoords[dir][1]]
        
        const isExterior = newCoord[0] < 0 || newCoord[1] < 0 || newCoord[0] >= rows || newCoord[1] >= cols;

        switch (type) {
        case 'CELL':
            borderClassName += getCellBorderClassName(matrix, val, dir, newCoord, isExterior)
            break;
        case 'SHAPE':
            borderClassName += getShapeBorderClassName(matrix, val, dir, newCoord, isExterior)
            break;
        }   
    })

    return borderClassName
}

const getCellBorderClassName = (matrix, val, dir, newCoord, isExterior) => {
    let borderClassName = '';
    if (val === 'dead') {
        if (!isExterior) {
            const neighboringVal = matrix[newCoord[0]][newCoord[1]];
            if (neighboringVal !== 'dead') {
                borderClassName += ' border' + dir
            } else if (neighboringVal === 'dead') {
                borderClassName += ' deadborder' + dir 
            }
        } else {
            borderClassName += ' deadborder' + dir
        }
    } else {
        if (isExterior) {
            borderClassName += ' exteriorborder' + dir
        } else {
            const neighboringVal = matrix[newCoord[0]][newCoord[1]]

            // if same as neighboring cell
            if (neighboringVal === val) {
                if (ShapeNames.includes(val)) {
                    borderClassName += ' shapeborder' + dir
                } else {
                    borderClassName += ' border' + dir
                }
            }
        }
    }
    return borderClassName;
}

const getShapeBorderClassName = (matrix, val, dir, newCoord, isExterior) => {
    let borderClassName = '';
    if (!isExterior) {
        const neighboringVal = matrix[newCoord[0]][newCoord[1]] || undefined
        if (neighboringVal === val) {
            if (ShapeNames.includes(val)) {
                borderClassName += ' shapeborder' + dir
            } else {
                borderClassName += ' border' + dir
            }
        }
    }
    return borderClassName;
}

export const getShapeClassName = (matrix, val, x, y, isSelected) => {
    // get border
    const borderClassName = getBorderClassName(matrix, val, x, y, 'SHAPE')

    // get color
    const colorClassName = ShapeNames.includes(val) ? 'shapeColor' : ''

    // get selected class name
    const selectedClassName = val && isSelected ? 'red' : ''

    const styles = ['cellDimensions', borderClassName, colorClassName, selectedClassName].join(' ')

    return styles
}


export const getCellClassName = (matrix, val, x, y, isCurrentDateCell) => {
    let cellClassName = 'cell';
    if (!isCurrentDateCell && val === -1) {
        return 'emptyCell';
    } 

    if (isCurrentDateCell) {
        cellClassName += ' currentDate';
    }
    
    // get border
    const borderClassName = getBorderClassName(matrix, val, x, y, 'CELL')

    // get color
    const colorClassName = ShapeNames.includes(val) ? 'shapeColor' : ''

    const styles = ['cellDimensions', cellClassName, borderClassName, colorClassName].join(' ')

    return styles
}
