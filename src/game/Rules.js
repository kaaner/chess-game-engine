import { PieceType, PieceColor } from './Piece.js';

export default class Rules {
    static getPseudoLegalMoves(board, piece, row, col, context = {}) {
        const { enPassantTarget, castlingEnabled = true, enPassantEnabled = true } = context;
        const moves = [];
        const color = piece.color;
        const direction = color === PieceColor.WHITE ? -1 : 1;

        switch (piece.type) {
            case PieceType.PAWN:
                // Forward 1
                if (board.getPiece(row + direction, col) === null) {
                    moves.push({ row: row + direction, col: col });
                    // Forward 2 (start)
                    if ((color === PieceColor.WHITE && row === 6) || (color === PieceColor.BLACK && row === 1)) {
                        if (board.getPiece(row + 2 * direction, col) === null) {
                            moves.push({ row: row + 2 * direction, col: col });
                        }
                    }
                }
                // Captures
                [[direction, -1], [direction, 1]].forEach(([r, c]) => {
                    const targetRow = row + r;
                    const targetCol = col + c;

                    if (Rules.isInside(targetRow, targetCol)) {
                        const targetPiece = board.getPiece(targetRow, targetCol);
                        if (targetPiece && targetPiece.color !== color) {
                            moves.push({ row: targetRow, col: targetCol });
                        }
                        // En Passant
                        if (enPassantEnabled && enPassantTarget && enPassantTarget.row === targetRow && enPassantTarget.col === targetCol) {
                            moves.push({ row: targetRow, col: targetCol, isEnPassant: true });
                        }
                    }
                });
                break;

            case PieceType.KNIGHT:
                const knightMoves = [
                    [-2, -1], [-2, 1], [-1, -2], [-1, 2],
                    [1, -2], [1, 2], [2, -1], [2, 1]
                ];
                knightMoves.forEach(([r, c]) => {
                    const newRow = row + r;
                    const newCol = col + c;
                    if (Rules.isInside(newRow, newCol)) {
                        const target = board.getPiece(newRow, newCol);
                        if (!target || target.color !== color) {
                            moves.push({ row: newRow, col: newCol });
                        }
                    }
                });
                break;

            case PieceType.BISHOP:
            case PieceType.ROOK:
            case PieceType.QUEEN:
                const dirs = [];
                if (piece.type === PieceType.BISHOP || piece.type === PieceType.QUEEN) {
                    dirs.push([-1, -1], [-1, 1], [1, -1], [1, 1]); // Diagonals
                }
                if (piece.type === PieceType.ROOK || piece.type === PieceType.QUEEN) {
                    dirs.push([-1, 0], [1, 0], [0, -1], [0, 1]); // Orthogonals
                }

                dirs.forEach(([dr, dc]) => {
                    let r = row + dr;
                    let c = col + dc;
                    while (Rules.isInside(r, c)) {
                        const target = board.getPiece(r, c);
                        if (target === null) {
                            moves.push({ row: r, col: c });
                        } else {
                            if (target.color !== color) {
                                moves.push({ row: r, col: c });
                            }
                            break; // Blocked
                        }
                        r += dr;
                        c += dc;
                    }
                });
                break;

            case PieceType.KING:
                // Normal moves
                const kingMoves = [
                    [-1, -1], [-1, 0], [-1, 1],
                    [0, -1], [0, 1],
                    [1, -1], [1, 0], [1, 1]
                ];
                kingMoves.forEach(([r, c]) => {
                    const newRow = row + r;
                    const newCol = col + c;
                    if (Rules.isInside(newRow, newCol)) {
                        const target = board.getPiece(newRow, newCol);
                        if (!target || target.color !== color) {
                            moves.push({ row: newRow, col: newCol });
                        }
                    }
                });

                // Castling
                if (castlingEnabled && !piece.hasMoved) {
                    const rookRow = color === PieceColor.WHITE ? 7 : 0; // But wait, row logic: White is 7?
                    // My board setup: Row 0 Black, Row 7 White.
                    // Yes, white king at (7, 4)

                    // Kingside (dist 2) -> Rook at col 7
                    // Queenside (dist 3) -> Rook at col 0

                    const opponentColor = color === PieceColor.WHITE ? PieceColor.BLACK : PieceColor.WHITE;

                    // Helper to check safety and emptiness
                    const checkCastling = (rookCol, emptyCols, passThroughCols) => {
                        const rook = board.getPiece(row, rookCol);
                        if (rook && rook.type === PieceType.ROOK && rook.color === color && !rook.hasMoved) {
                            // Check empty squares
                            if (emptyCols.every(c => board.getPiece(row, c) === null)) {
                                // Check not in check, and pass-through not in check
                                // We only check if start (row,col) is attacked, and pass-through cols.
                                // "Cannot castle out of check" -> Start square not attacked.
                                // "Cannot castle through check" -> Pass through squares not attacked.
                                // Destination square not attacked.

                                const squaresToCheck = [col, ...passThroughCols]; // col is king start

                                // This check is expensive here (recursive dependency on isSquareAttacked calling getPseudoLegalMoves),
                                // but we are inside getPseudoLegalMoves. Infinite recursion risk if we call isSquareAttacked?
                                // isSquareAttacked calls getPseudoLegalMoves.
                                // If we are calculating King moves, and we check isSquareAttacked, we look at opponent pieces.
                                // Opponent pieces (e.g. Rook) call getPseudoLegalMoves(ROOK). That is fine.
                                // Opponent King? call getPseudoLegalMoves(KING). 
                                // If opponent king checks castling, it checks isSquareAttacked by us... 
                                // Standard recursion protection or simplifiction is needed if we go deep.
                                // But usually 1 level deep is fine.

                                // HOWEVER: usually pseudo-legal moves do NOT check for checks. 
                                // Castling is unique because the move ITSELF is illegal if in check.

                                // Let's generate the move as "Pseudo-legal" if path is empty and pieces haven't moved.
                                // Validation of "through check" should happen in getLegalMoves ideally?
                                // But standard "getLegalMoves" simply checks if END result leaves king in check.
                                // Castling requires intermediate squares to be safe.

                                moves.push({
                                    row: row,
                                    col: rookCol === 7 ? 6 : 2, // Destination: g1 or c1 equivalent
                                    isCastling: true,
                                    side: rookCol === 7 ? 'k' : 'q'
                                });
                            }
                        }
                    };

                    // Kingside
                    checkCastling(7, [5, 6], [5, 6]);
                    // Queenside
                    checkCastling(0, [1, 2, 3], [2, 3]); // King moves 2 squares (c1, d1 for queenside? No. King e1->c1. Passing d1. Target c1.) 
                    // e1(4) -> c1(2). Passing d1(3).
                    // Wait, standard: King e1, Queen d1, Bishop c1, Knight b1, Rook a1.
                    // Queenside castle: King moves e1 -> c1. Rook a1 -> d1.
                    // Empty squares needed: d1(3), c1(2), b1(1).
                    // Squares preventing check: e1(4), d1(3), c1(2). (b1 doesn't matter for check, just emptiness)

                    // So for Queenside: emptyCols=[1,2,3], passThroughCols=[2, 3] (Destination is 2. Passing 3.)

                    // Wait, passThroughCols logic for checkCastling: 
                    // King (4). Destination (2). Path: (3).
                    // Checked squares: 4 (Start), 3 (Path), 2 (Dest).

                    // Correct call for Queenside (rookCol=0): 
                    // emptyCols=[1,2,3].
                    // passThroughCols=[2, 3]. (Destination included in passThrough for generic check, plus 3).
                }
                break;
        }

        return moves;
    }

