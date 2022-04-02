import { hash } from './hash';

export const COLORS = [
  'red',
  'orange',
  'yellow',
  'olive',
  'green',
  'teal',
  'blue',
  'violet',
  'purple',
  'pink',
  'brown',
  'grey',
  'black',
];

export const getRandomColor = () => COLORS[Math.floor(Math.random() * COLORS.length)];

export const getColorForValue = (val) => COLORS[Math.floor(hash(val)) % COLORS.length];