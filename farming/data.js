/* data.js */
const GAME_DATA = {
    // 1. CROPS: Seed Cost -> Sell Price, Time (ms)
    crops: {
        // TIER 1: The Humble Beginnings (Level 1-4)
        turnip: { id: 'turnip', name: 'Turnip', type: 'crop', seedCost: 5, sell: 12, time: 3000, emoji: '🥔', reqLevel: 1, xp: 5 },
        radish: { id: 'radish', name: 'Radish', type: 'crop', seedCost: 8, sell: 20, time: 5000, emoji: '🌺', reqLevel: 1, xp: 8 },
        garlic: { id: 'garlic', name: 'Garlic', type: 'crop', seedCost: 15, sell: 35, time: 8000, emoji: '🧄', reqLevel: 2, xp: 12 },
        potato: { id: 'potato', name: 'Potato', type: 'crop', seedCost: 25, sell: 60, time: 12000, emoji: '🥔', reqLevel: 2, xp: 20 },
        wheat: { id: 'wheat', name: 'Wheat', type: 'crop', seedCost: 40, sell: 100, time: 18000, emoji: '🌾', reqLevel: 3, xp: 25 },
        carrot: { id: 'carrot', name: 'Carrot', type: 'crop', seedCost: 60, sell: 150, time: 25000, emoji: '🥕', reqLevel: 4, xp: 35 },

        // TIER 2: Staple Farms (Level 5-9)
        onion: { id: 'onion', name: 'Onion', type: 'crop', seedCost: 100, sell: 280, time: 35000, emoji: '🧅', reqLevel: 5, xp: 50 },
        tomato: { id: 'tomato', name: 'Tomato', type: 'crop', seedCost: 150, sell: 420, time: 45000, emoji: '🍅', reqLevel: 6, xp: 65 },
        corn: { id: 'corn', name: 'Maize (Corn)', type: 'crop', seedCost: 250, sell: 700, time: 60000, emoji: '🌽', reqLevel: 7, xp: 90 }, // 1 min
        rice: { id: 'rice', name: 'Rice Paddy', type: 'crop', seedCost: 400, sell: 1200, time: 90000, emoji: '🍚', reqLevel: 8, xp: 120 },
        soybean: { id: 'soybean', name: 'Soybean', type: 'crop', seedCost: 600, sell: 1800, time: 120000, emoji: '🫘', reqLevel: 9, xp: 150 },

        // TIER 3: Cash Crops & Berries (Level 10-14)
        blueberry: { id: 'blueberry', name: 'Blueberry', type: 'crop', seedCost: 1000, sell: 3200, time: 180000, emoji: '🫐', reqLevel: 10, xp: 200 }, // 3 mins
        strawberry: { id: 'strawberry', name: 'Strawberry', type: 'crop', seedCost: 1800, sell: 5500, time: 240000, emoji: '🍓', reqLevel: 11, xp: 280 },
        cotton: { id: 'cotton', name: 'Cotton Field', type: 'crop', seedCost: 3000, sell: 9000, time: 300000, emoji: '☁️', reqLevel: 12, xp: 350 }, // 5 mins
        sunflower: { id: 'sunflower', name: 'Sunflower', type: 'crop', seedCost: 5000, sell: 15000, time: 420000, emoji: '🌻', reqLevel: 13, xp: 450 },
        coffee: { id: 'coffee', name: 'Coffee Beans', type: 'crop', seedCost: 8000, sell: 25000, time: 600000, emoji: '☕', reqLevel: 14, xp: 600 }, // 10 mins

        // TIER 4: Plantations & Heavy Yields (Level 15-19)
        pumpkin: { id: 'pumpkin', name: 'Pumpkin', type: 'crop', seedCost: 15000, sell: 50000, time: 900000, emoji: '🎃', reqLevel: 15, xp: 800 }, // 15 mins
        watermelon: { id: 'watermelon', name: 'Watermelon', type: 'crop', seedCost: 25000, sell: 85000, time: 1200000, emoji: '🍉', reqLevel: 16, xp: 1100 }, // 20 mins
        sugarcane: { id: 'sugarcane', name: 'Sugarcane', type: 'crop', seedCost: 40000, sell: 140000, time: 1800000, emoji: '🎋', reqLevel: 17, xp: 1500 }, // 30 mins
        hops: { id: 'hops', name: 'Hops Trellis', type: 'crop', seedCost: 75000, sell: 280000, time: 2700000, emoji: '🌿', reqLevel: 18, xp: 2200 }, // 45 mins
        grape: { id: 'grape', name: 'Vineyard Grapes', type: 'crop', seedCost: 120000, sell: 480000, time: 3600000, emoji: '🍇', reqLevel: 19, xp: 3000 }, // 1 hour

        // TIER 5: Luxury Exotics (Level 20+)
        tea_leaf: { id: 'tea_leaf', name: 'Tea Leaves', type: 'crop', seedCost: 250000, sell: 1100000, time: 5400000, emoji: '🍵', reqLevel: 21, xp: 5000 }, // 1.5 hours
        cocoa: { id: 'cocoa', name: 'Cocoa Pods', type: 'crop', seedCost: 500000, sell: 2500000, time: 7200000, emoji: '🍫', reqLevel: 24, xp: 8000 }, // 2 hours
        vanilla: { id: 'vanilla', name: 'Vanilla Orchid', type: 'crop', seedCost: 1000000, sell: 6000000, time: 14400000, emoji: '🌸', reqLevel: 28, xp: 15000 } // 4 hours
    },

    // 2. TREES: Setup Cost -> Free Production 
    trees: {
        apple: { id: 'apple', name: 'Apple Tree', type: 'tree', seedCost: 2000, sell: 150, time: 20000, emoji: '🍎', reqLevel: 4, xp: 40 },
        lemon: { id: 'lemon', name: 'Lemon Tree', type: 'tree', seedCost: 5000, sell: 400, time: 35000, emoji: '🍋', reqLevel: 6, xp: 75 },
        orange: { id: 'orange', name: 'Orange Grove', type: 'tree', seedCost: 12000, sell: 1000, time: 60000, emoji: '🍊', reqLevel: 8, xp: 120 },
        peach: { id: 'peach', name: 'Peach Tree', type: 'tree', seedCost: 25000, sell: 2200, time: 90000, emoji: '🍑', reqLevel: 10, xp: 200 },
        cherry: { id: 'cherry', name: 'Cherry Tree', type: 'tree', seedCost: 60000, sell: 5500, time: 150000, emoji: '🍒', reqLevel: 12, xp: 350 },
        olive: { id: 'olive', name: 'Olive Tree', type: 'tree', seedCost: 150000, sell: 15000, time: 300000, emoji: '🫒', reqLevel: 15, xp: 600 },
        walnut: { id: 'walnut', name: 'Walnut Tree', type: 'tree', seedCost: 400000, sell: 45000, time: 600000, emoji: '🌰', reqLevel: 18, xp: 1200 },
        maple: { id: 'maple', name: 'Maple Tap', type: 'tree', seedCost: 1000000, sell: 150000, time: 1200000, emoji: '🍁', reqLevel: 22, xp: 2500 }, // 20 mins
        rubber: { id: 'rubber', name: 'Rubber Tree', type: 'tree', seedCost: 3000000, sell: 600000, time: 3600000, emoji: '🌳', reqLevel: 26, xp: 6000 } // 1 hour
    },

    // 3. ANIMALS: Setup Cost -> Free Production
    animals: {
        quail: { id: 'quail', name: 'Quail Hutch', seedCost: 1000, output: 'quail_egg', time: 5000, emoji: '🐦', reqLevel: 2, xp: 15 },
        chicken: { id: 'chicken', name: 'Chicken Coop', seedCost: 3500, output: 'egg', time: 10000, emoji: '🐔', reqLevel: 3, xp: 30 },
        duck: { id: 'duck', name: 'Duck Pond', seedCost: 8000, output: 'feather', time: 18000, emoji: '🦆', reqLevel: 5, xp: 60 },
        rabbit: { id: 'rabbit', name: 'Rabbit Hutch', seedCost: 20000, output: 'rabbit_wool', time: 30000, emoji: '🐇', reqLevel: 7, xp: 100 },
        pig: { id: 'pig', name: 'Pig Pen', seedCost: 50000, output: 'pork_trimmings', time: 60000, emoji: '🐷', reqLevel: 9, xp: 200 },
        sheep: { id: 'sheep', name: 'Sheep Pasture', seedCost: 120000, output: 'wool', time: 120000, emoji: '🐑', reqLevel: 11, xp: 400 },
        goat: { id: 'goat', name: 'Goat Pen', seedCost: 300000, output: 'goat_milk', time: 240000, emoji: '🐐', reqLevel: 13, xp: 800 },
        cow: { id: 'cow', name: 'Dairy Barn', seedCost: 800000, output: 'milk', time: 480000, emoji: '🐄', reqLevel: 16, xp: 1500 },
        apiary: { id: 'apiary', name: 'Apiary (Bees)', seedCost: 2000000, output: 'honeycomb', time: 900000, emoji: '🐝', reqLevel: 20, xp: 3500 },
        llama: { id: 'llama', name: 'Llama Trek', seedCost: 5000000, output: 'alpaca_fleece', time: 1800000, emoji: '🦙', reqLevel: 24, xp: 8000 }, // 30 mins
        truffle_pig: { id: 'truffle_pig', name: 'Truffle Boar', seedCost: 15000000, output: 'truffle', time: 3600000, emoji: '🐗', reqLevel: 29, xp: 20000 } // 1 hour
    },

    // 4. MACHINES: Setup Cost -> Requires Input Item
    machines: {
        mayo_machine: { id: 'mayo_machine', name: 'Mayo Machine', seedCost: 2000, input: 'egg', output: 'mayo', time: 5000, emoji: '🏺', reqLevel: 3, xp: 40 },
        mill: { id: 'mill', name: 'Flour Mill', seedCost: 5000, input: 'wheat', output: 'flour', time: 8000, emoji: '🏭', reqLevel: 4, xp: 60 },
        sugar_mill: { id: 'sugar_mill', name: 'Sugar Mill', seedCost: 15000, input: 'sugarcane', output: 'sugar', time: 12000, emoji: '⚙️', reqLevel: 8, xp: 120 },
        spindle: { id: 'spindle', name: 'Spinning Wheel', seedCost: 40000, input: 'cotton', output: 'thread', time: 20000, emoji: '🧵', reqLevel: 12, xp: 250 },
        loom: { id: 'loom', name: 'Loom', seedCost: 100000, input: 'wool', output: 'cloth', time: 35000, emoji: '👕', reqLevel: 14, xp: 500 },
        preserves_jar: { id: 'preserves_jar', name: 'Preserves Jar', seedCost: 250000, input: 'strawberry', output: 'jam', time: 60000, emoji: '🫙', reqLevel: 16, xp: 900 },
        cheese_press: { id: 'cheese_press', name: 'Cheese Press', seedCost: 600000, input: 'milk', output: 'cheese', time: 120000, emoji: '🧀', reqLevel: 18, xp: 1800 },
        roaster: { id: 'roaster', name: 'Coffee Roaster', seedCost: 1500000, input: 'coffee', output: 'roasted_coffee', time: 300000, emoji: '🔥', reqLevel: 21, xp: 4000 },
        extractor: { id: 'extractor', name: 'Honey Extractor', seedCost: 3500000, input: 'honeycomb', output: 'honey', time: 600000, emoji: '🍯', reqLevel: 23, xp: 8000 },
        fermenter: { id: 'fermenter', name: 'Fermenting Tank', seedCost: 8000000, input: 'hops', output: 'beer', time: 1200000, emoji: '🍺', reqLevel: 25, xp: 15000 },
        oil_press: { id: 'oil_press', name: 'Oil Press', seedCost: 18000000, input: 'olive', output: 'olive_oil', time: 2400000, emoji: '🛢️', reqLevel: 27, xp: 30000 },
        cask: { id: 'cask', name: 'Oak Cask', seedCost: 40000000, input: 'grape', output: 'wine', time: 7200000, emoji: '🍷', reqLevel: 30, xp: 60000 } // 2 hours
    },

    // 5. PRODUCTS (Raw Animal Outputs + Machine Outputs)
    products: {
        // Raw Animal Goods
        quail_egg: { sell: 30 }, egg: { sell: 90 }, feather: { sell: 180 }, rabbit_wool: { sell: 400 }, pork_trimmings: { sell: 900 }, 
        wool: { sell: 2200 }, goat_milk: { sell: 5000 }, milk: { sell: 12000 }, honeycomb: { sell: 35000 }, 
        alpaca_fleece: { sell: 90000 }, truffle: { sell: 300000 },
        
        // Machine Goods
        mayo: { sell: 250 }, flour: { sell: 300 }, sugar: { sell: 450 }, thread: { sell: 30000 }, cloth: { sell: 8000 }, 
        jam: { sell: 18000 }, cheese: { sell: 45000 }, roasted_coffee: { sell: 100000 }, honey: { sell: 150000 }, 
        beer: { sell: 1000000 }, olive_oil: { sell: 80000 }, wine: { sell: 2500000 } 
    },

    // 6. UPGRADES (Permanent Modifiers)
    upgrades: {
        steel_tools: { name: 'Steel Hoes', desc: 'Crops grow 10% faster', cost: 10000, reqLevel: 5 },
        irrigation: { name: 'Drip Irrigation', desc: 'Crops grow 20% faster', cost: 150000, reqLevel: 12 },
        tractor: { name: 'Heavy Tractor', desc: 'Crops grow 35% faster', cost: 2500000, reqLevel: 22 },
        
        premium_feed: { name: 'Premium Feed', desc: 'Animal products sell for +25%', cost: 50000, reqLevel: 8 },
        selective_breeding: { name: 'Selective Breeding', desc: 'Animal products sell for +50%', cost: 800000, reqLevel: 17 },
        
        artisan_crafting: { name: 'Artisan Goods', desc: 'Machine products sell for +40%', cost: 5000000, reqLevel: 25 }
    },

    // 7. MANAGERS (Automation)
    managers: {
        auto_replant: { name: 'Field Hands', desc: 'Automatically pays for and replants crops', cost: 25000, reqLevel: 6 },
        auto_route: { name: 'Logistics Network', desc: 'Auto-moves raw items into idle factory machines', cost: 250000, reqLevel: 14 },
        auto_sell: { name: 'Wholesale Contracts', desc: 'Automatically sells finished/end products', cost: 5000000, reqLevel: 20 }
    }
};
