// ===== CIVILIZATION CLICKER - ENHANCED EDITION (FIXED) =====
// v2.5 - EXPONENTIAL STORAGE + OFFLINE SAFETY

// ===== CONFIGURATION =====
const C = {
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

let G = {
    era: 0,
    prestigeLevel: 0,
    starvationAccumulator: 0, 
    res: {
        food: { cur: 0, max: 100, unlocked: true },
        wood: { cur: 0, max: 50, unlocked: true },
        science: { cur: 0, max: 200, unlocked: true },
        stone: { cur: 0, max: 20, unlocked: false },
        clay: { cur: 0, max: 20, unlocked: false },
        skins: { cur: 0, max: 20, unlocked: false },
        copper: { cur: 0, max: 10, unlocked: false },
        coal: { cur: 0, max: 20, unlocked: false },
        iron: { cur: 0, max: 10, unlocked: false },
        tools: { cur: 0, max: 10, unlocked: false },
        steel: { cur: 0, max: 10, unlocked: false },
        faith: { cur: 0, max: 50, unlocked: false },
        gold: { cur: 0, max: 5, unlocked: false },
        lumber: { cur: 0, max: 50, unlocked: false },
        brick: { cur: 0, max: 50, unlocked: false },
        glass: { cur: 0, max: 50, unlocked: false },
        mana: { cur: 0, max: 50, unlocked: false },
        brass: { cur: 0, max: 30, unlocked: false },
        parchment: { cur: 0, max: 30, unlocked: false },
        ale: { cur: 0, max: 40, unlocked: false },
        armor: { cur: 0, max: 20, unlocked: false },
        weapons: { cur: 0, max: 20, unlocked: false },
        chivalry: { cur: 0, max: 10, unlocked: false },
        gunpowder: { cur: 0, max: 30, unlocked: false },
        canvas: { cur: 0, max: 40, unlocked: false },
        art: { cur: 0, max: 20, unlocked: false },
        spices: { cur: 0, max: 30, unlocked: false },
        influence: { cur: 0, max: 10, unlocked: false },
        oil: { cur: 0, max: 50, unlocked: false },
        rubber: { cur: 0, max: 40, unlocked: false },
        plastic: { cur: 0, max: 30, unlocked: false },
        concrete: { cur: 0, max: 50, unlocked: false },
        power: { cur: 0, max: 100, unlocked: false },
        engines: { cur: 0, max: 20, unlocked: false },
        uranium: { cur: 0, max: 10, unlocked: false },
        rocketfuel: { cur: 0, max: 30, unlocked: false },
        superalloy: { cur: 0, max: 20, unlocked: false },
        nanobots: { cur: 0, max: 10, unlocked: false },
        helium3: { cur: 0, max: 5, unlocked: false },
        antimatter: { cur: 0, max: 5, unlocked: false }
    },
    pop: {
        total: 0, idle: 0,
        farmer: 0, woodcutter: 0, scholar: 0, mason: 0, digger: 0, hunter: 0,
        miner: 0, blacksmith: 0, smelter: 0, priest: 0,
        carpenter: 0, brickmaker: 0, glassblower: 0, wizard: 0, alchemist: 0, metalworker: 0,
        scribe: 0, brewer: 0, armorsmith: 0, knight: 0, inquisitor: 0, weaponsmith: 0,
        chemist: 0, musketeer: 0, painter: 0, navigator: 0, banker: 0, weaver: 0,
        driller: 0, factoryworker: 0, engineer: 0, operator: 0, capitalist: 0, tapper: 0,
        nucleartech: 0, synthesizer: 0, geneticist: 0, aiarchitect: 0, miner_uranium: 0,
        refiner: 0, nanobuilder: 0, physicist: 0
    },
    bld: {
        hut: { count: 0, base: { wood: 50 }, mult: 1.15 }, 
        stockpile: { count: 0, base: { wood: 30 }, mult: 1.15 }, 
        granary: { count: 0, base: { wood: 100 }, mult: 1.15 }, 
        warehouse: { count: 0, base: { wood: 150, stone: 20 }, mult: 1.15 },
        vault: { count: 0, base: { stone: 200, wood: 100 }, mult: 1.15 }, 
        house: { count: 0, base: { wood: 100, stone: 20 }, mult: 1.15 },
        library: { count: 0, base: { wood: 200, stone: 50 }, mult: 1.15 }, 
        temple: { count: 0, base: { stone: 300 }, mult: 1.15 }, 
        pyramid: { count: 0, base: { stone: 2000, gold: 400 }, mult: 1.0 },
        sawmill: { count: 0, base: { lumber: 50, wood: 200 }, mult: 1.15 }, 
        glassworks: { count: 0, base: { brick: 100, glass: 50 }, mult: 1.15 }, 
        academy: { count: 0, base: { brick: 200, glass: 100 }, mult: 1.15 }, 
        magetower: { count: 0, base: { brick: 300, mana: 50 }, mult: 1.15 }, 
        colosseum: { count: 0, base: { stone: 1000, brick: 500 }, mult: 1.15 }, 
        parthenon: { count: 0, base: { lumber: 2000, brick: 2000, gold: 800 }, mult: 1.0 },
        castle: { count: 0, base: { stone: 2000, lumber: 1000 }, mult: 1.15 }, 
        cathedral: { count: 0, base: { stone: 3000, glass: 1000, faith: 2000 }, mult: 1.15 }, 
        barracks: { count: 0, base: { lumber: 500, stone: 500 }, mult: 1.15 }, 
        scriptorium: { count: 0, base: { lumber: 300, parchment: 100 }, mult: 1.15 }, 
        grandcathedral: { count: 0, base: { glass: 2000, stone: 4000, faith: 2000, chivalry: 400 }, mult: 1.0 },
        bank: { count: 0, base: { brick: 1000, gold: 500 }, mult: 1.15 }, 
        museum: { count: 0, base: { brick: 800, art: 200 }, mult: 1.15 }, 
        shipyard: { count: 0, base: { lumber: 2000, canvas: 500 }, mult: 1.15 }, 
        observatory: { count: 0, base: { glass: 500, brass: 200 }, mult: 1.15 }, 
        printingpress: { count: 0, base: { lumber: 400, parchment: 300 }, mult: 1.15 }, 
        globetheatre: { count: 0, base: { lumber: 3200, art: 1200, influence: 800 }, mult: 1.0 },
        oilrig: { count: 0, base: { steel: 2000, engines: 500 }, mult: 1.15 }, 
        powerplant: { count: 0, base: { steel: 3000, coal: 5000 }, mult: 1.15 }, 
        factory: { count: 0, base: { steel: 2500, concrete: 1000 }, mult: 1.15 }, 
        skyscraper: { count: 0, base: { steel: 5000, concrete: 10000 }, mult: 1.15 }, 
        railroad: { count: 0, base: { steel: 4000, lumber: 2000 }, mult: 1.15 }, 
        eiffeltower: { count: 0, base: { steel: 6000, concrete: 3200, engines: 800 }, mult: 1.0 },
        nuclearreactor: { count: 0, base: { superalloy: 1000, concrete: 5000 }, mult: 1.15 }, 
        launchpad: { count: 0, base: { concrete: 10000, steel: 8000 }, mult: 1.15 }, 
        cryochamber: { count: 0, base: { superalloy: 500, power: 5000 }, mult: 1.15 }, 
        hadroncollider: { count: 0, base: { superalloy: 3000, power: 10000 }, mult: 1.15 }, 
        spaceelevator: { count: 0, base: { superalloy: 20000, nanobots: 4000, antimatter: 400 }, mult: 1.0 }
    },
    tech: {
        stoneTools: { researched: false, cost: 20 },
        mining: { researched: false, cost: 100 },
        construction: { researched: false, cost: 150 },
        smelting: { researched: false, cost: 300 },
        steelwork: { researched: false, cost: 600 },
        mysticism: { researched: false, cost: 1000 },
        monumentalism: { researched: false, cost: 5000 },
        mathematics: { researched: false, cost: 2000 },
        engineering: { researched: false, cost: 4000 },
        glassblowing: { researched: false, cost: 6000 },
        currency: { researched: false, cost: 8000 },
        drama: { researched: false, cost: 10000 },
        magic: { researched: false, cost: 15000 },
        alchemy: { researched: false, cost: 25000 },
        metalworking: { researched: false, cost: 30000 },
        divineright: { researched: false, cost: 50000 },
        feudalism: { researched: false, cost: 75000 },
        chivalrycode: { researched: false, cost: 100000 },
        manuscript: { researched: false, cost: 120000 },
        brewing: { researched: false, cost: 150000 },
        platearmor: { researched: false, cost: 200000 },
        inquisition: { researched: false, cost: 250000 },
        gothicarch: { researched: false, cost: 500000 },
        exploration: { researched: false, cost: 600000 },
        gunpowdertech: { researched: false, cost: 750000 },
        banking: { researched: false, cost: 900000 },
        artistry: { researched: false, cost: 1100000 },
        navigation: { researched: false, cost: 1300000 },
        printing: { researched: false, cost: 1500000 },
        humanism: { researched: false, cost: 2000000 },
        steelframe: { researched: false, cost: 2500000 },
        petroleum: { researched: false, cost: 3000000 },
        electricity: { researched: false, cost: 3500000 },
        assembly: { researched: false, cost: 4000000 },
        combustion: { researched: false, cost: 5000000 },
        capitalism: { researched: false, cost: 6000000 },
        modernarch: { researched: false, cost: 8000000 },
        nuclear: { researched: false, cost: 4000000 },
        rocketry: { researched: false, cost: 4800000 },
        nanotechnology: { researched: false, cost: 6000000 },
        genetics: { researched: false, cost: 7200000 },
        ai: { researched: false, cost: 8000000 },
        antimatterphysics: { researched: false, cost: 12000000 },
        spacecolonization: { researched: false, cost: 20000000 }
    },
    stats: {
        totalResourcesGathered: 0,
        manualClicks: 0,
        buildingsConstructed: 0,
        techResearched: 0,
        villagersRecruited: 0,
        timePlayed: 0,
        eraReached: 0,
        achievementsUnlocked: 0
    },
    achievements: {},
    lastSaveTime: Date.now()
};

const ACHIEVEMENTS = {
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

for(let key in ACHIEVEMENTS) {
    G.achievements[key] = false;
}

// ===== RANDOM EVENTS =====
const RANDOM_EVENTS = [
    { name: "Bountiful Harvest", desc: "+500 Food", type: "good", effect: () => { addRes('food', 500); } },
    { name: "Gold Discovery", desc: "+50 Gold", type: "good", effect: () => { addRes('gold', 50); } },
    { name: "Scientific Breakthrough", desc: "+1000 Science", type: "good", effect: () => { addRes('science', 1000); } },
    { name: "Generous Donation", desc: "+100 of random resource", type: "good", effect: () => {
        const resources = Object.keys(G.res).filter(r => G.res[r].unlocked);
        const random = resources[Math.floor(Math.random() * resources.length)];
        addRes(random, 100);
    }},
    { name: "Plague", desc: "-20% Population", type: "bad", effect: () => {
        const loss = Math.floor(G.pop.total * 0.2);
        killMultiple(loss);
    }},
    { name: "Famine", desc: "-50% Food", type: "bad", effect: () => {
        G.res.food.cur = Math.floor(G.res.food.cur * 0.5);
    }},
    { name: "Fire", desc: "-30% Wood", type: "bad", effect: () => {
        G.res.wood.cur = Math.floor(G.res.wood.cur * 0.7);
    }},
    { name: "Earthquake", desc: "-50% Stone", type: "bad", effect: () => {
        if(G.res.stone.unlocked) G.res.stone.cur = Math.floor(G.res.stone.cur * 0.5);
    }}
];

let lastEventTime = Date.now();

function triggerRandomEvent() {
    const now = Date.now();
    const timeSinceLastEvent = now - lastEventTime;
    const minInterval = 120000; // 2 min
    const maxInterval = 300000; // 5 min
    const randomInterval = Math.random() * (maxInterval - minInterval) + minInterval;
    
    if(timeSinceLastEvent > randomInterval) {
        const event = RANDOM_EVENTS[Math.floor(Math.random() * RANDOM_EVENTS.length)];
        event.effect();
        showEventNotification(event);
        lastEventTime = now;
    }
}

function showEventNotification(event) {
    const notif = document.createElement('div');
    notif.className = `event-notification ${event.type === 'good' ? 'positive' : 'negative'}`;
    notif.innerHTML = `
        <div class="event-title">${event.name}</div>
        <div class="event-desc">${event.desc}</div>
    `;
    document.body.appendChild(notif);
    setTimeout(() => notif.remove(), 4000);
}

// ===== CORE FUNCTIONS =====
function addRes(type, amount) {
    if(!G.res[type]) return;
    G.res[type].cur = Math.min(G.res[type].max, Math.max(0, G.res[type].cur + amount));
    if(amount > 0) G.stats.totalResourcesGathered += amount;
}

function getMaxPop() {
    let base = C.BASE_CAP.pop;
    base += G.bld.hut.count * 5;
    base += G.bld.house.count * 10;
    base += G.bld.colosseum.count * 30;
    base += G.bld.castle.count * 50;
    base += G.bld.skyscraper.count * 100;
    base += G.bld.cryochamber.count * 200;
    return base;
}

// HELPER: Calculates cumulative geometric growth 
// Formula: Base * (Mult^Count - 1) / (Mult - 1)
function getGeom(baseCap, count, mult = 1.15) {
    if (count <= 0) return 0;
    if (mult === 1) return baseCap * count;
    return baseCap * (Math.pow(mult, count) - 1) / (mult - 1);
}

function recalcCaps() {
    for(let r in G.res) {
        let base = C.BASE_CAP[r] || 0;
        
        // ERA 0
        if(r === 'wood') base += getGeom(20, G.bld.stockpile.count);
        if(r === 'food') base += getGeom(50, G.bld.granary.count);
        if(r === 'science') base += getGeom(100, G.bld.library.count) + getGeom(200, G.bld.academy.count) + getGeom(300, G.bld.observatory.count);
        if(r === 'stone') base += G.bld.warehouse.count * 100; // Warehouse is special (linear but applies to all)
        if(r === 'faith') base += getGeom(50, G.bld.temple.count) + getGeom(100, G.bld.cathedral.count);
        if(r === 'gold') base += getGeom(20, G.bld.vault.count) + getGeom(50, G.bld.bank.count);
        
        // ERA 1
        if(r === 'lumber') base += getGeom(50, G.bld.sawmill.count);
        if(r === 'glass') base += getGeom(50, G.bld.glassworks.count);
        if(r === 'mana') base += getGeom(50, G.bld.magetower.count);
        
        // ERA 2
        if(r === 'parchment') base += getGeom(30, G.bld.scriptorium.count) + getGeom(50, G.bld.printingpress.count);
        if(r === 'weapons' || r === 'armor') base += getGeom(50, G.bld.barracks.count);
        
        // ERA 3
        if(r === 'art') base += getGeom(50, G.bld.museum.count);
        if(r === 'spices') base += getGeom(50, G.bld.shipyard.count);
        
        // ERA 4
        if(r === 'oil') base += getGeom(100, G.bld.oilrig.count);
        if(r === 'power') base += getGeom(200, G.bld.powerplant.count) + getGeom(500, G.bld.nuclearreactor.count);
        if(r === 'concrete') base += getGeom(100, G.bld.factory.count);
        
        // ERA 5
        if(r === 'rocketfuel') base += getGeom(100, G.bld.launchpad.count);
        if(r === 'antimatter') base += getGeom(10, G.bld.hadroncollider.count);
        
        // Monuments (Linear is fine for wonders as they are capped/unique usually, but we can scale them too)
        base += G.bld.pyramid.count * 500;
        base += G.bld.parthenon.count * 1000;
        base += G.bld.grandcathedral.count * 1500;
        base += G.bld.globetheatre.count * 2000;
        base += G.bld.eiffeltower.count * 3000;
        base += G.bld.spaceelevator.count * 5000;
        
        // Warehouse applies to almost everything
        if(['wood','stone','clay','iron','copper','coal'].includes(r)) {
            base += getGeom(100, G.bld.warehouse.count);
        }
        
        if(r === 'railroad') base += getGeom(500, G.bld.railroad.count); // Applies to "all" conceptually
        
        G.res[r].max = Math.floor(base);
    }
}

// NOTE: This now only calculates potential rate for UI display
// Actual logic is handled in `processProductionTick`
function getNetRate(type) {
    let rate = 0;
    const prod = C.PROD;
    
    // Production from jobs
    for(let job in prod) {
        if(G.pop[job] === undefined) continue;
        const count = G.pop[job];
        if(count === 0) continue;
        
        // Simple display logic: assumes 100% efficiency
        if(typeof prod[job] === 'object') {
            if(prod[job][type]) rate += prod[job][type] * count;
        }
    }
    
    // Consumption from Population
    if(type === 'food') rate -= G.pop.total * C.POP_EAT;
    
    rate *= (1 + G.prestigeLevel * 0.05);
    
    return rate;
}

function getCost(buildingType) {
    const bld = G.bld[buildingType];
    if(!bld) return {};
    
    let costs = {};
    for(let res in bld.base) {
        costs[res] = Math.floor(bld.base[res] * Math.pow(bld.mult, bld.count));
    }
    return costs;
}

// ===== GAME LOOP =====
function tick() {
    const dt = C.TICK / 1000;
    processProductionTick(dt);
    checkAchievements();
    triggerRandomEvent();
    G.stats.timePlayed += dt;
    updateUI();
}

// ===== NEW PRODUCTION LOGIC (Fixes Magic Prod & Starvation) =====
function processProductionTick(dt) {
    const prestigeMult = (1 + G.prestigeLevel * 0.05);

    // 1. Food Consumption & Starvation Logic
    const foodNeeded = G.pop.total * C.POP_EAT * dt;
    
    if (G.res.food.cur >= foodNeeded) {
        G.res.food.cur -= foodNeeded;
        G.starvationAccumulator = 0; // Reset starvation timer
    } else {
        // Starvation occurring
        G.res.food.cur = 0; // Eat what's left
        
        if (G.pop.total > 0) {
            G.starvationAccumulator += dt;
            // Kill 1 villager per second of starvation
            if (G.starvationAccumulator >= 1.0) {
                killVillager();
                G.starvationAccumulator = 0;
                log("A villager has died from starvation!", "bad");
            }
        }
    }

    // 2. Job Production Logic (with input checking)
    // We create a temporary map of changes so inputs from Job A are available for Job B in the same tick 
    // (Simulates simultaneous production for simplicity, preventing order bias)
    let productionDeltas = {};

    for (let job in C.PROD) {
        const count = G.pop[job];
        if (!count || count <= 0) continue;

        const recipe = C.PROD[job];
        
        // Calculate Inputs Required
        let maxEfficiency = 1.0;
        let inputsNeeded = {};

        // First pass: Check if we have enough resources for inputs
        for (let res in recipe) {
            if (recipe[res] < 0) {
                // It's an input
                const amountNeeded = Math.abs(recipe[res]) * count * dt;
                inputsNeeded[res] = amountNeeded;
                
                if (G.res[res].cur < amountNeeded) {
                    // Not enough resources! Limit efficiency.
                    // If we need 10 but have 5, efficiency is 0.5
                    const efficiency = G.res[res].cur / amountNeeded;
                    if (efficiency < maxEfficiency) maxEfficiency = efficiency;
                }
            }
        }

        // Second pass: Apply consumption and production based on limited efficiency
        if (maxEfficiency > 0) {
            for (let res in recipe) {
                let amount = recipe[res] * count * dt * prestigeMult * maxEfficiency;
                
                // If it's an input (negative), we consume it immediately from current stock
                // to prevent other jobs from using the same resource phantomly in this tick
                if (amount < 0) {
                    G.res[res].cur += amount; // amount is negative
                } else {
                    // Output: Add to deltas to be added at end of tick
                    if (!productionDeltas[res]) productionDeltas[res] = 0;
                    productionDeltas[res] += amount;
                }
            }
        }
    }

    // Apply accumulated production outputs
    for (let res in productionDeltas) {
        addRes(res, productionDeltas[res]);
    }
}

function killVillager() {
    if (G.pop.total <= 0) return;
    
    G.pop.total--;
    
    // Priority: Kill Idle first
    if (G.pop.idle > 0) {
        G.pop.idle--;
    } else {
        // Kill random job
        const jobs = Object.keys(G.pop).filter(k => k!=='total' && k!=='idle' && G.pop[k] > 0);
        if (jobs.length > 0) {
            const victim = jobs[Math.floor(Math.random() * jobs.length)];
            G.pop[victim]--;
        }
    }
    updateUI();
}

function killMultiple(amount) {
    for(let i=0; i<amount; i++) {
        killVillager();
    }
}

// ===== ACTIONS =====
function manualGather() {
    addRes('food', 1);
    G.stats.manualClicks++;
    updateUI();
    
    if(!G.achievements.firstClick) {
        G.achievements.firstClick = true;
        showAchievement('firstClick');
    }
}

function recruitVillager() {
    if(G.res.food.cur >= C.COST_VILLAGER && G.pop.total < getMaxPop()) {
        G.res.food.cur -= C.COST_VILLAGER;
        G.pop.total++;
        G.pop.idle++;
        G.stats.villagersRecruited++;
        log("Villager recruited.", "good");
        updateUI();
    }
}

function adjustJob(job, delta) {
    if(delta > 0) {
        const actualDelta = Math.min(delta, G.pop.idle);
        G.pop.idle -= actualDelta;
        G.pop[job] += actualDelta;
    } else {
        const actualDelta = Math.min(Math.abs(delta), G.pop[job]);
        G.pop[job] -= actualDelta;
        G.pop.idle += actualDelta;
    }
    updateUI();
}

function buildStructure(type) {
    const costs = getCost(type);
    let canBuild = true;
    
    for(let res in costs) {
        if(!G.res[res] || G.res[res].cur < costs[res]) {
            canBuild = false;
            break;
        }
    }
    
    if(canBuild) {
        for(let res in costs) {
            G.res[res].cur -= costs[res];
        }
        G.bld[type].count++;
        G.stats.buildingsConstructed++;
        recalcCaps();
        log(`${type} built!`, "good");
        updateUI();
        
        if(type === 'pyramid' && G.era === 0) advanceEra();
        if(type === 'parthenon' && G.era === 1) advanceEra();
        if(type === 'grandcathedral' && G.era === 2) advanceEra();
        if(type === 'globetheatre' && G.era === 3) advanceEra();
        if(type === 'eiffeltower' && G.era === 4) advanceEra();
        if(type === 'spaceelevator') {
            G.achievements.victory = true;
            G.achievements.spaceelevator = true;
            showAchievement('victory');
            alert("🎉 CONGRATULATIONS! YOU HAVE REACHED THE STARS! 🎉\n\nYou've completed Civilization Clicker!");
        }
    }
}

function buildMax(event, type) {
    event.stopPropagation();
    
    let built = 0;
    while(built < 100) {
        const costs = getCost(type);
        let canBuild = true;
        
        for(let res in costs) {
            if(!G.res[res] || G.res[res].cur < costs[res]) {
                canBuild = false;
                break;
            }
        }
        
        if(!canBuild) break;
        
        for(let res in costs) {
            G.res[res].cur -= costs[res];
        }
        G.bld[type].count++;
        G.stats.buildingsConstructed++;
        built++;
    }
    
    if(built > 0) {
        recalcCaps();
        log(`Built ${built}x ${type}!`, "good");
        updateUI();
    }
}

function purchaseTech(tech) {
    const cost = G.tech[tech].cost;
    if(G.res.science.cur >= cost && !G.tech[tech].researched) {
        G.res.science.cur -= cost;
        G.tech[tech].researched = true;
        G.stats.techResearched++;
        log(`Researched ${tech}!`, "good");
        updateUI();
    }
}

function advanceEra() {
    G.era++;
    G.stats.eraReached = G.era;
    log(`Welcome to Era ${G.era}!`, "good");
    
    if(G.era >= 3) {
        document.getElementById('btn-prestige').style.display = 'block';
    }
    
    updateUI();
}

// ===== PRESTIGE SYSTEM =====
function confirmPrestige() {
    if(G.era < 3) {
        alert("You must reach Era 3 to prestige!");
        return;
    }
    
    const prestigePoints = Math.floor(G.era * 10 + G.stats.buildingsConstructed / 10);
    const bonus = (G.prestigeLevel + 1) * 5;
    
    if(confirm(`Prestige and start over?\n\nYou will gain 1 Prestige Level.\nCurrent bonus: +${G.prestigeLevel * 5}% production\nNew bonus: +${bonus}% production\n\nAll progress will reset!`)) {
        doPrestige();
    }
}

function doPrestige() {
    G.prestigeLevel++;
    G.achievements.prestige1 = true;
    showAchievement('prestige1');
    
    const savedPrestige = G.prestigeLevel;
    const savedAchievements = {...G.achievements};
    const savedStats = {...G.stats};
    
    resetGameState();
    
    G.prestigeLevel = savedPrestige;
    G.achievements = savedAchievements;
    G.stats = savedStats;
    
    log(`Prestiged! Now at Level ${G.prestigeLevel}`, "good");
    updateUI();
}

function confirmReset() {
    if(confirm("Are you sure? This will delete ALL your progress including prestige!")) {
        localStorage.removeItem('civIdleSave');
        location.reload();
    }
}

function resetGameState() {
    G.era = 0;
    G.starvationAccumulator = 0;
    
    for(let r in G.res) {
        G.res[r].cur = 0;
        G.res[r].unlocked = ['food', 'wood', 'science'].includes(r);
    }
    
    for(let job in G.pop) {
        G.pop[job] = 0;
    }
    G.pop.total = 0;
    G.pop.idle = 0;
    
    for(let b in G.bld) {
        G.bld[b].count = 0;
    }
    
    for(let t in G.tech) {
        G.tech[t].researched = false;
    }
    
    recalcCaps();
}

// ===== ACHIEVEMENTS =====
function checkAchievements() {
    if(G.pop.total >= 10 && !G.achievements.pop10) {
        G.achievements.pop10 = true;
        showAchievement('pop10');
    }
    if(G.pop.total >= 50 && !G.achievements.pop50) {
        G.achievements.pop50 = true;
        showAchievement('pop50');
    }
    if(G.pop.total >= 100 && !G.achievements.pop100) {
        G.achievements.pop100 = true;
        showAchievement('pop100');
    }
    if(G.era >= 1 && !G.achievements.era1) {
        G.achievements.era1 = true;
        showAchievement('era1');
    }
    if(G.era >= 2 && !G.achievements.era2) {
        G.achievements.era2 = true;
        showAchievement('era2');
    }
    if(G.era >= 3 && !G.achievements.era3) {
        G.achievements.era3 = true;
        showAchievement('era3');
    }
    if(G.era >= 4 && !G.achievements.era4) {
        G.achievements.era4 = true;
        showAchievement('era4');
    }
    if(G.era >= 5 && !G.achievements.era5) {
        G.achievements.era5 = true;
        showAchievement('era5');
    }
    if(G.bld.pyramid.count > 0 && !G.achievements.pyramid) {
        G.achievements.pyramid = true;
        showAchievement('pyramid');
    }
    if(G.bld.parthenon.count > 0 && !G.achievements.parthenon) {
        G.achievements.parthenon = true;
        showAchievement('parthenon');
    }
    if(G.bld.grandcathedral.count > 0 && !G.achievements.grandcathedral) {
        G.achievements.grandcathedral = true;
        showAchievement('grandcathedral');
    }
    if(G.bld.globetheatre.count > 0 && !G.achievements.globetheatre) {
        G.achievements.globetheatre = true;
        showAchievement('globetheatre');
    }
    if(G.bld.eiffeltower.count > 0 && !G.achievements.eiffeltower) {
        G.achievements.eiffeltower = true;
        showAchievement('eiffeltower');
    }
    if(G.stats.techResearched >= 10 && !G.achievements.tech10) {
        G.achievements.tech10 = true;
        showAchievement('tech10');
    }
    if(G.stats.techResearched >= 20 && !G.achievements.tech20) {
        G.achievements.tech20 = true;
        showAchievement('tech20');
    }
    if(G.stats.buildingsConstructed >= 50 && !G.achievements.buildings50) {
        G.achievements.buildings50 = true;
        showAchievement('buildings50');
    }
    if(G.stats.buildingsConstructed >= 100 && !G.achievements.buildings100) {
        G.achievements.buildings100 = true;
        showAchievement('buildings100');
    }
    if(G.res.gold.cur >= 100 && !G.achievements.gold100) {
        G.achievements.gold100 = true;
        showAchievement('gold100');
    }
    if(G.res.science.cur >= 1000000 && !G.achievements.science1M) {
        G.achievements.science1M = true;
        showAchievement('science1M');
    }
    if(G.stats.manualClicks >= 100 && !G.achievements.clicks100) {
        G.achievements.clicks100 = true;
        showAchievement('clicks100');
    }
}

function showAchievement(key) {
    const ach = ACHIEVEMENTS[key];
    if(!ach) return;
    
    G.stats.achievementsUnlocked++;
    log(`🏆 Achievement: ${ach.name}`, "good");
    
    const notif = document.createElement('div');
    notif.className = 'event-notification positive';
    notif.innerHTML = `
        <div class="event-title">${ach.icon} ${ach.name}</div>
        <div class="event-desc">${ach.desc}</div>
    `;
    document.body.appendChild(notif);
    setTimeout(() => notif.remove(), 5000);
}

// ===== SAVE/LOAD SYSTEM =====
function saveGame() {
    try {
        const saveData = {
            version: '2.5',
            era: G.era,
            prestigeLevel: G.prestigeLevel,
            res: {},
            pop: G.pop,
            bld: {},
            tech: {},
            stats: G.stats,
            achievements: G.achievements,
            lastSaveTime: Date.now()
        };
        
        for(let k in G.res) {
            saveData.res[k] = { cur: G.res[k].cur, unlocked: G.res[k].unlocked };
        }
        
        for(let k in G.bld) {
            saveData.bld[k] = { count: G.bld[k].count };
        }
        
        for(let k in G.tech) {
            saveData.tech[k] = { researched: G.tech[k].researched };
        }
        
        localStorage.setItem('civIdleSave', JSON.stringify(saveData));
        log("Game saved.", "good");
    } catch(e) {
        console.error("Save failed:", e);
        log("Save failed!", "bad");
    }
}

function loadGame() {
    const save = localStorage.getItem('civIdleSave');
    if(!save) return;
    
    try {
        const data = JSON.parse(save);
        
        if(!data || typeof data !== 'object') throw new Error("Invalid save data");
        
        G.era = data.era || 0;
        G.prestigeLevel = data.prestigeLevel || 0;
        
        if(data.res) {
            for(let key in G.res) {
                if(data.res[key]) {
                    G.res[key].cur = data.res[key].cur || 0;
                    G.res[key].unlocked = data.res[key].unlocked || false;
                    if(isNaN(G.res[key].cur)) G.res[key].cur = 0;
                }
            }
        }
        // Force unlock essentials if locked by bug
        if(G.res.food) G.res.food.unlocked = true;
        if(G.res.wood) G.res.wood.unlocked = true;
        if(G.res.science) G.res.science.unlocked = true;
        
        if(data.pop) {
            let safeTotal = 0;
            for(let job in G.pop) {
                if(job !== 'total' && job !== 'idle') {
                    let val = data.pop[job];
                    G.pop[job] = (typeof val === 'number' && !isNaN(val)) ? val : 0;
                    safeTotal += G.pop[job];
                }
            }
            G.pop.idle = (typeof data.pop.idle === 'number' && !isNaN(data.pop.idle)) ? data.pop.idle : 0;
            safeTotal += G.pop.idle;
            G.pop.total = safeTotal;
        }
        
        if(data.bld) {
            for(let key in G.bld) {
                if(data.bld[key]) {
                    G.bld[key].count = data.bld[key].count || 0;
                }
            }
        }
        
        if(data.tech) {
            for(let key in G.tech) {
                if(data.tech[key]) {
                    G.tech[key].researched = data.tech[key].researched || false;
                }
            }
        }
        
        if(data.stats) G.stats = {...G.stats, ...data.stats};
        if(data.achievements) G.achievements = {...G.achievements, ...data.achievements};
        
        // ===== UPDATED OFFLINE PROGRESS =====
        if(data.lastSaveTime) {
            const now = Date.now();
            const timeDiff = (now - data.lastSaveTime) / 1000;
            
            // 1. INCREASE CAP TO 24 HOURS (86400 seconds)
            const maxOfflineTime = 86400; 
            let offlineTime = Math.min(timeDiff, maxOfflineTime);
            
            if(offlineTime > 60) {
                // 2. SAFETY CHECK: Do we have enough food?
                // Calculate net food rate per second (Production - Consumption)
                const foodRate = getNetRate('food'); 
                
                // If we are losing food, calculate exactly when we would hit 0
                if (foodRate < 0 && G.res.food.cur > 0) {
                    const timeToStarve = G.res.food.cur / Math.abs(foodRate);
                    
                    if (timeToStarve < offlineTime) {
                        offlineTime = timeToStarve;
                        console.log(`⚠️ Offline simulation stopped early at ${offlineTime.toFixed(1)}s to prevent starvation.`);
                        log("Offline progress halted early to prevent starvation!", "bad");
                    }
                }

                // Simulate ticks
                // We use larger chunks for performance
                // Let's run a simplified calculation for resources to save CPU
                // We add resources based on rate * time, taking caps into account
                for(let r in G.res) {
                    const rate = getNetRate(r);
                    if(rate !== 0) {
                        addRes(r, rate * offlineTime);
                    }
                }
                
                // Special handling: If we stopped due to starvation, set food to 0
                if (foodRate < 0 && offlineTime < timeDiff) {
                    G.res.food.cur = 0;
                }

                const timeString = offlineTime > 3600 
                    ? `${(offlineTime/3600).toFixed(1)} hours` 
                    : `${(offlineTime/60).toFixed(1)} minutes`;
                
                log(`Welcome back! ${timeString} of offline progress applied.`, "good");
            }
        }
        
        recalcCaps();
        updateUI();
        log("Game loaded.", "good");
    } catch(e) {
        console.error("Load failed:", e);
        log("Save corrupted, starting fresh.", "bad");
        localStorage.removeItem('civIdleSave');
    }
}

// ===== UI UPDATE =====
function updateUI() {
    checkUnlocks(); 

    // Update resources
    for(let r in G.res) {
        if(!G.res[r].unlocked) continue;
        
        const curEl = document.getElementById(`${r}-current`);
        const maxEl = document.getElementById(`${r}-max`);
        const barEl = document.getElementById(`${r}-bar`);
        const rateEl = document.getElementById(`${r}-rate`);
        const boxEl = document.getElementById(`box-${r}`);
        
        if(boxEl) boxEl.classList.remove('locked');
        if(curEl) curEl.innerText = Math.floor(G.res[r].cur);
        if(maxEl) maxEl.innerText = G.res[r].max;
        if(barEl) barEl.style.width = Math.min(100, (G.res[r].cur / G.res[r].max) * 100) + "%";
        
        if(rateEl) {
            const rate = getNetRate(r);
            rateEl.innerText = (rate >= 0 ? "+" : "") + rate.toFixed(2) + "/s";
            rateEl.style.color = rate > 0 ? "var(--accent-food)" : rate < 0 ? "var(--accent-danger)" : "#555";
        }
    }
    
    // Update population
    document.getElementById('pop-total').innerText = G.pop.total;
    document.getElementById('pop-max').innerText = getMaxPop();
    document.getElementById('pop-idle').innerText = G.pop.idle;
    document.getElementById('current-era').innerText = G.era;
    
    // Update prestige
    if(G.prestigeLevel > 0) {
        document.getElementById('prestige-level').style.display = 'block';
        document.getElementById('prestige-count').innerText = G.prestigeLevel;
    }
    
    // Update recruit button
    const btnRecruit = document.getElementById('btn-recruit');
    if(btnRecruit) btnRecruit.disabled = G.res.food.cur < C.COST_VILLAGER || G.pop.total >= getMaxPop();
    
    // Update job counts  
    for(let job in G.pop) {
        if(job === 'total' || job === 'idle') continue;
        const el = document.getElementById(`count-${job}`);
        if(el) el.innerText = G.pop[job];
    }
    
    // Update tech buttons
    for(let tech in G.tech) {
        const btn = document.getElementById(`btn-tech-${tech}`);
        const card = document.getElementById(`tech-${tech}`);
        if(btn) {
            if(G.tech[tech].researched) {
                btn.innerText = "Researched";
                if(card) card.classList.add('tech-purchased');
            } else {
                btn.disabled = G.res.science.cur < G.tech[tech].cost;
            }
        }
    }
    
    // Update building buttons
    for(let b in G.bld) {
        const countEl = document.getElementById(`${b}-count`);
        if(countEl) countEl.innerText = G.bld[b].count;
        
        const btn = document.getElementById(`btn-${b}`);
        const costEl = document.getElementById(`${b}-cost`);
        if(btn && costEl) {
            const costs = getCost(b);
            let str = "";
            let canAfford = true;
            for(let res in costs) {
                if(!G.res[res]) continue;
                str += `${costs[res]} ${res}, `;
                if(G.res[res].cur < costs[res]) canAfford = false;
            }
            costEl.innerText = str.slice(0, -2);
            btn.disabled = !canAfford;
        }
    }
    
    updateAchievements();
    updateStatistics();
}

function updateAchievements() {
    const container = document.getElementById('achievements-container');
    if(!container) return;
    
    let html = '';
    let unlockedCount = 0;
    
    for(let key in ACHIEVEMENTS) {
        const ach = ACHIEVEMENTS[key];
        const unlocked = G.achievements[key];
        if(unlocked) unlockedCount++;
        
        html += `
            <div class="achievement-card ${unlocked ? 'unlocked' : 'locked'}">
                <div class="achievement-icon">${ach.icon}</div>
                <div class="achievement-info">
                    <div class="achievement-title">${ach.name}</div>
                    <div class="achievement-desc">${ach.desc}</div>
                </div>
                ${unlocked ? '<span class="achievement-badge">✓</span>' : ''}
            </div>
        `;
    }
    
    container.innerHTML = html;
    
    const progress = document.getElementById('achievement-progress');
    if(progress) progress.innerText = `(${unlockedCount}/${Object.keys(ACHIEVEMENTS).length})`;
}

function updateStatistics() {
    const container = document.getElementById('stats-container');
    if(!container) return;
    
    const stats = [
        { title: "Time Played", value: formatTime(G.stats.timePlayed) },
        { title: "Total Resources", value: G.stats.totalResourcesGathered.toFixed(0) },
        { title: "Manual Clicks", value: G.stats.manualClicks },
        { title: "Buildings Built", value: G.stats.buildingsConstructed },
        { title: "Tech Researched", value: G.stats.techResearched },
        { title: "Villagers Recruited", value: G.stats.villagersRecruited },
        { title: "Current Era", value: G.era },
        { title: "Highest Era", value: G.stats.eraReached },
        { title: "Prestige Level", value: G.prestigeLevel },
        { title: "Production Bonus", value: `+${(G.prestigeLevel * 5)}%` },
        { title: "Achievements", value: `${G.stats.achievementsUnlocked}/${Object.keys(ACHIEVEMENTS).length}` },
        { title: "Current Population", value: G.pop.total }
    ];
    
    let html = '';
    for(let stat of stats) {
        html += `
            <div class="stat-card">
                <div class="stat-card-title">${stat.title}</div>
                <div class="stat-card-value">${stat.value}</div>
            </div>
        `;
    }
    
    container.innerHTML = html;
}

function formatTime(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${h}h ${m}m ${s}s`;
}

// ===== TAB SWITCHING =====
function switchTab(tab, event) {
    document.querySelectorAll('.content-area').forEach(e => e.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(e => e.classList.remove('active'));
    document.getElementById(`tab-${tab}`).classList.add('active');
    event.target.classList.add('active');
}

// ===== UTILITY =====
function log(msg, type = "") {
    const d = document.createElement('div');
    d.className = `log-msg ${type}`;
    d.innerText = msg;
    const overlay = document.getElementById('log-overlay');
    overlay.prepend(d);
    if(overlay.children.length > 5) overlay.lastChild.remove();
    setTimeout(() => { if(d.parentNode) d.remove(); }, 3000);
}

// ===== UI GENERATION =====
function generateJobsUI() {
    const container = document.getElementById('jobs-container');
    if(!container) return;
    
    const jobs = {
        // Era 0
        farmer: { title: "🌾 Farmer", desc: "Produces food" },
        woodcutter: { title: "🪓 Woodcutter", desc: "Chops wood" },
        scholar: { title: "📚 Scholar", desc: "Generates science" },
        mason: { title: "🔨 Mason", desc: "Gathers stone", locked: true },
        digger: { title: "⛏️ Digger", desc: "Digs clay", locked: true },
        hunter: { title: "🏹 Hunter", desc: "Food & skins", locked: true },
        miner: { title: "⛏️ Miner", desc: "Mines ores", locked: true },
        blacksmith: { title: "🔨 Blacksmith", desc: "Forges tools", locked: true },
        smelter: { title: "🔥 Smelter", desc: "Smelts steel", locked: true },
        priest: { title: "⛪ Priest", desc: "Generates faith", locked: true },
        // Era 1
        carpenter: { title: "🪚 Carpenter", desc: "Produces lumber", locked: true },
        brickmaker: { title: "🧱 Brickmaker", desc: "Makes bricks", locked: true },
        glassblower: { title: "🏺 Glassblower", desc: "Blows glass", locked: true },
        wizard: { title: "🧙 Wizard", desc: "Channels mana", locked: true },
        alchemist: { title: "⚗️ Alchemist", desc: "Transmutes gold", locked: true },
        metalworker: { title: "🔔 Metalworker", desc: "Creates brass", locked: true },
        // Era 2
        scribe: { title: "📜 Scribe", desc: "Writes parchment", locked: true },
        brewer: { title: "🍺 Brewer", desc: "Brews ale", locked: true },
        armorsmith: { title: "🛡️ Armorsmith", desc: "Crafts armor", locked: true },
        weaponsmith: { title: "⚔️ Weaponsmith", desc: "Forges weapons", locked: true },
        knight: { title: "🐴 Knight", desc: "Upholds chivalry", locked: true },
        inquisitor: { title: "⚖️ Inquisitor", desc: "Enforces faith", locked: true },
        // Era 3
        chemist: { title: "🧪 Chemist", desc: "Makes gunpowder", locked: true },
        musketeer: { title: "🔫 Musketeer", desc: "Wields influence", locked: true },
        painter: { title: "🎨 Painter", desc: "Creates art", locked: true },
        navigator: { title: "🧭 Navigator", desc: "Finds spices", locked: true },
        banker: { title: "💰 Banker", desc: "Grows influence", locked: true },
        weaver: { title: "🧵 Weaver", desc: "Weaves canvas", locked: true },
        // Era 4
        driller: { title: "🛢️ Driller", desc: "Drills oil", locked: true },
        factoryworker: { title: "🏭 Factory Worker", desc: "Makes concrete", locked: true },
        engineer: { title: "⚙️ Engineer", desc: "Builds engines", locked: true },
        operator: { title: "⚡ Operator", desc: "Generates power", locked: true },
        capitalist: { title: "💼 Capitalist", desc: "Invests", locked: true },
        tapper: { title: "🌴 Tapper", desc: "Taps rubber", locked: true },
        // Era 5
        nucleartech: { title: "☢️ Nuclear Tech", desc: "Nuclear power", locked: true },
        synthesizer: { title: "🔬 Synthesizer", desc: "Superalloy", locked: true },
        geneticist: { title: "🧬 Geneticist", desc: "Boosts pop", locked: true },
        aiarchitect: { title: "🤖 AI Architect", desc: "AI science", locked: true },
        miner_uranium: { title: "☢️ Uranium Miner", desc: "Mines uranium", locked: true },
        refiner: { title: "🚀 Refiner", desc: "Rocket fuel", locked: true },
        nanobuilder: { title: "🤖 Nanobuilder", desc: "Nanobots", locked: true },
        physicist: { title: "⚛️ Physicist", desc: "Antimatter", locked: true }
    };
    
    let html = '';
    for(let key in jobs) {
        const job = jobs[key];
        const locked = job.locked ? ' locked' : '';
        html += `
            <div class="game-card${locked}" id="job-${key}">
                <span class="card-title">${job.title}</span>
                <span class="card-desc">${job.desc}</span>
                <div class="job-control">
                    <button class="job-btn" onclick="adjustJob('${key}', -10)">-10</button>
                    <button class="job-btn" onclick="adjustJob('${key}', -1)">-1</button>
                    <span style="min-width:40px; text-align:center; font-weight:700;" id="count-${key}">0</span>
                    <button class="job-btn" onclick="adjustJob('${key}', 1)">+1</button>
                    <button class="job-btn" onclick="adjustJob('${key}', 10)">+10</button>
                </div>
            </div>
        `;
    }
    container.innerHTML = html;
}

function generateBuildingsUI() {
    const container = document.getElementById('buildings-container');
    if(!container) return;
    
    const buildings = {
        // Era 0
        hut: { title: "🏚️ Hut", desc: "+5 max population" },
        stockpile: { title: "📦 Stockpile", desc: "+20 wood storage" },
        granary: { title: "🌾 Granary", desc: "+50 food storage", locked: true },
        warehouse: { title: "🏭 Warehouse", desc: "+100 all storage", locked: true },
        vault: { title: "🏦 Vault", desc: "+20 gold storage", locked: true },
        house: { title: "🏠 House", desc: "+10 max population", locked: true },
        library: { title: "📚 Library", desc: "+100 science storage", locked: true },
        temple: { title: "⛪ Temple", desc: "+50 faith storage", locked: true },
        pyramid: { title: "🔺 Great Pyramid", desc: "Monument (Era 1)", locked: true },
        // Era 1
        sawmill: { title: "🪚 Sawmill", desc: "+50 lumber storage", locked: true },
        glassworks: { title: "🏺 Glassworks", desc: "+50 glass storage", locked: true },
        academy: { title: "🎓 Academy", desc: "+200 science storage", locked: true },
        magetower: { title: "🗼 Mage Tower", desc: "+50 mana storage", locked: true },
        colosseum: { title: "🏟️ Colosseum", desc: "+30 max pop", locked: true },
        parthenon: { title: "🏛️ Parthenon", desc: "Monument (Era 2)", locked: true },
        // Era 2
        castle: { title: "🏰 Castle", desc: "+50 max population", locked: true },
        cathedral: { title: "⛪ Cathedral", desc: "+100 faith storage", locked: true },
        barracks: { title: "⚔️ Barracks", desc: "+50 weapons storage", locked: true },
        scriptorium: { title: "📜 Scriptorium", desc: "+30 parchment storage", locked: true },
        grandcathedral: { title: "⛪ Grand Cathedral", desc: "Monument (Era 3)", locked: true },
        // Era 3
        bank: { title: "🏦 Bank", desc: "+50 gold storage", locked: true },
        museum: { title: "🖼️ Museum", desc: "+50 art storage", locked: true },
        shipyard: { title: "⛵ Shipyard", desc: "+50 spices storage", locked: true },
        observatory: { title: "🔭 Observatory", desc: "+300 science storage", locked: true },
        printingpress: { title: "📰 Printing Press", desc: "+50 parchment storage", locked: true },
        globetheatre: { title: "🎭 Globe Theatre", desc: "Monument (Era 4)", locked: true },
        // Era 4
        oilrig: { title: "🛢️ Oil Rig", desc: "+100 oil storage", locked: true },
        powerplant: { title: "⚡ Power Plant", desc: "+200 power storage", locked: true },
        factory: { title: "🏭 Factory", desc: "+100 concrete storage", locked: true },
        skyscraper: { title: "🏢 Skyscraper", desc: "+100 max population", locked: true },
        railroad: { title: "🚂 Railroad", desc: "+500 all storage", locked: true },
        eiffeltower: { title: "🗼 Eiffel Tower", desc: "Monument (Era 5)", locked: true },
        // Era 5
        nuclearreactor: { title: "☢️ Nuclear Reactor", desc: "+500 power storage", locked: true },
        launchpad: { title: "🚀 Launch Pad", desc: "+100 rocket fuel storage", locked: true },
        cryochamber: { title: "❄️ Cryochamber", desc: "+200 max population", locked: true },
        hadroncollider: { title: "⚛️ Hadron Collider", desc: "+10 antimatter storage", locked: true },
        spaceelevator: { title: "🛰️ Space Elevator", desc: "Victory!", locked: true }
    };
    
    let html = '';
    for(let key in buildings) {
        const bld = buildings[key];
        const locked = bld.locked ? ' locked' : '';
        html += `
            <div class="game-card${locked}" id="build-${key}">
                <span class="card-title">${bld.title} (<span id="${key}-count">0</span>)</span>
                <span class="card-desc">${bld.desc}</span>
                <button id="btn-${key}" class="btn-action" onclick="buildStructure('${key}')">
                    <span id="${key}-cost">...</span>
                    <span class="build-max" onclick="buildMax(event, '${key}')">MAX</span>
                </button>
            </div>
        `;
    }
    container.innerHTML = html;
}

function generateTechUI() {
    const container = document.getElementById('tech-container');
    if(!container) return;
    
    const tech = {
        // Era 0
        stoneTools: { title: "🪨 Stone Tools", desc: "Unlocks Mason & Digger" },
        mining: { title: "⛏️ Mining", desc: "Unlocks Miner", locked: true },
        construction: { title: "🏗️ Construction", desc: "Granary & Warehouse", locked: true },
        smelting: { title: "🔥 Smelting", desc: "Blacksmith & Smelter", locked: true },
        steelwork: { title: "⚙️ Steelworking", desc: "Better steel", locked: true },
        mysticism: { title: "🙏 Mysticism", desc: "Priest & Temple", locked: true },
        monumentalism: { title: "🔺 Monumentalism", desc: "Great Pyramid", locked: true },
        // Era 1
        mathematics: { title: "📐 Mathematics", desc: "Carpenter", locked: true },
        engineering: { title: "🏗️ Engineering", desc: "Brickmaker", locked: true },
        glassblowing: { title: "🏺 Glassblowing", desc: "Glassblower", locked: true },
        currency: { title: "💰 Currency", desc: "Vault & Academy", locked: true },
        drama: { title: "🎭 Drama", desc: "Colosseum", locked: true },
        magic: { title: "✨ Magic", desc: "Wizard", locked: true },
        alchemy: { title: "⚗️ Alchemy", desc: "Alchemist", locked: true },
        metalworking: { title: "🔔 Metalworking", desc: "Metalworker (Brass)", locked: true },
        divineright: { title: "👑 Divine Right", desc: "Parthenon", locked: true },
        // Era 2
        feudalism: { title: "🏰 Feudalism", desc: "Castle", locked: true },
        chivalrycode: { title: "⚜️ Chivalry", desc: "Knights", locked: true },
        manuscript: { title: "📜 Manuscripts", desc: "Scribes", locked: true },
        brewing: { title: "🍺 Brewing", desc: "Brewers", locked: true },
        platearmor: { title: "🛡️ Plate Armor", desc: "Armorsmiths", locked: true },
        inquisition: { title: "⚖️ Inquisition", desc: "Inquisitors", locked: true },
        gothicarch: { title: "⛪ Gothic Architecture", desc: "Grand Cathedral", locked: true },
        // Era 3
        exploration: { title: "🗺️ Exploration", desc: "Navigators", locked: true },
        gunpowdertech: { title: "💥 Gunpowder", desc: "Chemists", locked: true },
        banking: { title: "💰 Banking", desc: "Bankers", locked: true },
        artistry: { title: "🎨 Artistry", desc: "Painters", locked: true },
        navigation: { title: "🧭 Navigation", desc: "Advanced trade", locked: true },
        printing: { title: "📰 Printing Press", desc: "Mass production", locked: true },
        humanism: { title: "🎭 Humanism", desc: "Globe Theatre", locked: true },
        // Era 4
        steelframe: { title: "🏢 Steel Frame", desc: "Skyscrapers", locked: true },
        petroleum: { title: "🛢️ Petroleum", desc: "Oil & Rubber", locked: true },
        electricity: { title: "⚡ Electricity", desc: "Power Plants", locked: true },
        assembly: { title: "🏭 Assembly Line", desc: "Factories", locked: true },
        combustion: { title: "⚙️ Combustion", desc: "Engineers", locked: true },
        capitalism: { title: "💼 Capitalism", desc: "Capitalists", locked: true },
        modernarch: { title: "🗼 Modern Architecture", desc: "Eiffel Tower", locked: true },
        // Era 5
        nuclear: { title: "☢️ Nuclear Energy", desc: "Uranium & Reactors", locked: true },
        rocketry: { title: "🚀 Rocketry", desc: "Rocket fuel", locked: true },
        nanotechnology: { title: "🤖 Nanotechnology", desc: "Nanobots", locked: true },
        genetics: { title: "🧬 Genetics", desc: "Geneticists", locked: true },
        ai: { title: "🤖 AI", desc: "AI Architects", locked: true },
        antimatterphysics: { title: "⚛️ Antimatter", desc: "Physicists", locked: true },
        spacecolonization: { title: "🛰️ Space Colony", desc: "Space Elevator", locked: true }
    };
    
    let html = '';
    for(let key in tech) {
        const t = tech[key];
        const locked = t.locked ? ' locked' : '';
        const cost = G.tech[key] ? G.tech[key].cost : 0;
        html += `
            <div class="game-card${locked}" id="tech-${key}">
                <span class="card-title">${t.title}</span>
                <span class="card-desc">${t.desc}</span>
                <button id="btn-tech-${key}" class="btn-action" onclick="purchaseTech('${key}')">${cost} Science</button>
            </div>
        `;
    }
    container.innerHTML = html;
}

// ===== UNLOCK SYSTEM =====
function checkUnlocks() {
    const unlock = (id) => {
        const el = document.getElementById(id);
        if (el && el.classList.contains('locked')) {
            el.classList.remove('locked');
            if(id.startsWith('box-')) {
                const resName = id.replace('box-', '');
                if(G.res[resName]) G.res[resName].unlocked = true;
            }
        }
    };

    // --- ERA 0 (Ancient) ---
    if (G.tech.stoneTools.researched) {
        unlock('tech-mining');
        unlock('tech-construction');
        unlock('tech-mysticism');
        unlock('job-mason');
        unlock('job-digger');
        unlock('job-hunter');
        unlock('cat-materials');
        unlock('box-stone');
        unlock('box-clay');
        unlock('box-skins');
    }

    if (G.tech.mining.researched) {
        unlock('tech-smelting');
        unlock('job-miner');
        unlock('box-copper');
        unlock('box-coal');
    }

    if (G.tech.construction.researched) {
        unlock('build-granary');
        unlock('build-warehouse');
        unlock('build-house');
    }

    if (G.tech.mysticism.researched) {
        unlock('tech-monumentalism');
        unlock('job-priest');
        unlock('build-temple');
        unlock('box-faith');
    }

    if (G.tech.smelting.researched) {
        unlock('tech-steelwork');
        unlock('job-blacksmith');
        unlock('job-smelter');
        unlock('cat-industry');
        unlock('box-tools');
        unlock('box-iron');
    }

    if (G.tech.steelwork.researched) {
        unlock('box-steel');
        unlock('box-gold');
    }

    if (G.tech.monumentalism.researched) {
        unlock('build-pyramid');
    }

    // --- ERA 1 (Classical) ---
    if (G.era >= 1) {
        unlock('tech-mathematics');
        unlock('tech-divineright');
        unlock('tech-drama');
        unlock('cat-refined');
        unlock('box-lumber');
        unlock('box-brick');
    }

    if (G.tech.mathematics.researched) {
        unlock('tech-engineering');
        unlock('job-carpenter');
        unlock('build-sawmill');
    }

    if (G.tech.engineering.researched) {
        unlock('tech-glassblowing');
        unlock('job-brickmaker');
        unlock('build-glassworks');
    }

    if (G.tech.glassblowing.researched) {
        unlock('tech-alchemy');
        unlock('job-glassblower');
        unlock('box-glass');
    }

    if (G.tech.divineright.researched) {
        unlock('build-parthenon');
        unlock('tech-magic');
        unlock('tech-currency');
    }
    
    if (G.tech.magic.researched) {
        unlock('job-wizard');
        unlock('build-magetower');
        unlock('box-mana');
    }

    if (G.tech.currency.researched) {
        unlock('build-vault'); 
    }
    
    if (G.tech.alchemy.researched) {
        unlock('job-alchemist');
        unlock('tech-metalworking');
    }

    if (G.tech.metalworking.researched) {
        unlock('job-metalworker');
        unlock('box-brass');
    }

    if (G.tech.drama.researched) {
        unlock('build-colosseum');
        unlock('build-academy');
    }

    // --- ERA 2 (Medieval) ---
    if (G.era >= 2) {
        unlock('tech-feudalism');
        unlock('tech-manuscript');
        unlock('tech-gothicarch');
    }
    
    if (G.tech.feudalism.researched) {
        unlock('build-castle');
        unlock('tech-chivalrycode');
    }
    
    if (G.tech.chivalrycode.researched) {
        unlock('job-knight');
        unlock('box-chivalry');
        unlock('tech-inquisition');
        unlock('tech-platearmor');
    }
    
    if (G.tech.manuscript.researched) {
        unlock('job-scribe');
        unlock('box-parchment');
        unlock('build-scriptorium');
        unlock('tech-brewing');
    }
    
    if (G.tech.brewing.researched) {
        unlock('job-brewer');
        unlock('box-ale');
    }

    if (G.tech.platearmor.researched) {
        unlock('job-armorsmith');
        unlock('job-weaponsmith');
        unlock('build-barracks');
        unlock('box-armor');
        unlock('box-weapons');
    }
    
    if (G.tech.inquisition.researched) {
        unlock('job-inquisitor');
    }
    
    if (G.tech.gothicarch.researched) {
        unlock('build-cathedral');
        unlock('build-grandcathedral');
    }

    // --- ERA 3 (Renaissance) ---
    if (G.era >= 3) {
        unlock('tech-exploration');
        unlock('tech-humanism');
        unlock('tech-artistry');
    }
    
    if (G.tech.exploration.researched) {
        unlock('tech-navigation');
        unlock('tech-gunpowdertech');
    }
    
    if (G.tech.navigation.researched) {
        unlock('job-navigator');
        unlock('build-shipyard');
        unlock('box-spices');
    }
    
    if (G.tech.gunpowdertech.researched) {
        unlock('job-chemist');
        unlock('job-musketeer');
        unlock('box-gunpowder');
    }
    
    if (G.tech.artistry.researched) {
        unlock('job-painter');
        unlock('job-weaver');
        unlock('box-art');
        unlock('box-canvas');
        unlock('build-museum');
    }
    
    if (G.tech.humanism.researched) {
        unlock('build-globetheatre');
        unlock('tech-printing');
        unlock('tech-banking');
    }
    
    if (G.tech.printing.researched) {
        unlock('build-printingpress');
        unlock('build-observatory');
    }
    
    if (G.tech.banking.researched) {
        unlock('job-banker');
        unlock('build-bank');
        unlock('box-influence');
    }

    // --- ERA 4 (Industrial) ---
    if (G.era >= 4) {
        unlock('tech-steelframe');
        unlock('tech-combustion');
        unlock('cat-modern');
    }

    if (G.tech.steelframe.researched) {
        unlock('tech-modernarch');
        unlock('build-skyscraper');
        unlock('build-railroad');
    }

    if (G.tech.combustion.researched) {
        unlock('job-engineer');
        unlock('box-engines');
        unlock('tech-petroleum');
    }

    if (G.tech.petroleum.researched) {
        unlock('job-driller');
        unlock('job-tapper');
        unlock('box-oil');
        unlock('box-rubber');
        unlock('build-oilrig');
        unlock('tech-assembly');
    }

    if (G.tech.assembly.researched) {
        unlock('job-factoryworker');
        unlock('build-factory');
        unlock('box-concrete');
        unlock('tech-electricity');
    }

    if (G.tech.electricity.researched) {
        unlock('job-operator');
        unlock('build-powerplant');
        unlock('box-power');
        unlock('tech-capitalism');
    }
    
    if (G.tech.capitalism.researched) {
        unlock('job-capitalist');
    }

    if (G.tech.modernarch.researched) {
        unlock('build-eiffeltower');
    }

    // --- ERA 5 (Space) ---
    if (G.era >= 5) {
        unlock('tech-nuclear');
        unlock('tech-ai');
        unlock('cat-space');
    }

    if (G.tech.nuclear.researched) {
        unlock('job-nucleartech');
        unlock('job-miner_uranium');
        unlock('build-nuclearreactor');
        unlock('box-uranium');
        unlock('tech-rocketry');
    }

    if (G.tech.rocketry.researched) {
        unlock('job-refiner');
        unlock('build-launchpad');
        unlock('box-rocketfuel');
        unlock('tech-genetics');
    }

    if (G.tech.genetics.researched) {
        unlock('job-geneticist');
        unlock('build-cryochamber');
        unlock('tech-nanotechnology');
    }

    if (G.tech.nanotechnology.researched) {
        unlock('job-nanobuilder');
        unlock('job-synthesizer');
        unlock('box-nanobots');
        unlock('box-superalloy');
        unlock('tech-antimatterphysics');
    }

    if (G.tech.antimatterphysics.researched) {
        unlock('job-physicist');
        unlock('build-hadroncollider');
        unlock('box-antimatter');
        unlock('tech-spacecolonization');
    }
    
    if (G.tech.ai.researched) {
        unlock('job-aiarchitect');
    }

    if (G.tech.spacecolonization.researched) {
        unlock('build-spaceelevator');
    }
}

// Generate UI on load
generateJobsUI();
generateBuildingsUI();
generateTechUI();

// Start
loadGame();
setInterval(tick, C.TICK);
setInterval(saveGame, 30000);
updateUI();

console.log("✅ Game Initialized Successfully (Logic Patched)");