import { Piece, PieceType, PieceColor } from './Piece.js';

export default class Board {
    constructor() {
        this.squares = Array(8).fill(null).map(() => Array(8).fill(null));
        this.resetBoard();
    }

    resetBoard() {
        // Clear board
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                this.squares[i][j] = null;
            }
        }

        // Setup Pawns
        for (let i = 0; i < 8; i++) {
            this.squares[1][i] = new Piece(PieceColor.BLACK, PieceType.PAWN);
            this.squares[6][i] = new Piece(PieceColor.WHITE, PieceType.PAWN);
        }

        // Setup Other Pieces
        const backRowPieces = [
            PieceType.ROOK, PieceType.KNIGHT, PieceType.BISHOP, PieceType.QUEEN,
            PieceType.KING, PieceType.BISHOP, PieceType.KNIGHT, PieceType.ROOK
        ];

        backRowPieces.forEach((type, col) => {
            this.squares[0][col] = new Piece(PieceColor.BLACK, type);
            this.squares[7][col] = new Piece(PieceColor.WHITE, type);
        });
    }

    getPiece(row, col) {
        if (row < 0 || row > 7 || col < 0 || col > 7) return null;
        return this.squares[row][col];
    }

    movePiece(fromRow, fromCol, toRow, toCol) {
        const piece = this.squares[fromRow][fromCol];
        this.squares[toRow][toCol] = piece;
        this.squares[fromRow][fromCol] = null;
        if (piece) piece.hasMoved = true;
    }

    clone() {
        const newBoard = new Board();
        // Optimized copy
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                const p = this.squares[i][j];
                if (p) {
                    const newP = new Piece(p.color, p.type);
                    newP.hasMoved = p.hasMoved;
                    newBoard.squares[i][j] = newP;
                } else {
                    newBoard.squares[i][j] = null;
                }
            }
        }
        return newBoard;
    }

    // Find King location
    findKing(color) {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                const p = this.squares[i][j];
                if (p && p.type === PieceType.KING && p.color === color) {
                    return { row: i, col: j };
                }
            }
        }
        return null;
    }

    // Helper to visualize in console
    toString() {
        return this.squares.map(row =>
            row.map(p => p ? (p.color === PieceColor.WHITE ? p.type.toUpperCase() : p.type) : '.').join(' ')
        ).join('\n');
    }
}
