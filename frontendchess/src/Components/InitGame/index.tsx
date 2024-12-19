import { Button, Stack, TextField } from "@mui/material";
import { useState } from "react";
import CustomDialog from "../CustomDialogue";
import socket from "../../utils/sockets";

export default function InitGame({ setRoom, setOrientation, SetPlayers }) {
  const [roomDialogOpen, setRoomDialogOpen] = useState(false);
  const [roomInput, setRoomInput] = useState("");
  const [roomError, setRoomError] = useState("");

  return (
    <Stack
      justifyContent="center"
      alignItems="center"
      sx={{ py: 1, height: "100vh" }}
    >
      <CustomDialog
        open={roomDialogOpen}
        handleClose={() => setRoomDialogOpen(false)}
        title="Seleccione el ID de la sala"
        contentText="Ingrese un ID valido para entrar"
        handleContinue={() => {
          if(!roomInput) return;
          console.log('Attempting to join room:', roomInput);
          socket.emit("JoinRoom", { roomId: roomInput }, (response: any) => {
            console.log('Response from JoinRoom:', response);
            if(response?.error) {
              console.error('Error joining room:', response.message);
              return setRoomError(response.message);
            }
            console.log("Join successful. Room data:", response);
            setRoom(response?.roomId);
            SetPlayers(response?.players);
            setOrientation("black");
            setRoomDialogOpen(false);
          });
        }}
      >
      <TextField
      autoFocus
        margin="dense"
        id="room"
        label="Room ID"
        name="room"
        value={roomInput}
        required
        onChange={(e) => setRoomInput(e.target.value)}
        type="text"
        fullWidth
        variant="standard"
        error={Boolean(roomError)}
        helperText={
          !roomError ? "Ingrese el ID de la sasa" : `ID invalido: ${roomError}`
        }
      />
      </CustomDialog>
      <Button
        variant="contained"
        onClick={()=>{
            console.log('Attempting to create room');
            socket.emit("createRoom", {}, (roomId) => {
              console.log('Received response from create room:', roomId);
              if (roomId) {
                console.log("Room created successfully:", roomId);
                setRoom(roomId);
                setOrientation("white");
              }
            });
        }}>
            Comenzar partida
        </Button>

        <Button
        onClick={() => {
          setRoomDialogOpen(true)
        }}
      >
        Unirse a una partida
      </Button>
    </Stack>
  );
}
