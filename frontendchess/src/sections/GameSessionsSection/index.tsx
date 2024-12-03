import Game from '../../components/chess/Game'
import Chat from '../../components/Chat'
import WebCam from '../../components/webCam'
import { useLocation } from 'react-router-dom'

const GameSessionsSection = () => {
  const location = useLocation();
  const isHost = location.state?.isHost || false;
  return (
    <section>
      <div className="main-row">
        <div className="columns">
          <Game isHost={isHost}/>
        </div>
        <div className="columns">
          <div className="video-cam">
            <WebCam />
          </div>
          <div className="chat">
            <Chat />
          </div>
        </div>
      </div>
    </section>
  )
}

export default GameSessionsSection