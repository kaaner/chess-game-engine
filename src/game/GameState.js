import Board from './Board.js';
import Rules from './Rules.js';
import { PieceColor } from './Piece.js';

export default class GameState {
    constructor() {
        this.board = new Board();
        this.turn = PieceColor.WHITE;
        this.history = []; // Keep track of moves
        this.gameOver = false;
        this.winner = null;
    }

    getBoard() {
        return this.board;
    }

    makeMove(fromRow, fromCol, toRow, toCol) {
        if (this.gameOver) return false;

        const piece = this.board.getPiece(fromRow, fromCol);

        // Basic checks
        if (!piece) return false;
        if (piece.color !== this.turn) return false;

        // Validate move
        const legalMoves = Rules.getLegalMoves(this.board, fromRow, fromCol);
        const isLegal = legalMoves.some(m => m.row === toRow && m.col === toCol);

        if (!isLegal) return false;

        // Execute move
        this.board.movePiece(fromRow, fromCol, toRow, toCol);
        this.history.push({ from: { r: fromRow, c: fromCol }, to: { r: toRow, c: toCol }, piece: piece });

        // Switch turn
        this.switchTurn();

        // Update Game Status
        this.updateGameStatus();

        return true;
    }

    switchTurn() {
        this.turn = this.turn === PieceColor.WHITE ? PieceColor.BLACK : PieceColor.WHITE;
    }

    updateGameStatus() {
        // Check for Checkmate / Stalemate for the *current* turn player
        // (the player who just got passed the turn)

        const currentTurnColor = this.turn;
        let hasLegalMoves = false;

        // Iterate all pieces of current turn
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                const p = this.board.getPiece(i, j);
                if (p && p.color === currentTurnColor) {
                    const moves = Rules.getLegalMoves(this.board, i, j);
                    if (moves.length > 0) {
                        hasLegalMoves = true;
                        break;
                    }
                }
            }
            if (hasLegalMoves) break;
        }

        if (!hasLegalMoves) {
            const kingPos = this.board.findKing(currentTurnColor);
            const opponent = currentTurnColor === PieceColor.WHITE ? PieceColor.BLACK : PieceColor.WHITE;

            if (Rules.isSquareAttacked(this.board, kingPos.row, kingPos.col, opponent)) {
                this.gameOver = true;
                this.winner = opponent;
                console.log(`Checkmate! ${opponent} wins.`);
            } else {
                this.gameOver = true;
                this.winner = 'draw';
                console.log("Stalemate!");
            }
        }
    }
}
