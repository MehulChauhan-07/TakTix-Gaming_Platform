"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { useAuth } from "@hooks/use-Auth";
import { Button } from "@components/ui/button";
import { ArrowLeft, MessageSquare } from "lucide-react";

export default function GamePlayPage() {
  const { user } = useAuth();
  const params = useParams();
  const [searchParams] = useSearchParams();
  const gameType = params.gameType;
  const matchId = searchParams.get("matchId");
  const [opponent, setOpponent] = useState<string | null>(null);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    if (user) {
      // For demo purposes, simulate opponent joining after 2 seconds
      const timer = setTimeout(() => {
        setOpponent("Opponent" + Math.floor(Math.random() * 1000));
      }, 2000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [user]);

  const renderGame = () => {
    switch (gameType) {
      case "chess":
        return <ChessGame matchId={matchId} />;
      case "tic-tac-toe":
        return <TicTacToeGame matchId={matchId} />;
      default:
        return <div>Unsupported game type</div>;
    }
  };

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <Button variant="outline" size="sm" asChild>
          <Link to="/games">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Games
          </Link>
        </Button>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowChat(!showChat)}
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            {showChat ? "Hide Chat" : "Show Chat"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className={`lg:col-span-${showChat ? "3" : "4"}`}>
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">
                  {gameType === "chess" ? "Chess" : "Tic-Tac-Toe"}
                </h2>
                <div className="text-sm text-muted-foreground">
                  {opponent
                    ? `Playing against: ${opponent}`
                    : "Waiting for opponent..."}
                </div>
              </div>

              <div className="bg-muted rounded-md p-4 min-h-[500px] flex items-center justify-center">
                {renderGame()}
              </div>
            </div>
          </div>
        </div>

        {showChat && (
          <div className="lg:col-span-1">
            <GameChat matchId={matchId} />
          </div>
        )}
      </div>
    </div>
  );
}

