
import Rules from './Rules.js';
import { PieceColor, PieceType } from './Piece.js';

export default class AI {
    constructor(game) {
        this.game = game;
        this.depth = 2; // Look-ahead depth
        // Piece values for evaluation
        this.pieceValues = {
            [PieceType.PAWN]: 10,
            [PieceType.KNIGHT]: 30,
            [PieceType.BISHOP]: 30,
            [PieceType.ROOK]: 50,
            [PieceType.QUEEN]: 90,
            [PieceType.KING]: 900
        };

        // Simplified Piece-Square Tables (Flip for Black)
        // Bonus for center control, development, etc.
        this.pst = {
            [PieceType.PAWN]: [
                [0, 0, 0, 0, 0, 0, 0, 0],
                [5, 5, 5, 5, 5, 5, 5, 5],
                [1, 1, 2, 3, 3, 2, 1, 1],
                [0, 0, 3, 5, 5, 3, 0, 0],
                [0, 0, 0, 2, 2, 0, 0, 0],
                [0, -1, -1, 0, 0, -1, -1, 0],
                [0, 1, 1, -2, -2, 1, 1, 0],
                [0, 0, 0, 0, 0, 0, 0, 0]
            ],
            [PieceType.KNIGHT]: [
                [-5, -4, -3, -3, -3, -3, -4, -5],
                [-4, -2, 0, 0, 0, 0, -2, -4],
                [-3, 0, 1, 1, 1, 1, 0, -3],
                [-3, 0, 1, 2, 2, 1, 0, -3],
                [-3, 0, 1, 2, 2, 1, 0, -3],
                [-3, 0, 1, 1, 1, 1, 0, -3],
                [-4, -2, 0, 0, 0, 0, -2, -4],
                [-5, -4, -3, -3, -3, -3, -4, -5]
            ],
            [PieceType.BISHOP]: [
                [-2, -1, -1, -1, -1, -1, -1, -2],
                [-1, 0, 0, 0, 0, 0, 0, -1],
                [-1, 0, 0, 1, 1, 0, 0, -1],
                [-1, 0, 0, 1, 1, 0, 0, -1],
                [-1, 0, 0, 1, 1, 0, 0, -1],
                [-1, 1, 1, 1, 1, 1, 1, -1],
                [-1, 0, 0, 0, 0, 0, 0, -1],
                [-2, -1, -1, -1, -1, -1, -1, -2]
            ],
            [PieceType.ROOK]: [
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [1, 2, 2, 2, 2, 2, 2, 1], // 7th rank bonus (if white)
                [0, 0, 0, 0, 0, 0, 0, 0]
            ],
            [PieceType.QUEEN]: [
                [-2, -1, -1, -0, -0, -1, -1, -2],
                [-1, 0, 0, 0, 0, 0, 0, -1],
                [-1, 0, 0, 0, 0, 0, 0, -1],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [-1, 0, 0, 0, 0, 0, 0, -1],
                [-1, 0, 0, 0, 0, 0, 0, -1],
                [-2, -1, -1, -0, -0, -1, -1, -2]
            ],
            [PieceType.KING]: [
                [-3, -4, -4, -5, -5, -4, -4, -3],
                [-3, -4, -4, -5, -5, -4, -4, -3],
                [-3, -4, -4, -5, -5, -4, -4, -3],
                [-3, -4, -4, -5, -5, -4, -4, -3],
                [-2, -3, -3, -4, -4, -3, -3, -2],
                [-1, -2, -2, -2, -2, -2, -2, -1],
                [2, 2, 0, 0, 0, 0, 2, 2], // Safety in castling spots
                [2, 3, 1, 0, 0, 1, 3, 2]
            ]
        };
    }

    // ... methods ...

