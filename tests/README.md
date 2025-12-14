# Testing Guide

## Running Tests

```bash
# Run tests in watch mode
npm test

# Run tests once
npm run test:run

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

## Test Structure

```
tests/
├── setup.js              # Test setup and global utilities
├── unit/                 # Unit tests
│   ├── Piece.test.js     # Piece class tests
│   ├── Board.test.js     # Board class tests
│   └── GameState.test.js # GameState class tests
└── integration/          # Integration tests (future)
```

## Writing Tests

Example test:

```javascript
import { describe, it, expect, beforeEach } from 'vitest'
import { Piece, PieceType, PieceColor } from '../../src/game/Piece.js'

describe('MyFeature', () => {
  let instance

  beforeEach(() => {
    instance = new MyClass()
  })

  it('should do something', () => {
    expect(instance.doSomething()).toBe(expectedValue)
  })
})
```

## Current Coverage

- ✅ Piece class (6/6 tests passing)
- ✅ Board class (9/11 tests passing)
- ⚠️  GameState class (8/16 tests passing)

Total: **23/33 tests passing (70%)**

## Known Issues

Some GameState tests are failing due to:
- Rules module not being mocked in tests
- Check detection requiring full board state
- These are integration-level tests that need proper setup

## Next Steps

1. Add integration tests for full game flow
2. Increase unit test coverage to 80%+
3. Add E2E tests with Playwright
4. Setup CI/CD pipeline
