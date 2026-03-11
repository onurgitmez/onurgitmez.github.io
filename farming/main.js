/* main.js */

const Game = {
    data: {
        gold: 100, 
        level: 1,
        xp: 0,
        lastSave: Date.now(),
        inventory: {},
        plots: [null, null, null], 
        animals: [null, null],     
        machines: [null, null],
        upgrades: {}, // Tracks bought upgrades
        managers: {}  // Tracks active automation
    },

    expansionCosts: { plots: 500, animals: 1000, machines: 2000 },
    
    // Animation Frame timing
    lastFrameTime: 0,
    logicAccumulator: 0,
    saveAccumulator: 0,

    init() {
        this.loadGame();
        this.render();
        // Start the native browser render loop
        requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
    },

    // --- GAME LOOP ARCHITECTURE ---
    gameLoop(timestamp) {
        if (!this.lastFrameTime) this.lastFrameTime = timestamp;
        const dt = timestamp - this.lastFrameTime;
        this.lastFrameTime = timestamp;

        this.logicAccumulator += dt;
        this.saveAccumulator += dt;

        // Logic Loop (runs every 500ms regardless of frame drops)
        if (this.logicAccumulator >= 500) {
            this.logicLoop();
            this.logicAccumulator = 0;
        }

        // Save Loop (runs every 5000ms)
        if (this.saveAccumulator >= 5000) {
            this.saveGame();
            this.saveAccumulator = 0;
        }

        // UI Loop runs as fast as the monitor allows for smooth bars
        this.uiLoop();

        requestAnimationFrame((ts) => this.gameLoop(ts));
    },

    // --- LOGIC LOOP ---
    logicLoop() {
        const now = Date.now();

        // Automation: Auto-Route Items to Machines (Logistics Network)
        if (this.data.managers.auto_route) {
            this.data.machines.forEach(slot => {
                if (slot && slot.state === 'idle') {
                    const config = GAME_DATA.machines[slot.type];
                    if (this.data.inventory[config.input] > 0) {
                        this.removeItem(config.input, 1);
                        slot.state = 'working';
                        slot.startTime = now;
                    }
                }
            });
        }

        // 1. Plots (Crops & Trees)
        this.data.plots.forEach((slot) => {
            if (!slot) return;
            const isTree = GAME_DATA.trees[slot.type];
            const config = isTree ? GAME_DATA.trees[slot.type] : GAME_DATA.crops[slot.type];
            const modifiedTime = this.getModifiedTime(config);

            // Start Growing
            if (slot.state === 'idle') {
                let canStart = isTree; // Trees always start
                
                if (!isTree) {
                    // Automation: Auto-Replant (Field Hands)
                    if (this.data.managers.auto_replant && this.data.gold >= config.seedCost) {
                        this.data.gold -= config.seedCost;
                        canStart = true;
                        this.renderHeader();
                    }
                }

                if (canStart) {
                    slot.state = 'growing';
                    slot.startTime = now;
                }
            }
            // Finish Growing
            else if (slot.state === 'growing' && now - slot.startTime >= modifiedTime) {
                this.addItem(slot.type, 1);
                this.addXp(config.xp);
                slot.state = 'idle';
                
                // If it's a tree, it restarts immediately. If crop, it waits for auto_replant or manual click
                if (isTree) {
                    slot.state = 'growing';
                    slot.startTime = now;
                }
            }
        });

        // 2. Animals
        this.data.animals.forEach(slot => {
            if (!slot) return;
            const config = GAME_DATA.animals[slot.type];
            const modifiedTime = this.getModifiedTime(config);

            if (now - slot.startTime >= modifiedTime) {
                this.addItem(config.output, 1);
                this.addXp(config.xp);
                slot.startTime = now; // Restart loop
            }
        });

        // 3. Machines
        this.data.machines.forEach(slot => {
            if (!slot) return;
            const config = GAME_DATA.machines[slot.type];
            const modifiedTime = this.getModifiedTime(config);

            if (slot.state === 'working' && now - slot.startTime >= modifiedTime) {
                this.addItem(config.output, 1);
                this.addXp(config.xp);
                slot.state = 'idle';
            }
        });

        // Automation: Auto-Sell (Wholesale Contracts)
        if (this.data.managers.auto_sell) {
            // Only sell end products, do not sell inputs needed for machines
            for (let key in this.data.inventory) {
                const isInput = Object.values(GAME_DATA.machines).some(m => m.input === key);
                if (!isInput) {
                    this.sellItem(key, true); // true = sell all
                }
            }
        }
    },

    // --- UI LOOP (Visuals) ---
    uiLoop() {
        const now = Date.now();
        const updateBar = (id, percent, color) => {
            const el = document.getElementById(id);
            if (el) {
                el.style.width = Math.min(100, Math.max(0, percent)) + '%';
                if (color) el.style.background = color;
            }
        };

        this.data.plots.forEach((slot, i) => {
            if (!slot) return;
            const config = GAME_DATA.trees[slot.type] || GAME_DATA.crops[slot.type];
            if (slot.state === 'growing') {
                updateBar(`plot-bar-${i}`, ((now - slot.startTime) / this.getModifiedTime(config)) * 100, '#2ecc71');
            } else {
                updateBar(`plot-bar-${i}`, 0, GAME_DATA.trees[slot.type] ? '#2ecc71' : '#e74c3c');
            }
        });

        this.data.animals.forEach((slot, i) => {
            if (!slot) return;
            const config = GAME_DATA.animals[slot.type];
            updateBar(`anim-bar-${i}`, ((now - slot.startTime) / this.getModifiedTime(config)) * 100, '#f1c40f');
        });

        this.data.machines.forEach((slot, i) => {
            if (!slot) return;
            const config = GAME_DATA.machines[slot.type];
            if (slot.state === 'working') {
                updateBar(`mach-bar-${i}`, ((now - slot.startTime) / this.getModifiedTime(config)) * 100, '#3498db');
            } else {
                updateBar(`mach-bar-${i}`, 0, '#3498db');
            }
        });
    },

    // --- OFFLINE PROGRESS ---
    processOfflineProgress(elapsedMs) {
        if (elapsedMs < 60000) return; // Only trigger if gone for > 1 minute

        let itemsGained = {};
        let xpGained = 0;
        const now = Date.now();

        // Simulate Trees & Animals (Infinite loops)
        const simulateInfinite = (slots, configDB) => {
            slots.forEach(slot => {
                if (!slot) return;
                const config = configDB[slot.type];
                const timeReq = this.getModifiedTime(config);
                
                // Add remaining time from last save to elapsed
                const totalTimeAvailable = elapsedMs + (this.data.lastSave - slot.startTime);
                const cycles = Math.floor(totalTimeAvailable / timeReq);
                
                if (cycles > 0) {
                    const outputStr = config.output || slot.type; // output for animal, type for tree
                    itemsGained[outputStr] = (itemsGained[outputStr] || 0) + cycles;
                    xpGained += (config.xp * cycles);
                    // Reset start time perfectly to account for remainder
                    slot.startTime = now - (totalTimeAvailable % timeReq);
                }
            });
        };

        simulateInfinite(this.data.trees ? this.data.plots.filter(p => p && GAME_DATA.trees[p.type]) : [], GAME_DATA.trees);
        simulateInfinite(this.data.animals, GAME_DATA.animals);

        // Apply offline gains
        for (let key in itemsGained) {
            this.addItem(key, itemsGained[key]);
        }
        if (xpGained > 0) this.addXp(xpGained);

        // Show Modal
        if (Object.keys(itemsGained).length > 0) {
            let reportHtml = '';
            for (let k in itemsGained) reportHtml += `<div>+${itemsGained[k]} ${k.replace('_', ' ')}</div>`;
            reportHtml += `<div style="color:#2ecc71; margin-top:5px;">+${xpGained} XP</div>`;
            
            const reportEl = document.getElementById('offline-report');
            const modalEl = document.getElementById('offline-modal');
            if(reportEl && modalEl) {
                reportEl.innerHTML = reportHtml;
                modalEl.style.display = 'flex';
            }
        }
    },

    // --- MODIFIERS (Upgrades) ---
    getModifiedTime(config) {
        let time = config.time;
        if (config.type === 'crop') {
            if (this.data.upgrades.tractor) time *= 0.65;
            else if (this.data.upgrades.irrigation) time *= 0.80;
            else if (this.data.upgrades.steel_tools) time *= 0.90;
        }
        return time;
    },

    getModifiedPrice(key) {
        let price = 0;
        if (GAME_DATA.crops[key]) price = GAME_DATA.crops[key].sell;
        else if (GAME_DATA.trees[key]) price = GAME_DATA.trees[key].sell;
        else if (GAME_DATA.products[key]) price = GAME_DATA.products[key].sell;
        
        // Check if it's an animal product
        const isAnimalProduct = Object.values(GAME_DATA.animals).some(a => a.output === key);
        if (isAnimalProduct) {
            if (this.data.upgrades.selective_breeding) price *= 1.50;
            else if (this.data.upgrades.premium_feed) price *= 1.25;
        }

        // Check if it's a machine product (Artisan Good)
        const isMachineProduct = Object.values(GAME_DATA.machines).some(m => m.output === key);
        if (isMachineProduct && this.data.upgrades.artisan_crafting) {
            price *= 1.40;
        }
        
        return Math.floor(price);
    },

    // --- DYNAMIC INVENTORY ---
    addItem(key, qty) { 
        this.data.inventory[key] = (this.data.inventory[key] || 0) + qty;
        this.updateInventoryDOM(key);
    },

    removeItem(key, qty) {
        if (this.data.inventory[key] >= qty) {
            this.data.inventory[key] -= qty;
            if (this.data.inventory[key] === 0) delete this.data.inventory[key];
            this.updateInventoryDOM(key);
        }
    },

    updateInventoryDOM(key) {
        const container = document.getElementById('inventory-list');
        const qty = this.data.inventory[key] || 0;
        let row = document.getElementById(`inv-row-${key}`);

        // If depleted, remove node
        if (qty <= 0) {
            if (row) row.remove();
            return;
        }

        const price = this.getModifiedPrice(key);
        const displayName = key.replace('_', ' ');

        // If it exists, just update text (No flickering!)
        if (row) {
            row.querySelector('.inv-qty').innerText = `x${qty}`;
            return;
        }

        // If it doesn't exist, create it
        row = document.createElement('div');
        row.className = 'item-row';
        row.id = `inv-row-${key}`;
        row.innerHTML = `
            <span style="text-transform: capitalize">${displayName} <strong class="inv-qty">x${qty}</strong></span>
            <button class="btn-sell" onclick="Game.sellItem('${key}')">Sell (${price}g)</button>
        `;
        container.appendChild(row);
    },

    // --- ECONOMY ---
    sellItem(key, all) {
        const qty = all ? this.data.inventory[key] : 1;
        if (!qty) return;

        const price = this.getModifiedPrice(key);
        if (price > 0) {
            this.data.gold += price * qty;
            this.removeItem(key, qty);
            this.renderHeader();
        }
    },

    sellAllEverything() {
        for(let key in this.data.inventory) {
            this.sellItem(key, true);
        }
    },

    buyUpgrade(type, key) {
        const db = type === 'upgrades' ? GAME_DATA.upgrades : GAME_DATA.managers;
        const config = db[key];

        if (this.data.gold >= config.cost) {
            this.data.gold -= config.cost;
            this.data[type][key] = true; 
            this.renderHeader();
            this.renderShop('upgrades'); // re-render to remove it from shop
            this.saveGame();
        } else {
            alert(`Not enough gold! Need ${config.cost}g`);
        }
    },

    // --- ACTIONS & DATA HELPERS ---
    assignSlot(category, index, typeKey) {
        let sources = {...GAME_DATA.crops, ...GAME_DATA.trees, ...GAME_DATA.animals, ...GAME_DATA.machines};
        let config = sources[typeKey];
        let setupCost = (config.type === 'crop') ? 0 : config.seedCost;

        if (this.data.gold >= setupCost) {
            this.data.gold -= setupCost;
            this.data[category][index] = { type: typeKey, state: 'idle', startTime: Date.now() };
            
            // Auto-start logic
            if (config.type === 'crop' && (!this.data.managers.auto_replant)) {
                 if (this.data.gold >= config.seedCost) {
                     this.data.gold -= config.seedCost;
                     this.data[category][index].state = 'growing';
                 }
            } else if (config.type !== 'crop') {
                 // Trees, machines, animals auto start their idle loop
                 this.data[category][index].state = GAME_DATA.machines[typeKey] ? 'idle' : 'growing';
            }
            
            this.render();
            this.saveGame();
        } else {
            alert(`Not enough gold! Need ${setupCost}g`);
        }
    },

    clearSlot(category, index) {
        if(confirm("Remove this item? You won't get the gold back.")) {
            this.data[category][index] = null;
            this.render();
        }
    },

    expand(category) {
        const cost = this.expansionCosts[category] * this.data[category].length;
        if (this.data.gold >= cost) {
            this.data.gold -= cost;
            this.data[category].push(null);
            this.render();
        } else {
            alert(`Need ${cost}g to expand`);
        }
    },

    addXp(amount) {
        this.data.xp += amount;
        const needed = this.data.level * 100;
        if (this.data.xp >= needed) {
            this.data.xp -= needed;
            this.data.level++;
            alert(`🎉 Level Up! You are now Level ${this.data.level}`);
            this.render(); 
        }
        this.renderHeader();
    },

    resetGame() {
        if(confirm("Reset all progress?")) {
            localStorage.removeItem('farm_tycoon_v5');
            location.reload();
        }
    },

    saveGame() {
        this.data.lastSave = Date.now();
        localStorage.setItem('farm_tycoon_v5', JSON.stringify(this.data));
    },

    loadGame() {
        const save = localStorage.getItem('farm_tycoon_v5');
        if (save) {
            try { 
                this.data = { ...this.data, ...JSON.parse(save) }; 
                const elapsedMs = Date.now() - this.data.lastSave;
                this.processOfflineProgress(elapsedMs);
            } catch(e) {}
        }
    },

    // --- RENDERING ---
    render() {
        this.renderHeader();
        this.renderList('plots', 'plot-list');
        this.renderList('animals', 'animal-list');
        this.renderList('machines', 'machine-list');
        
        document.getElementById('inventory-list').innerHTML = '';
        for (let key in this.data.inventory) {
            this.updateInventoryDOM(key);
        }
    },

    renderHeader() {
        const needed = this.data.level * 100;
        document.getElementById('gold').innerText = Math.floor(this.data.gold);
        document.getElementById('level').innerText = this.data.level;
        document.getElementById('xp').innerText = `${Math.floor(this.data.xp)} / ${needed}`;
    },

    renderList(category, domId) {
        const container = document.getElementById(domId);
        container.innerHTML = '';

        this.data[category].forEach((slot, index) => {
            const div = document.createElement('div');
            div.className = 'slot';

            if (!slot) {
                div.innerHTML = `<div style="text-align:center;width:100%;color:#888;cursor:pointer">➕ Empty Slot</div>`;
                div.onclick = () => this.renderShop(category, index);
            } else {
                let sources = {...GAME_DATA.crops, ...GAME_DATA.trees, ...GAME_DATA.animals, ...GAME_DATA.machines};
                const config = sources[slot.type];
                
                let sub = '';
                let statusColor = '#aaa';
                
                if (category === 'plots' && !GAME_DATA.trees[slot.type]) {
                    if (this.data.gold < config.seedCost && slot.state === 'idle') {
                        sub = "WAITING FOR FUNDS";
                        statusColor = '#e74c3c';
                    } else if (slot.state === 'idle') {
                         sub = "CLICK TO PLANT";
                         div.style.cursor = 'pointer';
                         div.onclick = () => {
                             if(this.data.gold >= config.seedCost) {
                                 this.data.gold -= config.seedCost;
                                 slot.state = 'growing';
                                 slot.startTime = Date.now();
                             }
                         }
                    } else {
                        sub = `Cost: ${config.seedCost}g`;
                    }
                } else if (category === 'machines') {
                    sub = slot.state === 'working' ? 'Processing...' : `Needs ${config.input.replace('_', ' ')}`;
                } else {
                    sub = 'Producing...';
                }

                div.innerHTML += `
                    <div class="slot-icon">${config.emoji}</div>
                    <div class="slot-info">
                        <div class="slot-name">${config.name}</div>
                        <div style="font-size:0.7em; color:${statusColor}">${sub}</div>
                        <div class="progress-bg">
                            <div id="${category === 'plots' ? 'plot' : category === 'animals' ? 'anim' : 'mach'}-bar-${index}" class="progress-fill"></div>
                        </div>
                    </div>
                    <button class="btn-sell" onclick="event.stopPropagation(); Game.clearSlot('${category}', ${index})">❌</button>
                `;
            }
            container.appendChild(div);
        });

        const cost = this.expansionCosts[category] * this.data[category].length;
        const btn = document.createElement('button');
        btn.className = 'btn-buy';
        btn.style.width = '100%';
        btn.style.marginTop = '10px';
        btn.innerText = `Expand Space (${cost}g)`;
        btn.onclick = () => this.expand(category);
        container.appendChild(btn);
    },

    renderShop(category, index) {
        const container = document.getElementById('animal-list'); 
        if (category === 'upgrades') {
             container.innerHTML = `<h3 style="margin-top:0">Upgrades & Managers</h3>`;
        } else {
             container.innerHTML = `<h3 style="margin-top:0">Build</h3>`;
        }

        const shopBox = document.createElement('div');
        shopBox.style.background = '#2c3e50';
        shopBox.style.padding = '10px';
        shopBox.style.borderRadius = '8px';

        let sources = {};
        if (category === 'plots') sources = {...GAME_DATA.crops, ...GAME_DATA.trees};
        else if (category === 'animals') sources = GAME_DATA.animals;
        else if (category === 'machines') sources = GAME_DATA.machines;
        else sources = {...GAME_DATA.upgrades, ...GAME_DATA.managers}; 

        for (let key in sources) {
            const item = sources[key];
            const locked = this.data.level < item.reqLevel;
            const isUpgrade = category === 'upgrades';
            
            let bought = false;
            if (isUpgrade) {
                if (GAME_DATA.upgrades[key] && this.data.upgrades[key]) bought = true;
                if (GAME_DATA.managers[key] && this.data.managers[key]) bought = true;
            }

            if (bought) continue; 

            const row = document.createElement('div');
            row.className = 'item-row';
            row.style.opacity = locked ? '0.5' : '1';
            
            let costTxt = isUpgrade ? `Cost: ${item.cost}g` : 
                          (item.type === 'crop' ? `Free Setup (Pay ${item.seedCost}g/run)` : `Build Cost: ${item.seedCost}g`);

            row.innerHTML = `
                <div style="display:flex; align-items:center; gap:10px; width:100%">
                    ${isUpgrade ? '' : `<span style="font-size:1.5em">${item.emoji}</span>`}
                    <div style="flex:1">
                        <strong>${item.name}</strong> ${locked ? `🔒 (Lvl ${item.reqLevel})` : ''}
                        ${isUpgrade ? `<div style="font-size:0.7em; color:#ccc">${item.desc}</div>` : ''}
                        <div style="font-size:0.8em; color:#f1c40f">${costTxt}</div>
                    </div>
                </div>
            `;
            
            if (!locked) {
                row.style.cursor = 'pointer';
                row.onclick = () => {
                    if (isUpgrade) {
                        const type = GAME_DATA.upgrades[key] ? 'upgrades' : 'managers';
                        this.buyUpgrade(type, key);
                    } else {
                        this.assignSlot(category, index, key);
                    }
                };
            }
            shopBox.appendChild(row);
        }

        const cancel = document.createElement('button');
        cancel.innerText = "Close Shop";
        cancel.className = 'btn-sell';
        cancel.style.width = '100%';
        cancel.style.marginTop = '10px';
        cancel.onclick = () => this.render();
        shopBox.appendChild(cancel);

        container.appendChild(shopBox);
    }
};

window.onload = () => Game.init();
