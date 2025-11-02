import { useState, useCallback } from 'react';
import type {GameState, FallingPiece, Player} from '../../types/game';
import {
    createEmptyBoard,
    checkWinner,
    checkDraw,
    findTargetRow,
    replayMoves
} from '../utils/gameLogic';

export const useGameState = () => {
    const [fallingPiece, setFallingPiece] = useState<FallingPiece | null>(null);

    const dropPiece = useCallback((
        col: number,
        gameState: GameState,
        updateGameState: (updates: Partial<GameState>) => void
    ) => {
        const { board, currentPlayer, isGameActive, winner, moveHistory } = gameState;

        if (!isGameActive || winner) return;

        const targetRow = findTargetRow(board, col);
        if (targetRow === -1) return;

        setFallingPiece({ col, row: targetRow, player: currentPlayer });

        setTimeout(() => {
            const newBoard = board.map(row => [...row]);
            newBoard[targetRow][col] = currentPlayer;

            const newMoveHistory = [...moveHistory, col];

            const winPositions = checkWinner(newBoard, targetRow, col, currentPlayer);
            if (winPositions) {
                updateGameState({
                    board: newBoard,
                    moveHistory: newMoveHistory,
                    winner: currentPlayer,
                    isGameActive: false,
                    winningPositions: winPositions
                });
            } else if (checkDraw(newBoard)) {
                updateGameState({
                    board: newBoard,
                    moveHistory: newMoveHistory,
                    winner: 'draw',
                    isGameActive: false
                });
            } else {
                updateGameState({
                    board: newBoard,
                    moveHistory: newMoveHistory,
                    currentPlayer: currentPlayer === 1 ? 2 : 1
                });
            }

            setFallingPiece(null);
        }, 400);
    }, []);

    const undoMove = useCallback((
        gameState: GameState,
        updateGameState: (updates: Partial<GameState>) => void
    ) => {
        const { moveHistory, isGameActive, winner } = gameState;

        if (moveHistory.length === 0 || !isGameActive || winner) return;

        const newMoveHistory = moveHistory.slice(0, -1);
        const newBoard = replayMoves(newMoveHistory);

        const newCurrentPlayer: Player = newMoveHistory.length % 2 === 0 ? 1 : 2;

        updateGameState({
            board: newBoard,
            moveHistory: newMoveHistory,
            currentPlayer: newCurrentPlayer,
            winner: null,
            isGameActive: true,
            winningPositions: []
        });
    }, []);

    const resetGame = useCallback((
        resetGameState: (newState: GameState) => void
    ) => {
        const initialState: GameState = {
            board: createEmptyBoard(),
            currentPlayer: 1,
            winner: null,
            isGameActive: true,
            winningPositions: [],
            moveHistory: []
        };
        resetGameState(initialState);
        setFallingPiece(null);
    }, []);

    return {
        fallingPiece,
        dropPiece,
        undoMove,
        resetGame
    };
};