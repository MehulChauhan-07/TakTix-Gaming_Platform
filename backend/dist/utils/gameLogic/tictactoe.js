"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicTacToe = void 0;
class TicTacToe {
    constructor() {
        this.BOARD_SIZE = 9;
        this.WINNING_COMBINATIONS = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6], // Diagonals
        ];
    }
    getInitialState() {
        return Array(this.BOARD_SIZE).fill(null);
    }
    makeMove(board, move) {
        const { position, player } = move;
        // Validate move
        if (position < 0 || position >= this.BOARD_SIZE) {
            throw new Error('Invalid position');
        }
        if (board[position] !== null) {
            throw new Error('Position already taken');
        }
        // Make the move
        const newBoard = [...board];
        newBoard[position] = player;
        // Check for winner
        const winner = this.checkWinner(newBoard);
        return {
            board: newBoard,
            winner: winner || null,
        };
    }
    checkWinner(board) {
        for (const combination of this.WINNING_COMBINATIONS) {
            const [a, b, c] = combination;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return board[a];
            }
        }
        // Check for draw
        if (!board.includes(null)) {
            return 'draw';
        }
        return null;
    }
    isValidMove(board, position) {
        return position >= 0 && position < this.BOARD_SIZE && board[position] === null;
    }
    getAvailableMoves(board) {
        return board
            .map((cell, index) => cell === null ? index : -1)
            .filter(index => index !== -1);
    }
}
exports.TicTacToe = TicTacToe;
