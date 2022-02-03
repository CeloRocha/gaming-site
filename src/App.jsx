import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './app.scss';
import AuthPage from './pages/auth/AuthPage';
import Homepage from './pages/home/Homepage';
import Lobbypage from './pages/lobby/Lobbypage';

const App = () => {
  return(
    <BrowserRouter>
      <Routes>
        <Route path='/' exact element={<Homepage />} />
        <Route path='/login' exact element={<AuthPage />} />
        <Route path='/lobby' element={<Lobbypage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
