import { Chess, Move } from 'chess.js';
import { BehaviorSubject } from 'rxjs';
import socket from '../sockets';

const chess = new Chess();

interface GameState {
  board: Array<Array<any>>;
  isGameOver: boolean;
  turn: string;
  result: string | null;
  fen: string;
  pendingPromotion: PendingPromotion | null;
}

interface PendingPromotion {
  from: string;
  to: string;
  color: string;
}

interface CustomMove {
  from: string;
  to: string;
  promotion?: string;
}

export const gameSubject = new BehaviorSubject<GameState>({
  board: chess.board(),
  isGameOver: false,
  turn: 'w',
  result: null,
  fen: chess.fen(),
  pendingPromotion: null,
});

let playerColor: 'w' | 'b' = 'w';

/**
 * @param {PendingPromotion | null} pendingPromotion
 */
function updateGame(pendingPromotion: PendingPromotion | null = null): void {
  const isGameOver = chess.isGameOver();

  const newGame: GameState = {
    board: chess.board(),
    pendingPromotion,
    isGameOver,
    turn: chess.turn(),
    result: isGameOver ? getGameResult() : null,
    fen: chess.fen(),
  };

  localStorage.setItem('savedGame', chess.fen());
  gameSubject.next(newGame);
}

/**
 * @returns {string} - The result of the game.
 */
function getGameResult(): string {
  if (chess.isCheckmate()) {
    const winner = chess.turn() === 'w' ? 'BLACK' : 'WHITE';
    return `CHECKMATE - WINNER - ${winner}`;
  } else if (chess.isDraw()) {
    let reason = '50 - MOVES - RULE';
    if (chess.isStalemate()) {
      reason = 'STALEMATE';
    } else if (chess.isThreefoldRepetition()) {
      reason = 'REPETITION';
    } else if (chess.isInsufficientMaterial()) {
      reason = 'INSUFFICIENT MATERIAL';
    }
    return `DRAW - ${reason}`;
  } else {
    return 'UNKNOWN REASON';
  }
}

/**
 * Attempts to make a move and emits it to the server if successful.
 * @param {string} from - The starting square of the piece.
 * @param {string} to - The target square of the piece.
 * @param {string} [promotion] - The promotion piece, if applicable.
 */
export function move(from: string, to: string, promotion?: string): void {
  if (chess.turn() !== playerColor) return; 

  const tempMove: CustomMove = { from, to, promotion };
  const legalMove: Move | null = chess.move(tempMove);

  if (legalMove) {
    socket.emit('playerMove', tempMove);
    updateGame();
  }
}

/**
 * Handles a move, checking for promotions and updating the game state.
 * @param {string} from - The starting square of the piece.
 * @param {string} to - The target square of the piece.
 */
export function handleMove(from: string, to: string): void {
  if (chess.turn() !== playerColor) return; 

  const promotions = chess.moves({ verbose: true }).filter((m) => m.promotion);
  if (promotions.some((p) => `${p.from}:${p.to}` === `${from}:${to}`)) {
    const pendingPromotion: PendingPromotion = { from, to, color: promotions[0].color };
    updateGame(pendingPromotion);
  }

  const { pendingPromotion } = gameSubject.getValue();
  if (!pendingPromotion) {
    move(from, to);
  }
}

/**
 * @param {string} roomId - The ID of the game room.
 */
export function initGame(roomId: string): void {
  updateGame();

  socket.emit('joinRoom', { roomId });

  socket.on('assignColor', (color: 'w' | 'b') => {
    playerColor = color;
  });

  socket.on('gameState', (serverGameState: GameState) => {
    chess.load(serverGameState.fen);
    updateGame(serverGameState.pendingPromotion);
  });

  socket.on('opponentMove', (serverMove: CustomMove) => {
    chess.move(serverMove);
    updateGame();
  });
}


export function resetGame(): void {
  chess.reset();
  socket.emit('resetGame');
  updateGame();
}