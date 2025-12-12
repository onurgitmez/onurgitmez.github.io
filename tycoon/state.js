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
    knowledgePoints: 0, // NEW: Currency for Tier 3
    researchUnlocked: [], // NEW: Track bought researches
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
    const data = {
        // ... (copy all game properties)
        money: game.money, 
        totalEarned: game.totalEarned, 
        lifetimeEarned: game.lifetimeEarned,
        totalSpent: game.totalSpent,
        totalClicks: game.totalClicks, 
        startTime: game.startTime, 
        lastSave: Date.now(),
        prestigeLevel: game.prestigeLevel, 
        prestigeBonus: game.prestigeBonus,
        knowledgePoints: game.knowledgePoints, // Save KP
        researchUnlocked: game.researchUnlocked, // Save Research
        eventsWitnessed: game.eventsWitnessed, 
        unlockedAchievements: game.unlockedAchievements,
        
        // OPTIMIZATION A: Only save dynamic data (ID, count, level)
        businesses: businesses.map((b, i) => ({ id: i, count: b.count, level: b.level })),
        
        upgrades: upgrades.map(u => u.level), 
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
            
            if (game.lifetimeEarned === undefined) game.lifetimeEarned = game.totalEarned;
            if (game.knowledgePoints === undefined) game.knowledgePoints = 0;
            if (game.researchUnlocked === undefined) game.researchUnlocked = [];

            // Merge saved business data with static data
            if (data.businesses) {
                data.businesses.forEach((savedBiz, i) => {
                    if (businesses[i]) {
                        businesses[i].count = savedBiz.count || 0;
                        businesses[i].level = savedBiz.level || 0;
                    }
                });
            }
            
            upgrades.forEach((u, i) => {
                if (data.upgrades && data.upgrades[i] !== undefined) u.level = data.upgrades[i];
            });
            if (data.settings) Object.assign(settings, data.settings);
            
            const offlineTime = Math.min((Date.now() - game.lastSave) / 1000, 3600); // 1 hr cap (default)
            // Tier 3: Check for "Offline Master" research to boost cap
            const offlineCap = game.researchUnlocked.includes('res_offline') ? 86400 : 3600; // 24hr vs 1hr
            
            const realOfflineTime = Math.min((Date.now() - game.lastSave) / 1000, offlineCap);

            if (realOfflineTime > 60 && game.totalIncome > 0) {
                const earnings = game.totalIncome * realOfflineTime;
                game.money += earnings;
                game.totalEarned += earnings;
                game.lifetimeEarned += earnings;
                return earnings;
            }
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

// Add to state.js

function exportSave() {
    saveGame(); // Ensure latest state is saved
    const data = localStorage.getItem('tycoonV5');
    // Encode to Base64 to make it look like a "save code" and prevent accidental edits
    const encoded = btoa(data);
    const textarea = document.getElementById('export-data');
    textarea.value = encoded;
    
    // Select text for user
    textarea.select();
    textarea.setSelectionRange(0, 99999); 
    
    // Copy to clipboard
    navigator.clipboard.writeText(encoded).then(() => {
        showToast('Save copied to clipboard!');
    });
}

function importSave() {
    const textarea = document.getElementById('import-data');
    const encoded = textarea.value.trim();
    
    if (!encoded) return;

    try {
        const decoded = atob(encoded);
        JSON.parse(decoded); // Validate JSON
        localStorage.setItem('tycoonV5', decoded);
        location.reload();
    } catch (e) {
        showToast('Invalid Save String!');
        console.error(e);
    }
}