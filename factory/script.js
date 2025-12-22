// --- CONFIGURATION ---
const TICK_RATE = 10;
const DT = 1 / TICK_RATE;

// --- STATE DEFINITIONS ---
const resources = {
    credits: 0,
    // TIER 0
    biomass: 0, stone: 0,
    // TIER 1
    ironOre: 0, copperOre: 0, coal: 0,
    ironIngot: 0, copperIngot: 0,
    ironPlate: 0, ironRod: 0, wire: 0, cable: 0, screw: 0, concrete: 0,
    // TIER 2+
    steelIngot: 0, crudeOil: 0, plastic: 0, circuit: 0, motor: 0,
    bauxite: 0, aluminumIngot: 0, computer: 0,
    uraniumOre: 0, uraniumCell: 0, nuclearWaste: 0, fusionCore: 0
};

// Tracks how much resource changes per second
let resourceRates = {}; 

let gameState = {
    stage: 0,
    systemReady: false,
    power: { produced: 0, demanded: 0, efficiency: 1.0 },
    buildings: {} 
};

// --- DATA ---
const tabs = [
    { id: 'power', icon: '⚡', name: 'Power' },
    { id: 'extraction', icon: '⛏️', name: 'Extraction' },
    { id: 'smelting', icon: '🔥', name: 'Smelting' },
    { id: 'production', icon: '⚙️', name: 'Factory' },
    { id: 'advanced', icon: '📟', name: 'High-Tech' },
    { id: 'nuclear', icon: '☢️', name: 'Nuclear' }
];

