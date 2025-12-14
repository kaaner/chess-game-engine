
import './style.css'
import GameState from './game/GameState.js';
import ChessView from './view/ChessView.js';

const game = new GameState();
const boardElement = document.getElementById('chess-board');

// Pass the element and the game state
// Note: We need to wait for DOMContent or ensure element exists.
// Since script is type=module and defer by default in Vite, it should be fine if element is in body.

// But wait, my index.html structure might be replaced by this script?
// Ah, my previous main.js was overwriting innerHTML of #app.
// I should structure it properly.

document.querySelector('#app').innerHTML = `
  <div class="chess-container">
    <h1>Antigravity Chess</h1>
    <div id="chess-board"></div>
    <div id="controls">
       <div id="status">White to move</div>
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
