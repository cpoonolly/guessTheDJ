import React, { useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";

import { Grid, Segment, Label, Header, Icon, Button } from 'semantic-ui-react'

import { useGame } from '../hooks/useGame';
import { addVote } from "../firebase";
import { Spinner } from "./Spinner";
import { ErrorOverlay } from "./ErrorOverlay";
import { ErrorMessage } from "./ErrorMessage";
import { getRandomColor } from '../utils/colors';
import { getRandomAvatarSmall } from '../utils/avatars';


const TodaysGame = ({ token }) => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const { game, error, refresh: refreshGame } = useGame({ token, gameId });
  const [ songUrl, setSongUrl ] = useState(null);
  const [ isLoading, setIsLoading ] = useState(false);
  const [ errorBanner, setErrorBanner ] = useState(null);

  const handleVoteAdd = async (userId) => {
    setIsLoading(true);

    try {
      await addVote({ token, gameId, vote: userId });
      await refreshGame();
    } catch (error) {
      console.error(error);
      setErrorBanner('Failed to add Vote');
    }
    setIsLoading(false);
  };

  const handleSongSuggest = () => {
    navigate(`/game/${gameId}/songs`);
  };

  if (error) {
    return <ErrorOverlay message="Failed to Load Game" />;
  }

  if (!game) {
    return <Spinner />;
  }

  const { vote, users, playedSongs, unplayedSongs, daysSong: todaysSong } = game;

  return (
    <Grid container>
      {isLoading ? <Spinner /> : <></>}
      <Grid.Row style={{minHeight: '150px'}}>
        <Grid.Column verticalAlign='top'>
          <Segment basic>
            {errorBanner ? <ErrorMessage message="Something went wrong" subMessage={errorBanner} onDismiss={() => setErrorBanner(null)} /> : <></>}
          </Segment>
        </Grid.Column>
      </Grid.Row>
      {todaysSong ? (
        <Grid.Row centered style={{minHeight: 'calc(100vh - 150px)'}}>
          <Grid.Column padded verticalAlign='middle' width={10}>
            <Segment>Hello World</Segment>
            <Segment>
              <VoteBox vote={vote} users={users} onVote={user => handleVoteAdd(user.id)} />
            </Segment>
          </Grid.Column>
        </Grid.Row>
      ) : (
        <Grid.Row centered style={{minHeight: 'calc(100vh - 150px)'}}>
          <Grid.Column padded verticalAlign='middle' width={10}>
            <Segment placeholder>
              <Header icon>
                <Icon name='music' />
                No Songs suggested for today
              </Header>
              <Button primary onClick={handleSongSuggest}>Suggest Song</Button>
            </Segment>
          </Grid.Column>
        </Grid.Row>
      )}
    </Grid>
  );
}

const VoteBox = ({vote, users, onVote}) => {
  return (
    <Grid>
      {users.map(user => {
        const color = getRandomColor();
        const avatar = getRandomAvatarSmall();

        return (
          <Grid.Column key={user.id} width={4}>
            <Label as='a' color={vote === user.id ? color : undefined} image onClick={user => onVote(user)}>
              <img src={avatar} />
              {user.name}
            </Label>
          </Grid.Column>
        )
      })}
    </Grid>
  )
};

export default TodaysGame;