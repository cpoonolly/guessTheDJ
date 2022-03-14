const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
// const { getAuth, signInWithCredential, GoogleAuthProvider } = require("firebase/auth");

initializeApp();

const db = getFirestore();
// const auth = getAuth();

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

      // Taken from: https://firebase.google.com/docs/auth/web/google-signin#web-version-9_9
      const credential = GoogleAuthProvider.credential(token);
      const response = await signInWithCredential(auth, credential);
      const userId = response.user['sub'];
      const userName = response.user['name'];
      
      return new User({id: userId, name: userName});
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
  constructor({id, gameId, content, userId, playDateUnix = null, votesByUserId = {}}) {
    this.id = id || uuidv4();
    this.gameId = gameId;
    this.content = content;
    this.userId = userId;
    this.playDateUnix = playDateUnix;
    this.votesByUserId = votesByUserId;
  }

  get playDate() {
    return this.playDateUnix ? dayjs.unix(this.playDateUnix) : null;
  }

  get revealDate() {
    return this.playDate ? this.playDate.endOf('day') : null;
  }

  get isPlayed() {
    return this.playDate && dayjs().isAfter(this.playDate);
  }

  get isRevealed() {
    return this.revealDate && dayjs().isAfter(this.revealDate);
  }

  async play() {
    if (this.playDate) {
      return;
    }

    this.playDateUnix = dayjs().startOf('day').unix();
    await db.collection('games')
      .doc(this.gameId)
      .collection('songs')
      .doc(this.id)
      .update({playDateUnix: this.playDateUnix});
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

  get songByPlayDate() {
    return mapBy(this.songs, song => song.playDate);
  }

  get unplayedSongsByUserId() {
    return groupBy(this.unplayedSongs, song => song.userId);
  }

  get todaysSong() {
    const today = dayjs().startOf('day');
    return this.songByPlayDate[today];
  }

  async addUser(user) {
    if (this.usersById[user.id]) {
      return;
    }

    await db.collection('games')
      .doc(this.gameId)
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
      .doc(this.gameId)
      .collection('users')
      .doc(userId)
      .delete();

    this.users = this.users.filter(user => user.id !== userId);
  }

  async addSong(user, content) {
    const song = new Song({gameId: this.id, userId: user.id, content});

    await db.collection('games')
      .doc(this.gameId)
      .collection('songs')
      .doc(song.id)
      .set({
        gameId: song.gameId,
        content: song.content,
        userId: song.userId,
        playDateUnix: song.playDateUnix,
        votesByUserId: song.votesByUserId,
      });

    this.songs.push(song);
    return song;
  }

  async removeSong(songId) {
    await db.collection('games')
      .doc(this.gameId)
      .collection('songs')
      .doc(song.id)
      .delete();

    this.songs = this.songs.filter(song => song.id !== songId);
  }

  async chooseTodaysSong() {
    if (this.todaysSong) {
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

    const users = await db.collection('games').doc(id).collection('users').get().map(doc => new User(doc));
    const songs = await db.collection('games').doc(id).collection('songs').get().map(doc => new Song(doc));

    return Game({id, users, songs});
  }
}

exports = {
  User,
  Song,
  Game
};