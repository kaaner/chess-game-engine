export default class ChessView {
    constructor(element, gameState) {
        this.element = element;
        this.gameState = gameState;
        this.squares = []; // DOM elements 8x8

        this.selectedSquare = null; // {row, col}

        // Setup controls (clock + settings)
        this.setupControlsUI();

        // Setup History Panel
        this.setupHistoryUI();

        // Setup Captured Pieces Panel
        this.setupCapturedPiecesUI();

        this.renderBoard();

        // Init clock
        this.gameState.initClock(10, 0, (w, b) => this.updateClockUI(w, b));
    }

    setupCapturedPiecesUI() {
        // Create container for captured pieces (Top for White's captures? Or side?)
        // Standard:
        // Top Player (Black) - Captured White pieces (Pieces black has won) OR Pieces Black has lost?
        // Usually: "Material Advantage".
        // Let's show "Captured by White" (Black pieces) near White clock?
        // Or "Pieces Lost by Black".

        // Let's do:
        // Top (Black Side): Show White pieces captured by Black. (Pieces White lost)
        // Bottom (White Side): Show Black pieces captured by White. (Pieces Black lost)

        const controls = document.getElementById('controls');
        const boardContainer = document.querySelector('.chess-container'); // Need a better anchor

        // Insert captured-pieces-top before board?
        // Existing layout: .chess-container -> #controls, #chess-board.
        // Let's wrap controls and board?

        // Simplest: Add to #controls (which is above board).
        // But controls has clock.
        // Let's add specific containers.

        const capturedContainer = document.createElement('div');
        capturedContainer.id = 'captured-pieces-container';
        capturedContainer.innerHTML = `
            <div id="captured-top" class="captured-area"></div>
            <div id="captured-bottom" class="captured-area"></div>
        `;

        // Insert between controls and board? Or inside controls?
        // Controls is flex row.
        // Let's put it above board, below controls?

        // We want to insert 'capturedContainer' BEFORE this.element (chess-board), but INSIDE the parent (.chess-container).
        if (this.element && this.element.parentNode) {
            this.element.parentNode.insertBefore(capturedContainer, this.element);
        }

        // Actually, we want one above (Black lost?) and one below (White lost?).
        // If we duplicate logic, we can split.
        // For now, let single container handle both top (opponents captured by me?)

        // Layout:
        // Controls (Clock)
        // Captured (Black pieces captured by White) - if White is bottom?
        // Board
        // Captured (White pieces captured by Black)

        // Let's stick to simple: One container with top/bottom sections.
    }
    setupHistoryUI() {
        const app = document.getElementById('app');
        const historyContainer = document.createElement('div');
        historyContainer.id = 'history-container';
        historyContainer.innerHTML = `
            <h3>Move History</h3>
            <div id="move-list"></div>
        `;

        // Insert before controls
        const controls = document.getElementById('controls');
        app.insertBefore(historyContainer, controls);
    }

    setupControlsUI() {
        const controls = document.getElementById('controls');
        if (!controls) return;

        const clockContainer = document.createElement('div');
        clockContainer.id = 'clock-container';
        clockContainer.innerHTML = `
            <div id="clock-black" class="clock">10:00</div>
            <div id="status">White to move</div>
            <div id="clock-white" class="clock">10:00</div>
            <div class="control-actions">
                <button id="pause-btn" title="Pause Game">⏸️</button>
                <button id="restart-btn" title="Restart Game">🔄</button>
                <button id="settings-btn" title="Settings">⚙️</button>
            </div>
        `;
        controls.innerHTML = ''; // Start fresh
        controls.appendChild(clockContainer);

        document.getElementById('settings-btn').addEventListener('click', () => this.showSettingsDialog());
        document.getElementById('pause-btn').addEventListener('click', () => this.handlePauseToggle());
        document.getElementById('restart-btn').addEventListener('click', () => this.handleRestart());
    }

    handlePauseToggle() {
        this.gameState.togglePause();
        const btn = document.getElementById('pause-btn');
        btn.innerText = this.gameState.isPaused ? '▶️' : '⏸️';

        const statusEl = document.getElementById('status');
        if (this.gameState.isPaused) {
            statusEl.innerText = "Paused";
            this.element.classList.add('paused');
        } else {
            statusEl.innerText = `${this.gameState.turn === 'w' ? 'White' : 'Black'} to move`;
            this.element.classList.remove('paused');
        }
    }

    handleRestart() {
        if (confirm('Are you sure you want to restart the game?')) {
            this.gameState.resetGame();

            // Clean UI
            this.deselectSquare();
            this.updatePieces();
            this.updateHistoryUI(); // Clear history

            // Reset Clock UI
            this.updateClockUI(600, 600); // 10 mins default

            const btn = document.getElementById('pause-btn');
            btn.innerText = '⏸️';
            this.element.classList.remove('paused');

            document.getElementById('status').innerText = 'White to move';
        }
    }

    updateClockUI(timeWhite, timeBlack) {
        const fmt = (t) => {
            const m = Math.floor(t / 60);
            const s = Math.floor(t % 60);
            return `${m}:${s < 10 ? '0' : ''}${s}`;
        };
        const elW = document.getElementById('clock-white');
        const elB = document.getElementById('clock-black');
        if (elW) elW.innerText = fmt(timeWhite);
        if (elB) elB.innerText = fmt(timeBlack);
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

                // Coordinates (Chess.com style: Rank on left file, File on bottom rank)
                // Rank (1-8): Show on left-most column (j === 0). 
                // Rows 0-7 correspond to Ranks 8-1.
                if (j === 0) {
                    const rankLabel = document.createElement('div');
                    rankLabel.classList.add('coord-rank');
                    rankLabel.innerText = 8 - i; // Row 0 -> 8, Row 7 -> 1
                    square.appendChild(rankLabel);
                }

                // File (a-h): Show on bottom-most row (i === 7).
                // Cols 0-7 correspond to Files a-h.
                if (i === 7) {
                    const fileLabel = document.createElement('div');
                    fileLabel.classList.add('coord-file');
                    fileLabel.innerText = String.fromCharCode(97 + j); // 0 -> 'a'
                    square.appendChild(fileLabel);
                }

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
            const result = this.gameState.makeMove(
                this.selectedSquare.row,
                this.selectedSquare.col,
                row,
                col
            );

            if (result === 'PROMOTION_NEEDED') {
                this.showPromotionDialog(this.selectedSquare.row, this.selectedSquare.col, row, col);
                return;
            }

            if (result) {
                this.updatePieces();
                this.updateHistoryUI(); // Update history
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
            this.deselectSquare();
        }
        this.selectedSquare = { row, col };
        this.squares[row][col].classList.add('selected');

        // Highlight valid moves
        import('../game/Rules.js').then(module => {
            const Rules = module.default;
            // Ideally GameState should handle this dependency, but for now importing here is quick
            const legalMoves = Rules.getLegalMoves(this.gameState.getBoard(), row, col);

            legalMoves.forEach(move => {
                const square = this.squares[move.row][move.col];
                square.classList.add('highlight-move');
                // Optional: Add a visual indicator dot
                const dot = document.createElement('div');
                dot.classList.add('move-hint');
                square.appendChild(dot);
            });
        });
    }

    deselectSquare() {
        if (this.selectedSquare) {
            this.squares[this.selectedSquare.row][this.selectedSquare.col].classList.remove('selected');
        }
        this.selectedSquare = null;

        // Clear highlights
        const hints = this.element.querySelectorAll('.highlight-move');
        hints.forEach(el => {
            el.classList.remove('highlight-move');
            const dot = el.querySelector('.move-hint');
            if (dot) dot.remove();
        });
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

    showPromotionDialog(fromRow, fromCol, toRow, toCol) {
        // Create modal container
        const modal = document.createElement('div');
        modal.classList.add('promotion-modal');

        const pieces = ['q', 'r', 'b', 'n']; // Queen, Rook, Bishop, Knight
        const color = this.gameState.turn;

        pieces.forEach(type => {
            const btn = document.createElement('div');
            btn.classList.add('promotion-piece');
            btn.classList.add(color === 'w' ? 'white' : 'black');

            // Map types to unicode
            const mapping = {
                'q': color === 'w' ? '♕' : '♛',
                'r': color === 'w' ? '♖' : '♜',
                'b': color === 'w' ? '♗' : '♝',
                'n': color === 'w' ? '♘' : '♞'
            };
            btn.textContent = mapping[type];

            btn.addEventListener('click', () => {
                this.gameState.makeMove(fromRow, fromCol, toRow, toCol, type);
                this.updatePieces();
                this.deselectSquare();

                // Update status
                const statusEl = document.getElementById('status');
                if (statusEl) statusEl.innerText = `${this.gameState.turn === 'w' ? 'White' : 'Black'} to move`;

                modal.remove();
            });

            modal.appendChild(btn);
        });

        this.element.appendChild(modal);
    }

    showSettingsDialog() {
        const modal = document.createElement('div');
        modal.classList.add('settings-modal');

        const settings = this.gameState.settings;

        modal.innerHTML = `
            <div class="settings-content">
                <h2>Game Settings</h2>
                
                <div class="setting-item">
                    <label>
                        <input type="checkbox" id="toggle-castling" ${settings.castlingEnabled ? 'checked' : ''}>
                        Allow Castling
                    </label>
                </div>
                
                <div class="setting-item">
                    <label>
                        <input type="checkbox" id="toggle-enpassant" ${settings.enPassantEnabled ? 'checked' : ''}>
                        Allow En Passant
                    </label>
                </div>
                
                <div class="setting-item">
                    <h3>Promotion Options</h3>
                    <div class="promotion-options">
                        ${['q', 'r', 'b', 'n'].map(p => `
                            <label>
                                <input type="checkbox" class="promo-option" value="${p}" checked disabled>
                                ${p.toUpperCase()}
                            </label>
                        `).join('')}
                    </div>
                    <small>(Configuring allowed pieces coming soon)</small>
                </div>

                <div class="settings-actions">
                    <button id="close-settings">Close</button>
                </div>
            </div>
        `;

        this.element.appendChild(modal);

        // Event Listeners
        modal.querySelector('#toggle-castling').addEventListener('change', () => settings.toggleCastling());
        modal.querySelector('#toggle-enpassant').addEventListener('change', () => settings.toggleEnPassant());

        modal.querySelector('#close-settings').addEventListener('click', () => modal.remove());
    }

    updateHistoryUI() {
        const list = document.getElementById('move-list');
        if (!list) return;

        list.innerHTML = '';
        const history = this.gameState.history;

        // Group into pairs (White, Black)
        for (let i = 0; i < history.length; i += 2) {
            const moveWhite = history[i];
            const moveBlack = history[i + 1];

            const moveRow = document.createElement('div');
            moveRow.classList.add('move-row');

            const num = document.createElement('span');
            num.classList.add('move-num');
            num.innerText = `${Math.floor(i / 2) + 1}.`;

            const wMove = document.createElement('span');
            wMove.classList.add('move-text');
            wMove.innerText = this.formatMove(moveWhite);

            moveRow.appendChild(num);
            moveRow.appendChild(wMove);

            if (moveBlack) {
                const bMove = document.createElement('span');
                bMove.classList.add('move-text');
                bMove.innerText = this.formatMove(moveBlack);
                moveRow.appendChild(bMove);
            }

            list.appendChild(moveRow);
        }

        // Auto scroll to bottom
        list.scrollTop = list.scrollHeight;

        this.updateCapturedPiecesUI();
    }

    updateCapturedPiecesUI() {
        const topArea = document.getElementById('captured-top'); // Pieces White lost (captured by Black) ?
        const bottomArea = document.getElementById('captured-bottom'); // Pieces Black lost (captured by White) ?

        if (!topArea || !bottomArea) return;

        // Logic: 
        // If Board is White-Orientation (default):
        // Top is Black Side. Show pieces Black has captured (White pieces lost).
        // Bottom is White Side. Show pieces White has captured (Black pieces lost).

        const whiteLost = this.gameState.capturedPieces.w;
        const blackLost = this.gameState.capturedPieces.b;

        topArea.innerHTML = this.renderCapturedList(whiteLost, 'w');
        bottomArea.innerHTML = this.renderCapturedList(blackLost, 'b');
    }

    renderCapturedList(pieces, color) {
        // Sort pieces by value
        const values = { 'p': 1, 'n': 3, 'b': 3, 'r': 5, 'q': 9, 'k': 0 };
        const sorted = [...pieces].sort((a, b) => values[a] - values[b]);

        // Render
        return sorted.map(p => {
            const symbol = this.getPieceSymbol(p, color);
            return `<span class="captured-piece ${color}">${symbol}</span>`;
        }).join('');
    }

    getPieceSymbol(type, color) {
        const mapping = {
            'k': color === 'w' ? '♔' : '♚',
            'q': color === 'w' ? '♕' : '♛',
            'r': color === 'w' ? '♖' : '♜',
            'b': color === 'w' ? '♗' : '♝',
            'n': color === 'w' ? '♘' : '♞',
            'p': color === 'w' ? '♙' : '♟'
        };
        return mapping[type];
    }

    formatMove(move) {
        // Simple Algebraic Notation (simplified)
        // Ideally needs to handle disambiguation (e.g. Nbd7), checks (+), mates (#)
        // For now: [Piece][ToCol][ToRow]
        // E.g. e4, Nf3, Bxc5

        const pieceMap = { 'p': '', 'n': 'N', 'b': 'B', 'r': 'R', 'q': 'Q', 'k': 'K' };

        let text = '';

        // Castle
        // We don't have isCastling flag in history yet easily accessible?
        // GameState history stores { from: {r,c}, to: {r,c}, piece: object, promotion: type }
        // We can infer castling if King moves > 1 file
        if (move.piece.type === 'k' && Math.abs(move.to.c - move.from.c) > 1) {
            return move.to.c > move.from.c ? 'O-O' : 'O-O-O';
        }

        text += pieceMap[move.piece.type];

        // Capture? 
        // History doesn't store 'captured' flag explicitly in the simple object pushed to history in GameState.js
        // We might need to check if a piece was there? But we don't have past board state easily here.
        // For now, let's just show destination.
        // If pawn capture, we usually show file (e.g. exd5).

        const userFriendlyCol = String.fromCharCode(97 + move.to.c);
        const userFriendlyRow = 8 - move.to.r;

        text += userFriendlyCol + userFriendlyRow;

        if (move.promotion) {
            text += '=' + move.promotion.toUpperCase();
        }

        return text;
    }
}
