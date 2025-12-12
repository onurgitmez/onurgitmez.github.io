// --- Math & Logic ---

function getMultiplier(i) {
    let m = 1;
    const b = businesses[i];
    
    // Upgrade Multipliers
    upgrades.forEach(u => {
        if (u.level > 0) {
            if (u.biz === i || u.tier === b.tier || u.tier === -1) {
                m *= Math.pow(u.mult, u.level);
            }
        }
    });
    
    // Synergy Multipliers
    synergies.forEach(([b1, b2, bonus]) => {
        if (b2 === i && businesses[b1].count > 0) {
            const researchBonus = game.researchUnlocked.includes('res_synergy') ? 1.5 : 1;
            m *= (1 + (bonus * researchBonus));
        }
    });
    
    // NERF: Milestone Bonus reduced from 1.25 to 1.1
    // NERF: Prestige Bonus reduced from 1.3 to 1.2
    const milestoneBonus = game.prestigeLevel >= 10 ? 1.2 : 1.1;
    const milestones = [25, 50, 75, 100, 150, 200, 250, 300, 400, 500, 600, 700, 800, 900, 1000];
    milestones.forEach(ms => { if (b.count >= ms) m *= milestoneBonus; });
    
    return m;
}

function getMultiplierBreakdown(i) {
    return "Total Multiplier"; 
}

function updateIncome() {
    let inc = 0;
    businesses.forEach((b, i) => {
        inc += b.income * b.count * getMultiplier(i);
    });
    inc *= (1 + game.prestigeBonus / 100) * game.eventMultiplier * game.comboMult;
    game.totalIncome = inc;
}

function checkAchievements() {
    achievementList.forEach(a => {
        if (!game.unlockedAchievements.includes(a.id) && a.check(game, businesses, upgrades)) {
            game.unlockedAchievements.push(a.id);
            game.money += a.reward;
            showToast(`🏆 Achievement: ${a.name}!`);
        }
    });
}

// --- Global Actions ---

function buyBiz(i, e) {
    const b = businesses[i];
    const amt = settings.buyMode;
    const c = amt === 1 ? cost(b.cost, b.count) : totalCost(b.cost, b.count, amt, game.prestigeLevel, settings.buyMode);
    
    if (game.money >= c) {
        game.money -= c;
        game.totalSpent += c;
        b.count += amt;
        // NOTE: "Level" logic removed here.
        game.totalClicks++;
        
        // --- FIXED COMBO LOGIC (Capped) ---
        const now = Date.now();
        if (now - game.lastPurchase < 2000) {
            game.comboCount++;
            if (game.comboCount >= 5) {
                // Balance: Slower growth (0.05 instead of 0.1)
                let mult = 1 + (game.comboCount - 4) * 0.05;
                // Balance: Hard Cap at 2.0x
                const maxCombo = 2.0; 
                game.comboMult = Math.min(mult, maxCombo);
            }
        } else {
            game.comboCount = 1;
            game.comboMult = 1;
        }
        game.lastPurchase = now;

        updateIncome();
        checkAchievements();
        updateUIDisplay(getMultiplier, getMultiplierBreakdown);
        if (e) showFloat(e.clientX, e.clientY, `+${amt}`);
    }
}

function buyMax(i, e) {
    const b = businesses[i];
    const amt = maxBuy(b.cost, b.count, game.money);
    
    if (amt > 0) {
        const c = totalCost(b.cost, b.count, amt, game.prestigeLevel, settings.buyMode);
        
        if (game.money >= c) {
            game.money -= c;
            b.count += amt;
            updateIncome();
            updateUIDisplay(getMultiplier, getMultiplierBreakdown);
        }
    }
}

function buyUpgrade(id) {
    const u = upgrades.find(x => x.id === id);
    if (!u || u.level >= u.max) return;
    const c = u.cost * Math.pow(3, u.level);
    if (game.money >= c) {
        game.money -= c;
        u.level++;
        updateIncome();
        renderUpgrades();
        updateUIDisplay(getMultiplier, getMultiplierBreakdown);
    }
}

