import { useState, useMemo, useCallback, useEffect } from 'react';
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import CustomDialog from '../CustomDialogue';
import socket from '../../utils/sockets';

function Game({ players, room, orientation, cleanup }){
    const chess = useMemo(()=> new Chess(), []);
    const [fen, setFen] = useState(chess.fen());
    const [over, setOver] = useState("");

    const makeAMove = useCallback(
        (move) => {
            try {
                const result = chess.move(move); // update Chess instance
                setFen(chess.fen()); // update fen state to trigger a re-render

                console.log("Se acabó, jaque mate", chess.isGameOver(), chess.isCheckmate());

                if (chess.isGameOver()) { // check if move led to "game over"
                    if (chess.isCheckmate()) { // if reason for game over is a checkmate
                        // Set message to checkmate. 
                        setOver(
                            `Jaque mate! ${chess.turn() === "w" ? "Negras" : "Blancas"} Ganan!`
                        );
                        // The winner is determined by checking which side made the last move
                    } else if (chess.isDraw()) { // if it is a draw
                        setOver("Empate"); // set message to "Draw"
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

      const onDrop = (sourceSquare, targetSquare) => {
        if(chess.turn() !== orientation[0]) return false;

        if(players.length <2) return false;

        const moveData = {
            from: sourceSquare,
            to: targetSquare,
            color: chess.turn(),
        };

        const move = makeAMove(moveData);

        if (move === null) return false;

        socket.emit("move", { 
            move,
            room,
          }); 

        return true;
    };

    return(
        <>
        <div className="board">
        <Chessboard id="BasicBoard" position={fen} onPieceDrop={onDrop} />  {/**  <- 4 */}
      </div>
      <CustomDialog 
                open={Boolean(over)}
                title={over}
                contentText={over}
                handleContinue={() => {
                    setOver("");
                } } children={undefined}      />
        </>
    )
}

export default Game;