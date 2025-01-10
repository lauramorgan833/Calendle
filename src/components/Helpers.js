import { ShapeNames } from "../lib/common";

const directionCoords = {
  top: [-1, 0],
  bottom: [1, 0],
  left: [0, -1],
  right: [0, 1],
};

const getBorderClassName = (matrix, val, x, y, type) => {
  const directions = ['left', 'right', 'top', 'bottom'];
  let borderClassName = '';

  directions.forEach((dir) => {
    const rows = matrix.length;
    const cols = matrix[0].length;
    const newCoord = [x + directionCoords[dir][0], y + directionCoords[dir][1]];
    const isExterior = newCoord[0] < 0 || newCoord[1] < 0 || newCoord[0] >= rows || newCoord[1] >= cols;

    if (type === 'CELL') {
      borderClassName += getCellBorderClassName(matrix, val, dir, newCoord, isExterior);
    } else if (type === 'SHAPE') {
      borderClassName += getShapeBorderClassName(matrix, val, dir, newCoord, isExterior);
    }
  });

  return borderClassName;
};

const getCellBorderClassName = (matrix, val, dir, newCoord, isExterior) => {
  let borderClassName = '';
  if (val === 'dead') {
    borderClassName += isExterior || matrix[newCoord[0]][newCoord[1]] === 'dead' ? ' deadborder' + dir : ' border' + dir;
  } else {
    borderClassName += isExterior ? ' exteriorborder' + dir : (matrix[newCoord[0]][newCoord[1]] === val ? (ShapeNames.includes(val) ? ' shapeborder' + dir : ' border' + dir) : '');
  }
  return borderClassName;
};

const getShapeBorderClassName = (matrix, val, dir, newCoord, isExterior) => {
  if (isExterior || matrix[newCoord[0]][newCoord[1]] !== val) return '';
  return ShapeNames.includes(val) ? ' shapeborder' + dir : '';
};

export const getShapeClassName = (matrix, val, x, y, isSelected) => {
  const borderClassName = getBorderClassName(matrix, val, x, y, 'SHAPE');
  const colorClassName = ShapeNames.includes(val) ? 'shapeColor' : '';
  const selectedClassName = val && isSelected ? 'red' : '';
  return ['cellDimensions', borderClassName, colorClassName, selectedClassName].join(' ');
};

export const getCellClassName = (matrix, val, x, y, isCurrentDateCell) => {
  if (!isCurrentDateCell && val === -1) return 'emptyCell';
  const cellClassName = isCurrentDateCell ? 'cell currentDate' : 'cell';
  const borderClassName = getBorderClassName(matrix, val, x, y, 'CELL');
  const colorClassName = ShapeNames.includes(val) ? 'shapeColor' : '';
  return ['cellDimensions', cellClassName, borderClassName, colorClassName].join(' ');
};
