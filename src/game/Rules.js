import { PieceType, PieceColor } from './Piece.js';

export default class Rules {
    static getPseudoLegalMoves(board, piece, row, col) {
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
                    const targetPiece = board.getPiece(row + r, col + c);
                    if (targetPiece && targetPiece.color !== color) {
                        moves.push({ row: row + r, col: col + c });
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

    static getLegalMoves(board, row, col) {
        const piece = board.getPiece(row, col);
        if (!piece) return [];

        const pseudoMoves = Rules.getPseudoLegalMoves(board, piece, row, col);
        const legalMoves = [];

        pseudoMoves.forEach(move => {
            // Simulate move
            const tempBoard = board.clone();
            tempBoard.movePiece(row, col, move.row, move.col);

            // Find our king
            const kingPos = tempBoard.findKing(piece.color);

            // Check if king is asserted
            const opponentColor = piece.color === PieceColor.WHITE ? PieceColor.BLACK : PieceColor.WHITE;
            if (!Rules.isSquareAttacked(tempBoard, kingPos.row, kingPos.col, opponentColor)) {
                legalMoves.push(move);
            }
        });

        return legalMoves;
    }
}
