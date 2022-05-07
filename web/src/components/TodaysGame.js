import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { Grid, Segment, Label, Header, Icon, Button } from "semantic-ui-react";

import { useGame } from "../hooks/useGame";
import { addVote } from "../firebase";
import { Spinner } from "./Spinner";
import { ErrorOverlay } from "./ErrorOverlay";
import { ErrorMessage } from "./ErrorMessage";
import { getColorForValue } from "../utils/colors";
import { getAvatarSmallForValue } from "../utils/avatars";

const TodaysGame = ({ user, token }) => {
  const { gameId } = useParams();
  const { game, error, refresh: refreshGame } = useGame({ token, gameId });
  const [songUrl, setSongUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorBanner, setErrorBanner] = useState(null);

  const handleVoteAdd = async (userId) => {
    setIsLoading(true);

    try {
      await addVote({ token, gameId, vote: userId });
      await refreshGame();
    } catch (error) {
      console.error(error);
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
    <Grid container padded="vertically">
      {isLoading ? <Spinner /> : <></>}
      {errorBanner ? (
        <Grid.Row style={{ minHeight: "150px" }}>
          <Grid.Column verticalAlign="top">
            <Segment basic>
              <ErrorMessage
                message="Something went wrong"
                subMessage={errorBanner}
                onDismiss={() => setErrorBanner(null)}
              />
            </Segment>
          </Grid.Column>
        </Grid.Row>
      ) : (
        <></>
      )}
      {todaysSong ? (
        <Grid.Row centered style={{ minHeight: "calc(100vh)" }}>
          <Grid.Column padded verticalAlign="middle" width={10}>
            <Segment>Hello World</Segment>
            <Segment>
              <VoteBox
                vote={vote}
                users={users}
                onVote={(user) => handleVoteAdd(user.id)}
              />
            </Segment>
          </Grid.Column>
        </Grid.Row>
      ) : (
        <NoSongsToday gameId={gameId} />
      )}
    </Grid>
  );
};

const VoteBox = ({ vote, users, onVote }) => {
  return (
    <Grid stackable columns={2}>
      {users.map((user) => {
        const color = getColorForValue(user.id);
        const avatar = getAvatarSmallForValue(user.id);

        return (
          <Grid.Column key={user.id}>
            <Label
              as="a"
              color={vote === user.id ? color : undefined}
              image
              onClick={(user) => onVote(user)}
            >
              <img src={avatar} />
              {user.name}
            </Label>
          </Grid.Column>
        );
      })}
    </Grid>
  );
};

const NoSongsToday = ({ gameId }) => {
  const navigate = useNavigate();

  const handleSongSuggest = () => {
    navigate(`/game/${gameId}/songs`);
  };

  return (
    <Grid.Row centered style={{ minHeight: "calc(100vh)" }}>
      <Grid.Column padded verticalAlign="middle" width={10}>
        <Segment placeholder className="gamebox">
          <Header icon>
            <Icon name="music" />
            No songs suggested for today
          </Header>
          <Button
            // primary
            onClick={handleSongSuggest}
            className="button-primary"
          >
            Suggest Song
          </Button>
        </Segment>
      </Grid.Column>
    </Grid.Row>
  );
};

export default TodaysGame;
