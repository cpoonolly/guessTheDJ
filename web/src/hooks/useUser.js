import React, {useEffect, useState} from 'react';

import { getAuth, onAuthStateChanged, signInWithRedirect, GoogleAuthProvider } from "firebase/auth";

const provider = new GoogleAuthProvider();
const auth = getAuth();

export const useUser = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);

  const logout = () => {
    setUser(null);
    setToken(null);
    setError(null);
  }

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        setToken(await user.getIdToken());
      } else {
        signInWithRedirect(auth, provider);
      }
    });
  }, []);

  return {user, token, error, logout}
};