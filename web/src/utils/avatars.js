import { hash } from './hash';

export const AVATARS_SMALL = [
  'https://raw.githubusercontent.com/Semantic-Org/Semantic-UI-React/master/docs/public/images/avatar/small/ade.jpg',
  'https://raw.githubusercontent.com/Semantic-Org/Semantic-UI-React/master/docs/public/images/avatar/small/chris.jpg',
  'https://raw.githubusercontent.com/Semantic-Org/Semantic-UI-React/master/docs/public/images/avatar/small/christian.jpg',
  'https://raw.githubusercontent.com/Semantic-Org/Semantic-UI-React/master/docs/public/images/avatar/small/daniel.jpg',
  'https://raw.githubusercontent.com/Semantic-Org/Semantic-UI-React/master/docs/public/images/avatar/small/elliot.jpg',
  'https://raw.githubusercontent.com/Semantic-Org/Semantic-UI-React/master/docs/public/images/avatar/small/helen.jpg',
  'https://raw.githubusercontent.com/Semantic-Org/Semantic-UI-React/master/docs/public/images/avatar/small/jenny.jpg',
  'https://raw.githubusercontent.com/Semantic-Org/Semantic-UI-React/master/docs/public/images/avatar/small/joe.jpg',
  'https://raw.githubusercontent.com/Semantic-Org/Semantic-UI-React/master/docs/public/images/avatar/small/justen.jpg',
  'https://raw.githubusercontent.com/Semantic-Org/Semantic-UI-React/master/docs/public/images/avatar/small/laura.jpg',
  'https://raw.githubusercontent.com/Semantic-Org/Semantic-UI-React/master/docs/public/images/avatar/small/lena.png',
  'https://raw.githubusercontent.com/Semantic-Org/Semantic-UI-React/master/docs/public/images/avatar/small/lindsay.png',
  'https://raw.githubusercontent.com/Semantic-Org/Semantic-UI-React/master/docs/public/images/avatar/small/mark.png',
  'https://raw.githubusercontent.com/Semantic-Org/Semantic-UI-React/master/docs/public/images/avatar/small/matt.jpg',
  'https://raw.githubusercontent.com/Semantic-Org/Semantic-UI-React/master/docs/public/images/avatar/small/matthew.png',
  'https://raw.githubusercontent.com/Semantic-Org/Semantic-UI-React/master/docs/public/images/avatar/small/molly.png',
  'https://raw.githubusercontent.com/Semantic-Org/Semantic-UI-React/master/docs/public/images/avatar/small/nan.jpg',
  'https://raw.githubusercontent.com/Semantic-Org/Semantic-UI-React/master/docs/public/images/avatar/small/nom.jpg',
  'https://raw.githubusercontent.com/Semantic-Org/Semantic-UI-React/master/docs/public/images/avatar/small/rachel.png',
  'https://raw.githubusercontent.com/Semantic-Org/Semantic-UI-React/master/docs/public/images/avatar/small/steve.jpg',
  'https://raw.githubusercontent.com/Semantic-Org/Semantic-UI-React/master/docs/public/images/avatar/small/stevie.jpg',
  'https://raw.githubusercontent.com/Semantic-Org/Semantic-UI-React/master/docs/public/images/avatar/small/tom.jpg',
  'https://raw.githubusercontent.com/Semantic-Org/Semantic-UI-React/master/docs/public/images/avatar/small/veronika.jpg',
  'https://raw.githubusercontent.com/Semantic-Org/Semantic-UI-React/master/docs/public/images/avatar/small/zoe.jpg',
];

export const AVATARS_LARGE = [
  'https://raw.githubusercontent.com/Semantic-Org/Semantic-UI-React/master/docs/public/images/avatar/large/ade.jpg',
  'https://raw.githubusercontent.com/Semantic-Org/Semantic-UI-React/master/docs/public/images/avatar/large/chris.jpg',
  'https://raw.githubusercontent.com/Semantic-Org/Semantic-UI-React/master/docs/public/images/avatar/large/christian.jpg',
  'https://raw.githubusercontent.com/Semantic-Org/Semantic-UI-React/master/docs/public/images/avatar/large/daniel.jpg',
  'https://raw.githubusercontent.com/Semantic-Org/Semantic-UI-React/master/docs/public/images/avatar/large/elliot.jpg',
  'https://raw.githubusercontent.com/Semantic-Org/Semantic-UI-React/master/docs/public/images/avatar/large/elyse.png',
  'https://raw.githubusercontent.com/Semantic-Org/Semantic-UI-React/master/docs/public/images/avatar/large/helen.jpg',
  'https://raw.githubusercontent.com/Semantic-Org/Semantic-UI-React/master/docs/public/images/avatar/large/jenny.jpg',
  'https://raw.githubusercontent.com/Semantic-Org/Semantic-UI-React/master/docs/public/images/avatar/large/joe.jpg',
  'https://raw.githubusercontent.com/Semantic-Org/Semantic-UI-React/master/docs/public/images/avatar/large/justen.jpg',
  'https://raw.githubusercontent.com/Semantic-Org/Semantic-UI-React/master/docs/public/images/avatar/large/kristy.png',
  'https://raw.githubusercontent.com/Semantic-Org/Semantic-UI-React/master/docs/public/images/avatar/large/laura.jpg',
  'https://raw.githubusercontent.com/Semantic-Org/Semantic-UI-React/master/docs/public/images/avatar/large/matt.jpg',
  'https://raw.githubusercontent.com/Semantic-Org/Semantic-UI-React/master/docs/public/images/avatar/large/matthew.png',
  'https://raw.githubusercontent.com/Semantic-Org/Semantic-UI-React/master/docs/public/images/avatar/large/molly.png',
  'https://raw.githubusercontent.com/Semantic-Org/Semantic-UI-React/master/docs/public/images/avatar/large/nan.jpg',
  'https://raw.githubusercontent.com/Semantic-Org/Semantic-UI-React/master/docs/public/images/avatar/large/nom.jpg',
  'https://raw.githubusercontent.com/Semantic-Org/Semantic-UI-React/master/docs/public/images/avatar/large/patrick.png',
  'https://raw.githubusercontent.com/Semantic-Org/Semantic-UI-React/master/docs/public/images/avatar/large/rachel.png',
  'https://raw.githubusercontent.com/Semantic-Org/Semantic-UI-React/master/docs/public/images/avatar/large/steve.jpg',
  'https://raw.githubusercontent.com/Semantic-Org/Semantic-UI-React/master/docs/public/images/avatar/large/stevie.jpg',
  'https://raw.githubusercontent.com/Semantic-Org/Semantic-UI-React/master/docs/public/images/avatar/large/tom.jpg',
  'https://raw.githubusercontent.com/Semantic-Org/Semantic-UI-React/master/docs/public/images/avatar/large/veronika.jpg',
  'https://raw.githubusercontent.com/Semantic-Org/Semantic-UI-React/master/docs/public/images/avatar/large/zoe.jpg',
];

export const getRandomAvatarSmall = () => AVATARS_SMALL[Math.floor(Math.random() * AVATARS_SMALL.length)];

export const getRandomAvatarLarge = () => AVATARS_LARGE[Math.floor(Math.random() * AVATARS_LARGE.length)];

export const getAvatarSmallForValue = (val) => AVATARS_SMALL[Math.floor(hash(val)) % AVATARS_SMALL.length];

export const getAvatarLargeForValue = (val) => AVATARS_SMALL[Math.floor(hash(val)) % AVATARS_LARGE.length];