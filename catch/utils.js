import { RW, RWL } from './constants.js';
import { POKEBALLS, ITEMS } from './items.js';

export const spriteUrl = (id) => `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

// Weighted random selection
export function wr(pool, lure) {
  const w = lure ? RWL : RW;
  const t = pool.reduce((s, p) => s + (w[p.rarity] || 0), 0);
  let r = Math.random() * t;
  for (const p of pool) {
    r -= w[p.rarity] || 0;
    if (r <= 0) return p;
  }
  return pool[pool.length - 1];
}

// Calculate catch rate
export function cr(poke, ball, item) {
  const bm = POKEBALLS.find(b => b.id === ball)?.catchMult || 1;
  const im = item ? ITEMS.find(i => i.id === item)?.catchBonus || 1 : 1;
  return Math.min(0.99, Math.min(255, poke.baseRate * bm * (im > 0 ? im : 1)) / 255);
}

export const INIT = {
  money: 500,
  inv: { pokeball: 10, greatball: 0, ultraball: 0, masterball: 0, razz: 2, golden_razz: 0, lure: 0, repel_flee: 0 },
  caught: {},
  seen: {},
  screen: "home",
  biome: null,
  wild: null,
  msg: null,
  ball: "pokeball",
  item: null,
  lure: 0,
  smoke: 0,
  anim: null,
  sell: false,
};
