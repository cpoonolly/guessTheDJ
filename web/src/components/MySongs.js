import React, { useState } from "react";
import { useParams } from "react-router-dom";

import { useGame } from "../hooks/useGame";
import { addSong, removeSong, addVote } from "../firebase";
import { Spinner } from "./Spinner";
import { ErrorOverlay } from "./ErrorOverlay";
import { ErrorMessage } from "./ErrorMessage";
import {
  Container,
  Grid,
  Label,
  Header,
  Segment,
  Input,
} from "semantic-ui-react";
import { getAvatarSmallForValue } from "../utils/avatars";

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
      <Grid container padded="vertically" style={{ minHeight: "calc(100vh)" }}>
        {/* <Grid.Row centered> */}
        {/* <Grid.Column verticalAlign="middle" padded width={8}> */}
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
            <Container>
              <Header>Today's Song:</Header>
              <Segment>Spotify Player to go here</Segment>
              {/* <p>{JSON.stringify(todaysSong)}</p> */}
            </Container>
          </>
        ) : (
          <></>
        )}
        <Container>
          <Header>DJs:</Header>
          <Grid stackable columns={2}>
            {users.map((user) => {
              const avatar = getAvatarSmallForValue(user.id);
              return (
                <Grid.Column key={user.id}>
                  {todaysSong ? (
                    <>
                      <Label
                        as="a"
                        image
                        onClick={() => handleVoteAdd(user.id)}
                        href="javascript:void(0)"
                      >
                        <img src={avatar} />
                        {user.name}
                      </Label>
                    </>
                  ) : (
                    <></>
                  )}
                  {/* {JSON.stringify(user)} */}
                </Grid.Column>
              );
            })}
          </Grid>
        </Container>
        <Container>
          <Header>Your Current Vote:</Header>
          <p>{vote}</p>
        </Container>
        <Container>
          <Header>Your Unplayed Songs:</Header>
          <Container>
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
          </Container>
        </Container>
        <Container>
          <Input
            action={{
              className: "button-primary",
              content: "Add Song",
              onClick: handleSongAdd,
            }}
            icon="music"
            iconPosition="left"
            placeholder="Your Spotify Link"
            onChange={(e) => setSongUrl(e.target.value)}
          />
        </Container>
        <Container>
          <Header>Played Songs:</Header>

          <ul>
            {playedSongs.map((song) => (
              <li key={song.id}>{JSON.stringify(song)}</li>
            ))}
          </ul>
        </Container>
        {/* </Grid.Column> */}
        {/* </Grid.Row> */}
      </Grid>
    </>
  );
};

export default MySongs;
