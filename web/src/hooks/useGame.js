import React, {useEffect, useState} from 'react';

import { getGame } from "../firebase";


export const useGame = ({ token, gameId, dateUnix = null }) => {
  const [ game, setGame ] = useState(null);
  const [ error, setError ] = useState(null);

  const fetchGame = async () => {
    try {
      const { data: game } = await getGame({ token, gameId, date: dateUnix });
      setGame(game);
    } catch (error) {
      setError({code: error.code, message: error.message});
    }
  };

  useEffect(() => {
    fetchGame();
  }, [gameId]);

  return { game, error, refresh: fetchGame };
};