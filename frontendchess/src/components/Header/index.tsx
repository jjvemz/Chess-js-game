import React from 'react';
import { useLocation, useNavigate  } from 'react-router-dom';
import socket from '../../utils/sockets';
import './header.css'

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isSessionRoute = /^\/session\/\w+$/.test(location.pathname);

  const isHost = true;
  const handleExit = () => {
    if (isHost) {
      // Emit the deleteSession event with the roomId
      socket.emit('deleteSession', { roomId: location.pathname.split('/')[2] });
    }
    // Redirect to the main page
    navigate('/');
  };

  return (
    <header>
      <div className="title">Juego de ajedréz multijugador</div>
      {isSessionRoute && (<div className="exit-button">
        <button onClick={handleExit}>Salir</button>
      </div>)}
    </header>
  );
};

export default Header;
