import type {BoardType, Player, Position} from '../../types/game';

export const ROWS = 6;
export const COLS = 7;
export const WINNING_LENGTH = 4;

export const createEmptyBoard = (): BoardType =>
    Array(ROWS).fill(null).map(() => Array(COLS).fill(0));

export const checkWinner = (
    board: BoardType,
    row: number,
    col: number,
    player: Player
): Position[] | null => {
    const directions = [
        [0, 1],
        [1, 0],
        [1, 1],
        [1, -1]
    ];

    for (const [dx, dy] of directions) {
        let count = 1;
        const positions: Position[] = [[row, col]];


        for (let i = 1; i < WINNING_LENGTH; i++) {
            const newRow = row + dx * i;
            const newCol = col + dy * i;
            if (
                newRow >= 0 && newRow < ROWS &&
                newCol >= 0 && newCol < COLS &&
                board[newRow][newCol] === player
            ) {
                count++;
                positions.push([newRow, newCol]);
            } else {
                break;
            }
        }

        for (let i = 1; i < WINNING_LENGTH; i++) {
            const newRow = row - dx * i;
            const newCol = col - dy * i;
            if (
                newRow >= 0 && newRow < ROWS &&
                newCol >= 0 && newCol < COLS &&
                board[newRow][newCol] === player
            ) {
                count++;
                positions.unshift([newRow, newCol]);
            } else {
                break;
            }
        }

        if (count >= WINNING_LENGTH) {
            return positions.slice(0, WINNING_LENGTH);
        }
    }

    return null;
};

export const checkDraw = (board: BoardType): boolean => {
    return board.every(row => row.every(cell => cell !== 0));
};

export const findTargetRow = (board: BoardType, col: number): number => {
    for (let row = ROWS - 1; row >= 0; row--) {
        if (board[row][col] === 0) {
            return row;
        }
    }
    return -1;
};

export const getPlayerColor = (player: Player): string => {
    return player === 1 ? '#e74c3c' : '#f39c12';
};

export const replayMoves = (moves: number[]): BoardType => {
    const board = createEmptyBoard();
    let currentPlayer: Player = 1;

    moves.forEach(move => {
        const targetRow = findTargetRow(board, move);
        if (targetRow !== -1) {
            board[targetRow][move] = currentPlayer;
            currentPlayer = currentPlayer === 1 ? 2 : 1;
        }
    });

    return board;
};