import { G } from './state.js';
import { C, ACHIEVEMENTS, RANDOM_EVENTS } from './config.js';
import { getGeom, log } from './utils.js';
import { updateUI, showAchievement, showEventNotification } from './ui.js';

let lastEventTime = Date.now();

// ===== CORE FUNCTIONS =====
export function addRes(type, amount) {
    if(!G.res[type]) return;
    G.res[type].cur = Math.min(G.res[type].max, Math.max(0, G.res[type].cur + amount));
    if(amount > 0) G.stats.totalResourcesGathered += amount;
}

export function getMaxPop() {
    let base = C.BASE_CAP.pop;
    base += G.bld.hut.count * 5;
    base += G.bld.house.count * 10;
    base += G.bld.colosseum.count * 30;
    base += G.bld.castle.count * 50;
    base += G.bld.skyscraper.count * 100;
    base += G.bld.cryochamber.count * 200;
    return base;
}

export function recalcCaps() {
    for(let r in G.res) {
        let base = C.BASE_CAP[r] || 0;
        
        // ERA 0
        if(r === 'wood') base += getGeom(20, G.bld.stockpile.count);
        if(r === 'food') base += getGeom(50, G.bld.granary.count);
        if(r === 'science') base += getGeom(100, G.bld.library.count) + getGeom(200, G.bld.academy.count) + getGeom(300, G.bld.observatory.count);
        if(r === 'stone') base += G.bld.warehouse.count * 100;
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
        
        // Monuments 
        base += G.bld.pyramid.count * 500;
        base += G.bld.parthenon.count * 1000;
        base += G.bld.grandcathedral.count * 1500;
        base += G.bld.globetheatre.count * 2000;
        base += G.bld.eiffeltower.count * 3000;
        base += G.bld.spaceelevator.count * 5000;
        
        if(['wood','stone','clay','iron','copper','coal'].includes(r)) {
            base += getGeom(100, G.bld.warehouse.count);
        }
        
        if(r === 'railroad') base += getGeom(500, G.bld.railroad.count); 
        
        G.res[r].max = Math.floor(base);
    }
}

export function getNetRate(type) {
    let rate = 0;
    const prod = C.PROD;
    
    for(let job in prod) {
        if(G.pop[job] === undefined) continue;
        const count = G.pop[job];
        if(count === 0) continue;
        
        if(typeof prod[job] === 'object') {
            if(prod[job][type]) rate += prod[job][type] * count;
        }
    }
    
    if(type === 'food') rate -= G.pop.total * C.POP_EAT;
    rate *= (1 + G.prestigeLevel * 0.05);
    
    return rate;
}

export function getCost(buildingType) {
    const bld = G.bld[buildingType];
    if(!bld) return {};
    
    let costs = {};
    for(let res in bld.base) {
        costs[res] = Math.floor(bld.base[res] * Math.pow(bld.mult, bld.count));
    }
    return costs;
}

// ===== GAME LOOP & PRODUCTION =====
export function tick() {
    const dt = C.TICK / 1000;
    processProductionTick(dt);
    checkAchievements();
    triggerRandomEvent();
    G.stats.timePlayed += dt;
    updateUI();
}

export function processProductionTick(dt) {
    const prestigeMult = (1 + G.prestigeLevel * 0.05);
    const foodNeeded = G.pop.total * C.POP_EAT * dt;
    
    if (G.res.food.cur >= foodNeeded) {
        G.res.food.cur -= foodNeeded;
        G.starvationAccumulator = 0; 
    } else {
        G.res.food.cur = 0; 
        
        if (G.pop.total > 0) {
            G.starvationAccumulator += dt;
            if (G.starvationAccumulator >= 1.0) {
                killVillager();
                G.starvationAccumulator = 0;
                log("A villager has died from starvation!", "bad");
            }
        }
    }

    let productionDeltas = {};

    for (let job in C.PROD) {
        const count = G.pop[job];
        if (!count || count <= 0) continue;

        const recipe = C.PROD[job];
        let maxEfficiency = 1.0;
        let inputsNeeded = {};

        for (let res in recipe) {
            if (recipe[res] < 0) {
                const amountNeeded = Math.abs(recipe[res]) * count * dt;
                inputsNeeded[res] = amountNeeded;
                
                if (G.res[res].cur < amountNeeded) {
                    const efficiency = G.res[res].cur / amountNeeded;
                    if (efficiency < maxEfficiency) maxEfficiency = efficiency;
                }
            }
        }

        if (maxEfficiency > 0) {
            for (let res in recipe) {
                let amount = recipe[res] * count * dt * prestigeMult * maxEfficiency;
                if (amount < 0) {
                    G.res[res].cur += amount; 
                } else {
                    if (!productionDeltas[res]) productionDeltas[res] = 0;
                    productionDeltas[res] += amount;
                }
            }
        }
    }

    for (let res in productionDeltas) {
        addRes(res, productionDeltas[res]);
    }
}

