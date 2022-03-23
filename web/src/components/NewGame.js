import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

import { Grid, Input, Button, Segment } from 'semantic-ui-react'

import { createGame } from "../firebase";
import { Spinner } from "./Spinner";
import { ErrorOverlay } from "./ErrorOverlay";

const NewGame = ({token}) => {
  const navigate = useNavigate();
  const [ error, setError ] = useState(null);
  const [ isLoading, setIsLoading ] = useState(false);
  const [ roomId, setRoomId ] = useState('');

  const addGame = async () => {
    setIsLoading(true);

    try {
      const { data: { id: gameId } } = await createGame({ token });
      navigate(`/game/${gameId}/`);
    } catch (error) {
      setError({code: error.code, message: error.message});
    }

    setIsLoading(false);
  }

  const joinGame = async () => {
    navigate(`/game/${roomId}/`);
  }

  if (error) {
    return <ErrorOverlay message="Failed to Create New Game" />;
  }

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <Grid container  style={{minHeight: 'calc(100vh)'}}>
      <Grid.Row centered>
        <Grid.Column verticalAlign='middle' padded width={8}>
          <Segment vertical basic>
            <Input fluid size="huge" placeholder='Room ID' value={roomId} onChange={e => setRoomId(e.target.value)}/>
          </Segment>
          <Segment vertical basic>
            <Button.Group size="huge" widths="8">
              <Button primary onClick={addGame}>Create</Button>
              <Button.Or />
              <Button secondary disabled={!roomId} onClick={joinGame}>Join</Button>
            </Button.Group>
          </Segment>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
}

export default NewGame;