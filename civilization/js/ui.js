import { G } from './state.js';
import { C, ACHIEVEMENTS } from './config.js';
import { formatTime, formatNumber, log } from './utils.js';
import { getNetRate, getCost } from './engine.js';

// ===== UI GENERATION =====
export function generateJobsUI() {
    const container = document.getElementById('jobs-container');
    if(!container) return;
    
    // (We map the job descriptions here to keep the config file clean of UI strings)
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
                    <button class="job-btn" onclick="window.adjustJob('${key}', -10)">-10</button>
                    <button class="job-btn" onclick="window.adjustJob('${key}', -1)">-1</button>
                    <span style="min-width:40px; text-align:center; font-weight:700;" id="count-${key}">0</span>
                    <button class="job-btn" onclick="window.adjustJob('${key}', 1)">+1</button>
                    <button class="job-btn" onclick="window.adjustJob('${key}', 10)">+10</button>
                </div>
            </div>
        `;
    }
    container.innerHTML = html;
}

export function generateBuildingsUI() {
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
                <button id="btn-${key}" class="btn-action" onclick="window.buildStructure('${key}')">
                    <span id="${key}-cost">...</span>
                    <span class="build-max" onclick="window.buildMax(event, '${key}')">MAX</span>
                </button>
            </div>
        `;
    }
    container.innerHTML = html;
}

export function generateTechUI() {
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
                <button id="btn-tech-${key}" class="btn-action" onclick="window.purchaseTech('${key}')">${formatNumber(cost)} Science</button>
            </div>
        `;
    }
    container.innerHTML = html;
}

// ===== UI UPDATES =====
export function updateUI() {
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
        if(curEl) curEl.innerText = formatNumber(Math.floor(G.res[r].cur));
        if(maxEl) maxEl.innerText = formatNumber(G.res[r].max);
        if(barEl) barEl.style.width = Math.min(100, (G.res[r].cur / G.res[r].max) * 100) + "%";
        
        if(rateEl) {
            const rate = getNetRate(r);
            rateEl.innerText = (rate >= 0 ? "+" : "") + formatNumber(rate) + "/s";
            rateEl.style.color = rate > 0 ? "var(--accent-food)" : rate < 0 ? "var(--accent-danger)" : "#555";
        }
    }
    
    // Update population
    let maxPopEl = document.getElementById('pop-max');
    // Calculate max pop dynamically (from engine.js)
    import('./engine.js').then(module => {
        if(maxPopEl) maxPopEl.innerText = formatNumber(module.getMaxPop());
        
        const btnRecruit = document.getElementById('btn-recruit');
        if(btnRecruit) btnRecruit.disabled = G.res.food.cur < C.COST_VILLAGER || G.pop.total >= module.getMaxPop();
    });

    document.getElementById('pop-total').innerText = formatNumber(G.pop.total);
    document.getElementById('pop-idle').innerText = formatNumber(G.pop.idle);
    document.getElementById('current-era').innerText = G.era;
    
    // Update prestige
    if(G.prestigeLevel > 0) {
        document.getElementById('prestige-level').style.display = 'block';
        document.getElementById('prestige-count').innerText = G.prestigeLevel;
    }
    
    // Update job counts  
    for(let job in G.pop) {
        if(job === 'total' || job === 'idle') continue;
        const el = document.getElementById(`count-${job}`);
        if(el) el.innerText = formatNumber(G.pop[job]);
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
        if(countEl) countEl.innerText = formatNumber(G.bld[b].count);
        
        const btn = document.getElementById(`btn-${b}`);
        const costEl = document.getElementById(`${b}-cost`);
        if(btn && costEl) {
            const costs = getCost(b);
            let str = "";
            let canAfford = true;
            for(let res in costs) {
                if(!G.res[res]) continue;
                str += `${formatNumber(costs[res])} ${res}, `;
                if(G.res[res].cur < costs[res]) canAfford = false;
            }
            costEl.innerText = str.slice(0, -2);
            btn.disabled = !canAfford;
        }
    }
    
    updateAchievements();
    updateStatistics();
}

export function showEventNotification(event) {
    const notif = document.createElement('div');
    notif.className = `event-notification ${event.type === 'good' ? 'positive' : 'negative'}`;
    notif.innerHTML = `
        <div class="event-title">${event.name}</div>
        <div class="event-desc">${event.desc}</div>
    `;
    document.body.appendChild(notif);
    setTimeout(() => notif.remove(), 4000);
}

export function showAchievement(key) {
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

export function updateAchievements() {
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

export function updateStatistics() {
    const container = document.getElementById('stats-container');
    if(!container) return;
    
    const stats = [
        { title: "Time Played", value: formatTime(G.stats.timePlayed) },
        { title: "Total Resources", value: formatNumber(G.stats.totalResourcesGathered) },
        { title: "Manual Clicks", value: formatNumber(G.stats.manualClicks) },
        { title: "Buildings Built", value: formatNumber(G.stats.buildingsConstructed) },
        { title: "Tech Researched", value: formatNumber(G.stats.techResearched) },
        { title: "Villagers Recruited", value: formatNumber(G.stats.villagersRecruited) },
        { title: "Current Era", value: G.era },
        { title: "Highest Era", value: G.stats.eraReached },
        { title: "Prestige Level", value: G.prestigeLevel },
        { title: "Production Bonus", value: `+${(G.prestigeLevel * 5)}%` },
        { title: "Achievements", value: `${G.stats.achievementsUnlocked}/${Object.keys(ACHIEVEMENTS).length}` },
        { title: "Current Population", value: formatNumber(G.pop.total) }
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

export function switchTab(tab, event) {
    document.querySelectorAll('.content-area').forEach(e => e.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(e => e.classList.remove('active'));
    document.getElementById(`tab-${tab}`).classList.add('active');
    event.target.classList.add('active');
}

export function checkUnlocks() {
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