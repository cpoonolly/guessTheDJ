import React from 'react';
import { Routes, Route } from "react-router-dom";

import './App.css';
import NewGame from './NewGame';
import Game from './Game';
import { firebase } from './firebase';
import { useUser } from './useUser';

function App() {
  const {user, token, error} = useUser();

  if (error) {
    console.error(error);
    return (<div>Failed to Login</div>);
  }

  if (!user || !token) {
    return (<div>Logging in Page. (make sure to unblock popups)</div>);
  }

  return (
    <div>
      <Routes>
        <Route path="/" element={<NewGame user={user} token={token} />} />
        <Route path="/game/:gameId/" element={<Game user={user} token={token} />} />
      </Routes>
    </div>
  );
}

export default App;
