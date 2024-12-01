import HomeLayout from "../../layouts/HomeLayout";
import './home.css'
const Home = () => {
  return (
    <main>
      <h2>Bienvenido al juego de ajedréz multijugador</h2>
      <h3>Para revise las opciones para que pueda unirse a una partida.</h3>
      <p>Recuerde que el juego tiene opciones de Chat de texto y Webcam para poder jugar.</p>
      <HomeLayout />
      <p>Para mas información puede revisar nuestra sección de instrucciones de nuestro juego multijugador.</p>
    </main>
  );
};

export default Home;