function buyAllUpgrades() {
    let count = 0;
    upgrades.forEach(u => {
        if (u.level < u.max) {
            const c = u.cost * Math.pow(3, u.level);
            if (game.money >= c) {
                game.money -= c;
                u.level++;
                count++;
            }
        }
    });
    if (count > 0) {
        updateIncome();
        renderUpgrades();
        updateUIDisplay(getMultiplier, getMultiplierBreakdown);
    }
}

function buyResearch(id) {
    const r = researchData.find(x => x.id === id);
    if (!r || game.researchUnlocked.includes(id)) return;
    
    if (game.knowledgePoints >= r.cost) {
        game.knowledgePoints -= r.cost;
        game.researchUnlocked.push(id);
        renderResearch(); 
        updateIncome();   
        showToast(`🧪 Researched: ${r.name}`);
        saveGame();
    }
}

function doPrestige() {
    const minRequired = 10000000;
    if (game.totalEarned < minRequired) {
        showToast(`Need $${fmt(minRequired)} total earned!`);
        return;
    }
    
    const reward = Math.floor(Math.log10(game.totalEarned / minRequired) * 5) + 5;
    const kpEarned = Math.max(1, Math.floor(reward / 5));
    
    if (!confirm(`Reset for +${reward}% income and ${kpEarned} Knowledge Points?`)) return;
    
    game.prestigeLevel++;
    game.prestigeBonus += reward;
    game.knowledgePoints += kpEarned;
    
    const keepMoney = game.researchUnlocked.includes('res_prestige');
    game.money = keepMoney ? (game.money * 0.05) : (game.prestigeLevel >= 1 ? 1000 : 20);
    
    game.totalIncome = 0;
    game.totalEarned = 0; 
    game.totalSpent = 0;
    game.startTime = Date.now();
    
    businesses.forEach((b, i) => { 
        b.count = 0; 
        b.level = 0; 
        if (game.prestigeLevel >= 2 && i < 5) b.count = 1;
    });
    
    upgrades.forEach(u => { u.level = 0; });
    
    checkAchievements();
    updateIncome();
    createUI();
    closeModal('prestige');
    showToast(`⭐ Ascended! +${kpEarned} KP`);
    
    const pDisplay = document.getElementById('prestige-display');
    if (pDisplay) {
        pDisplay.style.display = 'flex';
        document.getElementById('prestige-level').textContent = game.prestigeLevel;
        document.getElementById('prestige-bonus').textContent = game.prestigeBonus;
    }
}

function exportSave() {
    saveGame(); 
    const data = localStorage.getItem('tycoonV5');
    const encoded = btoa(data); 
    const textarea = document.getElementById('export-data');
    textarea.value = encoded;
    textarea.select();
    navigator.clipboard.writeText(encoded).then(() => showToast('Save copied to clipboard!'));
}

function importSave() {
    const textarea = document.getElementById('import-data');
    const encoded = textarea.value.trim();
    if (!encoded) return;
    try {
        const decoded = atob(encoded);
        JSON.parse(decoded); 
        localStorage.setItem('tycoonV5', decoded);
        location.reload();
    } catch (e) {
        showToast('Invalid Save String!');
        console.error(e);
    }
}

function toggleSound() {
    settings.soundEnabled = !settings.soundEnabled;
    const btn = document.getElementById('sound-toggle');
    if(btn) btn.textContent = settings.soundEnabled ? '🔊' : '🔇';
    saveGame();
}

