export const PieceType = {
    PAWN: 'p',
    ROOK: 'r',
    KNIGHT: 'n',
    BISHOP: 'b',
    QUEEN: 'q',
    KING: 'k',
};

export const PieceColor = {
    WHITE: 'w',
    BLACK: 'b',
};

export class Piece {
    constructor(color, type) {
        this.color = color;
        this.type = type;
        this.hasMoved = false;
    }
}
