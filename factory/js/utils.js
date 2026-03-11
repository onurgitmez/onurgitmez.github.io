import { buildingDefs } from './data.js';
import { resources, gameState } from './state.js';

export function getCost(key) {
    const def = buildingDefs[key];
    if(def.type === 'milestone') return def.cost;
    const mult = Math.pow(1.15, gameState.buildings[key].count);
    let c = {};
    for(const [r,v] of Object.entries(def.cost)) {
        c[r] = Math.ceil(v * mult);
    }
    return c;
}

export function checkAfford(c) { 
    for(const r in c) {
        if(resources[r] < c[r]) return false;
    }
    return true;
}

export function payCost(c) { 
    for(const r in c) resources[r] -= c[r];
}

export function getPrice(r) { 
    const prices = {
        ironOre: 1, copperOre: 1, stone: 0.5,
        coal: 2, ironIngot: 2, copperIngot: 2,
        ironPlate: 3, wire: 3, cable: 5,
        steelIngot: 10, plastic: 12, circuit: 15,
        motor: 20, computer: 50
    };
    return prices[r] || 1;
}

export function formatName(s) { 
    return s.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim();
}

export function fmtIO(obj) { 
    if(!obj || Object.keys(obj).length === 0) return '-';
    return Object.entries(obj).map(([k,v]) => `${v} ${formatName(k)}`).join(', ');
}

export function formatTime(sec) {
    if (sec < 60) return `${Math.floor(sec)}s`;
    if (sec < 3600) return `${Math.floor(sec/60)}m ${Math.floor(sec%60)}s`;
    return `${Math.floor(sec/3600)}h ${Math.floor((sec%3600)/60)}m`;
}