export function triggerRandomEvent() {
    const now = Date.now();
    const timeSinceLastEvent = now - lastEventTime;
    const minInterval = 120000; 
    const maxInterval = 300000; 
    const randomInterval = Math.random() * (maxInterval - minInterval) + minInterval;
    
    if(timeSinceLastEvent > randomInterval) {
        const event = RANDOM_EVENTS[Math.floor(Math.random() * RANDOM_EVENTS.length)];
        // Pass G, addRes, and killMultiple to the event effect so it works modularly
        event.effect(G, addRes, killMultiple);
        showEventNotification(event);
        lastEventTime = now;
    }
}

function killVillager() {
    if (G.pop.total <= 0) return;
    G.pop.total--;
    if (G.pop.idle > 0) {
        G.pop.idle--;
    } else {
        const jobs = Object.keys(G.pop).filter(k => k!=='total' && k!=='idle' && G.pop[k] > 0);
        if (jobs.length > 0) {
            const victim = jobs[Math.floor(Math.random() * jobs.length)];
            G.pop[victim]--;
        }
    }
    updateUI();
}

export function killMultiple(amount) {
    for(let i=0; i<amount; i++) killVillager();
}

// ===== PLAYER ACTIONS =====
export function manualGather() {
    addRes('food', 1);
    G.stats.manualClicks++;
    updateUI();
    
    if(!G.achievements.firstClick) {
        G.achievements.firstClick = true;
        showAchievement('firstClick');
    }
}

export function recruitVillager() {
    if(G.res.food.cur >= C.COST_VILLAGER && G.pop.total < getMaxPop()) {
        G.res.food.cur -= C.COST_VILLAGER;
        G.pop.total++;
        G.pop.idle++;
        G.stats.villagersRecruited++;
        log("Villager recruited.", "good");
        updateUI();
    }
}