const buildingDefs = {
    // TIER 0 - Starting Buildings
    genBiomass: { name: "Biomass Burner", stage: 0, tab: 'power', cost: { stone: 5 }, power: 15, inputs: { biomass: 0.5 }, outputs: {} },
    windTurbine: { name: "Wind Turbine", stage: 0, tab: 'power', cost: { ironPlate: 15, wire: 10 }, power: 5, inputs: {}, outputs: {} },
    
    drillIron: { name: "Iron Drill", stage: 0, tab: 'extraction', cost: { credits: 50 }, power: -2.5, inputs: {}, outputs: { ironOre: 1 } },
    drillCopper: { name: "Copper Drill", stage: 0, tab: 'extraction', cost: { credits: 80 }, power: -2.5, inputs: {}, outputs: { copperOre: 1 } },
    drillStone: { name: "Quarry Drill", stage: 0, tab: 'extraction', cost: { credits: 50 }, power: -2.5, inputs: {}, outputs: { stone: 1 } },
    
    smelterIron: { name: "Iron Smelter", stage: 0, tab: 'smelting', cost: { ironOre: 20 }, power: -4, inputs: { ironOre: 1 }, outputs: { ironIngot: 1 } },
    smelterCopper: { name: "Copper Smelter", stage: 0, tab: 'smelting', cost: { ironOre: 20 }, power: -4, inputs: { copperOre: 1 }, outputs: { copperIngot: 1 } },
    
    constPlate: { name: "Plate Press", stage: 0, tab: 'production', cost: { ironIngot: 20 }, power: -4, inputs: { ironIngot: 2 }, outputs: { ironPlate: 2 } },
    constRod: { name: "Rod Former", stage: 0, tab: 'production', cost: { ironIngot: 15 }, power: -3, inputs: { ironIngot: 1 }, outputs: { ironRod: 2 } },
    constWire: { name: "Wire Cabler", stage: 0, tab: 'production', cost: { copperIngot: 10 }, power: -4, inputs: { copperIngot: 1 }, outputs: { wire: 2 } },
    constScrew: { name: "Screw Factory", stage: 0, tab: 'production', cost: { ironRod: 20 }, power: -3, inputs: { ironRod: 1 }, outputs: { screw: 4 } },
    constCable: { name: "Cable Machine", stage: 0, tab: 'production', cost: { wire: 30 }, power: -4, inputs: { wire: 2 }, outputs: { cable: 1 } },

    // MILESTONE 1
    milestone1: { name: "UNLOCK: Coal Power", stage: 0, tab: 'production', type: 'milestone', cost: { ironPlate: 100, wire: 100 }, unlocks: 1 },
    
    // TIER 1 - Coal Era
    drillCoal: { name: "Coal Miner", stage: 1, tab: 'extraction', cost: { credits: 200, ironPlate: 50 }, power: -5, inputs: {}, outputs: { coal: 1 } },
    genCoal: { name: "Coal Generator", stage: 1, tab: 'power', cost: { ironPlate: 50, wire: 50 }, power: 50, inputs: { coal: 1 }, outputs: {} },
    
    foundrySteel: { name: "Steel Foundry", stage: 1, tab: 'smelting', cost: { ironPlate: 100, concrete: 50 }, power: -15, inputs: { ironIngot: 3, coal: 2 }, outputs: { steelIngot: 2 } },
    constConcrete: { name: "Cement Mixer", stage: 1, tab: 'production', cost: { ironPlate: 20 }, power: -8, inputs: { stone: 3 }, outputs: { concrete: 1 } },
    
    // MILESTONE 2
    milestone2: { name: "UNLOCK: Oil & Plastic", stage: 1, tab: 'production', type: 'milestone', cost: { steelIngot: 200, concrete: 200 }, unlocks: 2 },
    
    // TIER 2 - Oil Era
    pumpOil: { name: "Oil Pump", stage: 2, tab: 'extraction', cost: { steelIngot: 100, motor: 5 }, power: -30, inputs: {}, outputs: { crudeOil: 1 } },
    refineryPlastic: { name: "Plastic Refinery", stage: 2, tab: 'production', cost: { steelIngot: 50, ironPlate: 100 }, power: -25, inputs: { crudeOil: 1 }, outputs: { plastic: 2 } },
    
    assemblerMotor: { name: "Motor Factory", stage: 2, tab: 'production', cost: { steelIngot: 50, wire: 100 }, power: -15, inputs: { ironRod: 2, wire: 4 }, outputs: { motor: 1 } },
    assemblerCircuit: { name: "Circuit Assembler", stage: 2, tab: 'advanced', cost: { ironPlate: 50, wire: 100 }, power: -10, inputs: { copperIngot: 2, plastic: 1 }, outputs: { circuit: 1 } },
    
    // MILESTONE 3
    milestone3: { name: "UNLOCK: Advanced Tech", stage: 2, tab: 'advanced', type: 'milestone', cost: { circuit: 200, motor: 100 }, unlocks: 3 },
    
    // TIER 3 - High Tech
    drillBauxite: { name: "Bauxite Miner", stage: 3, tab: 'extraction', cost: { credits: 1000, steelIngot: 200 }, power: -40, inputs: {}, outputs: { bauxite: 1 } },
    smelterAluminum: { name: "Alum. Smelter", stage: 3, tab: 'smelting', cost: { steelIngot: 200, circuit: 50 }, power: -60, inputs: { bauxite: 4, coal: 2 }, outputs: { aluminumIngot: 2 } },
    assemblerComputer: { name: "Computer Fab", stage: 3, tab: 'advanced', cost: { circuit: 100, plastic: 100 }, power: -100, inputs: { circuit: 5, plastic: 3, cable: 2 }, outputs: { computer: 1 } },
    
    // MILESTONE 4
    milestone4: { name: "UNLOCK: Nuclear Age", stage: 3, tab: 'advanced', type: 'milestone', cost: { computer: 100, aluminumIngot: 500 }, unlocks: 4 },
    
    // TIER 4 - Nuclear
    drillUranium: { name: "Uranium Miner", stage: 4, tab: 'extraction', cost: { credits: 5000, computer: 10 }, power: -200, inputs: {}, outputs: { uraniumOre: 1 } },
    centrifuge: { name: "Centrifuge", stage: 4, tab: 'nuclear', cost: { aluminumIngot: 500, computer: 50 }, power: -150, inputs: { uraniumOre: 5 }, outputs: { uraniumCell: 1 } },
    genNuclear: { name: "Nuclear Reactor", stage: 4, tab: 'nuclear', cost: { concrete: 2000, steelIngot: 1000, computer: 50 }, power: 5000, inputs: { uraniumCell: 0.1 }, outputs: { nuclearWaste: 0.1 } },
    
    wasteProcessor: { name: "Waste Recycler", stage: 4, tab: 'nuclear', cost: { aluminumIngot: 1000, computer: 100 }, power: -300, inputs: { nuclearWaste: 1 }, outputs: { uraniumOre: 2 } },
    
    projectAssembly: { name: "PROJECT ASSEMBLY", stage: 4, tab: 'advanced', cost: { computer: 500, aluminumIngot: 1000, fusionCore: 1 }, power: 0, inputs: {}, outputs: {} }
};

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    try {
        // 1. Setup State
        for(const key of Object.keys(buildingDefs)) {
            gameState.buildings[key] = { count: 0, active: true, efficiency: 0, def: buildingDefs[key] };
        }
        
        // 2. Load Save or Set Defaults
        loadGame();

        // 3. Build UI
        initMarket();
        rebuildTabs();
        updateMilestoneUI();
        updateStageDisplay();

        // 4. Mark System Ready
        gameState.systemReady = true;

        // 5. Start Loops
        setInterval(gameLoop, 1000 / TICK_RATE);
        setInterval(saveGame, 30000); // Auto-save every 30s
        
    } catch (e) {
        console.error("CRITICAL INIT FAILURE:", e);
        alert("Game failed to load. Please check console or refresh.");
    }
});

