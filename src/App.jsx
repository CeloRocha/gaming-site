import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './app.scss';
import { AuthContextProvider } from './contexts/AuthContextProvider';
import AuthPage from './pages/auth/AuthPage';
import Thanks from './pages/games/thanks/Thanks';
import Homepage from './pages/home/Homepage';
import Lobbypage from './pages/lobby/Lobbypage';
import RulesPage from './pages/rules/RulesPage';
import SearchLobbyPage from './pages/searchLobby/SearchLobbyPage';

const App = () => {
  return(
    <BrowserRouter>
      <AuthContextProvider >
        <Routes>
          <Route path='/' exact element={<Homepage />} />
          <Route path='/login' exact element={<AuthPage />} />
          <Route path='/rules' exact element={<RulesPage />} />
          <Route path='/lobby/:room' element={<Lobbypage />} />
          <Route path='/thanks/:room' element={<Thanks />} />
          <Route path='/search' element={<SearchLobbyPage />} />
        </Routes>
      </AuthContextProvider>
    </BrowserRouter>
  );
};

export default App;
