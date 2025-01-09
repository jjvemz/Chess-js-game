import React, { ReactNode } from 'react';

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

type CustomDialogueProps = {
  open: boolean;
  children?: ReactNode;
  title: string;
  contentText: string;
  handleClose: () => void; 
  handleContinue: () => void;
};

const CustomDialogue: React.FC<CustomDialogueProps> = ({ open, children, title, contentText, handleClose, handleContinue }) => {
  return (
    <Dialog open={open} onClose={handleClose}> 
      <DialogTitle>{title}</DialogTitle>
      <DialogContent> 
        <DialogContentText>
          {contentText}
        </DialogContentText>
        {children}
      </DialogContent>
      <DialogActions>
        <button onClick={handleClose}>Close</button>
        <button onClick={handleContinue}>Continue</button>
      </DialogActions>
    </Dialog>
  );
}

export default CustomDialogue;