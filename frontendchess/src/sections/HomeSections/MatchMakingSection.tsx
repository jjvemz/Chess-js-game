import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const MatchMakingSection = () => {
  const navigate = useNavigate();
  const [sessionId, setSessionId] = useState("");

  const generateGameId = () => {
    return Math.random().toString(36).slice(2, 11);
  };

  const hostGame = () => {
    const gameId = generateGameId();
    navigate(`/session/${gameId}`);
  };

  const joinGame = (event: React.FormEvent) => {
    event.preventDefault();
    if (sessionId.trim()) {
      navigate(`/session/${sessionId}`);
    }
  };

  return (
    <section>
      <div className="host-session">
        <button onClick={hostGame}>Hostear</button>
      </div>
      <div className="join-session">
        <form onSubmit={joinGame}>
          <input
            type="text"
            value={sessionId}
            onChange={(e) => setSessionId(e.target.value)}
            placeholder="Ingrese el ID de la sesión"
          />
          <button type="submit">Unirse</button>
        </form>
      </div>
    </section>
  );
};

export default MatchMakingSection;