    static isInside(row, col) {
        return row >= 0 && row < 8 && col >= 0 && col < 8;
    }

    static isSquareAttacked(board, row, col, attackerColor) {
        // Check all pieces of attackerColor to see if they can move to (row, col)
        // Reverse logic is often more efficient (e.g. check knight jumps from square), but iterating all pieces is safer for generic implementation first.

        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                const piece = board.getPiece(i, j);
                if (piece && piece.color === attackerColor) {
                    const moves = Rules.getPseudoLegalMoves(board, piece, i, j);
                    // We only care if one of the moves hits (row, col)
                    if (moves.some(m => m.row === row && m.col === col)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    static getLegalMoves(board, row, col, context = {}) {
        const piece = board.getPiece(row, col);
        if (!piece) return [];

        const pseudoMoves = Rules.getPseudoLegalMoves(board, piece, row, col, context);
        const legalMoves = [];

        pseudoMoves.forEach(move => {
            // Special Castling Validation
            if (move.isCastling) {
                // Must not be in check currently
                const kingPos = { row, col };
                const opponentColor = piece.color === PieceColor.WHITE ? PieceColor.BLACK : PieceColor.WHITE;

                if (Rules.isSquareAttacked(board, kingPos.row, kingPos.col, opponentColor)) {
                    return; // Cannot castle out of check
                }

                // Check path squares
                const midCol = (move.col + col) / 2;
                if (Rules.isSquareAttacked(board, row, midCol, opponentColor)) {
                    return; // Cannot castle through check
                }

                if (Rules.isSquareAttacked(board, row, move.col, opponentColor)) {
                    return; // Cannot castle into check
                }
            }

            // Simulate move
            const tempBoard = board.clone();

            // If castling, move rook too for proper simulation
            if (move.isCastling) {
                tempBoard.movePiece(row, col, move.row, move.col); // Move King
                // Move Rook
                const rookSrcCol = move.side === 'k' ? 7 : 0;
                const rookDstCol = move.side === 'k' ? 5 : 3;

                // Manual rook move in clone without validation
                const rook = tempBoard.squares[row][rookSrcCol];
                tempBoard.squares[row][rookDstCol] = rook;
                tempBoard.squares[row][rookSrcCol] = null;
                if (rook) rook.hasMoved = true;
            } else if (move.isEnPassant) {
                tempBoard.movePiece(row, col, move.row, move.col);
                // Remove the captured pawn (behind the move destination)
                // If white moves up (-1), captured pawn was at (row, col+diff). 
                // Destination is (row-1, col+diff). 
                // Actually simpler: captured piece is at (row, move.col)
                tempBoard.squares[row][move.col] = null;
            } else {
                tempBoard.movePiece(row, col, move.row, move.col);
            }

            // Find our king
            const kingPos = tempBoard.findKing(piece.color);

            // Check if king is asserted (Standard check for all moves)
            const opponentColor = piece.color === PieceColor.WHITE ? PieceColor.BLACK : PieceColor.WHITE;
            if (!Rules.isSquareAttacked(tempBoard, kingPos.row, kingPos.col, opponentColor)) {
                legalMoves.push(move);
            }
        });

        return legalMoves;
    }
}
