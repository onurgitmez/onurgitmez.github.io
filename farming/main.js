/* main.js */

const Game = {
    data: {
        gold: 100, level: 1, xp: 0, lastSave: Date.now(), inventory: {},
        plots: [null, null, null], animals: [null, null], machines: [null, null],
        upgrades: {}, managers: {}  
    },
    expansionCosts: { plots: 500, animals: 1000, machines: 2000 },
    lastFrameTime: 0, logicAccumulator: 0, saveAccumulator: 0,

    init() {
        this.loadGame();
        this.renderAll();
        requestAnimationFrame((ts) => this.gameLoop(ts));
    },

    getConfig(key) { return GAME_DATA.crops[key] || GAME_DATA.trees[key] || GAME_DATA.animals[key] || GAME_DATA.machines[key]; },
    getXpRequirement(level) { return Math.floor(Math.pow(level, 2) * 50); },
    getExpansionCost(cat) { return Math.floor(this.expansionCosts[cat] * Math.pow(1.5, this.data[cat].length - 1)); },

    gameLoop(timestamp) {
        if (!this.lastFrameTime) this.lastFrameTime = timestamp;
        const dt = timestamp - this.lastFrameTime;
        this.lastFrameTime = timestamp;

        this.logicAccumulator += dt;
        this.saveAccumulator += dt;

        if (this.logicAccumulator >= 500) { this.logicLoop(); this.logicAccumulator = 0; }
        if (this.saveAccumulator >= 5000) { this.saveGame(); this.saveAccumulator = 0; }

        this.uiLoop();
        requestAnimationFrame((ts) => this.gameLoop(ts));
    },

    logicLoop() {
        const now = Date.now();

        // 1. HARVEST
        ['plots', 'animals', 'machines'].forEach(category => {
            this.data[category].forEach(slot => {
                if (!slot) return;
                const config = this.getConfig(slot.type);
                if ((slot.state === 'growing' || slot.state === 'working') && now - slot.startTime >= this.getModifiedTime(config)) {
                    this.addItem(config.output || slot.type, 1);
                    this.addXp(config.xp);
                    if (config.type !== 'crop' && !config.input) slot.startTime = now; 
                    else slot.state = 'idle'; 
                }
            });
        });

        // 2. AUTO-SELL
        if (this.data.managers.auto_sell) {
            const activeInputs = new Set(this.data.machines.filter(s => s !== null).map(s => this.getConfig(s.type).input));
            for (let key in this.data.inventory) {
                if (!activeInputs.has(key)) this.sellItem(key, true); 
            }
        }

        // 3. AUTO-ROUTE
        if (this.data.managers.auto_route) {
            this.data.machines.forEach(slot => {
                if (slot && slot.state === 'idle') {
                    const config = this.getConfig(slot.type);
                    if (this.data.inventory[config.input] > 0) {
                        this.removeItem(config.input, 1);
                        slot.state = 'working'; slot.startTime = now;
                    }
                }
            });
        }

        // 4. AUTO-PLANT
        if (this.data.managers.auto_replant) {
            this.data.plots.forEach(slot => {
                if (slot && slot.state === 'idle') {
                    const config = this.getConfig(slot.type);
                    if (config.type === 'crop' && this.data.gold >= config.seedCost) {
                        this.data.gold -= config.seedCost;
                        slot.state = 'growing'; slot.startTime = now;
                    }
                }
            });
            this.updateHeaderDOM();
        }
    },

    uiLoop() {
        const now = Date.now();
        ['plots', 'animals', 'machines'].forEach(category => {
            this.data[category].forEach((slot, i) => {
                if (!slot) return;
                const config = this.getConfig(slot.type);
                const isCrop = config.type === 'crop';
                const bar = document.getElementById(`${category === 'plots' ? 'plot' : category === 'animals' ? 'anim' : 'mach'}-bar-${i}`);
                const statusEl = document.getElementById(`${category}-status-${i}`);
                const slotEl = document.getElementById(`${category}-slot-${i}`);
                
                if (!bar || !statusEl || !slotEl) return;

                if (slot.state === 'growing' || slot.state === 'working') {
                    bar.style.width = Math.min(100, ((now - slot.startTime) / this.getModifiedTime(config)) * 100) + '%';
                    bar.style.background = category === 'plots' ? '#2ecc71' : category === 'animals' ? '#f1c40f' : '#3498db';
                    statusEl.innerText = category === 'machines' ? 'Processing...' : 'Producing...'; 
                    statusEl.style.color = '#aaa';
                    slotEl.style.cursor = 'default'; slotEl.onclick = null;
                } else {
                    bar.style.width = '0%';
                    if (isCrop) {
                        if (this.data.gold < config.seedCost) {
                            statusEl.innerText = `WAITING FOR FUNDS (${config.seedCost}g)`; statusEl.style.color = '#e74c3c';
                            slotEl.style.cursor = 'default'; slotEl.onclick = null;
                        } else {
                            statusEl.innerText = `CLICK TO PLANT (${config.seedCost}g)`; statusEl.style.color = '#2ecc71';
                            slotEl.style.cursor = 'pointer';
                            slotEl.onclick = () => {
                                if (this.data.gold >= config.seedCost) {
                                    this.data.gold -= config.seedCost;
                                    slot.state = 'growing'; slot.startTime = Date.now();
                                    this.updateHeaderDOM();
                                }
                            };
                        }
                    } else if (category === 'machines') {
                        if (this.data.inventory[config.input] > 0) {
                            statusEl.innerText = `CLICK TO LOAD (${config.input.replace('_', ' ')})`; 
                            statusEl.style.color = '#2ecc71';
                            slotEl.style.cursor = 'pointer';
                            slotEl.onclick = () => {
                                this.removeItem(config.input, 1);
                                slot.state = 'working'; slot.startTime = Date.now();
                            };
                        } else {
                            statusEl.innerText = `Needs ${config.input.replace('_', ' ')}`; 
                            statusEl.style.color = '#e67e22';
                            slotEl.style.cursor = 'default'; slotEl.onclick = null;
                        }
                    }
                }
            });
        });
    },

    getModifiedTime(config) {
        let t = config.time;
        if (config.type === 'crop') {
            if (this.data.upgrades.tractor) t *= 0.65;
            else if (this.data.upgrades.irrigation) t *= 0.80;
            else if (this.data.upgrades.steel_tools) t *= 0.90;
        }
        return t;
    },
    
    getModifiedPrice(key) {
        let price = GAME_DATA.crops[key]?.sell || GAME_DATA.trees[key]?.sell || GAME_DATA.products[key]?.sell || 0;
        if (Object.values(GAME_DATA.animals).some(a => a.output === key)) {
            price *= this.data.upgrades.selective_breeding ? 1.50 : this.data.upgrades.premium_feed ? 1.25 : 1;
        }
        if (Object.values(GAME_DATA.machines).some(m => m.output === key)) {
            price *= this.data.upgrades.luxury_branding ? 2.00 : this.data.upgrades.artisan_crafting ? 1.40 : 1;
            if (key === 'premium_whisky' || key === 'wine') {
                price *= this.data.upgrades.master_distiller ? 1.50 : 1;
            }
        }
        return Math.floor(price);
    },

    addItem(key, qty) { this.data.inventory[key] = (this.data.inventory[key] || 0) + qty; this.updateInventoryDOM(key); },
    removeItem(key, qty) {
        if (this.data.inventory[key] >= qty) {
            this.data.inventory[key] -= qty;
            if (this.data.inventory[key] === 0) delete this.data.inventory[key];
            this.updateInventoryDOM(key);
        }
    },
    sellItem(key, all) {
        const qty = all ? this.data.inventory[key] : 1;
        if (!qty) return;
        this.data.gold += this.getModifiedPrice(key) * qty;
        this.removeItem(key, qty);
        this.updateHeaderDOM();
    },
    sellAllEverything() { for(let k in this.data.inventory) this.sellItem(k, true); },
    addXp(amount) {
        this.data.xp += amount;
        let leveledUp = false;
        while (this.data.xp >= this.getXpRequirement(this.data.level)) {
            this.data.xp -= this.getXpRequirement(this.data.level); 
            this.data.level++; leveledUp = true;
        }
        if (leveledUp) { alert(`🎉 Level Up! You are now Level ${this.data.level}`); this.renderAll(); }
        this.updateHeaderDOM();
    },

    buyUpgrade(type, key) {
        const config = (type === 'upgrades' ? GAME_DATA.upgrades : GAME_DATA.managers)[key];
        if (this.data.gold >= config.cost) {
            this.data.gold -= config.cost; this.data[type][key] = true; 
            this.updateHeaderDOM(); this.renderShop('upgrades'); this.saveGame();
        } else alert(`Need ${config.cost}g`);
    },
    assignSlot(category, index, key) {
        const config = this.getConfig(key);
        const willAutoPlant = config.type === 'crop' && this.data.managers.auto_replant;
        const cost = config.type === 'crop' && !willAutoPlant ? 0 : config.seedCost;
        if (this.data.gold >= cost) {
            this.data.gold -= cost;
            this.data[category][index] = { type: key, state: (config.input || (config.type === 'crop' && !willAutoPlant) ? 'idle' : 'growing'), startTime: Date.now() };
            document.getElementById('shop-modal').style.display = 'none';
            this.renderAll(); this.saveGame();
        } else alert(`Need ${cost}g`);
    },
    clearSlot(cat, i) { if(confirm("Remove item?")) { this.data[cat][i] = null; this.renderAll(); } },
    expand(cat) {
        const cost = this.getExpansionCost(cat);
        if (this.data.gold >= cost) { this.data.gold -= cost; this.data[cat].push(null); this.renderAll(); } 
        else alert(`Need ${cost}g`);
    },

    saveGame() { this.data.lastSave = Date.now(); localStorage.setItem('farm_v8', JSON.stringify(this.data)); },
    loadGame() {
        const s = localStorage.getItem('farm_v8');
        if (s) { try { this.data = { ...this.data, ...JSON.parse(s) }; this.processOffline(Date.now() - this.data.lastSave); } catch(e){} }
    },

    // ADVANCED OFFLINE SIMULATION
    processOffline(ms) {
        if (ms < 60000) return; 
        let gainedItems = {}, earnedGold = 0, earnedXp = 0;
        let virtualInventory = { ...this.data.inventory };
        const now = Date.now();

        // 1. Simulate Raw Generators (Trees, Animals, and Auto-Planted Crops)
        const simulateGenerators = (slots) => {
            slots.forEach(slot => {
                if (!slot) return;
                const config = this.getConfig(slot.type);
                const isCrop = config.type === 'crop';
                
                // Crops only grow offline if auto-replant is owned
                if (isCrop && !this.data.managers.auto_replant) return; 

                const reqTime = this.getModifiedTime(config);
                const cycles = Math.floor((ms + (this.data.lastSave - slot.startTime)) / reqTime);
                
                if (cycles > 0) {
                    const totalCost = isCrop ? config.seedCost * cycles : 0;
                    // Ensure we only simulate crop cycles we can afford
                    let actualCycles = cycles;
                    if (isCrop && this.data.gold + earnedGold < totalCost) {
                        actualCycles = Math.floor((this.data.gold + earnedGold) / config.seedCost);
                    }

                    if (actualCycles > 0) {
                        const outputKey = config.output || slot.type;
                        virtualInventory[outputKey] = (virtualInventory[outputKey] || 0) + actualCycles;
                        gainedItems[outputKey] = (gainedItems[outputKey] || 0) + actualCycles;
                        earnedXp += config.xp * actualCycles;
                        if (isCrop) earnedGold -= config.seedCost * actualCycles;
                        slot.startTime = now - ((ms + (this.data.lastSave - slot.startTime)) % reqTime);
                    }
                }
            });
        };

        simulateGenerators(this.data.plots);
        simulateGenerators(this.data.animals);

        // 2. Simulate Machines (If Auto-Route is active)
        if (this.data.managers.auto_route) {
            this.data.machines.forEach(slot => {
                if (!slot) return;
                const config = this.getConfig(slot.type);
                const reqTime = this.getModifiedTime(config);
                const maxTimeCycles = Math.floor((ms + (this.data.lastSave - slot.startTime)) / reqTime);
                
                if (maxTimeCycles > 0) {
                    // Machine is limited by EITHER time passed OR available inputs
                    const availableInputs = virtualInventory[config.input] || 0;
                    const actualCycles = Math.min(maxTimeCycles, availableInputs);

                    if (actualCycles > 0) {
                        virtualInventory[config.input] -= actualCycles;
                        virtualInventory[config.output] = (virtualInventory[config.output] || 0) + actualCycles;
                        
                        // Adjust the display text for the report
                        gainedItems[config.output] = (gainedItems[config.output] || 0) + actualCycles;
                        earnedXp += config.xp * actualCycles;
                        slot.startTime = now - ((ms + (this.data.lastSave - slot.startTime)) % reqTime);
                    }
                }
            });
        }

        // 3. Apply changes and Auto-Sell
        this.data.gold += earnedGold; // Apply any seed costs
        if (earnedXp > 0) this.addXp(earnedXp);

        // Get active inputs to protect them from auto-sell
        const activeInputs = new Set(this.data.machines.filter(s => s !== null).map(s => this.getConfig(s.type).input));

        for (let key in virtualInventory) {
            const qty = virtualInventory[key] - (this.data.inventory[key] || 0); // Only add net new items to real inventory
            if (qty > 0) this.addItem(key, qty);
            
            // Auto sell logic on the updated inventory
            if (this.data.managers.auto_sell && !activeInputs.has(key)) {
                this.sellItem(key, true);
            }
        }

        // Show Report
        if (Object.keys(gainedItems).length > 0) {
            document.getElementById('offline-report').innerHTML = 
                Object.entries(gainedItems).map(([k,v]) => `<div>+${v} ${k.replace('_',' ')}</div>`).join('') + 
                `<div style="color:#2ecc71; margin-top:10px;">+${earnedXp} XP</div>`;
            document.getElementById('offline-modal').style.display = 'flex';
        }
    },

    renderAll() {
        this.updateHeaderDOM();
        ['plots', 'animals', 'machines'].forEach(cat => this.renderList(cat));
        document.getElementById('inventory-list').innerHTML = '';
        for (let k in this.data.inventory) this.updateInventoryDOM(k);
    },
    updateHeaderDOM() {
        document.getElementById('gold').innerText = Math.floor(this.data.gold);
        document.getElementById('level').innerText = this.data.level;
        document.getElementById('xp').innerText = `${Math.floor(this.data.xp)} / ${this.getXpRequirement(this.data.level)}`;
    },
    updateInventoryDOM(key) {
        const qty = this.data.inventory[key] || 0;
        let row = document.getElementById(`inv-row-${key}`);
        if (qty <= 0) { if (row) row.remove(); return; }
        if (row) { row.querySelector('.inv-qty').innerText = `x${qty}`; return; }
        
        row = document.createElement('div'); row.className = 'item-row'; row.id = `inv-row-${key}`;
        row.innerHTML = `<span style="text-transform: capitalize">${key.replace('_', ' ')} <strong class="inv-qty">x${qty}</strong></span>
                         <button class="btn-sell" onclick="Game.sellItem('${key}')">Sell (${this.getModifiedPrice(key)}g)</button>`;
        document.getElementById('inventory-list').appendChild(row);
    },
    renderList(cat) {
        const targetId = cat === 'plots' ? 'plot-list' : cat === 'animals' ? 'animal-list' : 'machine-list';
        const container = document.getElementById(targetId);
        container.innerHTML = '';
        
        this.data[cat].forEach((slot, i) => {
            const div = document.createElement('div'); div.className = 'slot'; div.id = `${cat}-slot-${i}`;
            if (!slot) {
                div.innerHTML = `<div style="text-align:center;width:100%;color:#888;cursor:pointer">➕ Empty Slot</div>`;
                div.onclick = () => this.renderShop(cat, i);
            } else {
                const config = this.getConfig(slot.type);
                div.innerHTML = `<div class="slot-icon">${config.emoji}</div>
                    <div class="slot-info">
                        <div class="slot-name">${config.name}</div>
                        <div id="${cat}-status-${i}" style="font-size:0.7em; font-weight:bold;"></div>
                        <div class="progress-bg"><div id="${cat === 'plots' ? 'plot' : cat === 'animals' ? 'anim' : 'mach'}-bar-${i}" class="progress-fill"></div></div>
                    </div>
                    <button class="btn-sell" onclick="event.stopPropagation(); Game.clearSlot('${cat}', ${i})">❌</button>`;
            }
            container.appendChild(div);
        });
        
        const btn = document.createElement('button'); btn.className = 'btn-buy'; btn.style = 'width:100%; margin-top:10px;';
        btn.innerText = `Expand Space (${this.getExpansionCost(cat)}g)`;
        btn.onclick = () => this.expand(cat); container.appendChild(btn);
    },
    renderShop(category, index, filter = 'all') {
        let modal = document.getElementById('shop-modal');
        if (!modal) {
            modal = document.createElement('div'); modal.id = 'shop-modal'; modal.className = 'modal-overlay';
            modal.innerHTML = `<div id="shop-content" class="modal-content" style="max-height:80vh; overflow-y:auto; width:400px; color:var(--text);"></div>`;
            document.body.appendChild(modal);
        }
        modal.style.display = 'flex';
        const container = document.getElementById('shop-content');
        container.innerHTML = `<h2 style="margin-top:0; color:var(--highlight)">${category === 'upgrades' ? 'Upgrades & Managers' : 'Build Menu'}</h2>`;
        
        const box = document.createElement('div'); box.style = 'background:#2c3e50; padding:10px; border-radius:8px;';
        
        let tabs = category === 'plots' ? [{id:'all', n:'All'}, {id:'crops', n:'Seeds'}, {id:'trees', n:'Saplings'}] : 
                   category === 'upgrades' ? [{id:'all', n:'All'}, {id:'upgrades', n:'Upgrades'}, {id:'managers', n:'Automation'}] : [];
        if (tabs.length) {
            const tc = document.createElement('div'); tc.className = 'tab-container';
            tabs.forEach(t => {
                const b = document.createElement('button'); b.innerText = t.n; b.className = filter === t.id ? 'btn-tab active' : 'btn-tab';
                b.onclick = () => this.renderShop(category, index, t.id); tc.appendChild(b);
            });
            box.appendChild(tc);
        }

        let sources = {};
        if (category === 'plots') { if(filter!=='trees') Object.assign(sources, GAME_DATA.crops); if(filter!=='crops') Object.assign(sources, GAME_DATA.trees); }
        else if (category === 'upgrades') { if(filter!=='managers') Object.assign(sources, GAME_DATA.upgrades); if(filter!=='upgrades') Object.assign(sources, GAME_DATA.managers); }
        else sources = GAME_DATA[category];

        for (let key in sources) {
            const item = sources[key]; const locked = this.data.level < item.reqLevel; const isUpg = category === 'upgrades';
            if (isUpg && (this.data.upgrades[key] || this.data.managers[key])) continue;

            const row = document.createElement('div'); row.className = 'item-row'; row.style.opacity = locked ? '0.5' : '1';
            row.innerHTML = `<div style="display:flex; align-items:center; gap:10px; width:100%">
                    ${isUpg ? '' : `<span style="font-size:1.5em">${item.emoji}</span>`}
                    <div style="flex:1; text-align:left;">
                        <strong>${item.name}</strong> ${locked ? `🔒 (Lvl ${item.reqLevel})` : ''}
                        ${isUpg ? `<div style="font-size:0.7em; color:#ccc">${item.desc}</div>` : ''}
                        <div style="font-size:0.8em; color:#f1c40f">${isUpg ? `Cost: ${item.cost}g` : item.type==='crop' ? `Free (Pay ${item.seedCost}g/run)` : `Build: ${item.seedCost}g`}</div>
                    </div></div>`;
            if (!locked) { row.style.cursor = 'pointer'; row.onclick = () => isUpg ? this.buyUpgrade(GAME_DATA.upgrades[key]?'upgrades':'managers', key) : this.assignSlot(category, index, key); }
            box.appendChild(row);
        }
        const cancel = document.createElement('button'); cancel.innerText = "Close Shop";
        cancel.style = 'width:100%; margin-top:10px; padding:10px; background:#e74c3c; color:white; border:none; border-radius:5px; cursor:pointer;';
        cancel.onclick = () => modal.style.display = 'none'; box.appendChild(cancel); container.appendChild(box);
    }
};

window.onload = () => Game.init();
