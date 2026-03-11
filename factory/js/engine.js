import { DT } from './data.js';
import { resources, resourceRates, gameState } from './state.js';
import { updateUI } from './ui.js';

export function gameLoop() {
    if (!gameState.systemReady) return;

    for(const k in resources) resourceRates[k] = 0;

    let gen = 0, drain = 0;

    // Generators
    for (const [key, b] of Object.entries(gameState.buildings)) {
        if (b.count === 0 || !b.active) continue;
        const def = b.def;
        
        if (def.power > 0) {
            let fuelEff = 1.0;
            for (const [res, qty] of Object.entries(def.inputs)) {
                const needed = qty * b.count * DT;
                if(resources[res] < needed) {
                    const availablePct = resources[res] / needed;
                    fuelEff = Math.min(fuelEff, availablePct);
                }
            }
            if (fuelEff > 0) {
                for (const [res, qty] of Object.entries(def.inputs)) {
                    const consumption = (qty * b.count * DT * fuelEff);
                    resources[res] -= consumption;
                    resourceRates[res] -= (qty * b.count * fuelEff); 
                }
                gen += (def.power * b.count * fuelEff);
            }
            b.efficiency = fuelEff;
        } else if (def.power < 0) {
            drain += Math.abs(def.power) * b.count;
        }
    }

    gameState.power.produced = gen;
    gameState.power.demanded = drain;
    const gridEff = (drain === 0) ? 1.0 : (gen >= drain ? 1.0 : gen / drain);
    gameState.power.efficiency = gridEff;

    // Production
    for (const [key, b] of Object.entries(gameState.buildings)) {
        if (b.count === 0 || !b.active || b.def.type === 'milestone') continue;
        const def = b.def;
        if (def.power > 0) continue;

        let opEff = gridEff; 
        for (const [res, qty] of Object.entries(def.inputs)) {
            const needed = qty * b.count * DT * opEff;
            if (resources[res] < needed) {
                const availablePct = resources[res] / needed;
                opEff = Math.min(opEff, availablePct * opEff);
            }
        }

        if (opEff > 0) {
            for (const [res, qty] of Object.entries(def.inputs)) {
                resources[res] -= (qty * b.count * DT * opEff);
                resourceRates[res] -= (qty * b.count * opEff); 
            }
            for (const [res, qty] of Object.entries(def.outputs)) {
                resources[res] += (qty * b.count * DT * opEff);
                resourceRates[res] += (qty * b.count * opEff); 
            }
        }
        b.efficiency = opEff;
    }

    for (const k in resources) {
        if (resources[k] < 0) resources[k] = 0;
    }
    
    updateUI();
}