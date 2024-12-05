import Game from '../../components/chess/Game'
import Chat from '../../components/Chat'
import WebCam from '../../components/webCam'

import socket from '../../utils/sockets'

import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'


const GameSessionsSection = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const roomId = location.pathname.split('/')[2];
  const isHost = location.state?.isHost || false;

  useEffect(()=>{
    if(roomId){
      socket.emit('joinRoom', { roomId });

      socket.on('roomFull', ()=>{
        alert('Sala llena, serás redireccionado a la pagina principal');
        navigate('/');
      })

      socket.on('userJoined', ()=>{
        if(isHost){
          socket.emit('startGame', { roomId });
        }
      })

      return () => {
        socket.emit('leaveRoom', { roomId });
      };
    }
  },[roomId, isHost, navigate])

  return (
    <section>
      <div className="main-row">
        <div className="columns">
          <Game roomId={roomId} isHost={isHost}/>
        </div>
        <div className="columns">
          <div className="video-cam">
            <WebCam  roomId={roomId}/>
          </div>
          <div className="chat">
            <Chat roomId={roomId}/>
          </div>
        </div>
      </div>
    </section>
  )
}

export default GameSessionsSection