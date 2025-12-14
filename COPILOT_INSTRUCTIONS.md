# Chess Game - Copilot Instructions

## Project Context
This is a standard Chess Game implementation using Vanilla JavaScript, HTML, and CSS. The goal is to create a fully functional, aesthetically pleasing, and feature-rich chess application.

## Completed Work
### Core Logic
- [x] **Game Engine**: Implemented `GameState` to manage turns, history, and game status.
- [x] **Board Representation**: 8x8 grid management in `Board.js`.
- [x] **Move Validation**: Full validation in `Rules.js` including check/checkmate detection.
- [x] **Special Moves**:
  - En Passant
  - Castling (Kingside & Queenside)
  - Pawn Promotion (currently auto-promotes to Queen or requires UI handling check)
- [x] **Game Clock**: Functional timer with start/stop/reset capabilities.

### User Interface
- [x] **Board Rendering**: Visual representation of the board and pieces.
- [x] **Captured Pieces**: Split layout displaying captured pieces for White and Black (above and below the board).
- [x] **Responsive Layout**: Basic responsive adjustments.
- [x] **Bug Fixes**: Resolved issues with board visibility and CSS layout conflicts.

## Planned Work & Future Roadmap
### Features
- [ ] **AI Opponent**: Implement a basic chess engine or minimax algorithm for single-player mode.
- [ ] **Network Multiplayer**: Use WebSockets (e.g., Socket.io) to allow remote play.
- [ ] **Persistance**: Save/Load game state using `localStorage`.
- [ ] **Move History UI**: Display algebraic notation of moves (e.g., "e4", "Nf3") in a sidebar.
- [ ] **Sound Effects**: Add audio feedback for moves, captures, and checkmate.

### Polish & Refactoring
- [ ] **Animations**: Smooth transitions for piece movement.
- [ ] **Theming**: Support for different board themes and piece sets.
- [ ] **Testing**: Add unit tests for `Rules.js` and `GameState.js` to ensure stability.

## User Preferences
- Prefer modern ES6+ JavaScript syntax.
- Maintain separation of concerns (Logic vs UI).
- CSS should be clean and use Flexbox/Grid where appropriate.