// --- CORE GAME LOOP ---
function gameLoop() {
    if (!gameState.systemReady) return;

    // Reset rates for this frame
    for(const k in resources) resourceRates[k] = 0;

    let gen = 0, drain = 0;

    // 1. Power Calculation - Generators First
    for (const [key, b] of Object.entries(gameState.buildings)) {
        if (b.count === 0 || !b.active) continue;
        const def = b.def;
        
        if (def.power > 0) {
            let fuelEff = 1.0;
            // Check if we have fuel (Partial consumption logic)
            for (const [res, qty] of Object.entries(def.inputs)) {
                const needed = qty * b.count * DT;
                if(resources[res] < needed) {
                    const availablePct = resources[res] / needed;
                    fuelEff = Math.min(fuelEff, availablePct);
                }
            }
            // Consume fuel and generate power
            if (fuelEff > 0) {
                for (const [res, qty] of Object.entries(def.inputs)) {
                    const consumption = (qty * b.count * DT * fuelEff);
                    resources[res] -= consumption;
                    resourceRates[res] -= (qty * b.count * fuelEff); 
                }
                gen += (def.power * b.count * fuelEff);
            }
            b.efficiency = fuelEff;
        } else if (def.power < 0) {
            drain += Math.abs(def.power) * b.count;
        }
    }

    // 2. Calculate Grid Efficiency
    gameState.power.produced = gen;
    gameState.power.demanded = drain;
    const gridEff = (drain === 0) ? 1.0 : (gen >= drain ? 1.0 : gen / drain);
    gameState.power.efficiency = gridEff;

    // 3. Production Phase (Now with Smoothing)
    for (const [key, b] of Object.entries(gameState.buildings)) {
        if (b.count === 0 || !b.active || b.def.type === 'milestone') continue;
        const def = b.def;
        
        // Skip generators
        if (def.power > 0) continue;

        let opEff = gridEff; // Start with power constraint
        
        // Input Constraint Check (Partial Efficiency)
        // We find the limiting resource and scale down production to match it
        for (const [res, qty] of Object.entries(def.inputs)) {
            const needed = qty * b.count * DT * opEff;
            if (resources[res] < needed) {
                const availablePct = resources[res] / needed;
                opEff = Math.min(opEff, availablePct * opEff);
            }
        }

        // Execute production
        if (opEff > 0) {
            for (const [res, qty] of Object.entries(def.inputs)) {
                resources[res] -= (qty * b.count * DT * opEff);
                resourceRates[res] -= (qty * b.count * opEff); 
            }
            for (const [res, qty] of Object.entries(def.outputs)) {
                resources[res] += (qty * b.count * DT * opEff);
                resourceRates[res] += (qty * b.count * opEff); 
            }
        }
        
        b.efficiency = opEff;
    }

    // 4. Sanity Check & UI Update
    for (const k in resources) {
        if (resources[k] < 0) resources[k] = 0;
    }
    updateUI();
}

// --- SAVE SYSTEM ---
function saveGame() {
    const saveObj = {
        resources: resources,
        buildings: gameState.buildings,
        stage: gameState.stage,
        lastSaveTime: Date.now() // Timestamp for offline progress
    };
    localStorage.setItem('factoryOS_save', JSON.stringify(saveObj));
    
    // Visual feedback
    const status = document.getElementById('save-status');
    if(status) {
        status.innerText = "Saved...";
        setTimeout(() => status.innerText = "", 2000);
    }
}

