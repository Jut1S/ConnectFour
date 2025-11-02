import React from 'react';
import type {GameState, Player} from '../../types/game';
import { getPlayerColor, COLS } from '../utils/gameLogic';
import GameControls from '../GameControls/GameControls';
import './ConnectFour.css';

interface ConnectFourProps {
    gameState: GameState;
    fallingPiece: { col: number; row: number; player: Player } | null;
    onDropPiece: (col: number) => void;
    onUndoMove: () => void;
    onResetGame: () => void;
}

const ConnectFour: React.FC<ConnectFourProps> = ({
                                                     gameState,
                                                     fallingPiece,
                                                     onDropPiece,
                                                     onUndoMove,
                                                     onResetGame
                                                 }) => {
    const { board, currentPlayer, winner, winningPositions, moveHistory } = gameState;

    const getCellColor = (value: number): string => {
        switch (value) {
            case 1: return getPlayerColor(1);
            case 2: return getPlayerColor(2);
            default: return '#ecf0f1';
        }
    };

    const isWinningCell = (row: number, col: number): boolean => {
        return winningPositions.some(pos => pos[0] === row && pos[1] === col);
    };

    const getGameStatus = (): string => {
        if (winner === 'draw') return 'Ничья';
        if (winner) return `Победил игрок ${winner}`;
        return `Ход игрока ${currentPlayer}`;
    };

    return (
        <div className="connect-four">
            <h1>4 в ряд</h1>

            <div className="game-info">
                <div className="game-status">
                    {getGameStatus()}
                    {moveHistory.length > 0 && (
                        <span className="moves-count"> (ходов: {moveHistory.length})</span>
                    )}
                </div>

                {!winner && (
                    <div className="current-player">
                        Текущий игрок:
                        <span
                            className="player-indicator"
                            style={{ backgroundColor: getPlayerColor(currentPlayer) }}
                        >
                            {currentPlayer}
                        </span>
                    </div>
                )}

                {winner && (
                    <div className="winner-message">
                        {winner === 'draw' ? 'Ничья!' : `Игрок ${winner} победил!`}
                    </div>
                )}
            </div>

            <div className="board-container">
                <div className="column-headers">
                    {Array(COLS).fill(null).map((_, col) => (
                        <button
                            key={col}
                            className="column-button"
                            onClick={() => onDropPiece(col)}
                            disabled={!gameState.isGameActive || winner !== null}
                            title={`Бросить фишку в колонку ${col + 1}`}
                        >
                            ↓
                        </button>
                    ))}
                </div>

                <div className={`board ${winner ? 'win-state' : ''}`}>
                    {board.map((row, rowIndex) => (
                        <div key={rowIndex} className="row">
                            {row.map((cell, colIndex) => {
                                const isFalling = fallingPiece?.col === colIndex &&
                                    fallingPiece?.row === rowIndex;
                                const isWinning = isWinningCell(rowIndex, colIndex);

                                return (
                                    <div
                                        key={`${rowIndex}-${colIndex}`}
                                        className={`cell ${isFalling ? 'falling' : ''} ${cell !== 0 ? 'placed' : ''} ${isWinning ? 'winning' : ''}`}
                                        style={{
                                            backgroundColor: getCellColor(cell),
                                            animation: isFalling ? `dropAnimation 0.4s ease-out` : 'none'
                                        }}
                                    />
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>

            <GameControls
                onReset={onResetGame}
                onUndo={onUndoMove}
                canUndo={moveHistory.length > 0 && gameState.isGameActive && winner === null}
                moveHistory={moveHistory}
            />
        </div>
    );
};

export default ConnectFour;