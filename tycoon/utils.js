function fmt(n) {
    if (isNaN(n)) return "0";
    if (!isFinite(n)) return "∞";
    if (n < 1000000) return Math.floor(n).toLocaleString();
    
    const s = [
        "","k","M","B","T","Qa","Qi","Sx","Sp","Oc","No","Dc",
        "Ud","Dd","Td","Qad","Qid","Sxd","Spd","Ocd","Nod","Vg","Uvg"
    ];
    
    const i = Math.floor(Math.log10(n) / 3);
    if (i >= s.length) return n.toExponential(2).replace('+', '');
    
    let v = parseFloat((n / Math.pow(1000, i)).toFixed(2));
    return v + s[i];
}

function getResearchDiscount() {
    if (typeof game !== 'undefined' && game.researchLevels) {
        const lvl = game.researchLevels['res_cost'] || 0;
        if (lvl > 0) return Math.max(0.1, 1 - (lvl * 0.02)); 
    }
    return 1;
}

function cost(base, count) {
    let val = base * Math.pow(1.15, count);
    val *= getResearchDiscount();
    return val;
}

function totalCost(base, count, amt, prestigeLevel, buyModeSetting) {
    const scaling = 1.15;
    const discount = getResearchDiscount();
    const discountedBase = base * discount;
    const firstCost = discountedBase * Math.pow(scaling, count);
    
    const total = firstCost * (Math.pow(scaling, amt) - 1) / (scaling - 1);
    
    // LOGIC FIX: Check against the actual requested amount, not just the setting
    const useDiscount = prestigeLevel >= 5 && amt >= 10;
    const prestigeDiscount = useDiscount ? 0.95 : 1;
    
    return total * prestigeDiscount;
}

// FIX: Added prestigeLevel to params to calculate discount correctly
function maxBuy(base, count, money, prestigeLevel) {
    const scaling = 1.15;
    const researchDiscount = getResearchDiscount();
    
    // Effective base price after research
    const effectiveBase = base * researchDiscount;
    const currentCost = effectiveBase * Math.pow(scaling, count);
    
    if ((money + 0.000001) < currentCost) return 0;
    
    // Helper to calculate max N given a specific base price
    const calcN = (p_base) => {
    const p_curr = p_base * Math.pow(scaling, count);
    if (!isFinite(p_curr) || p_curr <= 0) return 0;
    const result = Math.floor(
        Math.log(1 + (money * (scaling - 1)) / p_curr) / Math.log(scaling)
    );
    return isFinite(result) && result > 0 ? result : 0;
};

    // 1. Calculate Max at standard price
    let n = calcN(effectiveBase);

    // 2. Logic Check: Bulk Discount (Prestige Lvl 5+)
    if (prestigeLevel >= 5) {
        // If we can already afford 10+, recalculate using the 5% off price
        if (n >= 10) {
            n = calcN(effectiveBase * 0.95);
        } 
        // Edge Case: If we can afford 9 at full price, can we afford 10 at discount?
        else {
            const costOf10 = totalCost(base, count, 10, prestigeLevel, 10);
            if (money >= costOf10) {
                // If we can afford 10, we might be able to afford even more
                n = calcN(effectiveBase * 0.95);
            }
        }
    }
    
    return Math.max(0, n);
}