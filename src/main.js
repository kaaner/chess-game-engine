
import './style.css'
import GameState from './game/GameState.js';
import ChessView from './view/ChessView.js';

const game = new GameState();


// Pass the element and the game state
// Note: We need to wait for DOMContent or ensure element exists.
// Since script is type=module and defer by default in Vite, it should be fine if element is in body.

// But wait, my index.html structure might be replaced by this script?
// Ah, my previous main.js was overwriting innerHTML of #app.
// I should structure it properly.

document.querySelector('#app').innerHTML = `
  <div class="chess-container">
    <h1>Antigravity Chess</h1>
    <div class="game-layout">
        <div class="left-panel">
            <div class="eval-bar-container">
                <div id="eval-bar-fill"></div>
            </div>
            <div class="left-controls">
                <button id="analyze-btn" title="Toggle Analysis Panel">🔍</button>
                <button id="eval-status-btn" title="General Evaluation">📊</button>
                <button id="best-move-btn" title="Suggest Best Move">💡</button>
                <button id="review-move-btn" title="Review Last Move">🧐</button>
                <button id="chat-btn" title="Ask AI">💬</button>
            </div>
        </div>
        <div class="board-section">
            <div id="chess-board"></div>
            <div id="chat-widget" class="chat-widget" style="display: none;">
                <div class="chat-header">
                    <span>Chess Assistant</span>
                    <button class="chat-close" id="chat-close-btn">&times;</button>
                </div>
                <div id="chat-messages" class="chat-messages">
                    <div class="message system">Hello! Ask me about the game.</div>
                </div>
                <div class="chat-input-area">
                    <input type="text" id="chat-input" placeholder="Ask e.g. 'Best move?'...">
                    <button id="chat-send">Send</button>
                </div>
            </div>
        </div>
        <div class="side-panel">
            <div id="controls">
               <div id="status">White to move</div>
            </div>
            <div id="widget-area" class="widget-list">
                <!-- Widgets will be injected here -->
            </div>
        </div>
    </div>
        </div>
    </div>
  </div>
`;

// Now element exists
const boardElement = document.getElementById('chess-board');
if (!boardElement) {
  console.error('Chess board element not found!');
} else {
  const view = new ChessView(boardElement, game);
}

// Debug
console.log(game.board.toString());
