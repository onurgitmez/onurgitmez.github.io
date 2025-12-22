/* data.js */
const GAME_DATA = {
    // 1. CROPS: Seed Cost (paid every time) -> Sell Price
    crops: {
        turnip: { id: 'turnip', name: 'Turnip Farm', type: 'crop', seedCost: 5, sell: 15, time: 3000, emoji: '🥔', reqLevel: 1, xp: 10 },
        wheat: { id: 'wheat', name: 'Wheat Field', type: 'crop', seedCost: 15, sell: 40, time: 5000, emoji: '🌾', reqLevel: 2, xp: 20 },
        carrot: { id: 'carrot', name: 'Carrot Patch', type: 'crop', seedCost: 40, sell: 100, time: 8000, emoji: '🥕', reqLevel: 3, xp: 30 },
        coffee: { id: 'coffee', name: 'Coffee Plantation', type: 'crop', seedCost: 100, sell: 350, time: 10000, emoji: '☕', reqLevel: 5, xp: 50 },
        pumpkin: { id: 'pumpkin', name: 'Pumpkin Patch', type: 'crop', seedCost: 300, sell: 1200, time: 15000, emoji: '🎃', reqLevel: 8, xp: 100 },
        ancient: { id: 'ancient', name: 'Ancient Fruit', type: 'crop', seedCost: 2000, sell: 8000, time: 30000, emoji: '✨', reqLevel: 12, xp: 500 }
    },

    // 2. TREES: Setup Cost (paid once) -> Free Production
    trees: {
        apple: { id: 'apple', name: 'Apple Orchard', type: 'tree', seedCost: 1000, sell: 200, time: 10000, emoji: '🍎', reqLevel: 4, xp: 40 },
        orange: { id: 'orange', name: 'Orange Grove', type: 'tree', seedCost: 2500, sell: 500, time: 15000, emoji: '🍊', reqLevel: 6, xp: 60 },
        olive: { id: 'olive', name: 'Olive Trees', type: 'tree', seedCost: 6000, sell: 1500, time: 25000, emoji: '🫒', reqLevel: 10, xp: 150 }
    },

    // 3. ANIMALS: Setup Cost (paid once) -> Free Production
    animals: {
        chicken: { id: 'chicken', name: 'Chicken Coop', seedCost: 2000, output: 'egg', time: 5000, emoji: '🐔', reqLevel: 2, xp: 25 },
        cow: { id: 'cow', name: 'Dairy Barn', seedCost: 5000, output: 'milk', time: 10000, emoji: '🐄', reqLevel: 4, xp: 50 },
        sheep: { id: 'sheep', name: 'Sheep Pen', seedCost: 15000, output: 'wool', time: 15000, emoji: '🐑', reqLevel: 7, xp: 100 },
        pig: { id: 'pig', name: 'Pig Sty', seedCost: 30000, output: 'truffle', time: 30000, emoji: '🐷', reqLevel: 10, xp: 300 }
    },

    // 4. MACHINES: Setup Cost (paid once) -> Requires Input Item
    machines: {
        mayo_machine: { id: 'mayo_machine', name: 'Mayo Machine', seedCost: 1500, input: 'egg', output: 'mayo', time: 4000, emoji: '🏺', reqLevel: 2, xp: 30 },
        mill: { id: 'mill', name: 'Flour Mill', seedCost: 2500, input: 'wheat', output: 'flour', time: 4000, emoji: '🏭', reqLevel: 3, xp: 30 },
        cheese_press: { id: 'cheese_press', name: 'Cheese Press', seedCost: 5000, input: 'milk', output: 'cheese', time: 6000, emoji: '🧀', reqLevel: 5, xp: 60 },
        loom: { id: 'loom', name: 'Loom', seedCost: 10000, input: 'wool', output: 'cloth', time: 8000, emoji: '👕', reqLevel: 7, xp: 120 },
        keg: { id: 'keg', name: 'Keg', seedCost: 15000, input: 'coffee', output: 'espresso', time: 12000, emoji: '🍺', reqLevel: 8, xp: 150 },
        cask: { id: 'cask', name: 'Wine Cask', seedCost: 30000, input: 'ancient', output: 'wine', time: 40000, emoji: '🍷', reqLevel: 15, xp: 1000 }
    },

    // 5. PRODUCTS: Sell prices for things made by Animals and Machines
    products: {
        // Animal Outputs
        egg: { sell: 50 },
        milk: { sell: 120 },
        wool: { sell: 350 },
        truffle: { sell: 1500 },
        
        // Machine Outputs
        mayo: { sell: 180 },
        flour: { sell: 100 },
        cheese: { sell: 450 },
        cloth: { sell: 1000 },
        espresso: { sell: 1800 },
        wine: { sell: 25000 }
    }
};
