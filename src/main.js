
import './style.css'
import GameState from './game/GameState.js';

const game = new GameState();
console.log(game.board.toString());

// Example move: White Pawn to e4 (row 6, col 4 -> row 4, col 4) if board is 0-indexed from top-left.
// Wait, my board setup:
// Row 0: Black Pieces
// Row 1: Black Pawns
// Row 6: White Pawns
// Row 7: White Pieces
// So e2 -> e4 is (6, 4) -> (4, 4)
console.log("Attempting e2 -> e4");
const success = game.makeMove(6, 4, 4, 4);
console.log("Move success:", success);
console.log(game.board.toString());


document.querySelector('#app').innerHTML = `
  <div class="chess-container">
    <h1>Antigravity Chess</h1>
    <div id="chess-board"></div>
    <div id="controls"></div>
  </div>
`
