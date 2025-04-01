import { GameType } from "../../types/game.types";

export class Chess {
  private readonly BOARD_SIZE = 8;
  private readonly INITIAL_BOARD = [
    ["r", "n", "b", "q", "k", "b", "n", "r"],
    ["p", "p", "p", "p", "p", "p", "p", "p"],
    Array(8).fill(null),
    Array(8).fill(null),
    Array(8).fill(null),
    Array(8).fill(null),
    ["P", "P", "P", "P", "P", "P", "P", "P"],
    ["R", "N", "B", "Q", "K", "B", "N", "R"],
  ];

  getInitialState() {
    return this.INITIAL_BOARD;
  }

  makeMove(
    board: (string | null)[][],
    move: { from: [number, number]; to: [number, number]; player: string }
  ) {
    const { from, to, player } = move;
    const [fromRow, fromCol] = from;
    const [toRow, toCol] = to;

    // Validate move
    if (!this.isValidMove(board, from, to, player)) {
      throw new Error("Invalid move");
    }

    // Make the move
    const newBoard = board.map((row) => [...row]);
    newBoard[toRow][toCol] = newBoard[fromRow][fromCol];
    newBoard[fromRow][fromCol] = null;

    // Check for checkmate
    const isCheckmate = this.isCheckmate(
      newBoard,
      player === "white" ? "black" : "white"
    );

    return {
      board: newBoard,
      isCheckmate,
      capturedPiece: board[toRow][toCol],
    };
  }

  private isValidMove(
    board: (string | null)[][],
    from: [number, number],
    to: [number, number],
    player: string
  ): boolean {
    const [fromRow, fromCol] = from;
    const [toRow, toCol] = to;

    // Basic validation
    if (
      fromRow < 0 ||
      fromRow >= this.BOARD_SIZE ||
      fromCol < 0 ||
      fromCol >= this.BOARD_SIZE ||
      toRow < 0 ||
      toRow >= this.BOARD_SIZE ||
      toCol < 0 ||
      toCol >= this.BOARD_SIZE
    ) {
      return false;
    }

    const piece = board[fromRow][fromCol];
    if (!piece) return false;

    // Check if piece belongs to player
    const isWhitePiece = piece === piece.toUpperCase();
    if (
      (player === "white" && !isWhitePiece) ||
      (player === "black" && isWhitePiece)
    ) {
      return false;
    }

    // TODO: Implement proper chess move validation
    // This is a simplified version that only checks if the destination is empty or contains an opponent's piece
    const targetPiece = board[toRow][toCol];
    if (targetPiece) {
      const isTargetWhite = targetPiece === targetPiece.toUpperCase();
      if (
        (player === "white" && isTargetWhite) ||
        (player === "black" && !isTargetWhite)
      ) {
        return false;
      }
    }

    return true;
  }

  private isCheckmate(board: (string | null)[][], player: string): boolean {
    // TODO: Implement proper checkmate detection
    // This is a placeholder that always returns false
    return false;
  }

  getAvailableMoves(
    board: (string | null)[][],
    player: string
  ): Array<{ from: [number, number]; to: [number, number] }> {
    const moves: Array<{ from: [number, number]; to: [number, number] }> = [];

    // TODO: Implement proper move generation
    // This is a placeholder that returns an empty array
    return moves;
  }
}
