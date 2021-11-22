import React, { useState, useEffect, useRef } from "react";
import './App.css';
import Canvas from './Components/Canvas.js';
import Header from "./Components/Header";
import Footer from "./Components/Footer";

function App() {


  return (
    <>
    <Header />
    <Canvas />
    <Footer />
    </>
  );
}

export default App;
