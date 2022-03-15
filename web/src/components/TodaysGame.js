import React, { useState } from 'react';
import { useParams } from "react-router-dom";

import { useGame } from '../hooks/useGame';

function TodaysGame({ token }) {
  const { gameId } = useParams();
  const { game, error, refresh: refreshGame } = useGame({ token, gameId });
  const [ song, setSong ] = useState(null);
  const [ vote, setVote ] = useState(null);

  if (error) {
    return (<div>Failed to Load Game</div>);
  }

  if (!game) {
    return (<div>Loading Game...</div>);
  }

  return (
    <>
      <div>{JSON.stringify(game)}</div>
      <div>
        <input type={'text'} value={song} onChange={e => setSong(e.target.value)} />
        <button>Add Song</button>
      </div>
      <div>
        <input type={'text'} value={vote} onChange={e => setVote(e.target.value)} />
        <button>Add Vote</button>
      </div>
    </>
  );
}

export default TodaysGame;