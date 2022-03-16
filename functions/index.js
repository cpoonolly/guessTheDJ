const functions = require("firebase-functions");

const {User, Game} = require('./models');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');


dayjs.extend(utc);

function sendResponse(res, statusCode, data) {
  res.setHeader('content-type', 'application/json');
  res.status(statusCode);
  res.send({data});
  res.end();
}

/**
 * Get the game data as of a given date
 */
exports.createGame = functions.https.onRequest(async (req, res) => {
  const { token } = req.body.data;
  const user = await User.getUserFromToken(token);
  if (!user) {
    sendResponse(res, 401, {message: 'Failed to authorize user'});
    return;
  }

  const game = await Game.create();
  await game.addUser(user);

  sendResponse(res, 201, {id: game.id, message: 'Game Created'});
});

/**
 * Get the game data as of a given date
 */
exports.getGame = functions.https.onRequest(async (req, res) => {
  const { token, gameId, date: dateStr } = req.body.data;
  const date = (dateStr ? dayjs(dateStr) : dayjs());

  const user = await User.getUserFromToken(token);
  if (!user) {
    sendResponse(res, 401, {message: 'Failed to authorize user'});
    return;
  }

  const game = await Game.getForId(gameId);
  if (!game) {
    sendResponse(res, 404, {message: 'Game not found'});
    return;
  }

  // Choose song for today if one isn't set
  if (!game.todaysSong) {
    await game.chooseTodaysSong();
  }

  const songToJson = (song) => (song ? {
    content: song.content,
    ...(song.isRevealed ? {
      playDate: song.playDateFormatted,
      votesByUserId: song.votesByUserId,
    } : {})
  } : null);

  const song = game.getSongForDate(date);
  const unplayedSongs = game.unplayedSongsByUserId[user.id] || [];

  sendResponse(res, 200, {
    users: game.users.map(user => ({id: user.id, name: user.name})),
    daysSong: songToJson(song),
    playedSongs: game.playedSongs.map(song => songToJson(song)),
    unplayedSongs: unplayedSongs.map(song => songToJson(song)),
    vote: (song && song.votesByUserId[user.id]) || null,
  })
});

/**
 * Add a song suggestion for the current user.
 */
exports.addSong = functions.https.onRequest(async (req, res) => {
  const { token, gameId, content } = req.body.data;
  const user = await User.getUserFromToken(token);
  if (!user) {
    sendResponse(res, 401, {message: 'Failed to authorize user'});
    return;
  }

  const game = await Game.getForId(gameId);
  if (!game) {
    sendResponse(res, 404, {message: 'Game not found'});
    return;
  }

  // add song
  const song = await game.addSong(user, content);

  sendResponse(res, 201, {id: song.id, message: 'Song Added'});
});

/** 
 * Guess today's DJ.
 * Called when the `/dj_guess @username` slack command is executed.
 */
exports.addVote = functions.https.onRequest(async (req, res) => {
  const { token, gameId, vote } = req.body.data;

  const user = await User.getUserFromToken(token);
  if (!user) {
    sendResponse(res, 401, {message: 'Failed to authorize user'});
    return;
  }

  const game = await Game.getForId(gameId);
  if (!game) {
    sendResponse(res, 404, {message: 'Game not found'});
    return;
  }

  // Choose song for today if one isn't set
  if (!game.todaysSong) {
    await game.chooseTodaysSong();
  }

  if (!game.todaysSong) {
    sendResponse(res, 400, {message: 'No songs available for today'});
    return;
  }

  await game.todaysSong.vote(user, vote);

  sendResponse(res, 200, {message: 'Vote Added'});
});