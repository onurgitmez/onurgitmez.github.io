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
        machines: [null, null]     
    },

    expansionCosts: { plots: 500, animals: 1000, machines: 2000 },

    init() {
        this.loadGame();
        this.render();
        
        // 1. SAVE Loop (Every 5 seconds)
        setInterval(() => this.saveGame(), 5000); 
        // 2. VISUAL Loop (Every 50ms for smooth bars)
        setInterval(() => this.uiLoop(), 50);
        // 3. LOGIC Loop (Every 500ms for resource calculation)
        setInterval(() => this.logicLoop(), 500);
    },

    // --- LOGIC LOOP ---
    logicLoop() {
        const now = Date.now();

        // 1. Plots (Crops & Trees)
        this.data.plots.forEach((slot) => {
            if (!slot) return;
            const isTree = GAME_DATA.trees[slot.type];
            const config = isTree ? GAME_DATA.trees[slot.type] : GAME_DATA.crops[slot.type];
            if (!config) return;

            // State: IDLE -> GROWING
            if (slot.state === 'idle') {
                let canStart = false;
                
                if (isTree) {
                    // Trees grow for free once planted
                    canStart = true;
                } else {
                    // Crops need money deducted every time
                    if (this.data.gold >= config.seedCost) {
                        this.data.gold -= config.seedCost;
                        canStart = true;
                        this.renderHeader(); // Show money change
                    }
                }

                if (canStart) {
                    slot.state = 'growing';
                    slot.startTime = now;
                }
            }
            // State: GROWING -> IDLE (Harvest)
            else if (slot.state === 'growing') {
                if (now - slot.startTime >= config.time) {
                    this.addItem(slot.type, 1);
                    this.addXp(config.xp);
                    slot.state = 'idle';
                }
            }
        });

        // 2. Animals
        this.data.animals.forEach(slot => {
            if (!slot) return;
            const config = GAME_DATA.animals[slot.type];
            if (now - slot.startTime >= config.time) {
                this.addItem(config.output, 1);
                this.addXp(config.xp);
                slot.startTime = now;
            }
        });

        // 3. Machines
        this.data.machines.forEach(slot => {
            if (!slot) return;
            const config = GAME_DATA.machines[slot.type];

            if (slot.state === 'idle') {
                // Check if we have input ingredient
                if (this.data.inventory[config.input] > 0) {
                    this.removeItem(config.input, 1);
                    slot.state = 'working';
                    slot.startTime = now;
                    this.renderInventory();
                }
            } 
            else if (slot.state === 'working') {
                if (now - slot.startTime >= config.time) {
                    this.addItem(config.output, 1);
                    this.addXp(config.xp);
                    slot.state = 'idle';
                }
            }
        });
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

        // Plots
        this.data.plots.forEach((slot, i) => {
            if (!slot) return;
            const config = GAME_DATA.trees[slot.type] || GAME_DATA.crops[slot.type];
            if (slot.state === 'idle') {
                // If it's a crop waiting for funds, show red
                if (!GAME_DATA.trees[slot.type] && this.data.gold < config.seedCost) {
                    updateBar(`plot-bar-${i}`, 100, '#e74c3c');
                } else {
                    updateBar(`plot-bar-${i}`, 0, '#2ecc71');
                }
            } else {
                updateBar(`plot-bar-${i}`, ((now - slot.startTime) / config.time) * 100, '#2ecc71');
            }
        });

        // Animals
        this.data.animals.forEach((slot, i) => {
            if (!slot) return;
            const config = GAME_DATA.animals[slot.type];
            updateBar(`anim-bar-${i}`, ((now - slot.startTime) / config.time) * 100, '#f1c40f');
        });

        // Machines
        this.data.machines.forEach((slot, i) => {
            if (!slot) return;
            const config = GAME_DATA.machines[slot.type];
            if (slot.state === 'working') {
                updateBar(`mach-bar-${i}`, ((now - slot.startTime) / config.time) * 100, '#3498db');
            } else {
                updateBar(`mach-bar-${i}`, 0, '#3498db');
            }
        });
    },

    // --- ACTIONS ---
    assignSlot(category, index, typeKey) {
        let sources = {...GAME_DATA.crops, ...GAME_DATA.trees, ...GAME_DATA.animals, ...GAME_DATA.machines};
        let config = sources[typeKey];
        
        // Setup Cost (Crops = 0, others = seedCost)
        let setupCost = (config.type === 'crop') ? 0 : config.seedCost;

        if (this.data.gold >= setupCost) {
            this.data.gold -= setupCost;
            this.data[category][index] = { type: typeKey, state: 'idle', startTime: Date.now() };
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

    // --- ECONOMY ---
    getPrice(key) {
        if (GAME_DATA.crops[key]) return GAME_DATA.crops[key].sell;
        if (GAME_DATA.trees[key]) return GAME_DATA.trees[key].sell;
        if (GAME_DATA.products[key]) return GAME_DATA.products[key].sell; 
        return 0;
    },

    sellItem(key, all) {
        const qty = all ? this.data.inventory[key] : 1;
        if (!qty) return;

        const price = this.getPrice(key);
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

    // --- DATA HELPERS ---
    addItem(key, qty) { 
        this.data.inventory[key] = (this.data.inventory[key] || 0) + qty;
        this.renderInventory();
    },

    removeItem(key, qty) {
        if (this.data.inventory[key] >= qty) {
            this.data.inventory[key] -= qty;
            if (this.data.inventory[key] === 0) delete this.data.inventory[key];
            this.renderInventory();
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
            localStorage.removeItem('farm_tycoon_v3');
            location.reload();
        }
    },

    saveGame() {
        this.data.lastSave = Date.now();
        localStorage.setItem('farm_tycoon_v3', JSON.stringify(this.data));
    },

    loadGame() {
        const save = localStorage.getItem('farm_tycoon_v3');
        if (save) {
            try { this.data = { ...this.data, ...JSON.parse(save) }; } catch(e) {}
        }
    },

    // --- RENDERING ---
    render() {
        this.renderHeader();
        this.renderList('plots', 'plot-list');
        this.renderList('animals', 'animal-list');
        this.renderList('machines', 'machine-list');
        this.renderInventory();
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
                div.onclick = () => this.openShop(category, index);
            } else {
                let sources = {...GAME_DATA.crops, ...GAME_DATA.trees, ...GAME_DATA.animals, ...GAME_DATA.machines};
                const config = sources[slot.type];
                
                let sub = '';
                let statusColor = '#aaa';
                
                if (category === 'plots' && !GAME_DATA.trees[slot.type]) {
                    if (this.data.gold < config.seedCost && slot.state === 'idle') {
                        sub = "WAITING FOR FUNDS";
                        statusColor = '#e74c3c';
                    } else {
                        sub = `Cost: ${config.seedCost}g`;
                    }
                } else if (category === 'machines') {
                    sub = slot.state === 'working' ? 'Processing...' : `Needs ${config.input}`;
                } else {
                    sub = 'Producing...';
                }

                div.innerHTML = `
                    <div class="slot-icon">${config.emoji}</div>
                    <div class="slot-info">
                        <div class="slot-name">${config.name}</div>
                        <div style="font-size:0.7em; color:${statusColor}">${sub}</div>
                        <div class="progress-bg">
                            <div id="${category === 'plots' ? 'plot' : category === 'animals' ? 'anim' : 'mach'}-bar-${index}" class="progress-fill"></div>
                        </div>
                    </div>
                    <button class="btn-sell" onclick="Game.clearSlot('${category}', ${index})">❌</button>
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

    openShop(category, index) {
        const container = document.getElementById(category === 'plots' ? 'plot-list' : category === 'animals' ? 'animal-list' : 'machine-list');
        container.innerHTML = '';

        const shopBox = document.createElement('div');
        shopBox.style.background = '#2c3e50';
        shopBox.style.padding = '10px';
        shopBox.style.borderRadius = '8px';

        let sources = {};
        if (category === 'plots') sources = {...GAME_DATA.crops, ...GAME_DATA.trees};
        else if (category === 'animals') sources = GAME_DATA.animals;
        else sources = GAME_DATA.machines;

        for (let key in sources) {
            const item = sources[key];
            const locked = this.data.level < item.reqLevel;

            const row = document.createElement('div');
            row.className = 'item-row';
            row.style.opacity = locked ? '0.5' : '1';
            
            let costTxt = '';
            if (item.type === 'crop') costTxt = `Free Setup (Pay ${item.seedCost}g/run)`;
            else costTxt = `Build Cost: ${item.seedCost}g`;

            row.innerHTML = `
                <div style="display:flex; align-items:center; gap:10px">
                    <span style="font-size:1.5em">${item.emoji}</span>
                    <div>
                        <strong>${item.name}</strong> ${locked ? `🔒 (Lvl ${item.reqLevel})` : ''}
                        <div style="font-size:0.8em; color:#f1c40f">${costTxt}</div>
                    </div>
                </div>
            `;
            
            if (!locked) {
                row.style.cursor = 'pointer';
                row.onclick = () => this.assignSlot(category, index, key);
            }
            shopBox.appendChild(row);
        }

        const cancel = document.createElement('button');
        cancel.innerText = "Cancel";
        cancel.className = 'btn-sell';
        cancel.style.width = '100%';
        cancel.style.marginTop = '10px';
        cancel.onclick = () => this.render();
        shopBox.appendChild(cancel);

        container.appendChild(shopBox);
    },

    renderInventory() {
        const container = document.getElementById('inventory-list');
        container.innerHTML = '';
        const keys = Object.keys(this.data.inventory);
        
        if (keys.length === 0) {
            container.innerHTML = '<div style="color:#666; text-align:center">Empty</div>';
            return;
        }

        keys.forEach(key => {
            const qty = this.data.inventory[key];
            const price = this.getPrice(key);

            const div = document.createElement('div');
            div.className = 'item-row';
            div.innerHTML = `
                <span>${key} x${qty}</span>
                <button class="btn-sell" onclick="Game.sellItem('${key}')">Sell (${price}g)</button>
            `;
            container.appendChild(div);
        });
    }
};

window.onload = () => Game.init();
