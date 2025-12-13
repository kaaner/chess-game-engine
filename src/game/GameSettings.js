export default class GameSettings {
    constructor() {
        this.castlingEnabled = true;
        this.enPassantEnabled = true;
        this.promotionPieces = ['q', 'r', 'b', 'n']; // Default: Queen, Rook, Bishop, Knight
    }

    toggleCastling() {
        this.castlingEnabled = !this.castlingEnabled;
    }

    toggleEnPassant() {
        this.enPassantEnabled = !this.enPassantEnabled;
    }

    setPromotionPieces(pieces) {
        this.promotionPieces = pieces;
    }
}
