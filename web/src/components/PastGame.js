import React from 'react';
import { useParams } from "react-router-dom";
import dayjs from 'dayjs';

import { useGame } from '../hooks/useGame';
import { Spinner } from "./Spinner";
import { ErrorOverlay } from "./ErrorOverlay";

const PastGame = ({ token }) => {
  const { gameId, date } = useParams();
  const dateUnix = dayjs(date).unix();

  const { game, error, refresh } = useGame({ token, gameId, dateUnix });

  if (error) {
    return <ErrorOverlay message="Failed to Load Game" />;
  }

  if (!game) {
    return <Spinner />;
  }

  return (
    <div>{JSON.stringify(game)}</div>
  );
}

export default PastGame;