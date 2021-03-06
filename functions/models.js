const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { getAuth } = require("firebase-admin/auth");

const dayjs = require('dayjs');
const { v4: uuidv4 } = require('uuid');

initializeApp();

const db = getFirestore();
const auth = getAuth();

function groupBy(items, key) {
  return items.reduce((acc, item) => ({...acc, [key(item)]: [...(acc[key(item)] || []), item]}), {});
}

function mapBy(items, key) {
  return items.reduce((acc, item) => ({...acc, [key(item)]: item}), {});
}

function chooseRandomly(items) {
  return items[Math.floor(Math.random() * items.length)];
}

class User {
  constructor({id, name}) {
    this.id = id;
    this.name = name;
  }

  static async getUserFromToken(token) {
    try {
      const { uid } = await auth.verifyIdToken(token);
      const user = await auth.getUser(uid);
      
      return new User({id: user.uid, name: user.displayName});
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  static async getUsersFromGame(game) {
    return await db.collection('games')
      .doc(game.id)
      .collection('users')
      .get();
  }
}

class Song {
  constructor({id, gameId, content, userId, playTime = null, votesByUserId = {}}) {
    this.id = id || uuidv4();
    this.gameId = gameId;
    this.content = content;
    this.userId = userId;
    this.playTime = playTime;
    this.votesByUserId = votesByUserId;
  }

  get playDate() {
    return this.playTime ? dayjs.unix(this.playTime).startOf('day') : null;
  }

  get playDateFormatted() {
    return this.playDate ? this.playDate.format('YYYY-MM-DD') : null;
  }

  get revealDate() {
    return this.playDate ? this.playDate.endOf('day') : null;
  }

  get isPlayed() {
    return !!this.playDate && dayjs().isAfter(this.playDate);
  }

  get isRevealed() {
    return !!this.revealDate && dayjs().isAfter(this.revealDate);
  }

  async play() {
    if (this.playDate) {
      return;
    }

    this.playTime = dayjs().unix();
    await db.collection('games')
      .doc(this.gameId)
      .collection('songs')
      .doc(this.id)
      .update({playTime: this.playTime});
  }

  async vote(user, vote) {
    await db.collection('games')
      .doc(this.gameId)
      .collection('songs')
      .doc(this.id)
      .update({[`votesByUserId.${user.id}`]: vote});

    this.votesByUserId[user.id] = vote;
  }
}

class Game {
  constructor({id, users = [], songs = []}) {
    this.id = id || uuidv4();
    this.users = users;
    this.songs = songs;
  }

  get usersById() {
    return mapBy(this.users, user => user.id);
  }

  get playedSongs() {
    return this.songs.filter(s => s.isPlayed);
  }

  get unplayedSongs() {
    return this.songs.filter(s => !s.isPlayed);
  }

  get songsById() {
    return mapBy(this.songs, song => song.id);
  }

  get songByPlayDate() {
    return mapBy(this.songs, song => song.playDateFormatted);
  }

  get unplayedSongsByUserId() {
    return groupBy(this.unplayedSongs, song => song.userId);
  }

  get hasUnplayedSongs() {
    return this.unplayedSongs && this.unplayedSongs.length > 0;
  }
  
  getSongForDate(date) {
    const dateStr = date.format('YYYY-MM-DD');
    return this.songByPlayDate[dateStr] || null;
  }

  get todaysSong() {
    return this.getSongForDate(dayjs());
  }

  async addUser(user) {
    if (this.usersById[user.id]) {
      return;
    }

    await db.collection('games')
      .doc(this.id)
      .collection('users')
      .doc(user.id)
      .set({
        id: user.id,
        name: user.name
      });

    this.users.push(user);
    return user;
  }

  async removeUser(userId) {
    await db.collection('games')
      .doc(this.id)
      .collection('users')
      .doc(userId)
      .delete();

    this.users = this.users.filter(user => user.id !== userId);
  }

  async addSong(user, content) {
    const song = new Song({gameId: this.id, userId: user.id, content});

    await db.collection('games')
      .doc(this.id)
      .collection('songs')
      .doc(song.id)
      .set({
        gameId: song.gameId,
        content: song.content,
        userId: song.userId,
        playTime: song.playTime,
        votesByUserId: song.votesByUserId,
      });

    this.songs.push(song);
    return song;
  }

  async removeSong(songId) {
    await db.collection('games')
      .doc(this.id)
      .collection('songs')
      .doc(songId)
      .delete();

    this.songs = this.songs.filter(song => song.id !== songId);
  }

  async chooseTodaysSong() {
    if (this.todaysSong || !this.hasUnplayedSongs) {
      return;
    }

    // randomly choose a song to mark as played
    const djUserId = chooseRandomly(Object.keys(this.unplayedSongsByUserId));
    const todaysSong = chooseRandomly(this.unplayedSongsByUserId[djUserId]);

    await todaysSong.play();
  }

  static async create() {
    const game = new Game({});

    await db.collection('games')
      .doc(game.id)
      .set({id: game.id});

    return game;
  }

  static async getForId(id) {
    const gameDoc = await db.collection('games').doc(id).get();
    if (!gameDoc.exists) {
      return null;
    }

    const users = [];
    const userDocs = await db.collection('games').doc(id).collection('users').get();
    userDocs.forEach(doc => users.push(new User({...doc.data(), id: doc.id})));

    const songs = [];
    const songDocs = await db.collection('games').doc(id).collection('songs').get();
    songDocs.forEach(doc => songs.push(new Song({...doc.data(), id: doc.id})));

    return new Game({id, users, songs});
  }
}

exports.User = User;
exports.Song = Song;
exports.Game = Game;