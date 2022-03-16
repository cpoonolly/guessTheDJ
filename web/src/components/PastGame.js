import React from 'react';
import { useParams } from "react-router-dom";
import dayjs from 'dayjs';

import { useGame } from '../hooks/useGame';

const PastGame = ({ token }) => {
  const { gameId, date } = useParams();
  const dateUnix = dayjs(date).unix();

  const { game, error, refresh } = useGame({ token, gameId, dateUnix });

  if (error) {
    return (<div>Failed to Load Game</div>);
  }

  if (!game) {
    return (<div>Loading Game...</div>);
  }

  return (
    <div>{JSON.stringify(game)}</div>
  );
}

export default PastGame;