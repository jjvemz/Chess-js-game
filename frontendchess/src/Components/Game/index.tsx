import { useState, useMemo, useCallback, useEffect } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import CustomDialog from "../CustomDialogue";
import socket from "../../utils/sockets";
import { Box, Card, CardContent, List, ListItem, ListItemText, ListSubheader, Stack, Typography } from "@mui/material";

interface GameProps {
  players: Array<{ id: string; username?: string }>;
  room: string;
  orientation: "white" | "black";
  cleanup: () => void;
}

function Game({ players, room, orientation, cleanup }: GameProps) {
  const chess = useMemo(() => new Chess(), []);
  const [fen, setFen] = useState(chess.fen());
  const [over, setOver] = useState("");

  const makeAMove = useCallback(
    (move) => {
      try {
        const result = chess.move(move);
        const newFen = chess.fen();
        console.log('Making move:', move, 'New FEN:', newFen);
        setFen(newFen);

        // Only check for game over conditions after the move is made
        if (chess.isGameOver()) {
          if (chess.isCheckmate()) {
            // Get the player who just made the move (they would be the winner)
            const winner = chess.turn() === 'w' ? "Negras" : "Blancas";
            setOver(`Jaque mate! ${winner} Ganan!`);
          } else if (chess.isDraw()) {
            setOver("Empate");
          } else {
            setOver("Game over");
          }
        }

        return result;
      } catch (e) {
        console.error('Error making move:', e);
        return null;
      }
    },
    [chess]
  );

  function onDrop(sourceSquare, targetSquare) {
    // Check if it's player's turn
    if (chess.turn() !== orientation[0].toLowerCase()) {
      console.log("Not your turn");
      return false;
    }

    // Check if there are enough players
    if (players.length < 2) {
      console.log("Waiting for opponent");
      return false;
    }

    // Create move object
    const moveData = {
      from: sourceSquare,
      to: targetSquare,
      promotion: 'q' // always promote to queen for simplicity
    };

    // Try to make the move
    const move = makeAMove(moveData);

    if (move === null) {
      console.log("Invalid move");
      return false;
    }

    // Emit move to other player
    console.log('Emitting move:', move);
    socket.emit("move", {
      move: moveData,
      room,
    });

    return true;
  }

  useEffect(() => {
    // Listen for opponent's moves
    socket.on("move", (moveData) => {
      console.log("Received move from opponent:", moveData);
      const result = makeAMove(moveData);
      if (result === null) {
        console.error('Failed to apply opponent move:', moveData);
      }
    });

    // Cleanup listener when component unmounts
    return () => {
      socket.off("move");
    };
  }, [makeAMove]);

  return (
    <>
      <Stack>
        <Card>
          <CardContent>
            <Typography variant="h5">Room ID: {room}</Typography>
          </CardContent>
        </Card>
        <Stack flexDirection="row" sx={{ pt: 2 }}>
          <div className="board" style={{
            maxWidth: 600,
            maxHeight: 600,
            flexGrow: 1,
          }}>
            <Chessboard
              position={fen}
              onPieceDrop={onDrop}
              boardOrientation={orientation}
            />
          </div>
          {players.length > 0 && (
            <Box>
              <List>
                <ListSubheader>Players</ListSubheader>
                {players.map((p) => (
                  <ListItem key={p.id}>
                    <ListItemText primary={p.username} />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </Stack>
        <CustomDialog 
          open={Boolean(over)}
          title={over}
          contentText={over}
          handleContinue={() => {
            socket.emit("closeRoom", { roomId: room });
            cleanup();
          }}
        />
      </Stack>
    </>
  );
}

export default Game;
