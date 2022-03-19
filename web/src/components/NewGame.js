import React, {useEffect, useState} from 'react';
import { useNavigate } from "react-router-dom";

import { createGame } from "../firebase";
import { Spinner } from "./Spinner";
import { ErrorOverlay } from "./ErrorOverlay";

const NewGame = ({token}) => {
  const navigate = useNavigate();
  const [ error, setError ] = useState(null);

  const addGame = async () => {
    try {
      const { data: { id: gameId } } = await createGame({ token });
      navigate(`/game/${gameId}/`);
    } catch (error) {
      setError({code: error.code, message: error.message});
    }
  }

  useEffect(() => {
    addGame();
  }, []);

  if (error) {
    return <ErrorOverlay message="Failed to Create New Game" />;
  }

  return <Spinner />;
}

export default NewGame;