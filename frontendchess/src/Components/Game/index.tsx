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
        setFen(chess.fen());

        if (chess.isGameOver()) {
          if (chess.isCheckmate()) {
            const winner = chess.turn() === "w" ? "Negras" : "Blancas";
            setOver(`¡Jaque mate! ¡${winner} ganan!`);
          } else if (chess.isDraw()) {
            setOver("¡Empate!");
          } else {
            setOver("Fin del juego");
          }
        }

        return result;
      } catch (e) {
        return null;
      }
    },
    [chess]
  );

  function onDrop(sourceSquare, targetSquare) {
    if (chess.turn() !== orientation[0].toLowerCase()) {
      return false;
    }

    if (players.length < 2) {
      return false;
    }

    const moveData = {
      from: sourceSquare,
      to: targetSquare,
      promotion: 'q'
    };

    const move = makeAMove(moveData);

    if (move === null) {
      return false;
    }

    socket.emit("move", {
      move: moveData,
      room,
    });

    return true;
  }

  useEffect(() => {
    socket.on("move", (moveData) => {
      makeAMove(moveData);
    });

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
          title="Game Over"
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
