export default class ChessView {
    constructor(element, gameState) {
        this.element = element;
        this.gameState = gameState;
        this.squares = []; // DOM elements 8x8

        this.selectedSquare = null; // {row, col}
        this.renderBoard();
    }

    renderBoard() {
        this.element.innerHTML = '';
        this.element.classList.add('chess-board');

        for (let i = 0; i < 8; i++) {
            const row = [];
            for (let j = 0; j < 8; j++) {
                const square = document.createElement('div');
                square.classList.add('square');
                square.dataset.row = i;
                square.dataset.col = j;

                // Interaction
                square.addEventListener('click', () => this.handleSquareClick(i, j));

                // Color logic: (row + col) % 2 === 0 -> Light, else Dark
                // But usually, a8 (0,0) is white? No, a8 is white. 
                // 0,0 is a8. 0+0=0 even -> light. Correct.
                // 0,1 is b8. 0+1=1 odd -> dark. Correct.
                const isLight = (i + j) % 2 === 0;
                square.classList.add(isLight ? 'light' : 'dark');

                this.element.appendChild(square);
                row.push(square);
            }
            this.squares.push(row);
        }
        this.updatePieces();
    }

    handleSquareClick(row, col) {
        const piece = this.gameState.getBoard().getPiece(row, col);
        const isMyPiece = piece && piece.color === this.gameState.turn;

        if (this.selectedSquare) {
            // If clicking invalid square or same square, deselect
            // If clicking valid move, execute
            // If clicking own piece (different one), change selection

            if (this.selectedSquare.row === row && this.selectedSquare.col === col) {
                this.deselectSquare();
                return;
            }

            if (isMyPiece) {
                this.selectSquare(row, col);
                return;
            }

            // Attempt move
            const success = this.gameState.makeMove(
                this.selectedSquare.row,
                this.selectedSquare.col,
                row,
                col
            );

            if (success) {
                this.updatePieces();
                this.deselectSquare();
                // Sound or status update here
                const statusEl = document.getElementById('status');
                if (statusEl) statusEl.innerText = `${this.gameState.turn === 'w' ? 'White' : 'Black'} to move`;
                if (this.gameState.gameOver) {
                    if (statusEl) statusEl.innerText = `Game Over! Winner: ${this.gameState.winner}`;
                }
            } else {
                // Invalid move
                this.deselectSquare();
            }

        } else {
            // No selection, select if own piece
            if (isMyPiece) {
                this.selectSquare(row, col);
            }
        }
    }

    selectSquare(row, col) {
        if (this.selectedSquare) {
            this.squares[this.selectedSquare.row][this.selectedSquare.col].classList.remove('selected');
        }
        this.selectedSquare = { row, col };
        this.squares[row][col].classList.add('selected');
    }

    deselectSquare() {
        if (this.selectedSquare) {
            this.squares[this.selectedSquare.row][this.selectedSquare.col].classList.remove('selected');
        }
        this.selectedSquare = null;
    }

    updatePieces() {
        const board = this.gameState.getBoard();
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                const piece = board.getPiece(i, j);
                const square = this.squares[i][j];
                square.innerHTML = ''; // Clear

                if (piece) {
                    const pieceEl = document.createElement('div');
                    pieceEl.classList.add('piece');
                    pieceEl.classList.add(piece.color === 'w' ? 'white' : 'black');

                    // Map types to unicode for now (or images later)
                    const mapping = {
                        'k': piece.color === 'w' ? '♔' : '♚',
                        'q': piece.color === 'w' ? '♕' : '♛',
                        'r': piece.color === 'w' ? '♖' : '♜',
                        'b': piece.color === 'w' ? '♗' : '♝',
                        'n': piece.color === 'w' ? '♘' : '♞',
                        'p': piece.color === 'w' ? '♙' : '♟'
                    };

                    pieceEl.textContent = mapping[piece.type];
                    square.appendChild(pieceEl);
                }
            }
        }
    }
}
