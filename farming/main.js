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
        upgrades: {}, 
        managers: {}  
    },

    expansionCosts: { plots: 500, animals: 1000, machines: 2000 },
    
    lastFrameTime: 0,
    logicAccumulator: 0,
    saveAccumulator: 0,

    init() {
        this.loadGame();
        this.render();
        requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
    },

    // --- GAME LOOP ARCHITECTURE ---
    gameLoop(timestamp) {
        if (!this.lastFrameTime) this.lastFrameTime = timestamp;
        const dt = timestamp - this.lastFrameTime;
        this.lastFrameTime = timestamp;

        this.logicAccumulator += dt;
        this.saveAccumulator += dt;

        if (this.logicAccumulator >= 500) {
            this.logicLoop();
            this.logicAccumulator = 0;
        }

        if (this.saveAccumulator >= 5000) {
            this.saveGame();
            this.saveAccumulator = 0;
        }

        this.uiLoop();
        requestAnimationFrame((ts) => this.gameLoop(ts));
    },

    // --- LOGIC LOOP (No UI rendering here anymore!) ---
    logicLoop() {
        const now = Date.now();

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

        this.data.plots.forEach((slot) => {
            if (!slot) return;
            const isTree = GAME_DATA.trees[slot.type];
            const config = isTree ? GAME_DATA.trees[slot.type] : GAME_DATA.crops[slot.type];
            const modifiedTime = this.getModifiedTime(config);

            if (slot.state === 'idle') {
                let canStart = isTree; 
                if (!isTree && this.data.managers.auto_replant && this.data.gold >= config.seedCost) {
                    this.data.gold -= config.seedCost;
                    canStart = true;
                    this.renderHeader();
                }
                if (canStart) {
                    slot.state = 'growing';
                    slot.startTime = now;
                }
            }
            else if (slot.state === 'growing' && now - slot.startTime >= modifiedTime) {
                this.addItem(slot.type, 1);
                this.addXp(config.xp);
                slot.state = 'idle';
                
                if (isTree) {
                    slot.state = 'growing';
                    slot.startTime = now;
                }
            }
        });

        this.data.animals.forEach(slot => {
            if (!slot) return;
            const config = GAME_DATA.animals[slot.type];
            const modifiedTime = this.getModifiedTime(config);

            if (now - slot.startTime >= modifiedTime) {
                this.addItem(config.output, 1);
                this.addXp(config.xp);
                slot.startTime = now; 
            }
        });

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

        if (this.data.managers.auto_sell) {
            for (let key in this.data.inventory) {
                const isInput = Object.values(GAME_DATA.machines).some(m => m.input === key);
                if (!isInput) this.sellItem(key, true); 
            }
        }
    },

    // --- UI LOOP (Real-time updates, zero flickering) ---
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
            const isTree = GAME_DATA.trees[slot.type];
            const statusEl = document.getElementById(`plots-status-${i}`);
            const slotEl = document.getElementById(`plots-slot-${i}`);
            
            if (slot.state === 'growing') {
                updateBar(`plot-bar-${i}`, ((now - slot.startTime) / this.getModifiedTime(config)) * 100, '#2ecc71');
                if (statusEl) { statusEl.innerText = 'Producing...'; statusEl.style.color = '#aaa'; }
                if (slotEl) { slotEl.style.cursor = 'default'; slotEl.onclick = null; }
            } else {
                updateBar(`plot-bar-${i}`, 0, isTree ? '#2ecc71' : '#e74c3c');
                if (statusEl && !isTree) {
                    if (this.data.gold < config.seedCost) {
                        statusEl.innerText = `WAITING FOR FUNDS (${config.seedCost}g)`;
                        statusEl.style.color = '#e74c3c';
                        if (slotEl) { slotEl.style.cursor = 'default'; slotEl.onclick = null; }
                    } else {
                        statusEl.innerText = `CLICK TO PLANT (${config.seedCost}g)`;
                        statusEl.style.color = '#2ecc71';
                        if (slotEl) {
                            slotEl.style.cursor = 'pointer';
                            // Manual planting logic directly attached here!
                            slotEl.onclick = () => {
                                if(this.data.gold >= config.seedCost) {
                                    this.data.gold -= config.seedCost;
                                    slot.state = 'growing';
                                    slot.startTime = Date.now();
                                    this.renderHeader();
                                }
                            };
                        }
                    }
                }
            }
        });

        this.data.animals.forEach((slot, i) => {
            if (!slot) return;
            const config = GAME_DATA.animals[slot.type];
            updateBar(`anim-bar-${i}`, ((now - slot.startTime) / this.getModifiedTime(config)) * 100, '#f1c40f');
            const statusEl = document.getElementById(`animals-status-${i}`);
            if (statusEl) { statusEl.innerText = 'Producing...'; statusEl.style.color = '#aaa'; }
        });

        this.data.machines.forEach((slot, i) => {
            if (!slot) return;
            const config = GAME_DATA.machines[slot.type];
            const statusEl = document.getElementById(`machines-status-${i}`);
            if (slot.state === 'working') {
                updateBar(`mach-bar-${i}`, ((now - slot.startTime) / this.getModifiedTime(config)) * 100, '#3498db');
                if (statusEl) { statusEl.innerText = 'Processing...'; statusEl.style.color = '#aaa'; }
            } else {
                updateBar(`mach-bar-${i}`, 0, '#3498db');
                if (statusEl) { statusEl.innerText = `Needs ${config.input.replace('_', ' ')}`; statusEl.style.color = '#e67e22'; }
            }
        });
    },

    processOfflineProgress(elapsedMs) {
        if (elapsedMs < 60000) return; 
        let itemsGained = {};
        let xpGained = 0;
        const now = Date.now();

        const simulateInfinite = (slots, configDB) => {
            slots.forEach(slot => {
                if (!slot) return;
                const config = configDB[slot.type];
                const timeReq = this.getModifiedTime(config);
                const totalTimeAvailable = elapsedMs + (this.data.lastSave - slot.startTime);
                const cycles = Math.floor(totalTimeAvailable / timeReq);
                if (cycles > 0) {
                    const outputStr = config.output || slot.type; 
                    itemsGained[outputStr] = (itemsGained[outputStr] || 0) + cycles;
                    xpGained += (config.xp * cycles);
                    slot.startTime = now - (totalTimeAvailable % timeReq);
                }
            });
        };

        simulateInfinite(this.data.trees ? this.data.plots.filter(p => p && GAME_DATA.trees[p.type]) : [], GAME_DATA.trees);
        simulateInfinite(this.data.animals, GAME_DATA.animals);

        for (let key in itemsGained) this.addItem(key, itemsGained[key]);
        if (xpGained > 0) this.addXp(xpGained);

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
        
        const isAnimalProduct = Object.values(GAME_DATA.animals).some(a => a.output === key);
        if (isAnimalProduct) {
            if (this.data.upgrades.selective_breeding) price *= 1.50;
            else if (this.data.upgrades.premium_feed) price *= 1.25;
        }

        const isMachineProduct = Object.values(GAME_DATA.machines).some(m => m.output === key);
        if (isMachineProduct && this.data.upgrades.artisan_crafting) price *= 1.40;
        
        return Math.floor(price);
    },

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

        if (qty <= 0) {
            if (row) row.remove();
            return;
        }

        const price = this.getModifiedPrice(key);
        const displayName = key.replace('_', ' ');

        if (row) {
            row.querySelector('.inv-qty').innerText = `x${qty}`;
            return;
        }

        row = document.createElement('div');
        row.className = 'item-row';
        row.id = `inv-row-${key}`;
        row.innerHTML = `
            <span style="text-transform: capitalize">${displayName} <strong class="inv-qty">x${qty}</strong></span>
            <button class="btn-sell" onclick="Game.sellItem('${key}')">Sell (${price}g)</button>
        `;
        container.appendChild(row);
    },

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
            this.renderShop('upgrades'); 
            this.saveGame();
        } else {
            alert(`Not enough gold! Need ${config.cost}g`);
        }
    },

    assignSlot(category, index, typeKey) {
        let sources = {...GAME_DATA.crops, ...GAME_DATA.trees, ...GAME_DATA.animals, ...GAME_DATA.machines};
        let config = sources[typeKey];
        let setupCost = (config.type === 'crop') ? 0 : config.seedCost;

        if (this.data.gold >= setupCost) {
            this.data.gold -= setupCost;
            this.data[category][index] = { type: typeKey, state: 'idle', startTime: Date.now() };
            
            if (config.type === 'crop' && (!this.data.managers.auto_replant)) {
                 if (this.data.gold >= config.seedCost) {
                     this.data.gold -= config.seedCost;
                     this.data[category][index].state = 'growing';
                 }
            } else if (config.type !== 'crop') {
                 this.data[category][index].state = GAME_DATA.machines[typeKey] ? 'idle' : 'growing';
            }
            
            // Close the shop modal after buying!
            const modal = document.getElementById('shop-modal');
            if (modal) modal.style.display = 'none';

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
            localStorage.removeItem('farm_tycoon_v7');
            location.reload();
        }
    },

    saveGame() {
        this.data.lastSave = Date.now();
        localStorage.setItem('farm_tycoon_v7', JSON.stringify(this.data));
    },

    loadGame() {
        const save = localStorage.getItem('farm_tycoon_v7');
        if (save) {
            try { 
                this.data = { ...this.data, ...JSON.parse(save) }; 
                const elapsedMs = Date.now() - this.data.lastSave;
                this.processOfflineProgress(elapsedMs);
            } catch(e) {}
        }
    },

    // --- RENDERING DOM ELEMENTS ONCE ---
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
            div.id = `${category}-slot-${index}`; // ID for uiLoop to target

            if (!slot) {
                div.innerHTML = `<div style="text-align:center;width:100%;color:#888;cursor:pointer">➕ Empty Slot</div>`;
                div.onclick = () => this.renderShop(category, index);
            } else {
                let sources = {...GAME_DATA.crops, ...GAME_DATA.trees, ...GAME_DATA.animals, ...GAME_DATA.machines};
                const config = sources[slot.type];
                
                // We render empty placeholders, uiLoop populates them instantly
                div.innerHTML += `
                    <div class="slot-icon">${config.emoji}</div>
                    <div class="slot-info">
                        <div class="slot-name">${config.name}</div>
                        <div id="${category}-status-${index}" style="font-size:0.7em; font-weight:bold;"></div>
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

    // --- NEW DYNAMIC SHOP MODAL ---
    renderShop(category, index, currentFilter = 'all') {
        // Create the modal dynamically if it doesn't exist
        let modal = document.getElementById('shop-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'shop-modal';
            modal.className = 'modal-overlay';
            modal.innerHTML = `<div id="shop-content" class="modal-content" style="max-height: 80vh; overflow-y: auto; width: 400px; color: var(--text);"></div>`;
            document.body.appendChild(modal);
        }
        modal.style.display = 'flex';
        
        const container = document.getElementById('shop-content');
        
        if (category === 'upgrades') {
             container.innerHTML = `<h2 style="margin-top:0; color: var(--highlight)">Upgrades & Managers</h2>`;
        } else {
             container.innerHTML = `<h2 style="margin-top:0; color: var(--highlight)">Build Menu</h2>`;
        }

        const shopBox = document.createElement('div');
        shopBox.style.background = '#2c3e50';
        shopBox.style.padding = '10px';
        shopBox.style.borderRadius = '8px';

        let tabs = [];
        if (category === 'plots') {
            tabs = [{ id: 'all', name: 'All' }, { id: 'crops', name: 'Seeds' }, { id: 'trees', name: 'Saplings' }];
        } else if (category === 'upgrades') {
            tabs = [{ id: 'all', name: 'All' }, { id: 'upgrades', name: 'Upgrades' }, { id: 'managers', name: 'Automation' }];
        }

        if (tabs.length > 0) {
            const tabContainer = document.createElement('div');
            tabContainer.className = 'tab-container';

            tabs.forEach(tab => {
                const btn = document.createElement('button');
                btn.innerText = tab.name;
                btn.className = currentFilter === tab.id ? 'btn-tab active' : 'btn-tab';
                btn.onclick = () => this.renderShop(category, index, tab.id);
                tabContainer.appendChild(btn);
            });
            shopBox.appendChild(tabContainer);
        }

        let sources = {};
        if (category === 'plots') {
            if (currentFilter === 'all' || currentFilter === 'crops') Object.assign(sources, GAME_DATA.crops);
            if (currentFilter === 'all' || currentFilter === 'trees') Object.assign(sources, GAME_DATA.trees);
        } else if (category === 'animals') {
            sources = GAME_DATA.animals;
        } else if (category === 'machines') {
            sources = GAME_DATA.machines;
        } else if (category === 'upgrades') {
            if (currentFilter === 'all' || currentFilter === 'upgrades') Object.assign(sources, GAME_DATA.upgrades);
            if (currentFilter === 'all' || currentFilter === 'managers') Object.assign(sources, GAME_DATA.managers);
        }

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
                    <div style="flex:1; text-align: left;">
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
        cancel.className = 'btn-danger'; // Using a red button for clarity
        cancel.style.width = '100%';
        cancel.style.marginTop = '10px';
        cancel.style.padding = '10px';
        cancel.style.background = '#e74c3c';
        cancel.style.color = 'white';
        cancel.style.border = 'none';
        cancel.style.borderRadius = '5px';
        cancel.style.cursor = 'pointer';
        
        // Modal Hide Logic
        cancel.onclick = () => { modal.style.display = 'none'; };
        
        shopBox.appendChild(cancel);
        container.appendChild(shopBox);
    }
};

window.onload = () => Game.init();
