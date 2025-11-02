import { useState, useEffect } from 'react';
import type {GameState} from '../../types/game';
import { saveGameState, loadGameState, clearGameState } from '../utils/localStorage';

export const useGameStorage = (initialState: GameState) => {
    const [gameState, setGameState] = useState<GameState>(() => {
        const saved = loadGameState();
        return saved || initialState;
    });

    useEffect(() => {
        saveGameState(gameState);
    }, [gameState]);

    const updateGameState = (updates: Partial<GameState>) => {
        setGameState(prev => ({ ...prev, ...updates }));
    };

    const resetGameState = (newState: GameState) => {
        setGameState(newState);
        clearGameState();
    };

    return {
        gameState,
        updateGameState,
        resetGameState
    };
};