function setView(mode, e) {
    settings.viewMode = mode;
    document.querySelectorAll('.view-toggle .toggle-btn').forEach(b => b.classList.remove('active'));
    if (e) e.target.classList.add('active');
    
    document.querySelectorAll('.business-card').forEach((card, i) => {
         const b = businesses[i];
         const c = cost(b.cost, b.count);
         const show = settings.viewMode === 'all' || 
                     (settings.viewMode === 'affordable' && game.money >= c) ||
                     (settings.viewMode === 'owned' && b.count > 0);
        card.classList.toggle('hidden', !show);
    });
}

function setBuyMode(mode, e) {
    settings.buyMode = mode;
    document.querySelectorAll('.buy-mode-selector .toggle-btn').forEach(b => b.classList.remove('active'));
    if (e) e.target.classList.add('active');
    updateUIDisplay(getMultiplier, getMultiplierBreakdown);
}

function openModal(type) {
    document.getElementById(`${type}-modal`).classList.add('active');
    if (type === 'upgrades') renderUpgrades();
    if (type === 'achievements') renderAchievements();
    if (type === 'research') renderResearch();
    if (type === 'stats') renderStats();          // Updates the stats page
    if (type === 'prestige') updatePrestigeModal(); // Updates prestige potential
}

function closeModal(type) {
    document.getElementById(`${type}-modal`).classList.remove('active');
}

function resetGame() {
    resetGameData();
}

// --- Game Loop ---

let lastUpdate = Date.now();
let loopFrame = 0; 

function gameLoop() {
    const now = Date.now();
    const delta = (now - lastUpdate) / 1000;
    lastUpdate = now;
    
    if (game.totalIncome > 0) {
        const earn = game.totalIncome * delta;
        game.money += earn;
        game.totalEarned += earn;
        game.lifetimeEarned += earn;
    }
    
    if (game.currentEvent && now > game.eventEndTime) {
        game.currentEvent = null;
        game.eventMultiplier = 1;
        showToast('Event ended!');
        updateIncome();
    }

    loopFrame++;
    if (loopFrame % 60 === 0) {
        checkAchievements();
    }

    updateUIDisplay(getMultiplier, getMultiplierBreakdown);
    requestAnimationFrame(gameLoop);
}

// --- Initialization ---

const offlineEarnings = loadGame();
if (offlineEarnings > 0) setTimeout(() => showToast(`💰 Offline: $${fmt(offlineEarnings)}`), 1000);

createUI();
updateIncome();

if (game.prestigeLevel > 0) {
    const pDisplay = document.getElementById('prestige-display');
    if (pDisplay) {
        pDisplay.style.display = 'flex';
        document.getElementById('prestige-level').textContent = game.prestigeLevel;
        document.getElementById('prestige-bonus').textContent = game.prestigeBonus;
    }
}

const soundBtn = document.getElementById('sound-toggle');
if(soundBtn) soundBtn.textContent = settings.soundEnabled ? '🔊' : '🔇';

requestAnimationFrame(gameLoop);
setInterval(saveGame, 15000);

setInterval(() => {
    const chance = game.researchUnlocked.includes('res_events') ? 0.2 : 0.1;
    if (!game.currentEvent && Math.random() < chance && game.totalIncome > 0) {
        const event = events[Math.floor(Math.random() * events.length)];
        game.currentEvent = event;
        game.eventEndTime = Date.now() + event.duration;
        game.eventMultiplier = event.mult;
        game.eventsWitnessed++;
        updateIncome();
        showToast(`${event.icon} ${event.name}!`);
    }
}, 30000);

setInterval(() => {
    if (Math.random() < 0.05 && game.totalIncome > 0) {
        spawnMysteryDrop(() => {
            const bonus = game.totalIncome * 300; 
            game.money += bonus;
            game.totalEarned += bonus;
            game.lifetimeEarned += bonus;
            showToast(`🎁 Mystery Bonus: $${fmt(bonus)}!`);
        });
    }
}, 30000);

// --- Add this to the very bottom of main.js ---

// Save automatically when the user closes the tab or refreshes
window.addEventListener('beforeunload', () => {
    saveGame();
});
