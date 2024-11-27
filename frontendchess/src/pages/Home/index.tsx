import React from "react";
import HomeLayout from "../../layouts/HomeLayout";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const Home = () => {
  return (
    <>
    <Header/>
    <div>
      <h1>Random Chess Game</h1>
      <div className="">
        <HomeLayout/>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default Home;
