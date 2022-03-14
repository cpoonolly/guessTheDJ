import React, {useEffect, useState} from 'react';

import firebase from "./firebase";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

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
    signInWithPopup(auth, provider).then(result => {
      const credential = GoogleAuthProvider.credentialFromResult(result);

      setUser(result.user);
      setToken(credential.idToken);
    }).catch(error => {
      setError(error.message);
    });
  }, []);

  return {user, token, error, logout}
};