    evaluateBoard(board, color) {
        let score = 0;

        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                const piece = board.getPiece(i, j);
                if (piece) {
                    let value = this.pieceValues[piece.type];

                    // PST Bonus
                    // Arrays are defined for White [0..7] -> Rank 8 to Rank 1?
                    // Usually PST is defined for Rank 1 to 8 (index 7 to 0).
                    // My board: row 0 = Rank 8 (Black side). row 7 = Rank 1 (White side).
                    // My PST definition above:
                    // Looks like standard "White bottom" perspective.
                    // e.g. Pawn rank 1 (index 1 in array?) -> 5 bonus. 
                    // In my board, Rank 7 (White pawns start) is row 6.
                    // Rank 2 (White pawns second) is row ... wait.
                    // White pawns start at row 6.

                    // Let's assume PST array index [0] = Rank 8 (Top), [7] = Rank 1 (Bottom).
                    // So for White, Row i maps to PST[i].
                    // For Black, we mirror. Row i maps to PST[7-i].

                    let pstVal = 0;
                    if (this.pst[piece.type]) {
                        if (piece.color === PieceColor.WHITE) {
                            pstVal = this.pst[piece.type][i][j];
                        } else {
                            pstVal = this.pst[piece.type][7 - i][j]; // Mirror rows
                            // Mirror cols? Usually board is symmetric horizontally for PST, but King safety is side dependent?
                            // My King PST is symmetric. Knight symmetric.
                            // So only row mirroring is needed.
                        }
                    }

                    // Scale PST to avoid overshadowing material?
                    // Material is 10, 30... PST is 1, 2, 5.
                    // 1 Pawn = 10. +5 PST = 1.5 Pawns. Significant.
                    // It's okay.

                    value += pstVal;

                    if (piece.color === color) {
                        score += value;
                    } else {
                        score -= value;
                    }
                }
            }
        }
        return score;
    }
    // ... rest ...

    getBestMove(color) {
        const board = this.game.getBoard(); // Current board
        // Context for rules (En Passant, Castling)
        // Note: AI simulation must update this context if it goes deep, but for depth 1-2 we might approximate or pass current.
        // Cloning GameState for full simulation is better.

        const startTime = performance.now();

        const { bestMove, bestScore } = this.minimax(board, this.depth, true, -Infinity, Infinity, color);

        const endTime = performance.now();
        console.log(`AI considered moves for ${color}. Time: ${(endTime - startTime).toFixed(2)}ms. Score: ${bestScore}`);

        return bestMove;
    }

    getEvaluation() {
        // Evaluate position from White's perspective
        // If it's White's turn, we maximize White.
        // If it's Black's turn, Black minimizes White (i.e. we minimize).

        const board = this.game.getBoard();
        const color = 'w'; // Always evaluate for White
        const isMaximizing = this.game.turn === 'w';

        // Use a shallow depth for quick UI feedback (e.g. 2)
        // Note: If in checkmate, depth 0 search won't find it if we are already there?
        // But minimax checks terminus at start.

        const { bestScore } = this.minimax(board, 2, isMaximizing, -Infinity, Infinity, color);
        return bestScore;
    }

    // Minimax with Alpha-Beta Pruning
    minimax(board, depth, isMaximizing, alpha, beta, color) {
        if (depth === 0) {
            return { bestScore: this.evaluateBoard(board, color) };
        }

        // Generate all legal moves for 'color'
        // Need to iterate all pieces of 'color'
        const moves = this.getAllLegalMoves(board, isMaximizing ? color : (color === PieceColor.WHITE ? PieceColor.BLACK : PieceColor.WHITE));

        if (moves.length === 0) {
            // No moves? Checkmate or Stalemate.
            // If checkmate (king is attacked), huge negative/positive score.
            // If stalemate, 0 score.
            // For simplicity, let's return evaluation. evaluateBoard checks material. 
            // Better to check isSquareAttacked.
            if (this.isCheckmate(board, isMaximizing ? color : (color === PieceColor.WHITE ? PieceColor.BLACK : PieceColor.WHITE))) {
                return { bestScore: isMaximizing ? -10000 : 10000 };
            }
            return { bestScore: 0 }; // Draw
        }

        let bestMove = null;

        if (isMaximizing) {
            let maxEval = -Infinity;
            for (const move of moves) {
                // Simulate move
                const nextBoard = this.simulateMove(board, move);
                const evaluation = this.minimax(nextBoard, depth - 1, false, alpha, beta, color).bestScore;

                if (evaluation > maxEval) {
                    maxEval = evaluation;
                    bestMove = move;
                }
                alpha = Math.max(alpha, evaluation);
                if (beta <= alpha) break;
            }
            return { bestMove, bestScore: maxEval };
        } else {
            let minEval = Infinity;
            for (const move of moves) {
                const nextBoard = this.simulateMove(board, move);
                const evaluation = this.minimax(nextBoard, depth - 1, true, alpha, beta, color).bestScore;

                if (evaluation < minEval) {
                    minEval = evaluation;
                    bestMove = move;
                }
                beta = Math.min(beta, evaluation);
                if (beta <= alpha) break;
            }
            return { bestMove, bestScore: minEval };
        }
    }

    getAllLegalMoves(board, color) {
        let allMoves = [];
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                const piece = board.getPiece(i, j);
                if (piece && piece.color === color) {
                    // Use Rules.js to get legal moves
                    // Note: Rules.getLegalMoves requires context (enPassant etc). 
                    // Simulating deep context is hard without GameState cloning. 
                    // For now, let's use current game settings/state for context approximation?
                    // BUT: En Passant target changes every move. 
                    // To do this properly, 'board' in minimax also needs 'enPassantTarget' and 'castlingRights'.
                    // Simplification: Ignore En Passant/Castling for AI depth > 1 for now or attach to board.

                    const context = {
                        enPassantTarget: this.game.enPassantTarget, // Warning: this is static from current state
                        castlingEnabled: this.game.settings.castlingEnabled,
                        enPassantEnabled: this.game.settings.enPassantEnabled
                    };

                    const moves = Rules.getLegalMoves(board, i, j, context);
                    moves.forEach(m => {
                        allMoves.push({ from: { r: i, c: j }, to: { r: m.row, c: m.col }, ...m });
                    });
                }
            }
        }
        // Improve ordering? e.g. Captures first
        allMoves.sort((a, b) => {
            // Prioritize captures...
            return 0;
        });
        return allMoves;
    }

    simulateMove(board, move) {
        const nextBoard = board.clone();

        // Logic similar to getLegalMoves simulation
        if (move.isCastling) {
            nextBoard.movePiece(move.from.r, move.from.c, move.to.r, move.to.c);
            const rookSrcCol = move.side === 'k' ? 7 : 0;
            const rookDstCol = move.side === 'k' ? 5 : 3;
            const rook = nextBoard.squares[move.from.r][rookSrcCol];
            nextBoard.squares[move.from.r][rookDstCol] = rook;
            nextBoard.squares[move.from.r][rookSrcCol] = null;
        } else if (move.isEnPassant) {
            nextBoard.movePiece(move.from.r, move.from.c, move.to.r, move.to.c);
            nextBoard.squares[move.from.r][move.to.c] = null;
        } else {
            nextBoard.movePiece(move.from.r, move.from.c, move.to.r, move.to.c);
        }

        // Promotion? Auto-promote to Queen for AI
        const piece = nextBoard.getPiece(move.to.r, move.to.c);
        if (piece && piece.type === PieceType.PAWN) {
            if (move.to.r === 0 || move.to.r === 7) {
                piece.type = PieceType.QUEEN;
            }
        }

        return nextBoard;
    }

    isCheckmate(board, color) {
        // Find King
        const kingPos = board.findKing(color);
        const opponent = color === PieceColor.WHITE ? PieceColor.BLACK : PieceColor.WHITE;
        return Rules.isSquareAttacked(board, kingPos.row, kingPos.col, opponent);
    }
}
