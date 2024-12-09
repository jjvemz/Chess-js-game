import { useState } from "react";
import { Container } from "@mui/material";
import  Game  from "./Components/Game";
import  CustomDialog  from "./Components/CustomDialogue";
import socket from "./utils/sockets";

function App() {
  const [username, setUsername] = useState('');

  const [usernameSubmitted, setUsernameSubmitted] = useState(false);
  return (
      <Container>
        <CustomDialog
        open={!usernameSubmitted}
        title="Escoja su nombre de usuario"
        contentText="Por favor, seleccione su nombre de usuario"
        handleContinue={()=>{
          if(!username) return;
          socket.emit("username", username);
          setUsernameSubmitted(true);
        }} 
        />
        <TextField 
          autofocus
          margin="dense"
          id="username"
          label="Username"
          name="username"
          value={username}
          required 
          onChange={(e)=> setUsername(e.target.value)}
          type="text"
          fullWidth
          variante="standard"
        />
        <Game/>
        jola
      </Container>
  );
}

export default App;
