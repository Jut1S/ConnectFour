type Player = 'player_1' | 'player_2';
type Position = [number, number];
type BoardState = 'waiting' | 'pending' | 'win' | 'draw';

interface WinnerInfo {
    who: Player;
    positions: Position[];
}

interface StepResult {
    player_1: Position[];
    player_2: Position[];
    board_state: BoardState;
    winner?: WinnerInfo;
}

interface ValidationResult {
    [key: string]: StepResult;
}

const ROWS = 6;
const COLS = 7;
const WINNING_LENGTH = 4;

export const validator = (moves: number[]): ValidationResult => {
    const result: ValidationResult = {};
    const board: (Player | null)[][] = Array(ROWS).fill(null).map(() => Array(COLS).fill(null));

    result['step_0'] = {
        player_1: [],
        player_2: [],
        board_state: 'waiting'
    };

    let gameEnded = false;

    for (let step = 1; step <= moves.length; step++) {
        if (gameEnded) break;

        const move = moves[step - 1];
        const currentPlayer: Player = step % 2 === 1 ? 'player_1' : 'player_2';

        let targetRow = -1;
        for (let row = ROWS - 1; row >= 0; row--) {
            if (board[row][move] === null) {
                targetRow = row;
                break;
            }
        }

        if (targetRow === -1) continue;

        board[targetRow][move] = currentPlayer;

        const player1Positions: Position[] = [];
        const player2Positions: Position[] = [];

        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLS; col++) {
                if (board[row][col] === 'player_1') {
                    player1Positions.push([row, col]);
                } else if (board[row][col] === 'player_2') {
                    player2Positions.push([row, col]);
                }
            }
        }

        const winnerInfo = checkWinner(board, targetRow, move, currentPlayer);
        const isDraw = !winnerInfo && isBoardFull(board);

        const stepResult: StepResult = {
            player_1: player1Positions,
            player_2: player2Positions,
            board_state: winnerInfo ? 'win' : (isDraw ? 'draw' : 'pending')
        };

        if (winnerInfo) {
            stepResult.winner = winnerInfo;
            gameEnded = true;
        } else if (isDraw) {
            gameEnded = true;
        }

        result[`step_${step}`] = stepResult;
    }

    return result;
};

const checkWinner = (
    board: (Player | null)[][],
    row: number,
    col: number,
    player: Player
): WinnerInfo | null => {
    const directions = [
        [0, 1],
        [1, 0],
        [1, 1],
        [1, -1]
    ];

    for (const [dx, dy] of directions) {
        const positions: Position[] = [[row, col]];

        for (let i = 1; i < WINNING_LENGTH; i++) {
            const newRow = row + dx * i;
            const newCol = col + dy * i;

            if (newRow >= 0 && newRow < ROWS &&
                newCol >= 0 && newCol < COLS &&
                board[newRow][newCol] === player) {
                positions.push([newRow, newCol]);
            } else {
                break;
            }
        }

        for (let i = 1; i < WINNING_LENGTH; i++) {
            const newRow = row - dx * i;
            const newCol = col - dy * i;

            if (newRow >= 0 && newRow < ROWS &&
                newCol >= 0 && newCol < COLS &&
                board[newRow][newCol] === player) {
                positions.unshift([newRow, newCol]);
            } else {
                break;
            }
        }

        if (positions.length >= WINNING_LENGTH) {
            return {
                who: player,
                positions: positions.slice(0, WINNING_LENGTH)
            };
        }
    }

    return null;
};

const isBoardFull = (board: (Player | null)[][]): boolean => {
    for (let col = 0; col < COLS; col++) {
        if (board[0][col] === null) {
            return false;
        }
    }
    return true;
};


if (typeof window !== 'undefined') {
    (window as any).validator = validator;
}