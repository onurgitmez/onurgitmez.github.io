import { TICK_RATE, buildingDefs } from './data.js';
import { resources, resourceRates, gameState } from './state.js';
import { initMarket, rebuildTabs, updateMilestoneUI, updateStageDisplay, updateUI } from './ui.js';
import { gameLoop } from './engine.js';
import { getCost, checkAfford, payCost, getPrice, formatName, formatTime } from './utils.js';

// Global Actions (Bound to window so inline HTML onclicks still work)
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
        saveGame();
    }
};

window.toggle = function(key, el) {
    gameState.buildings[key].active = el.checked;
};

function advanceStage(n) {
    gameState.stage = n;
    updateStageDisplay();
    rebuildTabs();
    updateMilestoneUI();
    saveGame();
}

// Storage Logic
function saveGame() {
    const saveObj = { resources, buildings: gameState.buildings, stage: gameState.stage, lastSaveTime: Date.now() };
    localStorage.setItem('factoryOS_save', JSON.stringify(saveObj));
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
            Object.assign(resources, data.resources);
            gameState.stage = data.stage || 0;
            for(const [k, b] of Object.entries(data.buildings)) {
                if(gameState.buildings[k]) {
                    gameState.buildings[k].count = b.count;
                    gameState.buildings[k].active = (b.active !== undefined) ? b.active : true;
                }
            }
            if (data.lastSaveTime) handleOfflineProgress(data.lastSaveTime);
        } catch(e) { console.error("Save Corrupt", e); }
    } else {
        gameState.buildings['genBiomass'].count = 1; 
        gameState.buildings['drillIron'].count = 1;
        resources.credits = 150; 
    }
}

function handleOfflineProgress(lastTime) {
    const secondsOffline = (Date.now() - lastTime) / 1000;
    if (secondsOffline < 10) return;

    const backupRes = { ...resources };
    gameState.systemReady = true;
    gameLoop(); 
    gameState.systemReady = false; 
    Object.assign(resources, backupRes);

    let maxTime = secondsOffline;
    let limitingResource = null;

    for (const [res, rate] of Object.entries(resourceRates)) {
        if (rate < 0) {
            const timeUntilEmpty = resources[res] / Math.abs(rate);
            if (timeUntilEmpty < maxTime) {
                maxTime = timeUntilEmpty;
                limitingResource = res;
            }
        }
    }

    let gains = [];
    if (maxTime > 0) {
        for (const [res, rate] of Object.entries(resourceRates)) {
            const amount = rate * maxTime;
            resources[res] += amount;
            if (Math.abs(amount) > 1) gains.push(`${amount > 0 ? '+' : ''}${Math.floor(amount)} ${formatName(res)}`);
        }
    }

    let msg = `SYSTEM REBOOT: Offline for ${formatTime(secondsOffline)}.\n`;
    if (limitingResource) msg += `⚠️ Production halted after ${formatTime(maxTime)} due to lack of ${formatName(limitingResource)}.\n`;
    msg += gains.length > 0 ? `\nChanges:\n` + gains.slice(0, 10).join('\n') + (gains.length > 10 ? '\n...and more' : '') : `No significant production occurred.`;
    alert(msg);
}

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    try {
        for(const key of Object.keys(buildingDefs)) {
            gameState.buildings[key] = { count: 0, active: true, efficiency: 0, def: buildingDefs[key] };
        }
        loadGame();
        initMarket();
        rebuildTabs();
        updateMilestoneUI();
        updateStageDisplay();
        
        gameState.systemReady = true;
        
        setInterval(gameLoop, 1000 / TICK_RATE);
        setInterval(saveGame, 30000); 
    } catch (e) {
        console.error("CRITICAL INIT FAILURE:", e);
        alert("Game failed to load. Please check console or refresh.");
    }
});