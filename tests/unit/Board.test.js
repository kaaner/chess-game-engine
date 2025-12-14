import { describe, it, expect, beforeEach } from 'vitest'
import Board from '../../src/game/Board.js'
import Piece, { PieceType, PieceColor } from '../../src/game/Piece.js'

describe('Board', () => {
  let board

  beforeEach(() => {
    board = new Board()
  })

  describe('initialization', () => {
    it('should create an 8x8 board', () => {
      expect(board.squares).toHaveLength(8)
      expect(board.squares[0]).toHaveLength(8)
    })

    it('should initialize with standard chess setup', () => {
      // Check white pieces
      expect(board.getPiece(7, 0).type).toBe(PieceType.ROOK)
      expect(board.getPiece(7, 0).color).toBe(PieceColor.WHITE)
      
      expect(board.getPiece(7, 4).type).toBe(PieceType.KING)
      expect(board.getPiece(7, 4).color).toBe(PieceColor.WHITE)

      // Check black pieces
      expect(board.getPiece(0, 0).type).toBe(PieceType.ROOK)
      expect(board.getPiece(0, 0).color).toBe(PieceColor.BLACK)
      
      expect(board.getPiece(0, 4).type).toBe(PieceType.KING)
      expect(board.getPiece(0, 4).color).toBe(PieceColor.BLACK)

      // Check pawns
      expect(board.getPiece(6, 0).type).toBe(PieceType.PAWN)
      expect(board.getPiece(1, 0).type).toBe(PieceType.PAWN)

      // Check empty squares
      expect(board.getPiece(4, 4)).toBeNull()
      expect(board.getPiece(3, 3)).toBeNull()
    })
  })

  describe('getPiece', () => {
    it('should return piece at valid position', () => {
      const piece = board.getPiece(0, 0)
      expect(piece).toBeInstanceOf(Piece)
    })

    it('should return null for empty square', () => {
      const piece = board.getPiece(4, 4)
      expect(piece).toBeNull()
    })

    it('should return null for out of bounds', () => {
      expect(board.getPiece(-1, 0)).toBeNull()
      expect(board.getPiece(8, 0)).toBeNull()
      expect(board.getPiece(0, -1)).toBeNull()
      expect(board.getPiece(0, 8)).toBeNull()
    })
  })

  describe('movePiece', () => {
    it('should move piece to new position', () => {
      const piece = board.getPiece(6, 4) // White pawn
      board.movePiece(6, 4, 4, 4)
      
      expect(board.getPiece(6, 4)).toBeNull()
      expect(board.getPiece(4, 4)).toBe(piece)
      expect(piece.hasMoved).toBe(true)
    })

    it('should capture opponent piece', () => {
      // Place pieces for capture
      board.squares[4][4] = new Piece(PieceType.PAWN, PieceColor.WHITE)
      board.squares[3][4] = new Piece(PieceType.PAWN, PieceColor.BLACK)
      
      board.movePiece(4, 4, 3, 4)
      
      expect(board.getPiece(4, 4)).toBeNull()
      expect(board.getPiece(3, 4).color).toBe(PieceColor.WHITE)
    })
  })

  describe('findKing', () => {
    it('should find white king', () => {
      const kingPos = board.findKing(PieceColor.WHITE)
      
      expect(kingPos).toEqual({ row: 7, col: 4 })
    })

    it('should find black king', () => {
      const kingPos = board.findKing(PieceColor.BLACK)
      
      expect(kingPos).toEqual({ row: 0, col: 4 })
    })

    it('should return null if king not found', () => {
      board.squares[0][4] = null // Remove black king
      
      const kingPos = board.findKing(PieceColor.BLACK)
      
      expect(kingPos).toBeNull()
    })
  })

  describe('resetBoard', () => {
    it('should reset to initial position', () => {
      // Make some moves
      board.movePiece(6, 4, 4, 4)
      board.movePiece(1, 4, 3, 4)
      
      // Reset
      board.resetBoard()
      
      // Check if back to initial
      expect(board.getPiece(6, 4).type).toBe(PieceType.PAWN)
      expect(board.getPiece(1, 4).type).toBe(PieceType.PAWN)
      expect(board.getPiece(4, 4)).toBeNull()
      expect(board.getPiece(3, 4)).toBeNull()
    })
  })
})
