const functions = require("firebase-functions");

const {User, Game} = require('./models');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');


dayjs.extend(utc);

function sendResponse(res, statusCode, message) {
  res.setHeader('content-type', 'application/json');
  res.status(statusCode);
  res.send(message);
  res.end();
}

/**
 * Get the game data as of a given date
 */
exports.createGame = functions.https.onRequest(async (req, res) => {
  const {token} = req.body;
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
  const {token, gameId, date: dateUnix = dayjs().unix()} = req.body;
  const date = dayjs.unix(dateUnix);

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
      playDate: song.playDateUnix,
      votesByUserId: song.votesByUserId,
    } : {})
  } : null);

  const song = game.songByPlayDate[date];
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
  const {token, gameId, content} = req.body;
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
  const {token, gameId, vote} = req.body;

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

  await game.todaysSong.vote(user, vote);

  sendResponse(res, 200, {message: 'Vote Added'});
});