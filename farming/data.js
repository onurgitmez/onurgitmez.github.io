/* data.js */
const GAME_DATA = {
    // CROPS: seedCost = deducted every cycle. sell = revenue.
    crops: {
        turnip: { id: 'turnip', name: 'Turnip Farm', type: 'crop', seedCost: 5, sell: 15, time: 3000, emoji: '🥔', reqLevel: 1, xp: 10 },
        wheat: { id: 'wheat', name: 'Wheat Field', type: 'crop', seedCost: 15, sell: 40, time: 5000, emoji: '🌾', reqLevel: 2, xp: 20 },
        carrot: { id: 'carrot', name: 'Carrot Patch', type: 'crop', seedCost: 40, sell: 100, time: 8000, emoji: '🥕', reqLevel: 3, xp: 30 },
        coffee: { id: 'coffee', name: 'Coffee Plantation', type: 'crop', seedCost: 100, sell: 350, time: 10000, emoji: '☕', reqLevel: 5, xp: 50 },
        pumpkin: { id: 'pumpkin', name: 'Pumpkin Patch', type: 'crop', seedCost: 300, sell: 1200, time: 15000, emoji: '🎃', reqLevel: 8, xp: 100 },
        ancient: { id: 'ancient', name: 'Ancient Fruit', type: 'crop', seedCost: 2000, sell: 8000, time: 30000, emoji: '✨', reqLevel: 12, xp: 500 }
    },

    // TREES: Setup cost only. No seedCost per cycle.
    trees: {
        apple: { id: 'apple', name: 'Apple Orchard', type: 'tree', seedCost: 1000, sell: 200, time: 10000, emoji: '🍎', reqLevel: 4, xp: 40 },
        orange: { id: 'orange', name: 'Orange Grove', type: 'tree', seedCost: 2500, sell: 500, time: 15000, emoji: '🍊', reqLevel: 6, xp: 60 },
        olive: { id: 'olive', name: 'Olive Trees', type: 'tree', seedCost: 6000, sell: 1500, time: 25000, emoji: '🫒', reqLevel: 10, xp: 150 }
    },

    // ANIMALS: Setup cost only.
    animals: {
        chicken: { id: 'chicken', name: 'Chicken Coop', seedCost: 2000, output: 'egg', sell: 60, time: 5000, emoji: '🐔', reqLevel: 2, xp: 25 },
        cow: { id: 'cow', name: 'Dairy Barn', seedCost: 5000, output: 'milk', sell: 150, time: 10000, emoji: '🐄', reqLevel: 4, xp: 50 },
        sheep: { id: 'sheep', name: 'Sheep Pen', seedCost: 15000, output: 'wool', sell: 400, time: 15000, emoji: '🐑', reqLevel: 7, xp: 100 },
        pig: { id: 'pig', name: 'Pig Sty', seedCost: 30000, output: 'truffle', sell: 1500, time: 30000, emoji: '🐷', reqLevel: 10, xp: 300 }
    },

    // MACHINES: setup cost + input item required.
    machines: {
        mayo: { id: 'mayo', name: 'Mayo Machine', seedCost: 1500, input: 'egg', output: 'mayo', sell: 180, time: 4000, emoji: '🏺', reqLevel: 2, xp: 30 },
        mill: { id: 'mill', name: 'Flour Mill', seedCost: 2500, input: 'wheat', output: 'flour', sell: 120, time: 4000, emoji: '🏭', reqLevel: 3, xp: 30 },
        cheese: { id: 'cheese', name: 'Cheese Press', seedCost: 5000, input: 'milk', output: 'cheese', sell: 450, time: 6000, emoji: '🧀', reqLevel: 5, xp: 60 },
        loom: { id: 'loom', name: 'Loom', seedCost: 10000, input: 'wool', output: 'cloth', sell: 1000, time: 8000, emoji: '👕', reqLevel: 7, xp: 120 },
        keg: { id: 'keg', name: 'Keg', seedCost: 15000, input: 'coffee', output: 'espresso', sell: 1800, time: 12000, emoji: '🍺', reqLevel: 8, xp: 150 },
        wine: { id: 'wine', name: 'Cask', seedCost: 30000, input: 'ancient', output: 'wine', sell: 25000, time: 40000, emoji: '🍷', reqLevel: 15, xp: 1000 }
    }
};