import React from 'react';
import { TbRotateClockwise2, TbArrowsVertical, TbArrowsHorizontal } from 'react-icons/tb';

// Receives currentShape, shapes, setShapes, and winner as props
export const ShapeTransform = ({ currentShape, shapes, setShapes, winner }) => {
    const rotate = (dir) => {
        if (!winner && currentShape) {
            const shapeList = { ...shapes };
            const shape = shapeList[currentShape];
            const matrix = shape.matrix;

            const x_values_rev = matrix.map((x, i) => i).reverse();
            const length = Math.max(matrix.length, matrix[0].length);

            let newMatrix = Array.from(Array(length), () => {
                return new Array(length).fill(0);
            });

            matrix.forEach((row, y) => {
                return row.forEach((val, x) => {
                    if (dir === 'vflip') {
                        const new_Y = x_values_rev[y];
                        newMatrix[new_Y][x] = val;
                    } else if (dir === 'hflip') {
                        const new_Y = x_values_rev[x];
                        newMatrix[y][new_Y] = val;
                    } else if (dir === 'right') {
                        const new_Y = x_values_rev[y];
                        newMatrix[x][new_Y] = val;
                    } else if (dir === 'left') {
                        const new_Y = x_values_rev[x];
                        newMatrix[new_Y][y] = val;
                    }
                });
            });

            shape.matrix = newMatrix;
            shapeList[currentShape] = shape;
            setShapes(shapeList);
        }
    };

    // Render rotate buttons for shape manipulation
    return (
        <div className="rotateButtons">
            <button
                className="rotateButton"
                aria-label="Rotate Left"
                onClick={() => rotate('left')}
                disabled={!currentShape || winner}
            >
                <TbRotateClockwise2 style={{ transform: 'scaleY(-1)' }} />
            </button>
            <button
                className="rotateButton"
                aria-label="Flip Vertical"
                onClick={() => rotate('vflip')}
                disabled={!currentShape || winner}
            >
                <TbArrowsVertical />
            </button>
            <button
                className="rotateButton"
                aria-label="Flip Horizontal"
                onClick={() => rotate('hflip')}
                disabled={!currentShape || winner}
            >
                <TbArrowsHorizontal />
            </button>
            <button
                className="rotateButton"
                aria-label="Rotate Right"
                onClick={() => rotate('right')}
                disabled={!currentShape || winner}
            >
                <TbRotateClockwise2 />
            </button>
        </div>
    );
};