function loadGame() {
    const saveStr = localStorage.getItem('factoryOS_save');
    if (saveStr) {
        try {
            const data = JSON.parse(saveStr);
            // Merge resources
            Object.assign(resources, data.resources);
            gameState.stage = data.stage || 0;
            
            // Merge buildings
            for(const [k, b] of Object.entries(data.buildings)) {
                if(gameState.buildings[k]) {
                    gameState.buildings[k].count = b.count;
                    gameState.buildings[k].active = (b.active !== undefined) ? b.active : true;
                }
            }
            console.log("Save Loaded.");

            // CHECK OFFLINE PROGRESS
            if (data.lastSaveTime) {
                handleOfflineProgress(data.lastSaveTime);
            }

        } catch(e) {
            console.error("Save Corrupt", e);
        }
    } else {
        // Defaults
        gameState.buildings['genBiomass'].count = 1; 
        gameState.buildings['drillIron'].count = 1;
        resources.credits = 150; 
    }
}

// --- OFFLINE LOGIC ---
function handleOfflineProgress(lastTime) {
    const now = Date.now();
    const secondsOffline = (now - lastTime) / 1000;

    // Minimum 10 seconds to trigger calculation
    if (secondsOffline < 10) return;

    // 1. Run ONE tick of the game loop to determine current rates
    // We backup resources first because gameLoop is destructive
    const backupRes = { ...resources };
    
    // Temporarily mark system ready to allow loop to run logic
    gameState.systemReady = true;
    gameLoop(); 
    gameState.systemReady = false; // Pause back until init finishes

    // restore resources
    Object.assign(resources, backupRes);

    // 2. Calculate the limiting factor (Input Starvation)
    // If we are consuming Coal at -2/s and have 100 Coal, we can only run for 50s.
    let maxTime = secondsOffline;
    let limitingResource = null;

    for (const [res, rate] of Object.entries(resourceRates)) {
        if (rate < 0) { // Consuming
            const timeUntilEmpty = resources[res] / Math.abs(rate);
            if (timeUntilEmpty < maxTime) {
                maxTime = timeUntilEmpty;
                limitingResource = res;
            }
        }
    }

    // 3. Apply Resources
    let gains = [];
    if (maxTime > 0) {
        for (const [res, rate] of Object.entries(resourceRates)) {
            const amount = rate * maxTime;
            resources[res] += amount;
            if (amount !== 0) {
                // Formatting for display
                if (Math.abs(amount) > 1) {
                    gains.push(`${amount > 0 ? '+' : ''}${Math.floor(amount)} ${formatName(res)}`);
                }
            }
        }
    }

    // 4. Notify User
    let msg = `SYSTEM REBOOT: You were offline for ${formatTime(secondsOffline)}.\n`;
    if (limitingResource) {
        msg += `⚠️ Production halted after ${formatTime(maxTime)} due to lack of ${formatName(limitingResource)}.\n`;
    }
    if (gains.length > 0) {
        msg += `\nChanges:\n` + gains.slice(0, 10).join('\n') + (gains.length > 10 ? '\n...and more' : '');
    } else {
        msg += `No significant production occurred.`;
    }

    alert(msg);
}

function formatTime(sec) {
    if (sec < 60) return `${Math.floor(sec)}s`;
    if (sec < 3600) return `${Math.floor(sec/60)}m ${Math.floor(sec%60)}s`;
    return `${Math.floor(sec/3600)}h ${Math.floor((sec%3600)/60)}m`;
}

// --- ACTIONS ---
window.scavenge = function() {
    resources.biomass += 2;
    resources.stone += 2;
    updateUI();
};

window.hardReset = function() {
    if(confirm("Wipe save and restart? This cannot be undone.")) {
        localStorage.removeItem('factoryOS_save');
        location.reload();
    }
};

window.sellResource = function(key, amt) {
    if (resources[key] >= amt) {
        resources[key] -= amt;
        resources.credits += (getPrice(key) * amt);
        updateUI();
    }
};

