import ConnectFour from '../src/components/ConnectFour/ConnectFour.tsx';
import { useGameStorage } from './components/hooks/useLocalStorage.ts';
import { useGameState } from './components/hooks/useGameState.ts';
import { createEmptyBoard } from './components/utils/gameLogic';
import type {GameState} from './types/game';

const initialState: GameState = {
    board: createEmptyBoard(),
    currentPlayer: 1,
    winner: null,
    isGameActive: true,
    winningPositions: [],
    moveHistory: []
};

function App() {
    const { gameState, updateGameState, resetGameState } = useGameStorage(initialState);
    const { fallingPiece, dropPiece, undoMove, resetGame } = useGameState();

    const handleDropPiece = (col: number) => {
        dropPiece(col, gameState, updateGameState);
    };

    const handleUndoMove = () => {
        undoMove(gameState, updateGameState);
    };

    const handleResetGame = () => {
        resetGame(resetGameState);
    };

    return (
        <div className="App">
            <ConnectFour
                gameState={gameState}
                fallingPiece={fallingPiece}
                onDropPiece={handleDropPiece}
                onUndoMove={handleUndoMove}
                onResetGame={handleResetGame}
            />
        </div>
    );
}

export default App;