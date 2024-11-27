import React, { useState, useEffect } from "react";
import { gameSubject, initGame, resetGame } from "../../utils/Game";

import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Board from "../../components/chess/Board";

function HomeLayout(roomId: string) {
  const [board, setBoard] = useState<[][]>([]); // Suponiendo que Piece es el tipo de las piezas
  const [isGameOver, setIsGameOver] = useState<boolean>(false); // Asegúrate de que es booleano
  const [result, setResult] = useState<string | null>(null);
  const [turn, setTurn] = useState<'w' | 'b'>('w');

  useEffect(() => {
    initGame(roomId);
    const subscription = gameSubject.subscribe((game) => {
      if (game) {
        setBoard(game.board || []);
        setIsGameOver(game.isGameOver || false);
        setResult(game.result || null);

        if (game.turn === 'w' || game.turn === 'b') {
          setTurn(game.turn);
        } else {
          console.error('Invalid turn value:', game.turn);
        }
      }
    });
    return () => subscription.unsubscribe();
  }, []);
  

  return (
    <>
      <Header />
      <div className="main">
      {isGameOver && (
        <h2 className="vertical-text">
          GAME OVER
          <button onClick={resetGame}>
            <span className="vertical-text"> NEW GAME</span>
          </button>
        </h2>
      )}
        <div className="chess-board">
          <Board board={board} turn={turn}/>
        </div>
        {result && <p className="vertical-text">{result}</p>}
        <div className="chat-box">
            <div className="webrtc"></div>
          </div>
      </div>
      <Footer />
    </>
  );
}

export default HomeLayout;
