import Game from '../../components/chess/Game'
import Chat from '../../components/Chat'
import WebCam from '../../components/webCam'

const GameSessionsSection = () => {
  return (
    <section>
      <div className="main-row">
        <div className="columns">
          <Game />
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