/* data.js */
const GAME_DATA = {
    // 1. CROPS: Rebalanced for tighter margins. 
    crops: {
        // TIER 1: The Humble Beginnings (Level 1-4)
        turnip: { id: 'turnip', name: 'Turnip', type: 'crop', seedCost: 5, sell: 10, time: 3000, emoji: '🥔', reqLevel: 1, xp: 5 },
        radish: { id: 'radish', name: 'Radish', type: 'crop', seedCost: 10, sell: 18, time: 5000, emoji: '🌺', reqLevel: 1, xp: 8 },
        garlic: { id: 'garlic', name: 'Garlic', type: 'crop', seedCost: 20, sell: 35, time: 8000, emoji: '🧄', reqLevel: 2, xp: 12 },
        potato: { id: 'potato', name: 'Potato', type: 'crop', seedCost: 35, sell: 60, time: 12000, emoji: '🥔', reqLevel: 2, xp: 18 },
        wheat: { id: 'wheat', name: 'Wheat', type: 'crop', seedCost: 60, sell: 100, time: 18000, emoji: '🌾', reqLevel: 3, xp: 25 },
        carrot: { id: 'carrot', name: 'Carrot', type: 'crop', seedCost: 90, sell: 140, time: 25000, emoji: '🥕', reqLevel: 4, xp: 35 },

        // TIER 2: Staple Farms (Level 5-9)
        onion: { id: 'onion', name: 'Onion', type: 'crop', seedCost: 150, sell: 230, time: 35000, emoji: '🧅', reqLevel: 5, xp: 45 },
        tomato: { id: 'tomato', name: 'Tomato', type: 'crop', seedCost: 220, sell: 340, time: 45000, emoji: '🍅', reqLevel: 6, xp: 60 },
        corn: { id: 'corn', name: 'Maize (Corn)', type: 'crop', seedCost: 350, sell: 520, time: 60000, emoji: '🌽', reqLevel: 7, xp: 80 }, 
        rice: { id: 'rice', name: 'Rice Paddy', type: 'crop', seedCost: 500, sell: 720, time: 90000, emoji: '🍚', reqLevel: 8, xp: 100 },
        soybean: { id: 'soybean', name: 'Soybean', type: 'crop', seedCost: 750, sell: 1050, time: 120000, emoji: '🫘', reqLevel: 9, xp: 130 },

        // TIER 3: Cash Crops & Berries (Level 10-14)
        blueberry: { id: 'blueberry', name: 'Blueberry', type: 'crop', seedCost: 1200, sell: 1650, time: 180000, emoji: '🫐', reqLevel: 10, xp: 170 }, 
        strawberry: { id: 'strawberry', name: 'Strawberry', type: 'crop', seedCost: 1800, sell: 2500, time: 240000, emoji: '🍓', reqLevel: 11, xp: 220 },
        cotton: { id: 'cotton', name: 'Cotton Field', type: 'crop', seedCost: 2800, sell: 3900, time: 300000, emoji: '☁️', reqLevel: 12, xp: 280 }, 
        sunflower: { id: 'sunflower', name: 'Sunflower', type: 'crop', seedCost: 4500, sell: 6100, time: 420000, emoji: '🌻', reqLevel: 13, xp: 350 },
        coffee: { id: 'coffee', name: 'Coffee Beans', type: 'crop', seedCost: 7000, sell: 9500, time: 600000, emoji: '☕', reqLevel: 14, xp: 450 }, 

        // TIER 4: Plantations & Heavy Yields (Level 15-19)
        pumpkin: { id: 'pumpkin', name: 'Pumpkin', type: 'crop', seedCost: 12000, sell: 16000, time: 900000, emoji: '🎃', reqLevel: 15, xp: 600 }, 
        watermelon: { id: 'watermelon', name: 'Watermelon', type: 'crop', seedCost: 18000, sell: 24000, time: 1200000, emoji: '🍉', reqLevel: 16, xp: 800 }, 
        sugarcane: { id: 'sugarcane', name: 'Sugarcane', type: 'crop', seedCost: 28000, sell: 37000, time: 1800000, emoji: '🎋', reqLevel: 17, xp: 1100 }, 
        hops: { id: 'hops', name: 'Hops Trellis', type: 'crop', seedCost: 45000, sell: 60000, time: 2700000, emoji: '🌿', reqLevel: 18, xp: 1500 }, 
        grape: { id: 'grape', name: 'Vineyard Grapes', type: 'crop', seedCost: 75000, sell: 98000, time: 3600000, emoji: '🍇', reqLevel: 19, xp: 2000 }, 

        // TIER 5: Luxury Exotics (Level 20+)
        tea_leaf: { id: 'tea_leaf', name: 'Tea Leaves', type: 'crop', seedCost: 150000, sell: 190000, time: 5400000, emoji: '🍵', reqLevel: 21, xp: 3000 }, 
        cocoa: { id: 'cocoa', name: 'Cocoa Pods', type: 'crop', seedCost: 300000, sell: 380000, time: 7200000, emoji: '🍫', reqLevel: 24, xp: 4500 }, 
        vanilla: { id: 'vanilla', name: 'Vanilla Orchid', type: 'crop', seedCost: 800000, sell: 1050000, time: 14400000, emoji: '🌸', reqLevel: 28, xp: 7000 } 
    },

    // 2. TREES: Rebalanced sell prices 
    trees: {
        apple: { id: 'apple', name: 'Apple Tree', type: 'tree', seedCost: 3000, sell: 100, time: 20000, emoji: '🍎', reqLevel: 4, xp: 25 },
        lemon: { id: 'lemon', name: 'Lemon Tree', type: 'tree', seedCost: 8000, sell: 250, time: 35000, emoji: '🍋', reqLevel: 6, xp: 50 },
        orange: { id: 'orange', name: 'Orange Grove', type: 'tree', seedCost: 20000, sell: 550, time: 60000, emoji: '🍊', reqLevel: 8, xp: 90 },
        peach: { id: 'peach', name: 'Peach Tree', type: 'tree', seedCost: 45000, sell: 1100, time: 90000, emoji: '🍑', reqLevel: 10, xp: 150 },
        cherry: { id: 'cherry', name: 'Cherry Tree', type: 'tree', seedCost: 90000, sell: 2200, time: 150000, emoji: '🍒', reqLevel: 12, xp: 250 },
        olive: { id: 'olive', name: 'Olive Tree', type: 'tree', seedCost: 200000, sell: 5000, time: 300000, emoji: '🫒', reqLevel: 15, xp: 400 },
        walnut: { id: 'walnut', name: 'Walnut Tree', type: 'tree', seedCost: 500000, sell: 12000, time: 600000, emoji: '🌰', reqLevel: 18, xp: 800 },
        maple: { id: 'maple', name: 'Maple Tap', type: 'tree', seedCost: 1200000, sell: 28000, time: 1200000, emoji: '🍁', reqLevel: 22, xp: 1500 }, 
        rubber: { id: 'rubber', name: 'Rubber Tree', type: 'tree', seedCost: 3500000, sell: 75000, time: 3600000, emoji: '🌳', reqLevel: 26, xp: 3500 } 
    },

    // 3. ANIMALS: Rebalanced XP and Output value dependency
    animals: {
        quail: { id: 'quail', name: 'Quail Hutch', seedCost: 1500, output: 'quail_egg', time: 5000, emoji: '🐦', reqLevel: 2, xp: 10 },
        chicken: { id: 'chicken', name: 'Chicken Coop', seedCost: 4500, output: 'egg', time: 10000, emoji: '🐔', reqLevel: 3, xp: 20 },
        duck: { id: 'duck', name: 'Duck Pond', seedCost: 12000, output: 'feather', time: 18000, emoji: '🦆', reqLevel: 5, xp: 40 },
        rabbit: { id: 'rabbit', name: 'Rabbit Hutch', seedCost: 28000, output: 'rabbit_wool', time: 30000, emoji: '🐇', reqLevel: 7, xp: 75 },
        pig: { id: 'pig', name: 'Pig Pen', seedCost: 65000, output: 'pork_trimmings', time: 60000, emoji: '🐷', reqLevel: 9, xp: 140 },
        sheep: { id: 'sheep', name: 'Sheep Pasture', seedCost: 150000, output: 'wool', time: 120000, emoji: '🐑', reqLevel: 11, xp: 280 },
        goat: { id: 'goat', name: 'Goat Pen', seedCost: 400000, output: 'goat_milk', time: 240000, emoji: '🐐', reqLevel: 13, xp: 500 },
        cow: { id: 'cow', name: 'Dairy Barn', seedCost: 1000000, output: 'milk', time: 480000, emoji: '🐄', reqLevel: 16, xp: 1000 },
        apiary: { id: 'apiary', name: 'Apiary (Bees)', seedCost: 2500000, output: 'honeycomb', time: 900000, emoji: '🐝', reqLevel: 20, xp: 2200 },
        llama: { id: 'llama', name: 'Llama Trek', seedCost: 6500000, output: 'alpaca_fleece', time: 1800000, emoji: '🦙', reqLevel: 24, xp: 4500 }, 
        truffle_pig: { id: 'truffle_pig', name: 'Truffle Boar', seedCost: 18000000, output: 'truffle', time: 3600000, emoji: '🐗', reqLevel: 29, xp: 10000 } 
    },

    // 4. MACHINES
    machines: {
        mayo_machine: { id: 'mayo_machine', name: 'Mayo Machine', seedCost: 3000, input: 'egg', output: 'mayo', time: 5000, emoji: '🏺', reqLevel: 3, xp: 30 },
        mill: { id: 'mill', name: 'Flour Mill', seedCost: 8000, input: 'wheat', output: 'flour', time: 8000, emoji: '🏭', reqLevel: 4, xp: 45 },
        sugar_mill: { id: 'sugar_mill', name: 'Sugar Mill', seedCost: 20000, input: 'sugarcane', output: 'sugar', time: 12000, emoji: '⚙️', reqLevel: 8, xp: 80 },
        spindle: { id: 'spindle', name: 'Spinning Wheel', seedCost: 55000, input: 'cotton', output: 'thread', time: 20000, emoji: '🧵', reqLevel: 12, xp: 180 },
        loom: { id: 'loom', name: 'Loom', seedCost: 140000, input: 'wool', output: 'cloth', time: 35000, emoji: '👕', reqLevel: 14, xp: 350 },
        preserves_jar: { id: 'preserves_jar', name: 'Preserves Jar', seedCost: 350000, input: 'strawberry', output: 'jam', time: 60000, emoji: '🫙', reqLevel: 16, xp: 600 },
        cheese_press: { id: 'cheese_press', name: 'Cheese Press', seedCost: 800000, input: 'milk', output: 'cheese', time: 120000, emoji: '🧀', reqLevel: 18, xp: 1200 },
        roaster: { id: 'roaster', name: 'Coffee Roaster', seedCost: 2000000, input: 'coffee', output: 'roasted_coffee', time: 300000, emoji: '🔥', reqLevel: 21, xp: 2500 },
        extractor: { id: 'extractor', name: 'Honey Extractor', seedCost: 4500000, input: 'honeycomb', output: 'honey', time: 600000, emoji: '🍯', reqLevel: 23, xp: 5000 },
        fermenter: { id: 'fermenter', name: 'Fermenting Tank', seedCost: 10000000, input: 'hops', output: 'beer', time: 1200000, emoji: '🍺', reqLevel: 25, xp: 9000 },
        oil_press: { id: 'oil_press', name: 'Oil Press', seedCost: 22000000, input: 'olive', output: 'olive_oil', time: 2400000, emoji: '🛢️', reqLevel: 27, xp: 18000 },
        cask: { id: 'cask', name: 'Oak Cask', seedCost: 50000000, input: 'grape', output: 'wine', time: 7200000, emoji: '🍷', reqLevel: 30, xp: 35000 } 
    },

    // 5. PRODUCTS (Adjusted to match new machine/animal pacing)
    products: {
        // Raw Animal Goods
        quail_egg: { sell: 20 }, egg: { sell: 60 }, feather: { sell: 120 }, rabbit_wool: { sell: 250 }, pork_trimmings: { sell: 600 }, 
        wool: { sell: 1400 }, goat_milk: { sell: 3200 }, milk: { sell: 7500 }, honeycomb: { sell: 20000 }, 
        alpaca_fleece: { sell: 55000 }, truffle: { sell: 180000 },
        
        // Machine Goods
        mayo: { sell: 150 }, flour: { sell: 200 }, sugar: { sell: 300 }, thread: { sell: 8000 }, cloth: { sell: 3500 }, 
        jam: { sell: 5000 }, cheese: { sell: 18000 }, roasted_coffee: { sell: 25000 }, honey: { sell: 60000 }, 
        beer: { sell: 180000 }, olive_oil: { sell: 25000 }, wine: { sell: 250000 } 
    },

    // 6. UPGRADES
    upgrades: {
        steel_tools: { name: 'Steel Hoes', desc: 'Crops grow 10% faster', cost: 10000, reqLevel: 5 },
        irrigation: { name: 'Drip Irrigation', desc: 'Crops grow 20% faster', cost: 150000, reqLevel: 12 },
        tractor: { name: 'Heavy Tractor', desc: 'Crops grow 35% faster', cost: 2500000, reqLevel: 22 },
        
        premium_feed: { name: 'Premium Feed', desc: 'Animal products sell for +25%', cost: 50000, reqLevel: 8 },
        selective_breeding: { name: 'Selective Breeding', desc: 'Animal products sell for +50%', cost: 800000, reqLevel: 17 },
        
        artisan_crafting: { name: 'Artisan Goods', desc: 'Machine products sell for +40%', cost: 5000000, reqLevel: 25 }
    },

    // 7. MANAGERS
    managers: {
        auto_replant: { name: 'Field Hands', desc: 'Automatically pays for and replants crops', cost: 25000, reqLevel: 6 },
        auto_route: { name: 'Logistics Network', desc: 'Auto-moves raw items into idle factory machines', cost: 250000, reqLevel: 14 },
        auto_sell: { name: 'Wholesale Contracts', desc: 'Automatically sells finished/end products', cost: 5000000, reqLevel: 20 }
    }
};