function ChessGame({ matchId }: { matchId: string | null }) {
  const [gameStatus, setGameStatus] = useState("waiting");
  const [playerColor, setPlayerColor] = useState("white");
  const [currentTurn, setCurrentTurn] = useState("white");

  useEffect(() => {
    // For demo purposes, simulate game start after 2 seconds
    const timer = setTimeout(() => {
      setPlayerColor(Math.random() > 0.5 ? "white" : "black");
      setGameStatus("playing");
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  // Render game status message
  const renderStatusMessage = () => {
    switch (gameStatus) {
      case "waiting":
        return "Waiting for opponent...";
      case "playing":
        return currentTurn === playerColor ? "Your turn" : "Opponent's turn";
      case "checkmate":
        return currentTurn === playerColor
          ? "Checkmate! You lost."
          : "Checkmate! You won!";
      case "draw":
        return "Game ended in a draw.";
      case "stalemate":
        return "Game ended in a stalemate.";
      default:
        return "";
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div className="mb-4 w-full max-w-md">
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="m12 8 4 4" />
              <path d="m8 12 4 4" />
              <path d="m12 8 4-4" />
              <path d="m8 12 4-4" />
            </svg>
            <div>
              <div className="font-medium">Game Status</div>
              <div className="text-sm text-muted-foreground">
                {renderStatusMessage()}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6 text-center">
        <p className="text-sm text-muted-foreground mb-2">
          You are playing as <span className="font-bold">{playerColor}</span>
        </p>

        <div className="bg-muted p-8 rounded-md">
          <p className="text-center text-muted-foreground">
            Chess implementation would go here.
            <br />
            For a complete implementation, you would use a library like chess.js
            <br />
            and a UI library for the chess board.
          </p>
        </div>
      </div>

      {gameStatus !== "waiting" && (
        <Button onClick={() => setGameStatus("waiting")}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4 mr-2"
          >
            <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
            <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
            <path d="M16 16h5v5" />
          </svg>
          Reset Game
        </Button>
      )}
    </div>
  );
}

function TicTacToeGame({ matchId }: { matchId: string | null }) {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState("X");
  const [playerSymbol, setPlayerSymbol] = useState("X");
  const [gameStatus, setGameStatus] = useState("waiting");
  const [winner, setWinner] = useState(null);

  // Initialize game
  useEffect(() => {
    // For demo purposes, simulate game start after 2 seconds
    const timer = setTimeout(() => {
      setPlayerSymbol(Math.random() > 0.5 ? "X" : "O");
      setGameStatus("playing");
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  // Make a move
  const makeMove = (index: number) => {
    if (
      gameStatus !== "playing" ||
      board[index] !== null ||
      currentPlayer !== playerSymbol
    ) {
      return;
    }

    // Create a new board with the move
    const newBoard = [...board];
    newBoard[index] = currentPlayer;

    // Update local state
    setBoard(newBoard);
    setCurrentPlayer(currentPlayer === "X" ? "O" : "X");

    // Check for game end
    checkGameEnd(newBoard);
  };

  // Check if the game has ended
  const checkGameEnd = (boardState: any[]) => {
    // Winning combinations
    const winPatterns = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // Rows
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // Columns
      [0, 4, 8],
      [2, 4, 6], // Diagonals
    ];

    // Check for a winner
    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (
        boardState[a] &&
        boardState[a] === boardState[b] &&
        boardState[a] === boardState[c]
      ) {
        const winningPlayer = boardState[a];
        setWinner(winningPlayer);

        if (winningPlayer === playerSymbol) {
          setGameStatus("won");
        } else {
          setGameStatus("lost");
        }

        return;
      }
    }

    // Check for a draw
    if (!boardState.includes(null)) {
      setGameStatus("draw");
    }
  };

  // Reset the game
  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer("X");
    setWinner(null);
    setGameStatus("playing");
  };

  // For demo purposes, simulate opponent moves
  useEffect(() => {
    if (
      gameStatus === "playing" &&
      currentPlayer !== playerSymbol &&
      !board.every((cell) => cell !== null)
    ) {
      const timer = setTimeout(() => {
        // Find empty cells
        const emptyCells = board
          .map((cell, index) => (cell === null ? index : -1))
          .filter((index) => index !== -1);

        if (emptyCells.length > 0) {
          // Choose a random empty cell
          const randomIndex =
            emptyCells[Math.floor(Math.random() * emptyCells.length)];

          // Make the move
          const newBoard = [...board];
          newBoard[randomIndex] = currentPlayer;

          setBoard(newBoard);
          setCurrentPlayer(currentPlayer === "X" ? "O" : "X");

          // Check for game end
          checkGameEnd(newBoard);
        }
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [board, currentPlayer, gameStatus, playerSymbol]);

  // Render game status message
  const renderStatusMessage = () => {
    switch (gameStatus) {
      case "waiting":
        return "Waiting for opponent...";
      case "playing":
        return currentPlayer === playerSymbol ? "Your turn" : "Opponent's turn";
      case "won":
        return "You won!";
      case "lost":
        return "You lost!";
      case "draw":
        return "It's a draw!";
      default:
        return "";
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto">
      <div className="mb-4 w-full">
        <div
          className={`rounded-lg border bg-card p-4 ${
            gameStatus === "won"
              ? "border-green-500"
              : gameStatus === "lost"
              ? "border-destructive"
              : ""
          }`}
        >
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="m12 8 4 4" />
              <path d="m8 12 4 4" />
              <path d="m12 8 4-4" />
              <path d="m8 12 4-4" />
            </svg>
            <div>
              <div className="font-medium">Game Status</div>
              <div className="text-sm text-muted-foreground">
                {renderStatusMessage()}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-6">
        {board.map((cell, index) => (
          <Button
            key={index}
            variant="outline"
            className="h-24 w-24 text-3xl font-bold"
            onClick={() => makeMove(index)}
            disabled={
              cell !== null ||
              gameStatus !== "playing" ||
              currentPlayer !== playerSymbol
            }
          >
            {cell}
          </Button>
        ))}
      </div>

      {(gameStatus === "won" ||
        gameStatus === "lost" ||
        gameStatus === "draw") && (
        <Button onClick={resetGame}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4 mr-2"
          >
            <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
            <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
            <path d="M16 16h5v5" />
          </svg>
          Play Again
        </Button>
      )}

      <div className="mt-4 text-sm text-muted-foreground">
        You are playing as <span className="font-bold">{playerSymbol}</span>
      </div>
    </div>
  );
}

function GameChat({ matchId }: { matchId: string | null }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<
    { id: string; sender: string; content: string; timestamp: string }[]
  >([]);
  const [inputMessage, setInputMessage] = useState("");

  useEffect(() => {
    if (user && matchId) {
      // For demo purposes, add a system message
      const systemMessage = {
        id: `system-${Date.now()}`,
        sender: "System",
        content: "Game chat started. Be respectful to your opponent.",
        timestamp: new Date().toISOString(),
      };

      setMessages([systemMessage]);

      // For demo purposes, simulate receiving a message after 5 seconds
      const timer = setTimeout(() => {
        const opponentMessage = {
          id: `opponent-${Date.now()}`,
          sender: "Opponent",
          content: "Hello! Good luck and have fun!",
          timestamp: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, opponentMessage]);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [user, matchId]);

  const sendMessage = () => {
    if (!inputMessage.trim() || !user || !matchId) return;

    const newMessage = {
      id: `msg-${Date.now()}`,
      sender: user.username,
      content: inputMessage,
      timestamp: new Date().toISOString(),
    };

    // Add message to local state
    setMessages((prev) => [...prev, newMessage]);

    // Clear input
    setInputMessage("");
  };

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm h-full flex flex-col">
      <div className="flex flex-col space-y-1.5 p-6 pb-3">
        <h3 className="text-lg font-semibold leading-none tracking-tight">
          Game Chat
        </h3>
      </div>

      <div className="flex-grow overflow-hidden p-0">
        <div className="h-[400px] px-4 overflow-y-auto">
          <div className="space-y-4 pt-1">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "System"
                    ? "justify-center"
                    : message.sender === user?.username
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                {message.sender !== "System" &&
                  message.sender !== user?.username && (
                    <div className="relative h-8 w-8 mr-2">
                      <div className="rounded-full bg-muted flex items-center justify-center h-full w-full">
                        {message.sender.substring(0, 2).toUpperCase()}
                      </div>
                    </div>
                  )}

                <div
                  className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                    message.sender === "System"
                      ? "bg-muted text-muted-foreground"
                      : message.sender === user?.username
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary"
                  }`}
                >
                  {message.sender === "System" ? (
                    <p>{message.content}</p>
                  ) : (
                    <>
                      {message.sender !== user?.username && (
                        <p className="font-semibold text-xs mb-1">
                          {message.sender}
                        </p>
                      )}
                      <p>{message.content}</p>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6 pt-3">
        <form
          className="flex w-full gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
        >
          <input
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Type a message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
          />
          <Button type="submit" size="icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="m22 2-7 20-4-9-9-4Z" />
              <path d="M22 2 11 13" />
            </svg>
          </Button>
        </form>
      </div>
    </div>
  );
}
