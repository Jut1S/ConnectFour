import React from 'react';
import './GameControls.css';

interface GameControlsProps {
    onReset: () => void;
    onUndo: () => void;
    canUndo: boolean;
    moveHistory: number[];
}

const GameControls: React.FC<GameControlsProps> = ({
                                                       onReset,
                                                       onUndo,
                                                       canUndo,
                                                       moveHistory
                                                   }) => {
    return (
        <div className="game-controls">
            <div className="controls-row">
                <button className="reset-button" onClick={onReset}>
                    Новая игра
                </button>

                <button
                    className="undo-button"
                    onClick={onUndo}
                    disabled={!canUndo}
                >
                    Отменить ход
                </button>
            </div>

            {moveHistory.length > 0 && (
                <div className="game-history">
                    <h4>История ходов:</h4>
                    <div className="moves-list">
                        {moveHistory.map((move, index) => (
                            <span key={index} className="move-item">
                                {index + 1}:{move + 1}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default GameControls;