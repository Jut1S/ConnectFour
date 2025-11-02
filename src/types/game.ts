export type Player = 1 | 2;
export type CellValue = 0 | Player;
export type BoardType = CellValue[][];
export type Position = [number, number];

export interface GameState {
    board: BoardType;
    currentPlayer: Player;
    winner: Player | 'draw' | null;
    isGameActive: boolean;
    winningPositions: Position[];
    moveHistory: number[];
}

export interface FallingPiece {
    col: number;
    row: number;
    player: Player;
}