import { useState, useMemo, useCallback, useEffect } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import CustomDialog from "../CustomDialogue";
import socket from "../../utils/sockets";
import {
  Box,
  Button,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  Stack,
  Typography,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

interface Player {
  id: string;
  username?: string;
}

interface GameProps {
  room: string;
  orientation: "white" | "black"; // Ensure the correct type for orientation
  players: Player[];
  cleanup: () => void;
}

const Game: React.FC<GameProps> = ({ room, orientation, players, cleanup }) => {
  const chess = useMemo(() => new Chess(), []);
  const [fen, setFen] = useState(chess.fen());
  const [over, setOver] = useState("");

  const makeAMove = useCallback(
    (move) => {
      try {
        const result = chess.move(move);
        setFen(chess.fen());

        console.log(
          "Se acabó, jaque mate",
          chess.isGameOver(),
          chess.isCheckmate()
        );

        if (chess.isGameOver()) {
          if (chess.isCheckmate()) {
            setOver(
              `Jaque mate! ${
                chess.turn() === "w" ? "Negras" : "Blancas"
              } Ganan!`
            );
          } else if (chess.isDraw()) {
            setOver("Empate");
          } else {
            setOver("Game over");
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
    if (chess.turn() !== orientation[0]) return false;

    if (players.length < 2) return false;

    const moveData = {
      from: sourceSquare,
      to: targetSquare,
      color: chess.turn(),
      promotion: "q",
    };

    const move = makeAMove(moveData);

    if (move === null) return false;

    socket.emit("move", {
      move,
      room,
    });

    return true;
  }

  const handleCopy = () => {
    navigator.clipboard
      .writeText(room)
      .then(() => {
        alert("Room ID copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  };

  useEffect(() => {
    socket.on("move", (move) => {
      makeAMove(move);
    });
  }, [makeAMove]);

  return (
    <>
      <Stack>
        <Card>
          <CardContent>
            <Typography variant="h5">
              <Button
                variant="contained"
                startIcon={<ContentCopyIcon />}
                onClick={handleCopy}>
                Copiar ID de la partida
              </Button>
            </Typography>
          </CardContent>
        </Card>
        <Stack flexDirection="row" sx={{ pt: 2 }}>
          <div
            className="board"
            style={{
              maxWidth: 600,
              maxHeight: 600,
              flexGrow: 1,
            }}>
            <Chessboard
              position={fen}
              onPieceDrop={onDrop}
              boardOrientation={orientation} // Ensure the correct type for orientation
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
          handleClose={() => setOver("")} // Add handleClose prop
        >
          {/* Add children prop if needed */}
        </CustomDialog>
      </Stack>
    </>
  );
}

export default Game;