import "./App.css";
import React, { useEffect, useState } from "react";

import { Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import Register from "./pages/Register";

function App() {
  return (
    <>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/login" element={<LoginPage />} />
        <Route exact path="/register" element={<Register />} />
      </Routes>
    </>
  );
}

export default App;
