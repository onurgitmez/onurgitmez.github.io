import { RW, RWL } from './constants.js';
import { POKEBALLS, ITEMS } from './items.js';
import { EVOLUTIONS } from './pokemon.js';

// Now supports an 'animated' toggle to fetch GIFs instead of PNGs, while keeping shinies intact
export const spriteUrl = (id, shiny, animated = false) => {
  if (animated) {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${shiny ? 'shiny/' : ''}${id}.gif`;
  }
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${shiny ? 'shiny/' : ''}${id}.png`;
};

export function rollTier() {
  const r = Math.random();
  if (r < 0.05) return 'S';
  if (r < 0.15) return 'A+';
  if (r < 0.35) return 'A';
  if (r < 0.65) return 'B';
  return 'C';
}

export function weightedRandom(pool, lure) {
  const weights = lure ? RWL : RW;
  const evolvedIds = Object.values(EVOLUTIONS).map(e => e.to);
  
  let totalWeight = 0;
  const poolWeights = pool.map(p => {
    let w = weights[p.rarity] || 0;
    if (evolvedIds.includes(p.id)) w *= 0.2; // Evolved forms are 5x rarer in the wild
    totalWeight += w;
    return w;
  });

  let r = Math.random() * totalWeight;
  for (let i = 0; i < pool.length; i++) {
    r -= poolWeights[i];
    if (r <= 0) return pool[i];
  }
  return pool[pool.length - 1];
}

export function catchRate(poke, ball, item) {
  const bm = POKEBALLS.find(b => b.id === ball)?.catchMult || 1;
  const im = item ? ITEMS.find(i => i.id === item)?.catchBonus || 1 : 1;
  return Math.min(0.99, Math.min(255, poke.baseRate * bm * (im > 0 ? im : 1)) / 255);
}

export const INIT = {
  money: 500,
  inv: { pokeball: 10, greatball: 0, ultraball: 0, masterball: 0, razz: 2, golden_razz: 0, lure: 0, repel_flee: 0, shiny_lure: 0 },
  caught: {},
  seen: {},
  screen: "home",
  biome: null,
  wild: null,
  wildShiny: false,
  wildTier: 'C',
  msg: null,
  ball: "pokeball",
  item: null,
  lure: 0,
  smoke: 0,
  shinyLureActive: 0,
  anim: null,
  sell: false,
};