export function adjustJob(job, delta) {
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

export function buildStructure(type) {
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

export function buildMax(event, type) {
    if (event) event.stopPropagation();
    
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

export function purchaseTech(tech) {
    const cost = G.tech[tech].cost;
    if(G.res.science.cur >= cost && !G.tech[tech].researched) {
        G.res.science.cur -= cost;
        G.tech[tech].researched = true;
        G.stats.techResearched++;
        log(`Researched ${tech}!`, "good");
        updateUI();
    }
}

export function advanceEra() {
    G.era++;
    G.stats.eraReached = G.era;
    log(`Welcome to Era ${G.era}!`, "good");
    
    if(G.era >= 3) {
        document.getElementById('btn-prestige').style.display = 'block';
    }
    
    updateUI();
}

// ===== PRESTIGE & RESET =====
export function confirmPrestige() {
    if(G.era < 3) {
        alert("You must reach Era 3 to prestige!");
        return;
    }
    
    const bonus = (G.prestigeLevel + 1) * 5;
    
    if(confirm(`Prestige and start over?\n\nYou will gain 1 Prestige Level.\nCurrent bonus: +${G.prestigeLevel * 5}% production\nNew bonus: +${bonus}% production\n\nAll progress will reset!`)) {
        doPrestige();
    }
}

export function doPrestige() {
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

export function resetGameState() {
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
export function checkAchievements() {
    if(G.pop.total >= 10 && !G.achievements.pop10) { G.achievements.pop10 = true; showAchievement('pop10'); }
    if(G.pop.total >= 50 && !G.achievements.pop50) { G.achievements.pop50 = true; showAchievement('pop50'); }
    if(G.pop.total >= 100 && !G.achievements.pop100) { G.achievements.pop100 = true; showAchievement('pop100'); }
    if(G.era >= 1 && !G.achievements.era1) { G.achievements.era1 = true; showAchievement('era1'); }
    if(G.era >= 2 && !G.achievements.era2) { G.achievements.era2 = true; showAchievement('era2'); }
    if(G.era >= 3 && !G.achievements.era3) { G.achievements.era3 = true; showAchievement('era3'); }
    if(G.era >= 4 && !G.achievements.era4) { G.achievements.era4 = true; showAchievement('era4'); }
    if(G.era >= 5 && !G.achievements.era5) { G.achievements.era5 = true; showAchievement('era5'); }
    if(G.bld.pyramid.count > 0 && !G.achievements.pyramid) { G.achievements.pyramid = true; showAchievement('pyramid'); }
    if(G.bld.parthenon.count > 0 && !G.achievements.parthenon) { G.achievements.parthenon = true; showAchievement('parthenon'); }
    if(G.bld.grandcathedral.count > 0 && !G.achievements.grandcathedral) { G.achievements.grandcathedral = true; showAchievement('grandcathedral'); }
    if(G.bld.globetheatre.count > 0 && !G.achievements.globetheatre) { G.achievements.globetheatre = true; showAchievement('globetheatre'); }
    if(G.bld.eiffeltower.count > 0 && !G.achievements.eiffeltower) { G.achievements.eiffeltower = true; showAchievement('eiffeltower'); }
    if(G.stats.techResearched >= 10 && !G.achievements.tech10) { G.achievements.tech10 = true; showAchievement('tech10'); }
    if(G.stats.techResearched >= 20 && !G.achievements.tech20) { G.achievements.tech20 = true; showAchievement('tech20'); }
    if(G.stats.buildingsConstructed >= 50 && !G.achievements.buildings50) { G.achievements.buildings50 = true; showAchievement('buildings50'); }
    if(G.stats.buildingsConstructed >= 100 && !G.achievements.buildings100) { G.achievements.buildings100 = true; showAchievement('buildings100'); }
    if(G.res.gold.cur >= 100 && !G.achievements.gold100) { G.achievements.gold100 = true; showAchievement('gold100'); }
    if(G.res.science.cur >= 1000000 && !G.achievements.science1M) { G.achievements.science1M = true; showAchievement('science1M'); }
    if(G.stats.manualClicks >= 100 && !G.achievements.clicks100) { G.achievements.clicks100 = true; showAchievement('clicks100'); }
}

// ===== SAVE / LOAD =====
export function saveGame() {
    try {
        const saveData = {
            version: '2.5', era: G.era, prestigeLevel: G.prestigeLevel,
            res: {}, pop: G.pop, bld: {}, tech: {}, stats: G.stats,
            achievements: G.achievements, lastSaveTime: Date.now()
        };
        for(let k in G.res) saveData.res[k] = { cur: G.res[k].cur, unlocked: G.res[k].unlocked };
        for(let k in G.bld) saveData.bld[k] = { count: G.bld[k].count };
        for(let k in G.tech) saveData.tech[k] = { researched: G.tech[k].researched };
        localStorage.setItem('civIdleSave', JSON.stringify(saveData));
    } catch(e) { console.error("Save failed:", e); }
}

export function loadGame() {
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
                }
            }
        }
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
        
        if(data.bld) { for(let key in G.bld) if(data.bld[key]) G.bld[key].count = data.bld[key].count || 0; }
        if(data.tech) { for(let key in G.tech) if(data.tech[key]) G.tech[key].researched = data.tech[key].researched || false; }
        if(data.stats) G.stats = {...G.stats, ...data.stats};
        if(data.achievements) G.achievements = {...G.achievements, ...data.achievements};
        
        if(data.lastSaveTime) {
            const now = Date.now();
            const timeDiff = (now - data.lastSaveTime) / 1000;
            let offlineTime = Math.min(timeDiff, 86400); 
            
            if(offlineTime > 60) {
                const foodRate = getNetRate('food'); 
                if (foodRate < 0 && G.res.food.cur > 0) {
                    const timeToStarve = G.res.food.cur / Math.abs(foodRate);
                    if (timeToStarve < offlineTime) {
                        offlineTime = timeToStarve;
                    }
                }
                for(let r in G.res) {
                    const rate = getNetRate(r);
                    if(rate !== 0) addRes(r, rate * offlineTime);
                }
                if (foodRate < 0 && offlineTime < timeDiff) G.res.food.cur = 0;
            }
        }
        recalcCaps();
        updateUI();
    } catch(e) {
        console.error("Load failed:", e);
        localStorage.removeItem('civIdleSave');
    }
}