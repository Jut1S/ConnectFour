import type {GameState} from '../../types/game';

const STORAGE_KEY = 'connect4_game_state';

export const saveGameState = (gameState: GameState): void => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
    } catch (error) {
        console.warn('Не удалось сохранить в localStorage:', error);
    }
};

export const loadGameState = (): GameState | null => {
    try {
        const item = localStorage.getItem(STORAGE_KEY);
        return item ? JSON.parse(item) : null;
    } catch (error) {
        console.warn('Не удалось загрузить из localStorage:', error);
        return null;
    }
};

export const clearGameState = (): void => {
    localStorage.removeItem(STORAGE_KEY);
};