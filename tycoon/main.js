// --- Math & Logic ---

function getResearchLevel(id) {
    return game.researchLevels[id] || 0;
}

function getMultiplier(i) {
    let m = 1;
    const b = businesses[i];
    
    // 1. Upgrade Multipliers
    upgrades.forEach(u => {
        if (u.level > 0) {
            if (u.biz !== -1) {
                // Specific Business Upgrade
                if (u.biz === i) m *= Math.pow(u.mult, u.level);
            } else {
                // Tier or Global Upgrade
                if (u.tier === -1 || u.tier === b.tier) m *= Math.pow(u.mult, u.level);
            }
        }
    });
    
    // 2. Milestone Bonuses
    const milestoneBonus = 1.25; 
    const milestones = [25, 50, 75, 100, 150, 200, 250, 300, 400, 500, 600, 700, 800, 900, 1000];
    milestones.forEach(ms => { if (b.count >= ms) m *= milestoneBonus; });
    
    // 3. RESEARCH: Global Income Boost
    const resLvl = getResearchLevel('res_global');
    if (resLvl > 0) {
        const rData = researchData.find(r => r.id === 'res_global');
        m *= (1 + (resLvl * rData.val));
    }
    
    // 4. HARD CAP (Significantly Increased for new endgame)
    if (m > 1e15) m = 1e15; 
    
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
    
    // PRESTIGE: Exactly 5% per level
    const prestigeMult = 1 + (game.prestigeLevel * 0.05);
    
    inc *= prestigeMult * game.eventMultiplier * game.comboMult;
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
        game.totalClicks++;
        
        const now = Date.now();
        if (now - game.lastPurchase < 2000) {
            game.comboCount++;
            if (game.comboCount >= 5) {
                let mult = 1 + (game.comboCount - 4) * 0.05;
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
    if (!r) return;
    
    const currentLevel = game.researchLevels[id] || 0;
    if (currentLevel >= r.max) return;

    // Cost Scaling: Base * (Scale ^ Level)
    const cost = Math.floor(r.baseCost * Math.pow(r.costScale, currentLevel));

    if (game.knowledgePoints >= cost) {
        game.knowledgePoints -= cost;
        game.researchLevels[id] = currentLevel + 1;
        
        renderResearch(); 
        updateIncome();   
        showToast(`🧪 Upgraded: ${r.name} (Lvl ${currentLevel + 1})`);
        saveGame();
    }
}

function doPrestige() {
    // 1. SCALING DIFFICULTY: Base 10M * (3 ^ PrestigeLevel)
    const baseReq = 10000000;
    const difficultyMult = Math.pow(3, game.prestigeLevel); 
    const minRequired = baseReq * difficultyMult;

    if (game.totalEarned < minRequired) {
        showToast(`Need $${fmt(minRequired)} total earned!`);
        return;
    }
    
    // 2. KP REWARD CALCULATION
    // KP based on how much you exceeded the requirement (logarithmic)
    let kpBase = Math.floor(Math.log10(game.totalEarned / (baseReq/10))) + 1; 
    
    // Apply "Ancient Wisdom" Research
    const kpResLvl = getResearchLevel('res_kp');
    if (kpResLvl > 0) {
        kpBase = Math.floor(kpBase * (1 + (kpResLvl * 0.05)));
    }
    
    // Calculate new income bonus
    const newLevel = game.prestigeLevel + 1;
    const totalBonus = newLevel * 5;

    if (!confirm(`Reset for +5% Income (Total: ${totalBonus}%) and ${kpBase} Knowledge Points?`)) return;
    
    game.prestigeLevel++;
    game.prestigeBonus = totalBonus;
    game.knowledgePoints += kpBase;
    
    // Hard reset money to 1000
    game.money = 1000;
    
    game.totalIncome = 0;
    game.totalEarned = 0; 
    game.totalSpent = 0;
    game.startTime = Date.now();
    
    businesses.forEach((b, i) => { 
        b.count = 0; 
        b.level = 0; 
    });
    
    upgrades.forEach(u => { u.level = 0; });
    
    checkAchievements();
    updateIncome();
    createUI();
    closeModal('prestige');
    showToast(`⭐ Ascended! +${kpBase} KP`);
    
    const pDisplay = document.getElementById('prestige-display');
    if (pDisplay) {
        pDisplay.style.display = 'flex';
        document.getElementById('prestige-level').textContent = game.prestigeLevel;
        document.getElementById('prestige-bonus').textContent = game.prestigeBonus;
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
    if (type === 'stats') renderStats();          
    if (type === 'prestige') updatePrestigeModal(); 
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

// Event Loop with Research Bonus
setInterval(() => {
    // Base 10% chance
    let chance = 0.1;
    // Add Research Bonus
    const evtLvl = getResearchLevel('res_events');
    if (evtLvl > 0) {
        chance += (evtLvl * 0.1); // +10% per level
    }

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

window.addEventListener('beforeunload', () => {
    saveGame();
});