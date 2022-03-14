import { initializeApp } from 'firebase/app';
import { getFunctions, httpsCallable } from "firebase/functions";


const firebase = initializeApp({
  apiKey: "AIzaSyBtRESG6NN--bQTaJv6dcq56qCKEAdO-Jg",
  authDomain: "guessthedj-51ad9.firebaseapp.com",
  projectId: "guessthedj-51ad9",
  storageBucket: "guessthedj-51ad9.appspot.com",
  messagingSenderId: "693013543709",
  appId: "1:693013543709:web:13229534d77d8e1c2d3ff4"
});

const functions = getFunctions();

export const createGame = httpsCallable(functions, 'createGame');
export const getGame = httpsCallable(functions, 'getGame');
export const addSong = httpsCallable(functions, 'addSong');
export const addVote = httpsCallable(functions, 'addVote');

export default firebase;