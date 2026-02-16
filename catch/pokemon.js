// Raw Pokémon Data
const RAW = [
  // ═══ FOREST (44) ═══
  [1,"Bulbasaur","Grass","forest",45,"r","🌿",400],[2,"Ivysaur","Grass","forest",45,"r","🌺",450],
  [3,"Venusaur","Grass","forest",45,"r","🌳",550],[10,"Caterpie","Bug","forest",255,"c","🐛",30],
  [11,"Metapod","Bug","forest",120,"u","🫘",60],[12,"Butterfree","Bug","forest",45,"r","🦋",300],
  [13,"Weedle","Bug","forest",255,"c","🪱",30],[14,"Kakuna","Bug","forest",120,"u","🥜",60],
  [15,"Beedrill","Bug","forest",45,"r","🐝",300],[25,"Pikachu","Electric","forest",190,"c","⚡",150],
  [26,"Raichu","Electric","forest",75,"u","🔌",250],[43,"Oddish","Grass","forest",255,"c","🌱",40],
  [44,"Gloom","Grass","forest",120,"u","🥀",100],[45,"Vileplume","Grass","forest",45,"r","🌸",350],
  [46,"Paras","Bug","forest",190,"c","🍄",50],[47,"Parasect","Bug","forest",75,"u","🍄",150],
  [69,"Bellsprout","Grass","forest",255,"c","🌾",40],[70,"Weepinbell","Grass","forest",120,"u","🔔",100],
  [71,"Victreebel","Grass","forest",45,"r","🪴",350],[102,"Exeggcute","Grass","forest",90,"u","🥚",120],
  [103,"Exeggutor","Grass","forest",45,"r","🌴",350],[114,"Tangela","Grass","forest",45,"r","🧶",300],
  [123,"Scyther","Bug","forest",45,"r","🗡️",400],[127,"Pinsir","Bug","forest",45,"r","🪲",400],
  [143,"Snorlax","Normal","forest",25,"r","😴",600],
  [152,"Chikorita","Grass","forest",45,"r","🍃",400],[153,"Bayleef","Grass","forest",45,"r","🌿",450],
  [154,"Meganium","Grass","forest",45,"r","🌺",550],[163,"Hoothoot","Flying","forest",255,"c","🦉",30],
  [164,"Noctowl","Flying","forest",90,"u","🦉",150],[165,"Ledyba","Bug","forest",255,"c","🐞",30],
  [166,"Ledian","Bug","forest",90,"u","🐞",120],[167,"Spinarak","Bug","forest",255,"c","🕷️",30],
  [168,"Ariados","Bug","forest",90,"u","🕸️",120],[182,"Bellossom","Grass","forest",45,"r","💐",350],
  [185,"Sudowoodo","Rock","forest",65,"u","🌲",200],[187,"Hoppip","Grass","forest",255,"c","🎈",25],
  [188,"Skiploom","Grass","forest",120,"u","🌼",80],[189,"Jumpluff","Grass","forest",45,"r","🌬️",300],
  [204,"Pineco","Bug","forest",190,"c","🌰",50],[205,"Forretress","Bug","forest",75,"u","🛡️",200],
  [212,"Scizor","Bug","forest",25,"r","✂️",600],[214,"Heracross","Bug","forest",45,"r","🪲",400],
  [251,"Celebi","Psychic","forest",3,"l","🧚",3000],

  // ═══ CAVE (32) ═══
  [23,"Ekans","Poison","cave",255,"c","🐍",40],[24,"Arbok","Poison","cave",90,"u","🐍",150],
  [35,"Clefairy","Fairy","cave",150,"c","🌙",80],[36,"Clefable","Fairy","cave",25,"r","✨",400],
  [41,"Zubat","Poison","cave",255,"c","🦇",30],[42,"Golbat","Poison","cave",90,"u","🦇",120],
  [66,"Machop","Fighting","cave",180,"c","💪",50],[67,"Machoke","Fighting","cave",90,"u","💪",150],
  [68,"Machamp","Fighting","cave",45,"r","🏋️",400],[74,"Geodude","Rock","cave",255,"c","🪨",30],
  [75,"Graveler","Rock","cave",120,"u","🪨",100],[76,"Golem","Rock","cave",45,"r","⛰️",350],
  [92,"Gastly","Ghost","cave",190,"c","💨",50],[93,"Haunter","Ghost","cave",90,"u","👻",175],
  [94,"Gengar","Ghost","cave",45,"r","😈",450],[95,"Onix","Rock","cave",45,"r","🐍",300],
  [104,"Cubone","Ground","cave",190,"c","💀",60],[105,"Marowak","Ground","cave",75,"u","🦴",200],
  [142,"Aerodactyl","Rock","cave",45,"r","🦅",500],[169,"Crobat","Poison","cave",90,"u","🦇",250],
  [190,"Aipom","Normal","cave",45,"r","🐒",300],[201,"Unown","Psychic","cave",225,"c","🔤",50],
  [202,"Wobbuffet","Psychic","cave",45,"r","🙇",300],[207,"Gligar","Flying","cave",60,"u","🦂",200],
  [208,"Steelix","Steel","cave",25,"r","⛓️",550],[213,"Shuckle","Bug","cave",190,"c","🐢",50],
  [236,"Tyrogue","Fighting","cave",75,"u","🥋",175],[237,"Hitmontop","Fighting","cave",45,"r","🌀",400],
  [246,"Larvitar","Rock","cave",45,"r","🪨",400],[247,"Pupitar","Rock","cave",45,"r","🪨",500],
  [248,"Tyranitar","Rock","cave",45,"r","🦖",650],[150,"Mewtwo","Psychic","cave",3,"l","🔮",3000],

  // ═══ OCEAN (36) ═══
  [7,"Squirtle","Water","ocean",45,"r","🐢",400],[8,"Wartortle","Water","ocean",45,"r","🐢",450],
  [9,"Blastoise","Water","ocean",45,"r","💧",550],[54,"Psyduck","Water","ocean",190,"c","🦆",50],
  [55,"Golduck","Water","ocean",75,"u","🦆",200],[60,"Poliwag","Water","ocean",255,"c","🌀",30],
  [61,"Poliwhirl","Water","ocean",120,"u","🌀",100],[62,"Poliwrath","Water","ocean",45,"r","🥊",350],
  [72,"Tentacool","Water","ocean",190,"c","🪼",40],[73,"Tentacruel","Water","ocean",60,"u","🪼",200],
  [90,"Shellder","Water","ocean",190,"c","🐚",50],[91,"Cloyster","Water","ocean",60,"u","🦪",200],
  [98,"Krabby","Water","ocean",225,"c","🦀",40],[99,"Kingler","Water","ocean",60,"u","🦞",200],
  [116,"Horsea","Water","ocean",225,"c","🐴",40],[117,"Seadra","Water","ocean",75,"u","🐉",180],
  [118,"Goldeen","Water","ocean",225,"c","🐠",35],[119,"Seaking","Water","ocean",60,"u","🐡",150],
  [120,"Staryu","Water","ocean",225,"c","⭐",45],[121,"Starmie","Water","ocean",60,"u","🌟",250],
  [129,"Magikarp","Water","ocean",255,"c","🐟",15],[130,"Gyarados","Water","ocean",45,"r","🐲",500],
  [131,"Lapras","Water","ocean",45,"r","🐢",500],[134,"Vaporeon","Water","ocean",45,"r","💠",450],
  [138,"Omanyte","Rock","ocean",45,"r","🐙",350],[139,"Omastar","Rock","ocean",45,"r","🐙",450],
  [140,"Kabuto","Rock","ocean",45,"r","🦂",350],[141,"Kabutops","Rock","ocean",45,"r","🦂",450],
  [158,"Totodile","Water","ocean",45,"r","🐊",400],[159,"Croconaw","Water","ocean",45,"r","🐊",450],
  [160,"Feraligatr","Water","ocean",45,"r","🐊",550],[170,"Chinchou","Water","ocean",190,"c","💡",45],
  [171,"Lanturn","Water","ocean",75,"u","🔦",200],[194,"Wooper","Water","ocean",255,"c","🐟",30],
  [195,"Quagsire","Water","ocean",90,"u","🐟",150],[211,"Qwilfish","Water","ocean",45,"r","🐡",300],
  [222,"Corsola","Water","ocean",60,"u","🪸",200],[223,"Remoraid","Water","ocean",190,"c","🐟",40],
  [224,"Octillery","Water","ocean",75,"u","🐙",200],[226,"Mantine","Water","ocean",25,"r","🦈",500],
  [230,"Kingdra","Water","ocean",45,"r","🐉",500],[249,"Lugia","Psychic","ocean",3,"l","🌊",3000],

  // ═══ VOLCANO (20) ═══
  [4,"Charmander","Fire","volcano",45,"r","🔥",400],[5,"Charmeleon","Fire","volcano",45,"r","🔥",450],
  [6,"Charizard","Fire","volcano",45,"r","🐲",600],[37,"Vulpix","Fire","volcano",190,"c","🦊",60],
  [38,"Ninetales","Fire","volcano",75,"u","🦊",250],[58,"Growlithe","Fire","volcano",190,"c","🐕",60],
  [59,"Arcanine","Fire","volcano",75,"u","🦁",300],[77,"Ponyta","Fire","volcano",190,"c","🐎",55],
  [78,"Rapidash","Fire","volcano",60,"u","🦄",250],[126,"Magmar","Fire","volcano",45,"r","🔥",400],
  [136,"Flareon","Fire","volcano",45,"r","🧡",450],
  [155,"Cyndaquil","Fire","volcano",45,"r","🔥",400],[156,"Quilava","Fire","volcano",45,"r","🔥",450],
  [157,"Typhlosion","Fire","volcano",45,"r","🌋",550],[218,"Slugma","Fire","volcano",190,"c","🌋",45],
  [219,"Magcargo","Fire","volcano",75,"u","🐌",200],[228,"Houndour","Dark","volcano",120,"u","🐺",100],
  [229,"Houndoom","Dark","volcano",45,"r","🐺",400],[240,"Magby","Fire","volcano",45,"r","🔥",350],
  [146,"Moltres","Fire","volcano",3,"l","🔱",3000],[244,"Entei","Fire","volcano",3,"l","🦁",3000],
  [250,"Ho-Oh","Fire","volcano",3,"l","🦅",3000],

  // ═══ MEADOW (40) ═══
  [16,"Pidgey","Flying","meadow",255,"c","🐦",25],[17,"Pidgeotto","Flying","meadow",120,"u","🐦",80],
  [18,"Pidgeot","Flying","meadow",45,"r","🦅",300],[19,"Rattata","Normal","meadow",255,"c","🐀",20],
  [20,"Raticate","Normal","meadow",127,"u","🐀",80],[29,"Nidoran♀","Poison","meadow",235,"c","🐰",35],
  [30,"Nidorina","Poison","meadow",120,"u","🐰",100],[31,"Nidoqueen","Poison","meadow",45,"r","👑",400],
  [32,"Nidoran♂","Poison","meadow",235,"c","🐇",35],[33,"Nidorino","Poison","meadow",120,"u","🐇",100],
  [34,"Nidoking","Poison","meadow",45,"r","🤴",400],[39,"Jigglypuff","Fairy","meadow",170,"c","🎤",50],
  [40,"Wigglytuff","Fairy","meadow",50,"r","🎀",300],[52,"Meowth","Normal","meadow",255,"c","🐱",40],
  [53,"Persian","Normal","meadow",90,"u","🐱",150],[83,"Farfetch'd","Flying","meadow",45,"r","🦆",350],
  [108,"Lickitung","Normal","meadow",45,"r","👅",300],[113,"Chansey","Normal","meadow",30,"r","🥚",500],
  [115,"Kangaskhan","Normal","meadow",45,"r","🦘",400],[128,"Tauros","Normal","meadow",45,"r","🐂",350],
  [132,"Ditto","Normal","meadow",35,"r","🫠",500],[133,"Eevee","Normal","meadow",45,"r","🦊",400],
  [137,"Porygon","Normal","meadow",45,"r","💠",450],
  [161,"Sentret","Normal","meadow",255,"c","🦦",25],[162,"Furret","Normal","meadow",90,"u","🦦",120],
  [172,"Pichu","Electric","meadow",190,"c","⚡",50],[173,"Cleffa","Fairy","meadow",150,"c","⭐",60],
  [174,"Igglybuff","Fairy","meadow",170,"c","🎈",40],[175,"Togepi","Fairy","meadow",190,"c","🥚",80],
  [176,"Togetic","Fairy","meadow",75,"u","🕊️",250],[179,"Mareep","Electric","meadow",235,"c","🐑",40],
  [180,"Flaaffy","Electric","meadow",120,"u","🐑",100],[181,"Ampharos","Electric","meadow",45,"r","💡",400],
  [183,"Marill","Water","meadow",190,"c","🔵",45],[184,"Azumarill","Water","meadow",75,"u","🔵",200],
  [186,"Politoed","Water","meadow",45,"r","🐸",350],[196,"Espeon","Psychic","meadow",45,"r","💜",450],
  [209,"Snubbull","Fairy","meadow",190,"c","🐶",45],[210,"Granbull","Fairy","meadow",75,"u","🐕",200],
  [234,"Stantler","Normal","meadow",45,"r","🦌",350],[235,"Smeargle","Normal","meadow",45,"r","🎨",350],
  [241,"Miltank","Normal","meadow",45,"r","🐄",350],[242,"Blissey","Normal","meadow",30,"r","💗",550],
  [151,"Mew","Psychic","meadow",3,"l","✨",3000],

  // ═══ TUNDRA (10) ═══
  [86,"Seel","Water","tundra",190,"c","🦭",50],[87,"Dewgong","Water","tundra",75,"u","🦭",200],
  [124,"Jynx","Ice","tundra",45,"r","💋",350],[197,"Umbreon","Dark","tundra",45,"r","🌑",450],
  [215,"Sneasel","Dark","tundra",60,"u","😼",200],[220,"Swinub","Ice","tundra",225,"c","🐷",40],
  [221,"Piloswine","Ice","tundra",75,"u","🦣",200],[225,"Delibird","Ice","tundra",45,"r","🎁",300],
  [238,"Smoochum","Ice","tundra",45,"r","💋",300],[144,"Articuno","Ice","tundra",3,"l","🧊",3000],

  // ═══ SWAMP (16) ═══
  [48,"Venonat","Bug","swamp",190,"c","🪰",40],[49,"Venomoth","Poison","swamp",75,"u","🦗",150],
  [88,"Grimer","Poison","swamp",190,"c","🟢",40],[89,"Muk","Poison","swamp",75,"u","🟣",200],
  [109,"Koffing","Poison","swamp",190,"c","☁️",45],[110,"Weezing","Poison","swamp",60,"u","💀",200],
  [177,"Natu","Psychic","swamp",190,"c","🐦",45],[178,"Xatu","Psychic","swamp",75,"u","🦜",200],
  [191,"Sunkern","Grass","swamp",235,"c","🌻",25],[192,"Sunflora","Grass","swamp",120,"u","🌻",100],
  [193,"Yanma","Bug","swamp",75,"u","🪰",175],[198,"Murkrow","Dark","swamp",30,"r","🐦‍⬛",400],
  [199,"Slowking","Water","swamp",70,"u","👑",250],[200,"Misdreavus","Ghost","swamp",45,"r","👻",350],
  [203,"Girafarig","Normal","swamp",60,"u","🦒",200],[206,"Dunsparce","Normal","swamp",190,"c","🐍",50],

  // ═══ CITY (24) ═══
  [21,"Spearow","Flying","city",255,"c","🐤",25],[22,"Fearow","Flying","city",90,"u","🦅",130],
  [50,"Diglett","Ground","city",255,"c","🕳️",30],[51,"Dugtrio","Ground","city",50,"r","🕳️",250],
  [56,"Mankey","Fighting","city",190,"c","🐒",45],[57,"Primeape","Fighting","city",75,"u","🦍",200],
  [63,"Abra","Psychic","city",200,"c","🧠",60],[64,"Kadabra","Psychic","city",100,"u","🥄",175],
  [65,"Alakazam","Psychic","city",50,"r","🧙",450],[79,"Slowpoke","Water","city",190,"c","🦥",50],
  [80,"Slowbro","Water","city",75,"u","🦥",200],[81,"Magnemite","Electric","city",190,"c","🧲",50],
  [82,"Magneton","Electric","city",60,"u","🧲",200],[96,"Drowzee","Psychic","city",190,"c","😪",45],
  [97,"Hypno","Psychic","city",75,"u","🔮",200],[100,"Voltorb","Electric","city",190,"c","🔴",45],
  [101,"Electrode","Electric","city",60,"u","💣",200],[106,"Hitmonlee","Fighting","city",45,"r","🦵",400],
  [107,"Hitmonchan","Fighting","city",45,"r","🥊",400],[122,"Mr. Mime","Psychic","city",45,"r","🤡",350],
  [125,"Electabuzz","Electric","city",45,"r","⚡",400],[135,"Jolteon","Electric","city",45,"r","💛",450],
  [216,"Teddiursa","Normal","city",120,"u","🧸",100],[217,"Ursaring","Normal","city",60,"u","🐻",250],
  [227,"Skarmory","Steel","city",25,"r","🦅",500],[233,"Porygon2","Normal","city",45,"r","💠",500],
  [239,"Elekid","Electric","city",45,"r","⚡",350],
  [145,"Zapdos","Electric","city",3,"l","🌩️",3000],[243,"Raikou","Electric","city",3,"l","🐅",3000],

  // ═══ DESERT (12) ═══
  [27,"Sandshrew","Ground","desert",255,"c","🦔",35],[28,"Sandslash","Ground","desert",90,"u","🦔",150],
  [84,"Doduo","Flying","desert",190,"c","🐣",45],[85,"Dodrio","Flying","desert",45,"r","🐓",300],
  [111,"Rhyhorn","Ground","desert",120,"u","🦏",100],[112,"Rhydon","Ground","desert",60,"u","🦏",250],
  [231,"Phanpy","Ground","desert",120,"u","🐘",100],[232,"Donphan","Ground","desert",60,"u","🐘",250],

  // ═══ MOUNTAIN (7) ═══
  [147,"Dratini","Dragon","mountain",45,"r","🐛",500],[148,"Dragonair","Dragon","mountain",45,"r","🐍",600],
  [149,"Dragonite","Dragon","mountain",45,"r","🐉",700],[245,"Suicune","Water","mountain",3,"l","💎",3000],
];

// Rarity mapping
const RM = {c:"common",u:"uncommon",r:"rare",l:"legendary"};

// Export processed Pokémon database
export const POKEMON_DB = RAW.map(([id,name,type,biome,baseRate,r,emoji,sellPrice]) => ({
  id,
  name,
  type,
  biome,
  baseRate,
  rarity: RM[r],
  emoji,
  sellPrice
}));

// Export list of all types
export const ALL_TYPES = [...new Set(POKEMON_DB.map(p=>p.type))].sort();
