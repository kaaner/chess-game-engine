import GameSettings from './GameSettings.js';
import GameClock from './GameClock.js';
import Board from './Board.js';
import Rules from './Rules.js';
import { PieceColor } from './Piece.js';

export default class GameState {
    constructor() {
        this.board = new Board();
        this.turn = PieceColor.WHITE;
        this.history = []; // Keep track of moves
        this.capturedPieces = { w: [], b: [] }; // Captured pieces BY color (i.e. 'w' contains pieces white captured? Or pieces captured FROM white?
        // Usually UI shows "Pieces White has lost" vs "Pieces Black has lost".
        // Or "Pieces White has captured" (which are Black pieces).
        // Let's store: { w: [captured white pieces], b: [captured black pieces] }
        this.gameOver = false;
        this.winner = null;
        this.clock = null;
        this.enPassantTarget = null; // { row, col } or null
        this.settings = new GameSettings();
        this.isPaused = false;
        this.lastMove = null; // { from: {row, col}, to: {row, col} } - for highlighting
    }

    initClock(minutes, increment, onTick) {
        this.clock = new GameClock(minutes, increment, onTick);
    }

    resetGame() {
        this.board.resetBoard();
        this.turn = PieceColor.WHITE;
        this.history = [];
        this.capturedPieces = { w: [], b: [] };
        this.gameOver = false;
        this.winner = null;
        this.enPassantTarget = null;
        this.isPaused = false;
        this.lastMove = null;

        if (this.clock) {
            this.clock.reset(10); // Hardcoded 10 min for now, should perhaps store initial config
        }
    }

    togglePause() {
        if (this.gameOver) return;
        this.isPaused = !this.isPaused;

        if (this.clock) {
            if (this.isPaused) {
                this.clock.stop();
            } else {
                // Resume
                // If game hasn't started (activeColor null), don't start clock yet? 
                // Actually if null, start('w') might be premature if we wait for first move.
                // But usually clock starts on first move? 
                // Let's assume clock only runs if activeColor is set.
                if (this.clock.activeColor) {
                    this.clock.start(this.clock.activeColor);
                }
            }
        }
    }

    getBoard() {
        return this.board;
    }

