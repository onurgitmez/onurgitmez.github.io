// ===== CONFIGURATION =====
export const C = {
    TICK: 200, // ms
    COST_VILLAGER: 10,
    POP_EAT: 1, // Food consumed per person per second
    
    // PRODUCTION DEFINITIONS
    PROD: {
        // ERA 0
        farmer: { food: 3 }, 
        woodcutter: { wood: 1 }, 
        mason: { stone: 0.5 }, 
        digger: { clay: 0.5 },
        hunter: { food: 1, skins: 0.2 }, 
        scholar: { science: 0.2 },
        miner: { copper: 0.2, coal: 0.1, iron: 0.05, gold: 0.02 },
        blacksmith: { wood: -0.5, copper: -0.2, tools: 0.1 },
        smelter: { iron: -0.2, coal: -0.5, steel: 0.1 },
        priest: { faith: 0.5 },
        // ERA 1
        carpenter: { wood: -2, lumber: 1 },
        brickmaker: { clay: -2, brick: 1 },
        glassblower: { stone: -1, coal: -1, glass: 1 },
        wizard: { gold: -1, mana: 0.5 },
        alchemist: { iron: -1, mana: -5, gold: 0.1 },
        metalworker: { copper: -1, coal: -0.5, brass: 0.3 }, 
        // ERA 2
        scribe: { wood: -1, parchment: 0.5 },
        brewer: { food: -2, ale: 1 },
        armorsmith: { steel: -1, skins: -2, armor: 0.5 },
        knight: { weapons: -0.5, armor: -0.3, chivalry: 1 },
        inquisitor: { faith: -2, chivalry: 0.3 },
        weaponsmith: { steel: -1, tools: -0.5, weapons: 0.8 },
        // ERA 3
        chemist: { coal: -1, gold: -0.1, gunpowder: 0.5 },
        musketeer: { gunpowder: -0.5, influence: 1 },
        painter: { canvas: -1, clay: -0.5, art: 0.3 },
        navigator: { wood: -2, spices: 0.2 },
        banker: { gold: -10, influence: 0.5 },
        weaver: { skins: -1, canvas: 1 },
        // ERA 4
        driller: { oil: 0.3 },
        factoryworker: { power: -2, iron: -1, concrete: 1 },
        engineer: { steel: -2, rubber: -1, engines: 0.5 },
        operator: { coal: -3, oil: -1, power: 5 },
        capitalist: { gold: -20, power: 2 },
        tapper: { rubber: 0.4 },
        // ERA 5
        nucleartech: { uranium: -0.5, power: 10 },
        synthesizer: { steel: -2, gold: -1, superalloy: 0.3 },
        geneticist: { science: -10, power: -2 },
        aiarchitect: { power: -5, science: 3 },
        miner_uranium: { uranium: 0.1 },
        refiner: { oil: -5, power: -2, rocketfuel: 1 },
        nanobuilder: { superalloy: -1, power: -5, nanobots: 0.2 },
        physicist: { power: -20, uranium: -2, antimatter: 0.1 }
    },

    // BASE CAPS
    BASE_CAP: {
        pop: 5, food: 100, wood: 50, science: 200,
        stone: 20, skins: 20, clay: 20, copper: 10, coal: 20, iron: 10,
        tools: 10, steel: 10, faith: 50, gold: 5,
        lumber: 50, brick: 50, glass: 50, mana: 50, brass: 30,
        parchment: 30, ale: 40, armor: 20, weapons: 20, chivalry: 10,
        gunpowder: 30, canvas: 40, art: 20, spices: 30, influence: 10,
        oil: 50, rubber: 40, plastic: 30, concrete: 50, power: 100, engines: 20,
        uranium: 10, rocketfuel: 30, superalloy: 20, nanobots: 10, helium3: 5, antimatter: 5
    }
};

