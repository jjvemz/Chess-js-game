# Chess Game with React, Material-UI, and Sockets

This is a multiplayer chess game built using React.js for the frontend, Material-UI for the design, and Socket.IO for real-time communication. The game supports two-player matchmaking, real-time move synchronization, and a chat feature.

## Features

- **Multiplayer Chess:** Play chess with another player in real-time.
- **Responsive Design:** Built with Material-UI for an attractive and responsive interface.
- **Real-time Updates:** Socket.IO ensures smooth communication and synchronization between players.
- **Matchmaking:** Create or join a game room.
- **Chat Support:** In-game chat for player interaction.
- **Error Handling:** Handles cases like a full room and provides appropriate user feedback.

## Prerequisites

Before starting, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 16.x or later recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

## Installation and Setup

1. Clone the repository:

   ```bash
   git clone <your-frontend-repo-link>
   cd <your-frontend-folder>
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Configure the backend API:
   
   Update the `.env` file with the backend API URL. Create a `.env` file in the root directory if it doesn't exist:

   ```env
   REACT_APP_BACKEND_URL=http://<your-backend-url>
   ```

4. Start the development server:

   ```bash
   npm start
   # or
   yarn start
   ```

5. Open your browser and navigate to `http://localhost:3000`.

## Backend Repository

The backend for this project handles real-time communication, room management, and game logic. You can find the backend repository here:

[Backend]((https://github.com/jjvemz/chessbackend))

## Technologies Used

### Frontend
- **React.js**: Core library for building the UI.
- **Material-UI**: Styling and layout framework.
- **Socket.IO-client**: For handling real-time updates.
- **Chess.js**: For game logic and move validation.

### Backend
- **Node.js**: Runtime environment.
- **Socket.IO**: For WebSocket communication.
- **NestJS**: Backend framework (if applicable).



## How to Play

1. Launch the frontend and backend servers.
2. Navigate to the application in your browser.
3. Use the "Create Room" button to start a game or "Join Room" to join an existing one.
4. Start playing chess!

## License

This project is licensed under the [MIT License](LICENSE).

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests for improvements and bug fixes.

## Contact

For questions or feedback, please contact [Juan José Vergara](mailto:juanj.vergaram@gmail.com).

