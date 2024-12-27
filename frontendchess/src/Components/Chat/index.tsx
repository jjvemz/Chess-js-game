import { Fragment, useEffect, useRef, useState } from "react";
import {
  Container,
  Divider,
  FormControl,
  Grid2,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import SendIcon from "@mui/icons-material/Send";
import socket from "../../utils/sockets"; // Adjust the path as necessary

const ChatBox = ({ roomId, username }) => {
  const ENTER_KEY_CODE = 13;
  const scrollBottomRef = useRef(null);
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const handleEnterKey = (event) => {
    if (event.keyCode === ENTER_KEY_CODE) {
      sendMessage();
    }
  };

  const sendMessage = () => {
    if (message.trim() !== "") {
      console.log(`Sending message: "${message}" to room: ${roomId}`);
      
      // Emit the message to the server
      socket.emit("sendMessage", { roomId, message, username });
      
      // Update local messages state to include the sent message
      setMessages((prevMessages) => [
        ...prevMessages,
        { username, message } // Add the sent message to local state
      ]);
      
      setMessage(""); // Clear the input field after sending
    }
  };
  
  useEffect(() => {
    socket.on("receiveMessage", (data) => {
      console.log("Received message data:", data);
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages, data];
        console.log("Current messages state:", updatedMessages);
        return updatedMessages;
      });
    });
  
    return () => {
      socket.off("receiveMessage");
    };
  }, []);


  useEffect(() => {
    if (scrollBottomRef.current) {
      scrollBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <Fragment>
      <Container>
        <Paper elevation={5}>
          <Box p={3}>
            <Typography variant="h4" gutterBottom>
              Bienvenido
            </Typography>
            <Divider />
            <Grid2 container spacing={4} alignItems="center">
              <Grid2 id="chat-window" xs={12} item>
                <List id="chat-window-messages">
                {messages.map((msg, index) => (
    <ListItem key={index}>
      <ListItemText primary={msg.username + ': ' + msg.message} />
    </ListItem>
  ))}
                  <ListItem ref={scrollBottomRef}></ListItem>
                </List>
              </Grid2>
              <Grid2 xs={9} item>
                <FormControl fullWidth>
                  <TextField
                    onChange={handleMessageChange}
                    onKeyDown={handleEnterKey}
                    value={message}
                    label="Type your message..."
                    variant="outlined"
                  />
                </FormControl>
              </Grid2>

              <Grid2 xs={1} item>
                <IconButton
                  onClick={sendMessage}
                  aria-label="send"
                  color="primary"
                >
                  <SendIcon />
                </IconButton>
              </Grid2>
            </Grid2>
          </Box>
        </Paper>
      </Container>
    </Fragment>
  );
};

export default ChatBox;