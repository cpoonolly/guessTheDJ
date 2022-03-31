import React from 'react';
import { Routes, Route } from "react-router-dom";

import './App.css';
import NewGame from './components/NewGame';
import TodaysGame from './components/TodaysGame';
import PastGame from './components/PastGame';
import MySongs from './components/MySongs';
import { useUser } from './hooks/useUser';

const App = () => {
  const {user, token, error} = useUser();

  if (error) {
    console.error(error);
    return (<div>Failed to Login</div>);
  }

  if (!user || !token) {
    return (<div>Loading User...</div>);
  }

  return (
    <div>
      <Routes>
        <Route path="/" element={<NewGame user={user} token={token} />} />
        <Route path="/game/:gameId/" element={<TodaysGame user={user} token={token} />} />
        <Route path="/game/:gameId/date/:date" element={<PastGame user={user} token={token} />} />
        <Route path="/game/:gameId/songs" element={<MySongs user={user} token={token} />} />
      </Routes>
    </div>
  );
}

export default App;
