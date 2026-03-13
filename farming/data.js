/* data.js */
const GAME_DATA = {
    crops: {
        turnip: { id: 'turnip', name: 'Turnip', type: 'crop', seedCost: 5, sell: 10, time: 3000, emoji: '🥔', reqLevel: 1, xp: 5 },
        radish: { id: 'radish', name: 'Radish', type: 'crop', seedCost: 10, sell: 18, time: 5000, emoji: '🌺', reqLevel: 1, xp: 8 },
        garlic: { id: 'garlic', name: 'Garlic', type: 'crop', seedCost: 20, sell: 35, time: 8000, emoji: '🧄', reqLevel: 2, xp: 12 },
        potato: { id: 'potato', name: 'Potato', type: 'crop', seedCost: 35, sell: 60, time: 12000, emoji: '🥔', reqLevel: 2, xp: 18 },
        wheat: { id: 'wheat', name: 'Wheat', type: 'crop', seedCost: 60, sell: 100, time: 18000, emoji: '🌾', reqLevel: 3, xp: 25 },
        carrot: { id: 'carrot', name: 'Carrot', type: 'crop', seedCost: 90, sell: 140, time: 25000, emoji: '🥕', reqLevel: 4, xp: 35 },

        onion: { id: 'onion', name: 'Onion', type: 'crop', seedCost: 150, sell: 230, time: 35000, emoji: '🧅', reqLevel: 5, xp: 45 },
        tomato: { id: 'tomato', name: 'Tomato', type: 'crop', seedCost: 220, sell: 340, time: 45000, emoji: '🍅', reqLevel: 6, xp: 60 },
        corn: { id: 'corn', name: 'Maize (Corn)', type: 'crop', seedCost: 350, sell: 520, time: 60000, emoji: '🌽', reqLevel: 7, xp: 80 }, 
        rice: { id: 'rice', name: 'Rice Paddy', type: 'crop', seedCost: 500, sell: 720, time: 90000, emoji: '🍚', reqLevel: 8, xp: 100 },
        soybean: { id: 'soybean', name: 'Soybean', type: 'crop', seedCost: 750, sell: 1050, time: 120000, emoji: '🫘', reqLevel: 9, xp: 130 },

        blueberry: { id: 'blueberry', name: 'Blueberry', type: 'crop', seedCost: 1200, sell: 1650, time: 180000, emoji: '🫐', reqLevel: 10, xp: 170 }, 
        strawberry: { id: 'strawberry', name: 'Strawberry', type: 'crop', seedCost: 1800, sell: 2500, time: 240000, emoji: '🍓', reqLevel: 11, xp: 220 },
        cotton: { id: 'cotton', name: 'Cotton Field', type: 'crop', seedCost: 2800, sell: 3900, time: 300000, emoji: '☁️', reqLevel: 12, xp: 280 }, 
        sunflower: { id: 'sunflower', name: 'Sunflower', type: 'crop', seedCost: 4500, sell: 6100, time: 420000, emoji: '🌻', reqLevel: 13, xp: 350 },
        coffee: { id: 'coffee', name: 'Coffee Beans', type: 'crop', seedCost: 7000, sell: 9500, time: 600000, emoji: '☕', reqLevel: 14, xp: 450 }, 
        
        // NEW TIER 3.5: Grains & Aromatics
        barley: { id: 'barley', name: 'Malted Barley', type: 'crop', seedCost: 10000, sell: 13000, time: 720000, emoji: '🌾', reqLevel: 15, xp: 550 },
        bergamot: { id: 'bergamot', name: 'Bergamot Orange', type: 'crop', seedCost: 15000, sell: 19500, time: 900000, emoji: '🍊', reqLevel: 16, xp: 700 },

        pumpkin: { id: 'pumpkin', name: 'Pumpkin', type: 'crop', seedCost: 22000, sell: 28000, time: 1200000, emoji: '🎃', reqLevel: 17, xp: 900 }, 
        watermelon: { id: 'watermelon', name: 'Watermelon', type: 'crop', seedCost: 35000, sell: 45000, time: 1800000, emoji: '🍉', reqLevel: 18, xp: 1200 }, 
        sugarcane: { id: 'sugarcane', name: 'Sugarcane', type: 'crop', seedCost: 55000, sell: 70000, time: 2700000, emoji: '🎋', reqLevel: 19, xp: 1600 }, 
        hops: { id: 'hops', name: 'Hops Trellis', type: 'crop', seedCost: 85000, sell: 110000, time: 3600000, emoji: '🌿', reqLevel: 20, xp: 2200 }, 
        grape: { id: 'grape', name: 'Vineyard Grapes', type: 'crop', seedCost: 130000, sell: 165000, time: 5400000, emoji: '🍇', reqLevel: 21, xp: 3000 }, 

        tea_leaf: { id: 'tea_leaf', name: 'Tea Leaves', type: 'crop', seedCost: 200000, sell: 250000, time: 7200000, emoji: '🍵', reqLevel: 23, xp: 4000 }, 
        cocoa: { id: 'cocoa', name: 'Cocoa Pods', type: 'crop', seedCost: 450000, sell: 580000, time: 10800000, emoji: '🍫', reqLevel: 26, xp: 6000 }, 
        vanilla: { id: 'vanilla', name: 'Vanilla Orchid', type: 'crop', seedCost: 1000000, sell: 1250000, time: 14400000, emoji: '🌸', reqLevel: 30, xp: 9000 } 
    },

    trees: {
        apple: { id: 'apple', name: 'Apple Tree', type: 'tree', seedCost: 3000, sell: 100, time: 20000, emoji: '🍎', reqLevel: 4, xp: 25 },
        lemon: { id: 'lemon', name: 'Lemon Tree', type: 'tree', seedCost: 8000, sell: 250, time: 35000, emoji: '🍋', reqLevel: 6, xp: 50 },
        orange: { id: 'orange', name: 'Orange Grove', type: 'tree', seedCost: 20000, sell: 550, time: 60000, emoji: '🍊', reqLevel: 8, xp: 90 },
        peach: { id: 'peach', name: 'Peach Tree', type: 'tree', seedCost: 45000, sell: 1100, time: 90000, emoji: '🍑', reqLevel: 10, xp: 150 },
        cherry: { id: 'cherry', name: 'Cherry Tree', type: 'tree', seedCost: 90000, sell: 2200, time: 150000, emoji: '🍒', reqLevel: 12, xp: 250 },
        olive: { id: 'olive', name: 'Olive Tree', type: 'tree', seedCost: 200000, sell: 5000, time: 300000, emoji: '🫒', reqLevel: 15, xp: 400 },
        
        // NEW LUXURY NUT TREES
        hazelnut: { id: 'hazelnut', name: 'Hazelnut Tree', type: 'tree', seedCost: 350000, sell: 8000, time: 450000, emoji: '🌰', reqLevel: 17, xp: 600 },
        pistachio: { id: 'pistachio', name: 'Pistachio Tree', type: 'tree', seedCost: 600000, sell: 14000, time: 720000, emoji: '🥜', reqLevel: 20, xp: 900 },

        walnut: { id: 'walnut', name: 'Walnut Tree', type: 'tree', seedCost: 1000000, sell: 22000, time: 1080000, emoji: '🌰', reqLevel: 23, xp: 1400 },
        maple: { id: 'maple', name: 'Maple Tap', type: 'tree', seedCost: 2500000, sell: 55000, time: 1800000, emoji: '🍁', reqLevel: 27, xp: 2500 }, 
        rubber: { id: 'rubber', name: 'Rubber Tree', type: 'tree', seedCost: 6000000, sell: 130000, time: 3600000, emoji: '🌳', reqLevel: 32, xp: 5000 } 
    },

    animals: {
        quail: { id: 'quail', name: 'Quail Hutch', seedCost: 1500, output: 'quail_egg', time: 5000, emoji: '🐦', reqLevel: 2, xp: 10 },
        chicken: { id: 'chicken', name: 'Chicken Coop', seedCost: 4500, output: 'egg', time: 10000, emoji: '🐔', reqLevel: 3, xp: 20 },
        duck: { id: 'duck', name: 'Duck Pond', seedCost: 12000, output: 'feather', time: 18000, emoji: '🦆', reqLevel: 5, xp: 40 },
        rabbit: { id: 'rabbit', name: 'Rabbit Hutch', seedCost: 28000, output: 'rabbit_wool', time: 30000, emoji: '🐇', reqLevel: 7, xp: 75 },
        pig: { id: 'pig', name: 'Pig Pen', seedCost: 65000, output: 'pork_trimmings', time: 60000, emoji: '🐷', reqLevel: 9, xp: 140 },
        sheep: { id: 'sheep', name: 'Sheep Pasture', seedCost: 150000, output: 'wool', time: 120000, emoji: '🐑', reqLevel: 11, xp: 280 },
        goat: { id: 'goat', name: 'Goat Pen', seedCost: 400000, output: 'goat_milk', time: 240000, emoji: '🐐', reqLevel: 13, xp: 500 },
        cow: { id: 'cow', name: 'Dairy Barn', seedCost: 1000000, output: 'milk', time: 480000, emoji: '🐄', reqLevel: 16, xp: 1000 },
        
        // NEW LUXURY ANIMALS
        silk_moth: { id: 'silk_moth', name: 'Silk Moth Enclosure', seedCost: 2500000, output: 'raw_silk', time: 720000, emoji: '🦋', reqLevel: 19, xp: 1800 },
        civet: { id: 'civet', name: 'Civet Sanctuary', seedCost: 6000000, output: 'civet_coffee_beans', time: 1800000, emoji: '🐈', reqLevel: 24, xp: 4000 },

        apiary: { id: 'apiary', name: 'Apiary (Bees)', seedCost: 12000000, output: 'honeycomb', time: 3600000, emoji: '🐝', reqLevel: 28, xp: 7000 },
        llama: { id: 'llama', name: 'Llama Trek', seedCost: 25000000, output: 'alpaca_fleece', time: 7200000, emoji: '🦙', reqLevel: 32, xp: 12000 }, 
        truffle_pig: { id: 'truffle_pig', name: 'Truffle Boar', seedCost: 60000000, output: 'truffle', time: 14400000, emoji: '🐗', reqLevel: 36, xp: 25000 } 
    },

    machines: {
        mayo_machine: { id: 'mayo_machine', name: 'Mayo Machine', seedCost: 3000, input: 'egg', output: 'mayo', time: 5000, emoji: '🏺', reqLevel: 3, xp: 30 },
        mill: { id: 'mill', name: 'Flour Mill', seedCost: 8000, input: 'wheat', output: 'flour', time: 8000, emoji: '🏭', reqLevel: 4, xp: 45 },
        sugar_mill: { id: 'sugar_mill', name: 'Sugar Mill', seedCost: 20000, input: 'sugarcane', output: 'sugar', time: 12000, emoji: '⚙️', reqLevel: 8, xp: 80 },
        spindle: { id: 'spindle', name: 'Spinning Wheel', seedCost: 55000, input: 'cotton', output: 'thread', time: 20000, emoji: '🧵', reqLevel: 12, xp: 180 },
        loom: { id: 'loom', name: 'Loom', seedCost: 140000, input: 'wool', output: 'cloth', time: 35000, emoji: '👕', reqLevel: 14, xp: 350 },
        preserves_jar: { id: 'preserves_jar', name: 'Preserves Jar', seedCost: 350000, input: 'strawberry', output: 'jam', time: 60000, emoji: '🫙', reqLevel: 16, xp: 600 },
        cheese_press: { id: 'cheese_press', name: 'Cheese Press', seedCost: 800000, input: 'milk', output: 'cheese', time: 120000, emoji: '🧀', reqLevel: 18, xp: 1200 },
        roaster: { id: 'roaster', name: 'Coffee Roaster', seedCost: 2000000, input: 'coffee', output: 'roasted_coffee', time: 300000, emoji: '🔥', reqLevel: 21, xp: 2500 },
        
        // NEW LUXURY ARTISAN MACHINES
        chocolatier: { id: 'chocolatier', name: 'Gourmet Mixer', seedCost: 3500000, input: 'pistachio', output: 'pistachio_praline', time: 600000, emoji: '🍯', reqLevel: 22, xp: 3500 },
        distillery: { id: 'distillery', name: 'Copper Still', seedCost: 6500000, input: 'barley', output: 'premium_whisky', time: 900000, emoji: '🥃', reqLevel: 24, xp: 5500 },
        perfumery: { id: 'perfumery', name: 'Fragrance Lab', seedCost: 12000000, input: 'bergamot', output: 'fresh_cologne', time: 1800000, emoji: '🧪', reqLevel: 26, xp: 8000 },

        extractor: { id: 'extractor', name: 'Honey Extractor', seedCost: 20000000, input: 'honeycomb', output: 'honey', time: 2400000, emoji: '🍯', reqLevel: 29, xp: 12000 },
        fermenter: { id: 'fermenter', name: 'Fermenting Tank', seedCost: 35000000, input: 'hops', output: 'beer', time: 3600000, emoji: '🍺', reqLevel: 31, xp: 18000 },
        oil_press: { id: 'oil_press', name: 'Oil Press', seedCost: 60000000, input: 'olive', output: 'olive_oil', time: 7200000, emoji: '🛢️', reqLevel: 33, xp: 28000 },
        cask: { id: 'cask', name: 'Oak Cask', seedCost: 120000000, input: 'grape', output: 'wine', time: 14400000, emoji: '🍷', reqLevel: 35, xp: 50000 } 
    },

    products: {
        quail_egg: { sell: 20 }, egg: { sell: 60 }, feather: { sell: 120 }, rabbit_wool: { sell: 250 }, pork_trimmings: { sell: 600 }, 
        wool: { sell: 1400 }, goat_milk: { sell: 3200 }, milk: { sell: 7500 }, honeycomb: { sell: 20000 }, 
        
        // New Animal Outputs
        raw_silk: { sell: 42000 }, civet_coffee_beans: { sell: 110000 },
        
        alpaca_fleece: { sell: 280000 }, truffle: { sell: 800000 },
        
        mayo: { sell: 150 }, flour: { sell: 200 }, sugar: { sell: 300 }, thread: { sell: 8000 }, cloth: { sell: 3500 }, 
        jam: { sell: 5000 }, cheese: { sell: 18000 }, roasted_coffee: { sell: 25000 }, honey: { sell: 60000 }, 
        
        // New Machine Outputs
        pistachio_praline: { sell: 45000 }, premium_whisky: { sell: 85000 }, fresh_cologne: { sell: 150000 },

        beer: { sell: 350000 }, olive_oil: { sell: 750000 }, wine: { sell: 1800000 } 
    },

    upgrades: {
        steel_tools: { name: 'Steel Hoes', desc: 'Crops grow 10% faster', cost: 10000, reqLevel: 5 },
        irrigation: { name: 'Drip Irrigation', desc: 'Crops grow 20% faster', cost: 150000, reqLevel: 12 },
        tractor: { name: 'Heavy Tractor', desc: 'Crops grow 35% faster', cost: 2500000, reqLevel: 22 },
        
        premium_feed: { name: 'Premium Feed', desc: 'Animal products sell for +25%', cost: 50000, reqLevel: 8 },
        selective_breeding: { name: 'Selective Breeding', desc: 'Animal products sell for +50%', cost: 800000, reqLevel: 17 },
        
        artisan_crafting: { name: 'Artisan Goods', desc: 'Machine products sell for +40%', cost: 5000000, reqLevel: 25 },
        
        // NEW LUXURY UPGRADES
        master_distiller: { name: 'Master Distiller', desc: 'Wine and Whisky sell for +50%', cost: 25000000, reqLevel: 28 },
        luxury_branding: { name: 'Boutique Branding', desc: 'ALL machine products sell for +100%', cost: 150000000, reqLevel: 34 }
    },

    managers: {
        auto_replant: { name: 'Field Hands', desc: 'Automatically pays for and replants crops', cost: 25000, reqLevel: 6 },
        auto_route: { name: 'Logistics Network', desc: 'Auto-moves raw items into idle factory machines', cost: 250000, reqLevel: 14 },
        auto_sell: { name: 'Wholesale Contracts', desc: 'Automatically sells finished/end products', cost: 5000000, reqLevel: 20 }
    }
};
