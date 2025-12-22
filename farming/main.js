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
        
        setInterval(() => this.saveGame(), 5000); 
        setInterval(() => this.uiLoop(), 50);
        setInterval(() => this.logicLoop(), 500); 
    },

    // --- LOGIC ---
    logicLoop() {
        const now = Date.now();

        // 1. PLOTS
        this.data.plots.forEach((slot) => {
            if (!slot) return;
            const isTree = GAME_DATA.trees[slot.type];
            const config = isTree ? GAME_DATA.trees[slot.type] : GAME_DATA.crops[slot.type];
            if (!config) return;

            if (slot.state === 'idle') {
                let canStart = false;
                if (isTree) {
                    canStart = true;
                } else {
                    if (this.data.gold >= config.seedCost) {
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
            else if (slot.state === 'growing') {
                if (now - slot.startTime >= config.time) {
                    this.addItem(slot.type, 1);
                    this.addXp(config.xp);
                    slot.state = 'idle';
                }
            }
        });

        // 2. ANIMALS
        this.data.animals.forEach(slot => {
            if (!slot) return;
            const config = GAME_DATA.animals[slot.type];
            if (now - slot.startTime >= config.time) {
                this.addItem(config.output, 1);
                this.addXp(config.xp);
                slot.startTime = now; 
            }
        });

        // 3. MACHINES
        this.data.machines.forEach(slot => {
            if (!slot) return;
            const config = GAME_DATA.machines[slot.type];
            if (slot.state === 'idle') {
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

    // --- UI LOOP (UPDATED COLORS) ---
    uiLoop() {
        const now = Date.now();

        const updateBar = (id, percent, color) => {
            const el = document.getElementById(id);
            if (el) {
                el.style.width = Math.min(100, Math.max(0, percent)) + '%';
                if (color) el.style.background = color;
            }
        };

        // COZY COLORS
        const C_GREEN = '#66bb6a';  // Pastel Green
        const C_RED = '#ef5350';    // Soft Red
        const C_YELLOW = '#ffa726'; // Warm Orange
        const C_BLUE = '#42a5f5';   // Soft Blue

        // Plots
        this.data.plots.forEach((slot, i) => {
            if (!slot) return;
            const config = GAME_DATA.trees[slot.type] || GAME_DATA.crops[slot.type];
            
            if (slot.state === 'idle') {
                if (!GAME_DATA.trees[slot.type] && this.data.gold < config.seedCost) {
                    updateBar(`plot-bar-${i}`, 100, C_RED); // No Money
                } else {
                    updateBar(`plot-bar-${i}`, 0, C_GREEN);
                }
            } else {
                const pct = ((now - slot.startTime) / config.time) * 100;
                updateBar(`plot-bar-${i}`, pct, C_GREEN);
            }
        });

        // Animals
        this.data.animals.forEach((slot, i) => {
            if (!slot) return;
            const config = GAME_DATA.animals[slot.type];
            const pct = ((now - slot.startTime) / config.time) * 100;
            updateBar(`anim-bar-${i}`, pct, C_YELLOW);
        });

        // Machines
        this.data.machines.forEach((slot, i) => {
            if (!slot) return;
            const config = GAME_DATA.machines[slot.type];
            if (slot.state === 'working') {
                const pct = ((now - slot.startTime) / config.time) * 100;
                updateBar(`mach-bar-${i}`, pct, C_BLUE);
            } else {
                updateBar(`mach-bar-${i}`, 0, C_BLUE);
            }
        });
    },

    // --- ACTIONS ---
    assignSlot(category, index, typeKey) {
        let sources = {...GAME_DATA.crops, ...GAME_DATA.trees, ...GAME_DATA.animals, ...GAME_DATA.machines};
        let config = sources[typeKey];
        
        let setupCost = 0;
        if (config.type !== 'crop') setupCost = config.seedCost;

        if (this.data.gold >= setupCost) {
            this.data.gold -= setupCost;
            this.data[category][index] = {
                type: typeKey,
                state: 'idle',
                startTime: Date.now()
            };
            this.render();
            this.saveGame();
        } else {
            alert(`Not enough gold! Need ${setupCost}g`);
        }
    },

    clearSlot(category, index) {
        if(confirm("Clear this slot?")) {
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

    sellItem(key, all) {
        const qty = all ? this.data.inventory[key] : 1;
        if (!qty) return;

        let price = 0;
        const find = (list) => { if(list[key]) price = list[key].sell; };
        find(GAME_DATA.crops); find(GAME_DATA.trees); find(GAME_DATA.animals); find(GAME_DATA.machines);

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

    // --- DATA ---
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
            try {
                const parsed = JSON.parse(save);
                this.data = { ...this.data, ...parsed };
            } catch(e) { console.error("Save corrupted"); }
        }
    },

    // --- RENDER ---
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
        
        // Update new XP bar format
        const pct = (this.data.xp / needed) * 100;
        document.getElementById('xp-fill').style.width = pct + '%';
        document.getElementById('xp-text').innerText = `${Math.floor(this.data.xp)} / ${needed} XP`;
    },

    renderList(category, domId) {
        const container = document.getElementById(domId);
        container.innerHTML = '';

        this.data[category].forEach((slot, index) => {
            const div = document.createElement('div');
            div.className = 'slot';

            if (!slot) {
                div.innerHTML = `<div style="text-align:center;width:100%;color:#aaa;cursor:pointer;font-weight:bold;">➕ New Slot</div>`;
                div.onclick = () => this.openShop(category, index);
            } else {
                let sources = {...GAME_DATA.crops, ...GAME_DATA.trees, ...GAME_DATA.animals, ...GAME_DATA.machines};
                const config = sources[slot.type];
                
                let sub = '';
                let statusColor = '#8d6e63'; // Wood color
                
                if (category === 'plots' && !GAME_DATA.trees[slot.type]) {
                    if (this.data.gold < config.seedCost && slot.state === 'idle') {
                        sub = "NEED FUNDS";
                        statusColor = '#ef5350';
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
                        <div class="slot-sub" style="color:${statusColor}">${sub}</div>
                        <div class="progress-bg">
                            <div id="${category === 'plots' ? 'plot' : category === 'animals' ? 'anim' : 'mach'}-bar-${index}" class="progress-fill"></div>
                        </div>
                    </div>
                    <button class="btn-sell-small" onclick="Game.clearSlot('${category}', ${index})">❌</button>
                `;
            }
            container.appendChild(div);
        });

        const cost = this.expansionCosts[category] * this.data[category].length;
        const btn = document.createElement('button');
        btn.className = 'btn-main';
        btn.style.marginTop = '10px';
        btn.style.background = '#8d6e63'; // Wood button for expand
        btn.style.boxShadow = '0 4px 0 #5d4037';
        btn.innerText = `Expand Space (${cost}g)`;
        btn.onclick = () => this.expand(category);
        container.appendChild(btn);
    },

    openShop(category, index) {
        const container = document.getElementById(category === 'plots' ? 'plot-list' : category === 'animals' ? 'animal-list' : 'machine-list');
        container.innerHTML = '';

        const shopBox = document.createElement('div');
        shopBox.style.background = '#fff';
        shopBox.style.padding = '15px';
        shopBox.style.borderRadius = '12px';
        shopBox.style.border = '2px solid #eee';

        let sources = {};
        if (category === 'plots') sources = {...GAME_DATA.crops, ...GAME_DATA.trees};
        else if (category === 'animals') sources = GAME_DATA.animals;
        else sources = GAME_DATA.machines;

        for (let key in sources) {
            const item = sources[key];
            const locked = this.data.level < item.reqLevel;

            const row = document.createElement('div');
            row.className = 'item-row';
            row.style.opacity = locked ? '0.6' : '1';
            
            let costTxt = '';
            if (item.type === 'crop') costTxt = `Pay ${item.seedCost}g/run`;
            else costTxt = `Build: ${item.seedCost}g`;

            row.innerHTML = `
                <div style="display:flex; align-items:center; gap:12px">
                    <span style="font-size:1.8em">${item.emoji}</span>
                    <div>
                        <div style="font-weight:800; color:#5d4037">${item.name}</div>
                        <div style="font-size:0.8em; color:#888">${locked ? `🔒 Lvl ${item.reqLevel}` : costTxt}</div>
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
        cancel.className = 'btn-main';
        cancel.style.background = '#ef5350';
        cancel.style.boxShadow = '0 4px 0 #c62828';
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
            container.innerHTML = '<div style="color:#aaa; text-align:center; padding:20px;">Inventory Empty</div>';
            return;
        }

        keys.forEach(key => {
            const qty = this.data.inventory[key];
            let price = 0;
            const find = (list) => { if(list[key]) price = list[key].sell; };
            find(GAME_DATA.crops); find(GAME_DATA.trees); find(GAME_DATA.animals); find(GAME_DATA.machines);

            const div = document.createElement('div');
            div.className = 'item-row';
            div.innerHTML = `
                <span style="font-weight:bold; color:#4e342e; text-transform:capitalize">${key} x${qty}</span>
                <button class="btn-sell-small" style="background:#ffa726; box-shadow:0 2px 0 #ef6c00" onclick="Game.sellItem('${key}')">Sell ${price}g</button>
            `;
            container.appendChild(div);
        });
    }
};

window.onload = () => Game.init();