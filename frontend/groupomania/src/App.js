import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import Home from './pages/Home';
import Groupomania from './pages/Groupomania';
import User from './pages/User';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/user" element={<User />} />
        <Route path="/groupomania" element={<Groupomania />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;