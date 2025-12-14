let game = {
    money: 20, 
    totalIncome: 0, 
    totalEarned: 0, 
    lifetimeEarned: 0,
    totalSpent: 0, 
    totalClicks: 0,
    startTime: Date.now(), 
    lastSave: Date.now(), 
    prestigeLevel: 0, 
    prestigeBonus: 0,
    knowledgePoints: 0,
    researchLevels: {},
    eventMultiplier: 1, 
    lastPurchase: 0, 
    comboCount: 0, 
    comboMult: 1,
    eventsWitnessed: 0, 
    currentEvent: null, 
    eventEndTime: 0, 
    unlockedAchievements: []
};

let settings = { soundEnabled: true, viewMode: 'all', buyMode: 1 };

function saveGame() {
    // FIX: Save upgrades as an Object map { "id": level }, not an Array
    const upgradeMap = {};
    upgrades.forEach(u => {
        if (u.level > 0) upgradeMap[u.id] = u.level;
    });

    const data = {
        money: game.money, 
        totalEarned: game.totalEarned, 
        lifetimeEarned: game.lifetimeEarned,
        totalSpent: game.totalSpent,
        totalClicks: game.totalClicks, 
        startTime: game.startTime, 
        lastSave: Date.now(),
        prestigeLevel: game.prestigeLevel, 
        prestigeBonus: game.prestigeBonus,
        knowledgePoints: game.knowledgePoints,
        researchLevels: game.researchLevels,
        eventsWitnessed: game.eventsWitnessed, 
        unlockedAchievements: game.unlockedAchievements,
        businesses: businesses.map((b, i) => ({ id: i, count: b.count, level: b.level })),
        
        upgrades: upgradeMap, // NEW FORMAT
        settings
    };
    localStorage.setItem('tycoonV5', JSON.stringify(data));
}

function loadGame() {
    const saved = localStorage.getItem('tycoonV5');
    if (saved) {
        try {
            const data = JSON.parse(saved);
            Object.assign(game, data);
            
            if (Array.isArray(game.researchUnlocked)) {
                game.researchLevels = {}; 
                game.researchUnlocked.forEach(id => {
                   if(researchData.find(r => r.id === id)) game.researchLevels[id] = 1;
                });
                delete game.researchUnlocked;
            }
            if (!game.researchLevels) game.researchLevels = {};

            if (game.lifetimeEarned === undefined) {
                game.lifetimeEarned = game.totalEarned || 0;
            }

            if (data.businesses) {
                data.businesses.forEach((savedBiz, i) => {
                    if (businesses[i]) {
                        businesses[i].count = savedBiz.count || 0;
                        businesses[i].level = savedBiz.level || 0;
                    }
                });
            }
            
            // FIX: Handle both Legacy (Array) and New (Object) upgrade saves
            if (data.upgrades) {
                if (Array.isArray(data.upgrades)) {
                    // Legacy: Load by Index
                    upgrades.forEach((u, i) => {
                        if (data.upgrades[i] !== undefined) u.level = data.upgrades[i];
                    });
                } else {
                    // New: Load by ID
                    for (const [id, lvl] of Object.entries(data.upgrades)) {
                        const u = upgrades.find(x => x.id === id);
                        if (u) u.level = lvl;
                    }
                }
            }
            
            if (data.settings) Object.assign(settings, data.settings);
            
            return game.lastSave;
        } catch (e) {
            console.error('Load failed:', e);
        }
    }
    return 0;
}

function resetGameData() {
    if (confirm('🚨 Reset ALL progress? Cannot be undone!')) {
        localStorage.removeItem('tycoonV5');
        location.reload();
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