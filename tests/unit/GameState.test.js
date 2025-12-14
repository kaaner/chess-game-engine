import { describe, it, expect, beforeEach } from 'vitest'
import GameState from '../../src/game/GameState.js'
import { PieceColor } from '../../src/game/Piece.js'

describe('GameState', () => {
  let gameState

  beforeEach(() => {
    gameState = new GameState()
  })

  describe('initialization', () => {
    it('should initialize with correct default values', () => {
      expect(gameState.turn).toBe(PieceColor.WHITE)
      expect(gameState.gameOver).toBe(false)
      expect(gameState.winner).toBeNull()
      expect(gameState.history).toEqual([])
      expect(gameState.lastMove).toBeNull()
      expect(gameState.enPassantTarget).toBeNull()
      expect(gameState.isPaused).toBe(false)
    })

    it('should have a valid board', () => {
      expect(gameState.board).toBeDefined()
      expect(gameState.getBoard()).toBeDefined()
    })

    it('should have empty captured pieces', () => {
      expect(gameState.capturedPieces.w).toEqual([])
      expect(gameState.capturedPieces.b).toEqual([])
    })
  })

  describe('check detection', () => {
    it('should detect when white is not in check initially', () => {
      const inCheck = gameState.isInCheck(PieceColor.WHITE)
      expect(inCheck).toBe(false)
    })

    it('should detect when black is not in check initially', () => {
      const inCheck = gameState.isInCheck(PieceColor.BLACK)
      expect(inCheck).toBe(false)
    })
  })

  describe('checkmate and stalemate', () => {
    it('should not be checkmate initially', () => {
      expect(gameState.isCheckmate()).toBe(false)
    })

    it('should not be stalemate initially', () => {
      expect(gameState.isStalemate()).toBe(false)
    })

    it('should detect checkmate when game is over with winner', () => {
      gameState.gameOver = true
      gameState.winner = PieceColor.BLACK
      
      expect(gameState.isCheckmate()).toBe(true)
      expect(gameState.isStalemate()).toBe(false)
    })

    it('should detect stalemate when game is draw', () => {
      gameState.gameOver = true
      gameState.winner = 'draw'
      
      expect(gameState.isStalemate()).toBe(true)
      expect(gameState.isCheckmate()).toBe(false)
    })
  })

  describe('getKingPosition', () => {
    it('should return white king position', () => {
      const pos = gameState.getKingPosition(PieceColor.WHITE)
      
      expect(pos).toEqual({ row: 7, col: 4 })
    })

    it('should return black king position', () => {
      const pos = gameState.getKingPosition(PieceColor.BLACK)
      
      expect(pos).toEqual({ row: 0, col: 4 })
    })
  })

  describe('resetGame', () => {
    it('should reset all game state', () => {
      // Modify state
      gameState.turn = PieceColor.BLACK
      gameState.gameOver = true
      gameState.winner = PieceColor.WHITE
      gameState.history = [{ some: 'move' }]
      gameState.lastMove = { from: {}, to: {} }
      
      // Reset
      gameState.resetGame()
      
      // Check reset
      expect(gameState.turn).toBe(PieceColor.WHITE)
      expect(gameState.gameOver).toBe(false)
      expect(gameState.winner).toBeNull()
      expect(gameState.history).toEqual([])
      expect(gameState.lastMove).toBeNull()
      expect(gameState.capturedPieces.w).toEqual([])
      expect(gameState.capturedPieces.b).toEqual([])
    })
  })

  describe('switchTurn', () => {
    it('should switch from white to black', () => {
      expect(gameState.turn).toBe(PieceColor.WHITE)
      
      gameState.switchTurn()
      
      expect(gameState.turn).toBe(PieceColor.BLACK)
    })

    it('should switch from black to white', () => {
      gameState.turn = PieceColor.BLACK
      
      gameState.switchTurn()
      
      expect(gameState.turn).toBe(PieceColor.WHITE)
    })
  })

  describe('togglePause', () => {
    it('should toggle pause state', () => {
      expect(gameState.isPaused).toBe(false)
      
      gameState.togglePause()
      
      expect(gameState.isPaused).toBe(true)
      
      gameState.togglePause()
      
      expect(gameState.isPaused).toBe(false)
    })

    it('should not toggle when game is over', () => {
      gameState.gameOver = true
      
      gameState.togglePause()
      
      expect(gameState.isPaused).toBe(false)
    })
  })
})