export const ACHIEVEMENTS = {
    firstClick: { name: "First Steps", desc: "Manually gather resources", icon: "👋", unlocked: false },
    pop10: { name: "Small Village", desc: "Reach 10 population", icon: "🏘️", unlocked: false },
    pop50: { name: "Growing Town", desc: "Reach 50 population", icon: "🏙️", unlocked: false },
    pop100: { name: "Bustling City", desc: "Reach 100 population", icon: "🌆", unlocked: false },
    era1: { name: "Classical Age", desc: "Advance to Era 1", icon: "🏛️", unlocked: false },
    era2: { name: "Medieval Times", desc: "Advance to Era 2", icon: "🏰", unlocked: false },
    era3: { name: "Renaissance", desc: "Advance to Era 3", icon: "🎨", unlocked: false },
    era4: { name: "Industrial Revolution", desc: "Advance to Era 4", icon: "🏭", unlocked: false },
    era5: { name: "Space Age", desc: "Advance to Era 5", icon: "🚀", unlocked: false },
    pyramid: { name: "Wonder of the World", desc: "Build the Great Pyramid", icon: "🔺", unlocked: false },
    parthenon: { name: "Classical Wonder", desc: "Build the Parthenon", icon: "🏛️", unlocked: false },
    grandcathedral: { name: "Divine Architecture", desc: "Build Grand Cathedral", icon: "⛪", unlocked: false },
    globetheatre: { name: "Cultural Icon", desc: "Build Globe Theatre", icon: "🎭", unlocked: false },
    eiffeltower: { name: "Iron Lady", desc: "Build Eiffel Tower", icon: "🗼", unlocked: false },
    spaceelevator: { name: "To The Stars!", desc: "Build Space Elevator", icon: "🛰️", unlocked: false },
    tech10: { name: "Scientist", desc: "Research 10 technologies", icon: "🔬", unlocked: false },
    tech20: { name: "Innovator", desc: "Research 20 technologies", icon: "💡", unlocked: false },
    buildings50: { name: "Master Builder", desc: "Construct 50 buildings", icon: "🏗️", unlocked: false },
    buildings100: { name: "Architect", desc: "Construct 100 buildings", icon: "📐", unlocked: false },
    gold100: { name: "Wealthy", desc: "Accumulate 100 gold", icon: "💰", unlocked: false },
    science1M: { name: "Knowledge is Power", desc: "Accumulate 1M science", icon: "📚", unlocked: false },
    clicks100: { name: "Clicker", desc: "Manually gather 100 times", icon: "🖱️", unlocked: false },
    prestige1: { name: "New Beginnings", desc: "Prestige for the first time", icon: "⭐", unlocked: false },
    victory: { name: "Civilization Complete", desc: "Build Space Elevator", icon: "🎉", unlocked: false }
};

// ===== RANDOM EVENTS =====
export const RANDOM_EVENTS = [
    { name: "Bountiful Harvest", desc: "+500 Food", type: "good", effect: (G, addRes) => { addRes('food', 500, G); } },
    { name: "Gold Discovery", desc: "+50 Gold", type: "good", effect: (G, addRes) => { addRes('gold', 50, G); } },
    { name: "Scientific Breakthrough", desc: "+1000 Science", type: "good", effect: (G, addRes) => { addRes('science', 1000, G); } },
    { name: "Generous Donation", desc: "+100 of random resource", type: "good", effect: (G, addRes) => {
        const resources = Object.keys(G.res).filter(r => G.res[r].unlocked);
        const random = resources[Math.floor(Math.random() * resources.length)];
        addRes(random, 100, G);
    }},
    { name: "Plague", desc: "-20% Population", type: "bad", effect: (G, addRes, killMultiple) => {
        const loss = Math.floor(G.pop.total * 0.2);
        killMultiple(loss, G);
    }},
    { name: "Famine", desc: "-50% Food", type: "bad", effect: (G) => {
        G.res.food.cur = Math.floor(G.res.food.cur * 0.5);
    }},
    { name: "Fire", desc: "-30% Wood", type: "bad", effect: (G) => {
        G.res.wood.cur = Math.floor(G.res.wood.cur * 0.7);
    }},
    { name: "Earthquake", desc: "-50% Stone", type: "bad", effect: (G) => {
        if(G.res.stone.unlocked) G.res.stone.cur = Math.floor(G.res.stone.cur * 0.5);
    }}
];