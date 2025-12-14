import { describe, it, expect } from 'vitest'
import { Piece, PieceType, PieceColor } from '../../src/game/Piece.js'

describe('Piece', () => {
  describe('constructor', () => {
    it('should create a white pawn', () => {
      const piece = new Piece(PieceColor.WHITE, PieceType.PAWN)
      
      expect(piece.type).toBe(PieceType.PAWN)
      expect(piece.color).toBe(PieceColor.WHITE)
      expect(piece.hasMoved).toBe(false)
    })

    it('should create a black king', () => {
      const piece = new Piece(PieceColor.BLACK, PieceType.KING)
      
      expect(piece.type).toBe(PieceType.KING)
      expect(piece.color).toBe(PieceColor.BLACK)
      expect(piece.hasMoved).toBe(false)
    })
  })

  describe('hasMoved flag', () => {
    it('should start with hasMoved as false', () => {
      const piece = new Piece(PieceColor.WHITE, PieceType.ROOK)
      
      expect(piece.hasMoved).toBe(false)
    })

    it('should allow setting hasMoved', () => {
      const piece = new Piece(PieceColor.BLACK, PieceType.KNIGHT)
      
      piece.hasMoved = true
      
      expect(piece.hasMoved).toBe(true)
    })
  })

  describe('PieceType constants', () => {
    it('should have all piece types defined', () => {
      expect(PieceType.PAWN).toBe('p')
      expect(PieceType.KNIGHT).toBe('n')
      expect(PieceType.BISHOP).toBe('b')
      expect(PieceType.ROOK).toBe('r')
      expect(PieceType.QUEEN).toBe('q')
      expect(PieceType.KING).toBe('k')
    })
  })

  describe('PieceColor constants', () => {
    it('should have both colors defined', () => {
      expect(PieceColor.WHITE).toBe('w')
      expect(PieceColor.BLACK).toBe('b')
    })
  })
})