window.build = function(key) {
    const cost = getCost(key);
    if (checkAfford(cost)) {
        payCost(cost);
        if (buildingDefs[key].type === 'milestone') {
            advanceStage(buildingDefs[key].unlocks);
        } else {
            gameState.buildings[key].count++;
        }
        updateUI();
        saveGame(); // Save on build
    }
};

window.toggle = function(key, el) {
    gameState.buildings[key].active = el.checked;
};

window.switchTab = function(id, navEl) {
    document.querySelectorAll('.tab-content').forEach(e => e.classList.remove('active-tab'));
    const targetTab = document.getElementById(`tab-${id}`);
    if(targetTab) targetTab.classList.add('active-tab');
    document.querySelectorAll('.nav-item').forEach(e => e.classList.remove('active'));
    navEl.classList.add('active');
};

function advanceStage(n) {
    gameState.stage = n;
    updateStageDisplay();
    rebuildTabs();
    updateMilestoneUI();
    saveGame();
}

function updateStageDisplay() {
    const stageEl = document.getElementById('current-stage');
    if(stageEl) stageEl.innerText = gameState.stage;
}

// --- UI BUILDERS ---
function initMarket() {
    const mkt = document.getElementById('market-buttons');
    if(!mkt) return;
    mkt.innerHTML = '';
    
    const sellList = ['ironOre', 'copperOre', 'coal', 'ironIngot', 'copperIngot', 'steelIngot', 'plastic', 'circuit'];
    sellList.forEach(r => {
        const price = getPrice(r) * 10;
        const btn = document.createElement('div');
        btn.className = 'market-row';
        btn.id = `mkt-btn-${r}`; // ID for live updates
        btn.onclick = () => sellResource(r, 10);
        btn.innerHTML = `
            <div class="mkt-left">
                <span class="mkt-icon">📦</span>
                <span class="mkt-name">10 ${formatName(r)}</span>
            </div>
            <div class="mkt-right">
                <span class="mkt-price">+${price}</span>
                <span class="mkt-currency">MC</span>
            </div>
        `;
        mkt.appendChild(btn);
    });
}

function rebuildTabs() {
    const nav = document.getElementById('nav-list');
    nav.innerHTML = '';
    const container = document.getElementById('tab-container');
    container.innerHTML = '';

    tabs.forEach(t => {
        if (t.id === 'nuclear' && gameState.stage < 4) return;
        if (t.id === 'advanced' && gameState.stage < 2) return;

        const li = document.createElement('li');
        li.className = 'nav-item';
        li.innerHTML = `${t.icon} ${t.name}`;
        li.onclick = () => switchTab(t.id, li);
        nav.appendChild(li);

        const div = document.createElement('div');
        div.id = `tab-${t.id}`;
        div.className = 'tab-content';
        div.innerHTML = `<h2 class="tab-header">${t.name}</h2><div class="grid-container" id="grid-${t.id}"></div>`;
        container.appendChild(div);

        // Populate Grid
        const grid = div.querySelector('.grid-container');
        for (const [key, def] of Object.entries(buildingDefs)) {
            if (def.tab !== t.id) continue;
            if (def.stage > gameState.stage) continue;
            if (def.type === 'milestone' && def.unlocks <= gameState.stage) continue;
            grid.appendChild(createCard(key, def));
        }
    });
    
    // Select first tab if none active
    if(!document.querySelector('.active-tab') && nav.firstChild) {
        nav.firstChild.click();
    }
}

