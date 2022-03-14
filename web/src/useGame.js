import React, {useEffect, useState} from 'react';

import { getGame } from "./firebase";


export const useGame = ({ token, gameId }) => {
  const [ game, setGame ] = useState(null);
  const [ error, setError ] = useState(null);  

  useEffect(() => {
    getGame({ token, gameId }).then((result) => {
      setGame(result);
    }).catch((error) => {
      setError({code: error.code, message: error.message});
    });
  }, [gameId]);

  return { game, error };
};