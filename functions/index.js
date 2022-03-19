const functions = require("firebase-functions");

const { User, Game } = require('./models');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const cors = require('cors')({
  origin: true,
});

dayjs.extend(utc);

function onRequest(handler) {
  return functions.https.onRequest((req, res) => {
    cors(req, res, async () => {
      const [statusCode, data] = await handler(req, res);

      res.setHeader('content-type', 'application/json');
      res.status(statusCode);
      res.send({data});
      res.end();
    });
  });
};

/** Create a new Guess the DJ Game */
exports.createGame = onRequest(async (req, res) => {
  const { token } = req.body.data;
  const user = await User.getUserFromToken(token);
  if (!user) {
    return [401, {message: 'Failed to authorize user'}];
  }

  const game = await Game.create();
  await game.addUser(user);

  return [201, {id: game.id, message: 'Game Created'}];
});

/** Fetch Game data for a given date (or today if none specified) */
exports.getGame = onRequest(async (req, res) => {
  const { token, gameId, date: dateStr } = req.body.data;
  const date = (dateStr ? dayjs(dateStr) : dayjs());

  const user = await User.getUserFromToken(token);
  if (!user) {
    return [401, {message: 'Failed to authorize user'}];
  }

  const game = await Game.getForId(gameId);
  if (!game) {
    return [404, {message: 'Game not found'}];
  }

  // If the user isn't part of the game yet add them
  if (!game.usersById[user.id]) {
    await game.addUser(user);
  }

  // Choose song for today if one isn't set
  if (!game.todaysSong) {
    await game.chooseTodaysSong();
  }

  const userToJson = (user) => (user ? {
    id: user.id, name: user.name
  } : null);

  const songToJson = (song) => (song ? {
    id: song.id,
    content: song.content,
    isPlayed: song.isPlayed,
    isRevealed: song.isRevealed,
    playDate: song.playDateFormatted,
    votesByUserId: song.isRevealed ? song.votesByUserId : {}
  } : null);

  const song = game.getSongForDate(date);
  const unplayedSongs = game.unplayedSongsByUserId[user.id] || [];

  return [
    200, 
    {
      users: game.users.map(user => userToJson(user)),
      daysSong: songToJson(song),
      playedSongs: game.playedSongs.map(song => songToJson(song)),
      unplayedSongs: unplayedSongs.map(song => songToJson(song)),
      vote: (song && song.votesByUserId[user.id]) || null,
    }
  ];
});

/** Add a song suggestion to be played on a random day */
exports.addSong = onRequest(async (req, res) => {
  const { token, gameId, content } = req.body.data;
  const user = await User.getUserFromToken(token);
  if (!user) {
    return [401, {message: 'Failed to authorize user'}];
  }

  const game = await Game.getForId(gameId);
  if (!game) {
    return [404, {message: 'Game not found'}];
  }

  // add song
  const song = await game.addSong(user, content);

  return [201, {id: song.id, message: 'Song Added'}];
});


/** Remove a unplayed song suggestion */
 exports.removeSong = onRequest(async (req, res) => {
  const { token, gameId, songId } = req.body.data;
  const user = await User.getUserFromToken(token);
  if (!user) {
    return [401, {message: 'Failed to authorize user'}];
  }

  const game = await Game.getForId(gameId);
  if (!game) {
    return [404, {message: 'Game not found'}];
  }

  const song = game.songsById[songId];
  if (!song) {
    return [404, {message: 'Song not found'}];
  }

  if (song.isPlayed) {
    return [400, {message: 'Can not remove played song'}];
  }

  // remove the song
  await game.removeSong(songId);

  return [201, {id: song.id, message: 'Song Added'}];
});


/** Vote for todays DJ */
exports.addVote = onRequest(async (req, res) => {
  const { token, gameId, vote } = req.body.data;

  const user = await User.getUserFromToken(token);
  if (!user) {
    return [401, {message: 'Failed to authorize user'}];
  }

  const game = await Game.getForId(gameId);
  if (!game) {
    return [404, {message: 'Game not found'}];
  }

  // Choose song for today if one isn't set
  if (!game.todaysSong) {
    await game.chooseTodaysSong();
  }

  if (!game.todaysSong) {
    return [400, {message: 'No songs available for today'}];
  }

  await game.todaysSong.vote(user, vote);

  return [200, {message: 'Vote Added'}];
});