function createCard(key, def) {
    const d = document.createElement('div');
    d.className = 'card';
    const ins = fmtIO(def.inputs);
    const outs = fmtIO(def.outputs);
    const pwr = def.power > 0 ? `<span class="t-green">+${def.power} MW</span>` : (def.power < 0 ? `<span class="t-red">${def.power} MW</span>` : '');

    const isChecked = gameState.buildings[key].active ? 'checked' : '';

    d.innerHTML = `
        <div class="card-top">
            <div>
                <div class="b-title">${def.name}</div>
                <div class="b-sub">${def.type==='milestone'?'RESEARCH':`Tier ${def.stage}`} &nbsp; ${pwr}</div>
            </div>
            ${def.type!=='milestone' ? `<div class="b-count" id="count-${key}">0</div>` : ''}
        </div>
        ${def.type!=='milestone' ? `<div class="prog-bar"><div class="prog-fill" id="fill-${key}"></div></div>` : ''}
        <div class="io-box">
            ${def.type==='milestone' ? '<div style="color:#fff;margin-bottom:5px">🔓 Unlocks New Technology</div>' : ''}
            <div class="io-row"><span class="t-mute">Base IN: ${ins}</span></div>
            <div class="io-row"><span class="t-white">Base OUT: ${outs}</span></div>
            
            ${def.type!=='milestone' ? `<div id="stats-${key}" class="live-stats"></div>` : ''}
        </div>
        <div class="card-actions">
            <button class="build-btn" id="btn-${key}" onclick="build('${key}')">
                ${def.type==='milestone'?'🔬 UNLOCK':'🔨 BUILD'} <div class="cost-text" id="cost-${key}"></div>
            </button>
            ${def.type!=='milestone' ? `<div class="toggle-wrap"><input type="checkbox" class="tgl-inp" id="tgl-${key}" ${isChecked} onchange="toggle('${key}',this)"><label for="tgl-${key}" class="tgl-lbl"></label></div>` : ''}
        </div>
    `;
    return d;
}

// --- UPDATE LOOPS ---
function updateUI() {
    if(!gameState.systemReady) return;

    // Sidebar Manual
    const bioDisp = document.getElementById('manual-status');
    if(bioDisp) bioDisp.innerHTML = `Biomass: ${Math.floor(resources.biomass)} | Stone: ${Math.floor(resources.stone)}`;
    
    // --- POWER DISPLAY UPDATES ---
    const produced = Math.floor(gameState.power.produced);
    const demanded = Math.floor(gameState.power.demanded);

    // 1. Text: "Load / Capacity"
    document.getElementById('power-val').innerText = `${demanded} / ${produced} MW`;

    // 2. Bar Logic
    const bar = document.getElementById('power-bar');
    let pct = 0;
    
    if (produced > 0) {
        pct = (demanded / produced) * 100;
    } else if (demanded > 0) {
        pct = 100;
    }

    bar.style.width = `${Math.min(pct,100)}%`;

    // 3. Color Logic
    if (demanded > produced) {
        bar.style.background = 'var(--danger)'; 
    } else if (pct > 90) {
        bar.style.background = '#f59e0b'; // Gold/Orange
    } else {
        bar.style.background = 'var(--power)'; 
    }

    document.getElementById('credit-display').innerText = Math.floor(resources.credits);

    // Ticker 
    const tick = document.getElementById('storage-ticker');
    let html = '';
    for(const [r,v] of Object.entries(resources)) {
        if(v > 0.01 && !['credits','biomass','stone'].includes(r)) {
            const rate = resourceRates[r] || 0;
            let rateStr = '';
            if (rate > 0.05) rateStr = `<span class="rate-pos">(+${rate.toFixed(1)}/s)</span>`;
            else if (rate < -0.05) rateStr = `<span class="rate-neg">(${rate.toFixed(1)}/s)</span>`;
            
            html += `<div class="res-pill"><span>${formatName(r)}</span> ${Math.floor(v)} ${rateStr}</div>`;
        }
    }
    tick.innerHTML = html || '<div class="res-pill" style="opacity:0.5">No resources in storage</div>';

    // Market Buttons (Visual Feedback)
    const sellList = ['ironOre', 'copperOre', 'coal', 'ironIngot', 'copperIngot', 'steelIngot', 'plastic', 'circuit'];
    sellList.forEach(r => {
        const btn = document.getElementById(`mkt-btn-${r}`);
        if(btn) {
            if(resources[r] >= 10) {
                btn.style.opacity = '1';
                btn.style.cursor = 'pointer';
            } else {
                btn.style.opacity = '0.4';
                btn.style.cursor = 'default';
            }
        }
    });

    // Buildings
    for(const [key, b] of Object.entries(gameState.buildings)) {
        const btn = document.getElementById(`btn-${key}`);
        if(!btn) continue;
        
        // Costs
        const cost = getCost(key);
        let costArr = [];
        for(const [r,v] of Object.entries(cost)) {
            costArr.push(`${v} ${r==='credits'?'MC':formatName(r)}`);
        }
        const costEl = document.getElementById(`cost-${key}`);
        if(costEl) costEl.innerText = costArr.join(', ');

        // Button State
        const canAfford = checkAfford(cost);
        btn.disabled = !canAfford;
        btn.style.opacity = canAfford ? 1 : 0.5;

        // Progress Bars & Counts
        if(b.def.type !== 'milestone') {
            const countEl = document.getElementById(`count-${key}`);
            if(countEl) countEl.innerText = b.count;
            
            const fill = document.getElementById(`fill-${key}`);
            if(fill) {
                if(!b.active) { 
                    fill.style.width='100%'; 
                    fill.style.background='#64748b'; 
                } else {
                    fill.style.width = `${b.efficiency*100}%`;
                    if(b.def.power > 0) {
                        fill.style.background = (b.efficiency === 0) ? 'var(--danger)' : 'var(--success)';
                    } else {
                        fill.style.background = (b.efficiency > 0.9) ? 'var(--success)' : (b.efficiency > 0 ? '#fbbf24' : 'var(--danger)');
                    }
                }
            }

            // LIVE STATS UPDATE
            const statsEl = document.getElementById(`stats-${key}`);
            if(statsEl) {
                if (b.count > 0 && b.active) {
                    let statHtml = '';
                    
                    // Total Input Rate
                    if(Object.keys(b.def.inputs).length > 0) {
                        const inText = Object.entries(b.def.inputs)
                            .map(([r, q]) => `${(q * b.count * b.efficiency).toFixed(1)} ${formatName(r)}`)
                            .join(', ');
                        statHtml += `<div class="stat-row down">▼ ${inText}/s</div>`;
                    }
                    // Total Output Rate
                    if(Object.keys(b.def.outputs).length > 0) {
                        const outText = Object.entries(b.def.outputs)
                            .map(([r, q]) => `${(q * b.count * b.efficiency).toFixed(1)} ${formatName(r)}`)
                            .join(', ');
                        statHtml += `<div class="stat-row up">▲ ${outText}/s</div>`;
                    }
                    statsEl.innerHTML = statHtml;
                    statsEl.style.display = 'block';
                } else if (b.count > 0 && !b.active) {
                    statsEl.innerHTML = '<span style="opacity:0.5; font-size:0.7em">-- OFFLINE --</span>';
                    statsEl.style.display = 'block';
                } else {
                    statsEl.style.display = 'none';
                }
            }
        }
    }
}