    makeMove(fromRow, fromCol, toRow, toCol, promotionType = null) {
        if (this.gameOver || this.isPaused) return false;

        const piece = this.board.getPiece(fromRow, fromCol);

        // Basic checks
        if (!piece) return false;
        if (piece.color !== this.turn) return false;

        // Context for rules
        const rulesContext = {
            enPassantTarget: this.enPassantTarget,
            castlingEnabled: this.settings.castlingEnabled,
            enPassantEnabled: this.settings.enPassantEnabled
        };

        // Validate move
        const legalMoves = Rules.getLegalMoves(this.board, fromRow, fromCol, rulesContext);
        const move = legalMoves.find(m => m.row === toRow && m.col === toCol);

        if (!move) return false;

        // Check for promotion
        if (piece.type === 'p') { // Hardcoded 'p' equivalent to PieceType.PAWN which needs import or just use string
            const isLastRank = (piece.color === 'w' && toRow === 0) || (piece.color === 'b' && toRow === 7);
            if (isLastRank) {
                if (!promotionType) {
                    return 'PROMOTION_NEEDED';
                }
            }
        }

        // Execute move
        const targetPiece = this.board.getPiece(toRow, toCol); // Check capture BEFORE moving? 
        // Logic: movePiece overwrites target. So we must get it before.
        // Wait, movePiece in Board.js:
        // const piece = this.squares[fromRow][fromCol];
        // this.squares[toRow][toCol] = piece;
        // So yes, Board.movePiece overwrites. 
        // BUT, I'm already looking at GameState.js line 60 (original), 
        // where `this.board.movePiece` is called.
        // I need to intercept the capture BEFORE calling movePiece.

        // Wait, current file view might use lines differently.
        // Let's look at `makeMove` again.

        const capturedPiece = this.board.getPiece(toRow, toCol);
        if (capturedPiece) {
            this.capturedPieces[capturedPiece.color].push(capturedPiece.type);
        }

        this.board.movePiece(fromRow, fromCol, toRow, toCol);

        // Handle Castling Execution
        if (move.isCastling) {
            const row = fromRow;
            const rookSrcCol = move.side === 'k' ? 7 : 0;
            const rookDstCol = move.side === 'k' ? 5 : 3;
            this.board.movePiece(row, rookSrcCol, row, rookDstCol);
        }

        // Handle En Passant Capture
        if (move.isEnPassant) {
            // Captured pawn is NOT at {fromRow, toCol}. 
            // It is at {fromRow, move.col} (i.e. toCol). Wait.
            // Move: P(r, c) -> (r+dir, c+shift).
            // En Passant Target: (r+dir, c+shift).
            // Captured Pawn: (r, c+shift). which is (fromRow, toCol).
            // Example: White at (3,4). Target (2,3). Captures Black at (3,3).
            // fromRow=3. toRow=2. toCol=3.
            // Captured Square: (3, 3). So (fromRow, toCol).
            // Black (4,2). Target (5,3). Captures White at (4,3).
            // fromRow=4. toRow=5. toCol=3.
            // Captured Square: (4, 3). So (fromRow, toCol).

            // WAIT, logic is correct for `fromRow` which is the start row.
            // But is `movePiece` messing it up?
            // movePiece(fromRow, fromCol, toRow, toCol);
            // This moves P from (fromRow, fromCol) to (toRow, toCol).
            // If capturing, `toRow`!=`fromRow`.
            // The captured pawn is at `fromRow` (same rank as attacker), and `toCol` (file of victim).
            // So `this.board.squares[fromRow][toCol]` is correct.

            // Is it possible `movePiece` overwrote it?
            // movePiece sets `toRow, toCol` to the piece.
            // Captured pawn is at `fromRow, toCol`.
            // So `fromRow` != `toRow`. 
            // So movePiece does NOT overwrite captured pawn.

            // Maybe the UI is not updating `fromRow, toCol`?
            // ChessView iterates board. If `squares[fromRow][toCol]` is null, it clears.

            // Captured pawn is at {fromRow, move.col}
            // En Passant captures a piece of OPPOSITE color to the turn.
            const opponentColor = this.turn === 'w' ? 'b' : 'w';
            this.capturedPieces[opponentColor].push('p');

            // Let's add logging to verify coordinates.
            console.log('En Passant Execution:', { fromRow, fromCol, toRow, toCol });
            this.board.squares[fromRow][toCol] = null;
        }

        // Set En Passant Target for NEXT turn
        // If pawn moved 2 squares
        if (piece.type === 'p' && Math.abs(toRow - fromRow) === 2) {
            this.enPassantTarget = {
                row: (fromRow + toRow) / 2,
                col: fromCol
            };
        } else {
            this.enPassantTarget = null;
        }


        // Apply promotion
        if (piece.type === 'p' && promotionType) {
            const promotedPiece = this.board.getPiece(toRow, toCol);
            promotedPiece.type = promotionType;
        }

        // Store last move for visual feedback
        this.lastMove = {
            from: { row: fromRow, col: fromCol },
            to: { row: toRow, col: toCol }
        };

        this.history.push({ from: { r: fromRow, c: fromCol }, to: { r: toRow, c: toCol }, piece: piece, promotion: promotionType });

        // Switch turn
        this.switchTurn();

        if (this.clock) {
            this.clock.switchTurn();
        }

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

        const rulesContext = {
            enPassantTarget: this.enPassantTarget,
            castlingEnabled: this.settings.castlingEnabled,
            enPassantEnabled: this.settings.enPassantEnabled
        };

        // Iterate all pieces of current turn
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                const p = this.board.getPiece(i, j);
                if (p && p.color === currentTurnColor) {
                    const moves = Rules.getLegalMoves(this.board, i, j, rulesContext);
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
