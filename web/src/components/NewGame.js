import React, {useEffect, useState} from 'react';
import { useNavigate } from "react-router-dom";

import { createGame } from "../firebase";

function NewGame({token}) {
  const navigate = useNavigate();
  const [ error, setError ] = useState(null);

  useEffect(() => {
    createGame({ token }).then(({data}) => {
      const { id: gameId } = data;
      navigate(`/game/${gameId}/`);
    }).catch((error) => {
      setError({code: error.code, message: error.message});
    });
  }, []);

  if (error) {
    console.error(error);
    return (<div>Failed to Create New Game</div>);
  }

  return (
    <div>Creating New Game...</div>
  );
}

export default NewGame;