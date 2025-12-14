const businesses = [
    { name: "Lemonade Stand", cost: 15, income: 1, count: 0, tier: 1 },
    { name: "Newspaper Route", cost: 100, income: 4, count: 0, tier: 1 },
    { name: "Flower Stall", cost: 350, income: 12, count: 0, tier: 1 },
    { name: "Taco Truck", cost: 1200, income: 35, count: 0, tier: 1 },
    { name: "Coffee Shop", cost: 4500, income: 110, count: 0, tier: 2 },
    { name: "Corner Store", cost: 12000, income: 250, count: 0, tier: 2 },
    { name: "Clothing Store", cost: 35000, income: 650, count: 0, tier: 2 },
    { name: "Local Bar", cost: 90000, income: 1400, count: 0, tier: 2 },
    { name: "Restaurant", cost: 250000, income: 3200, count: 0, tier: 3 },
    { name: "Beauty Salon", cost: 800000, income: 8500, count: 0, tier: 3 },
    { name: "Bowling Alley", cost: 3000000, income: 25000, count: 0, tier: 3 },
    { name: "Fitness Gym", cost: 10000000, income: 75000, count: 0, tier: 3 },
    { name: "Nightclub", cost: 45000000, income: 280000, count: 0, tier: 4 },
    { name: "Golf Course", cost: 150000000, income: 800000, count: 0, tier: 4 },
    { name: "Casino", cost: 600000000, income: 2500000, count: 0, tier: 4 },
    { name: "Luxury Hotel", cost: 2500000000, income: 9000000, count: 0, tier: 4 },
    { name: "Movie Studio", cost: 12000000000, income: 35000000, count: 0, tier: 5 },
    { name: "Tech Startup", cost: 65000000000, income: 150000000, count: 0, tier: 5 },
    { name: "Airline", cost: 350000000000, income: 700000000, count: 0, tier: 5 },
    { name: "Oil Company", cost: 2000000000000, income: 3500000000, count: 0, tier: 5 },
    { name: "Bank Chain", cost: 15000000000000, income: 20000000000, count: 0, tier: 6 },
    { name: "Social Network", cost: 85000000000000, income: 100000000000, count: 0, tier: 6 },
    { name: "Media Empire", cost: 500000000000000, income: 550000000000, count: 0, tier: 6 },
    { name: "Pharma Giant", cost: 3500000000000000, income: 3200000000000, count: 0, tier: 6 },
    { name: "AI Data Center", cost: 25000000000000000, income: 18000000000000, count: 0, tier: 7 },
    { name: "Space Station", cost: 200000000000000000, income: 120000000000000, count: 0, tier: 7 },
    { name: "Dyson Sphere", cost: 5000000000000000000, income: 950000000000000, count: 0, tier: 8 },
    { name: "Universal Fabricator", cost: 99000000000000000000, income: 8800000000000000, count: 0, tier: 8 }
];

const emojis = ["🍋","📰","🌸","🌮","☕","🏪","👔","🍺","🍽️","💇","🎳","💪","🎉","⛳","🎰","🏨","🎬","💻","✈️","🛢️","🏦","📱","📺","💊", "🤖", "🛰️", "☀️", "⚛️"];

const upgrades = businesses.map((b, i) => ({
    id: `u${i}`, name: `${b.name} Boost`, desc: `+150% ${b.name} income`, 
    cost: b.cost * 10, level: 0, max: 10, biz: i, mult: 2.5, tier: b.tier
})).concat([
    { id: 'gt1', name: 'Street Power', desc: 'Tier 1 +25%', cost: 50000, level: 0, max: 5, biz: -1, tier: 1, mult: 1.25 },
    { id: 'gt2', name: 'Retail Master', desc: 'Tier 2 +25%', cost: 500000, level: 0, max: 5, biz: -1, tier: 2, mult: 1.25 },
    { id: 'gt3', name: 'Service King', desc: 'Tier 3 +25%', cost: 5000000, level: 0, max: 5, biz: -1, tier: 3, mult: 1.25 },
    { id: 'gt4', name: 'Luxury Brand', desc: 'Tier 4 +25%', cost: 500000000, level: 0, max: 5, biz: -1, tier: 4, mult: 1.25 },
    { id: 'gt5', name: 'Corporate Elite', desc: 'Tier 5 +25%', cost: 50000000000, level: 0, max: 5, biz: -1, tier: 5, mult: 1.25 },
    { id: 'gt6', name: 'Global Power', desc: 'Tier 6 +25%', cost: 5000000000000, level: 0, max: 5, biz: -1, tier: 6, mult: 1.25 },
    { id: 'gt7', name: 'Future Tech', desc: 'Tier 7/8 +50%', cost: 1000000000000000, level: 0, max: 5, biz: -1, tier: 7, mult: 1.5 },
    { id: 'gall', name: 'Empire Synergy', desc: 'All +10%', cost: 100000000, level: 0, max: 10, biz: -1, tier: -1, mult: 1.1 }
]);

const prestigeUnlocksList = [
    { level: 1, title: 'Starter Boost', desc: 'Begin new runs with $1,000' },
    { level: 2, title: 'Quick Start', desc: 'First 5 businesses unlocked' },
    { level: 3, title: 'Event Magnet', desc: 'Events happen 50% more often' },
    { level: 5, title: 'Bulk Discount', desc: 'Buying x10 gives 5% discount' },
    { level: 7, title: 'Lucky Streaks', desc: 'Combo multiplier increased by 50%' },
    { level: 10, title: 'Master Tycoon', desc: 'All milestone bonuses increased to 30%' }
];

