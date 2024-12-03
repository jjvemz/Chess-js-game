import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MatchMaking.css";

const MatchMakingSection = () => {
  const navigate = useNavigate();
  const [sessionId, setSessionId] = useState("");

  const generateGameId = () => {
    return Math.random().toString(36).slice(2, 11);
  };

  const hostGame = () => {
    const gameId = generateGameId();
    navigate(`/session/${gameId}`, { state: { isHost: true } });
  };

  const joinGame = (event: React.FormEvent) => {
    event.preventDefault();
    if (sessionId.trim()) {
      navigate(`/session/${sessionId}`, { state: { isHost: false } });
    }
  };

  return (
    <div className="main-row">
      <div className="column-session">
        <button onClick={hostGame}>Hostear</button>
      </div>
      <div className="column-session">
        <button className="join-button">Unirse</button>
        <div className="form-container">
          <form onSubmit={joinGame}>
            <input
              type="text"
              value={sessionId}
              onChange={(e) => setSessionId(e.target.value)}
              placeholder="Ingrese el ID de la sesión"
            />
            <button type="submit">Ingresar</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MatchMakingSection;