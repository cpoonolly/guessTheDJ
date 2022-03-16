import React, { useState } from 'react';
import { useParams } from "react-router-dom";

import { useGame } from '../hooks/useGame';
import { addSong, addVote } from "../firebase";

function TodaysGame({ token }) {
  const { gameId } = useParams();
  const { game, error, refresh: refreshGame } = useGame({ token, gameId });
  const [ song, setSong ] = useState(null);
  const [ vote, setVote ] = useState(null);

  const handleSongAdd = async () => {
    const { data: { id: songId } } = await addSong({ token, gameId, content: song });
    console.log(`Added song: ${songId}`);

    await refreshGame();
  };

  const handleVoteAdd = async () => {
    await addVote({ token, gameId, vote });
    await refreshGame();
  };

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
        <button onClick={handleSongAdd}>Add Song</button>
      </div>
      <div>
        <input type={'text'} value={vote} onChange={e => setVote(e.target.value)} />
        <button onClick={handleVoteAdd}>Add Vote</button>
      </div>
    </>
  );
}

export default TodaysGame;