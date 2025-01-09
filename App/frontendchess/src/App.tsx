import { useCallback, useEffect, useState } from "react";
import { Container, TextField } from "@mui/material";
import Game from "./Components/Game";
import CustomDialogue from "./Components/CustomDialogue";
import socket from "./utils/sockets";
import InitGame from "./Components/InitGame";

interface Player {
  id: string;
  username?: string;
}

function App() {
  const [username, setUsername] = useState('');
  const [usernameSubmitted, setUsernameSubmitted] = useState(false);

  const [room, setRoom] = useState("");
  const [orientationPlayer, setOrientationPlayer] = useState<"white" | "black">("white"); // Ensure the correct type
  const [players, setPlayers] = useState<Player[]>([]);

  const cleanup = useCallback(()=>{
    setRoom("");
    setOrientationPlayer("white"); // Ensure the correct type
    setPlayers([]);
  },[])

  useEffect(()=>{
    socket.on("opponentJoined", (roomData) => {
      console.log("roomData", roomData)
      setPlayers(roomData.players);
    });
  }, [])

  return (
    <Container>
      <CustomDialogue
        open={!usernameSubmitted}
        handleClose={() => setUsernameSubmitted(true)}
        title="Seleccione un usuario"
        contentText="Por favor, ingrese un nombre de usuario"
        handleContinue={() => {
          if (!username) return;
          socket.emit("username", username);
          setUsernameSubmitted(true);
        }}
      >
        <TextField
          autoFocus
          margin="dense"
          id="username"
          label="Nombre de usuario"
          name="username"
          value={username}
          required
          onChange={(e) => setUsername(e.target.value)}
          type="text"
          fullWidth
          variant="standard"
        />
      </CustomDialogue>
      {room ? (
        <Game
          room={room}
          orientation={orientationPlayer}
          players={players}
          cleanup={cleanup}
        />
      ) : (
        <InitGame
          setRoom={setRoom}
          setOrientation={setOrientationPlayer}
          setPlayers={setPlayers}
        />
      )}
    </Container>
  );
}

export default App;