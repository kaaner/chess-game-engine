# Visual Feedback Implementation Plan

**Issue:** #8  
**Status:** In Progress  
**Start Date:** 2025-12-14  

## Implementation Phases

### Phase 1: Check & Checkmate Indicators (Priority: HIGH)

**Goal:** Provide clear visual feedback when king is in check or checkmate

**Tasks:**
1. Expose check state from GameState
   - Add `isInCheck(color)` method to GameState
   - Add `isCheckmate()` method to GameState
   
2. CSS Styles
   ```css
   .square.in-check {
     box-shadow: 0 0 20px rgba(255, 0, 0, 0.8);
     animation: pulse-check 1s infinite;
   }
   
   .square.checkmate {
     background: rgba(255, 0, 0, 0.3) !important;
     animation: flash-checkmate 0.5s ease-in-out 3;
   }
   ```

3. ChessView Updates
   - Add `updateCheckIndicators()` method
   - Call after each move
   - Clear previous check highlights

**Files:**
- `src/game/GameState.js`
- `src/game/Rules.js`
- `src/view/ChessView.js`
- `src/style.css`

**Estimated Time:** 2-3 hours

---

### Phase 2: Last Move Highlighting (Priority: HIGH)

**Goal:** Show which move was just played

**Tasks:**
1. Track last move in GameState
   - Store `lastMove: {from: {row, col}, to: {row, col}}`
   - Update after each move

2. CSS Styles
   ```css
   .square.last-move-from {
     background-color: rgba(255, 235, 59, 0.4) !important;
   }
   
   .square.last-move-to {
     background-color: rgba(255, 235, 59, 0.5) !important;
   }
   ```

3. ChessView Updates
   - Add `highlightLastMove()` method
   - Clear previous highlights before new move
   - Persist until next move

**Files:**
- `src/game/GameState.js`
- `src/view/ChessView.js`
- `src/style.css`

**Estimated Time:** 1-2 hours

---

### Phase 3: Selected Piece Feedback (Priority: MEDIUM)

**Goal:** Clear indication of which piece is currently selected

**Tasks:**
1. CSS Styles
   ```css
   .square.selected {
     background-color: rgba(76, 175, 80, 0.5) !important;
     border: 3px solid #4caf50;
     transform: scale(1.05);
     z-index: 10;
   }
   
   .square.selected .piece {
     filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.5));
   }
   ```

2. ChessView Updates
   - Enhance existing selection logic
   - Add/remove `.selected` class
   - Ensure only one selected at a time

**Files:**
- `src/view/ChessView.js`
- `src/style.css`

**Estimated Time:** 1 hour

---

### Phase 4: Capture Indicators (Priority: MEDIUM)

**Goal:** Distinguish capture moves from regular moves

**Tasks:**
1. Detect capture in move hints
   - Check if target square has opponent piece
   - Mark as capture move

2. CSS Styles
   ```css
   .move-hint.capture {
     background: rgba(255, 82, 82, 0.8);
     border: 2px solid #ff5252;
   }
   
   .move-hint.capture::before {
     content: '×';
     font-size: 1.5rem;
     color: white;
   }
   ```

3. ChessView Updates
   - Modify `showValidMoves()` to add `.capture` class
   - Handle en-passant as special capture

**Files:**
- `src/view/ChessView.js`
- `src/style.css`

**Estimated Time:** 1-2 hours

---

### Phase 5: Invalid Move Feedback (Priority: LOW)

**Goal:** Provide feedback when user attempts invalid move

**Tasks:**
1. CSS Animations
   ```css
   @keyframes shake {
     0%, 100% { transform: translateX(0); }
     25% { transform: translateX(-5px); }
     75% { transform: translateX(5px); }
   }
   
   .square.invalid-move {
     animation: shake 0.3s ease;
     background: rgba(255, 0, 0, 0.3) !important;
   }
   ```

2. ChessView Updates
   - Detect invalid move attempt
   - Add `.invalid-move` class
   - Remove after animation completes

**Files:**
- `src/view/ChessView.js`
- `src/style.css`

**Estimated Time:** 1 hour

---

### Phase 6: Turn Indicator (Priority: LOW)

**Goal:** Show whose turn it is

**Tasks:**
1. Add turn indicator UI element
   ```html
   <div id="turn-indicator">
     <span class="white-turn">White's Turn</span>
     <span class="black-turn">Black's Turn</span>
   </div>
   ```

2. CSS Styles
   ```css
   #turn-indicator {
     font-size: 1.2rem;
     padding: 0.5rem 1rem;
     border-radius: 8px;
     margin-bottom: 1rem;
   }
   
   .white-turn {
     background: rgba(255, 255, 255, 0.2);
     color: white;
   }
   
   .black-turn {
     background: rgba(0, 0, 0, 0.4);
     color: white;
   }
   ```

3. ChessView Updates
   - Update indicator after each move
   - Highlight active player

**Files:**
- `src/view/ChessView.js`
- `src/style.css`
- `index.html`

**Estimated Time:** 1 hour

---

### Phase 7: Stalemate & Draw Indicators (Priority: LOW)

**Goal:** Visual feedback for game end conditions

**Tasks:**
1. Expose stalemate state
   - Add `isStalemate()` to GameState
   - Add `isDraw()` for other draw conditions

2. CSS Styles
   ```css
   .game-end-overlay {
     position: absolute;
     top: 50%;
     left: 50%;
     transform: translate(-50%, -50%);
     background: rgba(0, 0, 0, 0.9);
     padding: 2rem;
     border-radius: 12px;
     font-size: 2rem;
     z-index: 1000;
   }
   ```

3. ChessView Updates
   - Detect game end
   - Show overlay with result
   - Disable further moves

**Files:**
- `src/game/GameState.js`
- `src/view/ChessView.js`
- `src/style.css`

**Estimated Time:** 2 hours

---

## Testing Checklist

- [ ] Check indicator appears when king in check
- [ ] Checkmate visual is distinct from check
- [ ] Last move highlighting works correctly
- [ ] Selected piece has clear visual feedback
- [ ] Capture moves show different indicator
- [ ] Invalid moves trigger shake animation
- [ ] Turn indicator updates correctly
- [ ] Stalemate shows proper overlay
- [ ] All visuals work on mobile
- [ ] Color-blind accessibility verified
- [ ] No performance issues with animations

## Accessibility Considerations

- Use high contrast ratios
- Provide alternative indicators beyond color
- Test with screen readers
- Ensure keyboard navigation works
- Add ARIA labels where needed

## Total Estimated Time: 10-14 hours

## Dependencies
- None (all features are independent)

## Notes
- All animations should be CSS-based for performance
- Consider adding user preference for animation intensity
- Ensure all styles work with existing dark theme
