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
          // TODO: IMPLEMENTAR UN JOIN ROOM
          if(!roomInput) return;
          socket.emit("joinRoom", { roomId: roomInput}, (r) =>{
            if(r.error) return setRoomError(r.message);
            console.log("response: ", r);
            setRoom(r?.roomId);
            SetPlayers(r?.players);
            setOrientation("black");
            setRoomDialogOpen(false);
          })
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
            //TODO: IMPLEMENTAR LA LOGICA PARA UNIRSE CON LA FUNCIÓN EN ESTE BOTON!!
            socket.emit("createRoom", (r)=>{
                console.log(r);
                setRoom(r);
                setOrientation("white");
            })
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