function updateMilestoneUI() {
    let nextMS = null;
    for(const [k, d] of Object.entries(buildingDefs)) {
        if (d.type === 'milestone' && d.unlocks > gameState.stage) { 
            nextMS = d; 
            break; 
        }
    }
    const title = document.getElementById('ms-desc');
    const req = document.getElementById('ms-req');
    if(nextMS) {
        title.innerText = nextMS.name;
        let arr = [];
        for(const [r,v] of Object.entries(nextMS.cost)) {
            arr.push(`${v} ${formatName(r)}`);
        }
        req.innerText = "Req: " + arr.join(', ');
    } else {
        title.innerText = "All Technologies Unlocked";
        req.innerText = "🎯 Goal: Build Project Assembly";
    }
}

// --- HELPERS ---
function getCost(key) {
    const def = buildingDefs[key];
    if(def.type === 'milestone') return def.cost;
    const mult = Math.pow(1.15, gameState.buildings[key].count);
    let c = {};
    for(const [r,v] of Object.entries(def.cost)) {
        c[r] = Math.ceil(v * mult);
    }
    return c;
}

function checkAfford(c) { 
    for(const r in c) {
        if(resources[r] < c[r]) return false;
    }
    return true;
}

function payCost(c) { 
    for(const r in c) resources[r] -= c[r];
}

function getPrice(r) { 
    const prices = {
        ironOre: 1, copperOre: 1, stone: 0.5,
        coal: 2, ironIngot: 2, copperIngot: 2,
        ironPlate: 3, wire: 3, cable: 5,
        steelIngot: 10, plastic: 12, circuit: 15,
        motor: 20, computer: 50
    };
    return prices[r] || 1;
}

function formatName(s) { 
    return s.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim();
}

function fmtIO(obj) { 
    if(!obj || Object.keys(obj).length === 0) return '-';
    return Object.entries(obj).map(([k,v]) => `${v} ${formatName(k)}`).join(', ');
}