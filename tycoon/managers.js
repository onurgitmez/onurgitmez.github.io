// managers.js

const managerData = [
    { 
        id: 'm_tier1', 
        name: "Lil' Timmy", 
        desc: "Reduces Tier 1 scaling costs by 5%", 
        cost: 500000, 
        tierTarget: 1, 
        costReduction: 0.05,
        icon: '👦'
    },
    { 
        id: 'm_tier2', 
        name: "Sarah 'The Shark'", 
        desc: "Reduces Tier 2 scaling costs by 5%", 
        cost: 25000000, 
        tierTarget: 2, 
        costReduction: 0.05,
        icon: '🦈'
    },
    { 
        id: 'm_tier3', 
        name: "Gordon Ramsey", 
        desc: "Reduces Tier 3 scaling costs by 5%", 
        cost: 1000000000, 
        tierTarget: 3, 
        costReduction: 0.05,
        icon: '👨‍🍳'
    },
    { 
        id: 'm_tier4', 
        name: "Victor 'The Vault'", 
        desc: "Reduces Tier 4 scaling costs by 5%", 
        cost: 50000000000, 
        tierTarget: 4, 
        costReduction: 0.05,
        icon: '💼'
    },
    { 
        id: 'm_tier5', 
        name: "Elon Tusk", 
        desc: "Reduces Tier 5 scaling costs by 5%", 
        cost: 2500000000000, 
        tierTarget: 5, 
        costReduction: 0.05,
        icon: '🚀'
    },
    { 
        id: 'm_tier6', 
        name: "Mr. Monopoly", 
        desc: "Reduces Tier 6 scaling costs by 5%", 
        cost: 100000000000000, 
        tierTarget: 6, 
        costReduction: 0.05,
        icon: '🎩'
    }
];

// Helper to calculate scaling modifiers if a manager is unlocked
function getManagerDiscount(tier) {
    const manager = managerData.find(m => m.tierTarget === tier);
    if (manager && game.unlockedManagers.includes(manager.id)) {
        return manager.costReduction;
    }
    return 0;
}