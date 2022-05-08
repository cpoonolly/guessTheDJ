import React, { useState } from "react";
import { useParams } from "react-router-dom";

import { useGame } from "../hooks/useGame";
import { addSong, removeSong, addVote } from "../firebase";
import { Spinner } from "./Spinner";
import { ErrorOverlay } from "./ErrorOverlay";
import { ErrorMessage } from "./ErrorMessage";
import { Container, Grid, Label, Header, Segment } from "semantic-ui-react";

const MySongs = ({ token }) => {
  const { gameId } = useParams();
  const { game, error, refresh: refreshGame } = useGame({ token, gameId });
  const [songUrl, setSongUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorBanner, setErrorBanner] = useState(null);

  const handleSongAdd = async () => {
    setIsLoading(true);

    try {
      await addSong({ token, gameId, content: songUrl });
      await refreshGame();
      setSongUrl(null);
    } catch (error) {
      setErrorBanner("Failed to add Song");
    }

    setIsLoading(false);
  };

  const handleSongRemove = async (songId) => {
    setIsLoading(true);

    try {
      await removeSong({ token, gameId, songId });
      await refreshGame();
    } catch (error) {
      setErrorBanner("Failed to remove Song");
    }

    setIsLoading(false);
  };

  const handleVoteAdd = async (userId) => {
    setIsLoading(true);

    try {
      await addVote({ token, gameId, vote: userId });
      await refreshGame();
    } catch (error) {
      setErrorBanner("Failed to add Vote");
    }
    setIsLoading(false);
  };

  if (error) {
    return <ErrorOverlay message="Failed to Load Game" />;
  }

  if (!game) {
    return <Spinner />;
  }

  const {
    vote,
    users,
    playedSongs,
    unplayedSongs,
    daysSong: todaysSong,
  } = game;

  return (
    <>
      {isLoading ? <Spinner /> : <></>}
      {errorBanner ? (
        <ErrorMessage
          message="Something went wrong"
          subMessage={errorBanner}
          onDismiss={() => setErrorBanner(null)}
        />
      ) : (
        <></>
      )}
      {todaysSong ? (
        <>
          <div>
            <p>
              <strong>Today's Song:</strong>
            </p>
            <p>{JSON.stringify(todaysSong)}</p>
          </div>
          <div>
            <p>
              <strong>Current Vote:</strong>
            </p>
            <p>{vote}</p>
          </div>
        </>
      ) : (
        <></>
      )}

      <Container>
        <Header>DJs:</Header>
        {/* <ul> */}
        <Grid stackable columns={2}>
          {users.map((user) => (
            <Grid.Column key={user.id}>
              {todaysSong ? (
                <a
                  onClick={() => handleVoteAdd(user.id)}
                  href="javascript:void(0)"
                >
                  (Vote)
                </a>
              ) : (
                <></>
              )}
              {/* {JSON.stringify(user)} */}
              <Label>{user.name}</Label>
            </Grid.Column>
          ))}
        </Grid>
        {/* </ul> */}
      </Container>
      <div>
        <p>
          <strong>Unplayed Songs:</strong>
        </p>
        <ul>
          {unplayedSongs.map((song) => (
            <li key={song.id}>
              <a
                onClick={() => handleSongRemove(song.id)}
                href="javascript:void(0)"
              >
                (Delete)
              </a>
              {JSON.stringify(song)}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <input
          type={"text"}
          value={songUrl}
          onChange={(e) => setSongUrl(e.target.value)}
        />
        <button onClick={handleSongAdd}>Add Song</button>
      </div>
      <div>
        <p>
          <strong>Played Songs:</strong>
        </p>
        <ul>
          {playedSongs.map((song) => (
            <li key={song.id}>{JSON.stringify(song)}</li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default MySongs;
