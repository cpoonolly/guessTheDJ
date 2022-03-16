import React, { useState } from 'react';
import { useParams } from "react-router-dom";

import { useGame } from '../hooks/useGame';
import { addSong, removeSong, addVote } from "../firebase";

const TodaysGame = ({ token }) => {
  const { gameId } = useParams();
  const { game, error, refresh: refreshGame } = useGame({ token, gameId });
  const [ songUrl, setSongUrl ] = useState(null);
  const [ isLoading, setIsLoading ] = useState(false);

  const handleSongAdd = async () => {
    setIsLoading(true);
    await addSong({ token, gameId, content: songUrl });
    await refreshGame();
    setSongUrl(null);
    setIsLoading(false);
  };

  const handleSongRemove = async (songId) => {
    setIsLoading(true);
    await removeSong({ token, gameId, songId });
    await refreshGame();
    setIsLoading(false);
  };

  const handleVoteAdd = async (userId) => {
    setIsLoading(true);
    await addVote({ token, gameId, vote: userId });
    await refreshGame();
    setIsLoading(false);
  };

  if (error) {
    return (<div>Failed to Load Game</div>);
  }

  if (!game) {
    return (<div>Loading Game...</div>);
  }

  const { vote, users, playedSongs, unplayedSongs, daysSong: todaysSong } = game;

  return (
    <>
      <h1 className="text-3xl font-bold underline text-red-900">Hello Tailwind!</h1>
      {isLoading ? <p>Loading</p> : <></>}
      {todaysSong ? (
        <>
          <div>
            <p><strong>Today's Song:</strong></p>
            <p>{JSON.stringify(todaysSong)}</p>
          </div>
          <div>
            <p><strong>Current Vote:</strong></p>
            <p>{vote}</p> 
          </div>
        </>
      ) : (
        <></>
      )}
      <div>
        <p><strong>Users:</strong></p>
        <ul>
          {users.map(user => (
            <li key={user.id} className="list-disc">
              {todaysSong ? (
                <a onClick={() => handleVoteAdd(user.id)} href="javascript:void(0)">(Vote)</a>
              ) : (
                <></>
              )}
              {JSON.stringify(user)}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <p><strong>Unplayed Songs:</strong></p>
        <ul>
          {unplayedSongs.map(song => (
            <li key={song.id} className="list-disc">
              <a onClick={() => handleSongRemove(song.id)} href="javascript:void(0)">(Delete)</a>
              {JSON.stringify(song)}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <input type={'text'} value={songUrl} onChange={e => setSongUrl(e.target.value)} />
        <button onClick={handleSongAdd}>Add Song</button>
      </div>
      <div>
        <p><strong>Played Songs:</strong></p>
        <ul>
          {playedSongs.map(song => (
            <li key={song.id} className="list-disc">
              {JSON.stringify(song)}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default TodaysGame;