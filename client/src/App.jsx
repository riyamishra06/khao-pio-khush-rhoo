import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import TrackNutrition from './pages/TrackNutrition';
import Navbar from './components/Home/Navbar';
import Footer from './components/Home/Footer';

const App = () => {
  return (
    <BrowserRouter>
    <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/track-nutrition" element={<TrackNutrition />} />
      </Routes>
      <Footer/>
    </BrowserRouter>
  );
};

export default App;
