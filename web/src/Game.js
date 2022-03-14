import React from 'react';
import { useParams } from "react-router-dom";

import { useGame } from './useGame';

function Game({ token }) {
  const { gameId } = useParams();
  const { game, error } = useGame({ token, gameId });

  if (error) {
    return (<div>Failed to Load Game</div>);
  }

  if (!game) {
    return (<div>Loading Game</div>);
  }

  return (
    <div>The Game</div>
  );
}

export default Game;