import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';  

import Main from '../Main/Main.js';

import React, { useEffect } from "react";

import AOS from "aos";
import "aos/dist/aos.css";
import './App.css'

function App() {
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <div>
        <Routes>
          <Route path='/' element={<Main />}></Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