const events = [
    { name: 'Market Boom', icon: '📈', desc: 'All income doubled!', mult: 2, duration: 30000 },
    { name: 'Super Sale', icon: '🎉', desc: 'All income tripled!', mult: 3, duration: 20000 },
    { name: 'Tax Break', icon: '💰', desc: '+50% income boost!', mult: 1.5, duration: 45000 },
    { name: 'Economic Crisis', icon: '📉', desc: 'Income reduced by 50%', mult: 0.5, duration: 30000 },
    { name: 'Recession', icon: '⚠️', desc: 'Income reduced by 30%', mult: 0.7, duration: 40000 },
    { name: 'Golden Hour', icon: '✨', desc: 'Massive 5x income!', mult: 5, duration: 15000 },
    { name: 'Flash Sale', icon: '⚡', desc: 'Quick 2x boost!', mult: 2, duration: 10000 }
];

const achievementList = [
    { id: 'first_biz', name: 'Entrepreneur', desc: 'Buy your first business', icon: '🎯', check: (g, b_list) => b_list.some(b => b.count > 0), reward: 100 },
    { id: 'lemon_100', name: 'Lemonade Empire', desc: 'Own 100 Lemonade Stands', icon: '🍋', check: (g, b_list) => b_list[0].count >= 100, reward: 2500 },
    { id: 'millionaire', name: 'Millionaire', desc: 'Earn $1 Million Lifetime', icon: '💰', check: (g) => g.lifetimeEarned >= 1000000, reward: 10000 },
    { id: 'billionaire', name: 'Billionaire', desc: 'Earn $1 Billion Lifetime', icon: '💎', check: (g) => g.lifetimeEarned >= 1000000000, reward: 10000000 },
    { id: 'trillionaire', name: 'Trillionaire', desc: 'Earn $1 Trillion Lifetime', icon: '👑', check: (g) => g.lifetimeEarned >= 1000000000000, reward: 10000000000 },
    { id: 'clicks_1000', name: 'Clicking Master', desc: 'Make 1000 purchases', icon: '👆', check: (g) => g.totalClicks >= 1000, reward: 50000 },
    { id: 'all_owned', name: 'Diversified', desc: 'Own at least one of every business', icon: '🌟', check: (g, b_list) => b_list.every(b => b.count > 0), reward: 500000 },
    { id: 'tier6_unlock', name: 'Elite Status', desc: 'Unlock a Tier 6 business', icon: '🏆', check: (g, b_list) => b_list.filter(b => b.tier === 6).some(b => b.count > 0), reward: 1000000000 },
    { id: 'upgrade_max', name: 'Power Player', desc: 'Max out any upgrade', icon: '⚡', check: (g, b_list, u_list) => u_list.some(u => u.level >= u.max), reward: 1000000 },
    { id: 'prestige_1', name: 'Ascended', desc: 'Prestige for the first time', icon: '⭐', check: (g) => g.prestigeLevel >= 1, reward: 0 },
    { id: 'income_1m', name: 'Cash Flow', desc: 'Reach $1M/sec income', icon: '💸', check: (g) => g.totalIncome >= 1000000, reward: 1000000 },
    { id: 'event_10', name: 'Event Veteran', desc: 'Witness 10 random events', icon: '🎪', check: (g) => g.eventsWitnessed >= 10, reward: 500000 },
    { id: 'biz_level_50', name: 'Master Manager', desc: 'Level any business to 50', icon: '📈', check: (g, b_list) => b_list.some(b => b.count >= 500), reward: 10000000 },
    { id: 'all_25', name: 'Quarter Century', desc: 'Own 25 of every business', icon: '🎯', check: (g, b_list) => b_list.every(b => b.count >= 25), reward: 50000000 },
    { id: 'quick_million', name: 'Speed Tycoon', desc: 'Reach $1M in one run within 5 mins', icon: '⚡', check: (g) => g.totalEarned >= 1000000 && (Date.now() - g.startTime) < 300000, reward: 250000 }
];

// FIX: Lowered cost scales to prevent mathematical soft-lock
const researchData = [
    { 
        id: 'res_cost', 
        name: 'Efficient Logistics', 
        desc: 'Reduce all business costs by 2% per level.', 
        baseCost: 1, 
        costScale: 1.2, // Was 1.5
        max: 25,
        type: 'cost_reduction',
        val: 0.02 
    },
    { 
        id: 'res_global', 
        name: 'Empire Synergy', 
        desc: 'Increase ALL income by 10% per level.', 
        baseCost: 2, 
        costScale: 1.3, // Was 1.8
        max: 50,
        type: 'income_boost',
        val: 0.10
    },
    { 
        id: 'res_events', 
        name: 'Market Analysis', 
        desc: 'Events spawn 10% more frequently per level.', 
        baseCost: 5, 
        costScale: 1.4, // Was 2.0
        max: 10,
        type: 'event_freq',
        val: 0.10
    },
    { 
        id: 'res_kp', 
        name: 'Ancient Wisdom', 
        desc: 'Gain 5% more Knowledge Points from Prestige.', 
        baseCost: 10, 
        costScale: 1.5, // Was 2.5
        max: 20,
        type: 'kp_boost',
        val: 0.05
    }
];