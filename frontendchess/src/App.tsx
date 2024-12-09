import { useCallback, useEffect, useState } from "react";
import { Container,TextField  } from "@mui/material";
import  Game  from "./Components/Game";
import  CustomDialog  from "./Components/CustomDialogue";
import socket from "./utils/sockets";
import InitGame from "./Components/InitGame";

function App() {
  const [username, setUsername] = useState('');
  const [usernameSubmitted, setUsernameSubmitted] = useState(false);

  const [room, setRoom] = useState("");
  const [orientationPlayer, setOrientationPlayer] = useState("");
  const [players, setPlayers] = useState([]);

  const cleanup = useCallback(()=>{
    setRoom("");
    setOrientationPlayer("");
    setPlayers("");
  },[])

  useEffect(()=>{
    socket.on("opponentJoined", (roomData) => {
      console.log("roomData", roomData)
      setPlayers(roomData.players);
    });
  }, [])
  console.log("Variables de entorno: ", import.meta.env.VITE_PORT)
  return (
    <Container>
    <CustomDialog
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
    </CustomDialog>
    {room ? (
      <Game
        room={room}
        orientation={orientationPlayer}
        username={username}
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
