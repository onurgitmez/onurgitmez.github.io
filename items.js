// Pokéballs
export const POKEBALLS = [
  {id:"pokeball",name:"Poké Ball",catchMult:1,price:0},
  {id:"greatball",name:"Great Ball",catchMult:1.5,price:300},
  {id:"ultraball",name:"Ultra Ball",catchMult:2,price:800},
  {id:"masterball",name:"Master Ball",catchMult:255,price:50000},
];

// Pokéball visual colors [top, bottom]
export const BALL_COLORS = {
  pokeball: ["#ef4444","#fff"],
  greatball: ["#3b82f6","#fff"],
  ultraball: ["#eab308","#222"],
  masterball: ["#a855f7","#fff"]
};

// Pokéball descriptions
export const BALL_DESC = {
  pokeball: "Standard",
  greatball: "1.5× rate",
  ultraball: "2× rate",
  masterball: "Never fails!"
};

// Special items
export const ITEMS = [
  {id:"razz",name:"Razz Berry",catchBonus:1.5,price:150,emoji:"🫐",desc:"1.5× catch boost"},
  {id:"golden_razz",name:"Golden Razz",catchBonus:2.5,price:500,emoji:"🍋",desc:"2.5× catch boost"},
  {id:"lure",name:"Lure Module",catchBonus:0,price:400,emoji:"🧲",desc:"Rarer spawns ×3"},
  {id:"repel_flee",name:"Smoke Ball",catchBonus:0,price:350,emoji:"💨",desc:"No flee ×3"},
  {id:"shiny_lure",name:"Shiny Charm",catchBonus:0,price:1000,emoji:"✨",desc:"Higher shiny odds ×3"},
];