import React from "react";
import HomeLayout from "./layouts/HomeLayout";
import "./App.css";




// const paddingStyle = {
//   padding: 5
// }
// const marginStyle = {
//   margin: 5
// }
const App: React.FC = () => {
  
  return (
    <>
    <div className="flex-center">
      <h1>Random Chess Game</h1>
      <HomeLayout />
    </div>
  </>
  );
};

export default App;