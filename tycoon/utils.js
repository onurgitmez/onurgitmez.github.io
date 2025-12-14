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
    // Calculate research discount once
    if (typeof game !== 'undefined' && game.researchLevels) {
        const lvl = game.researchLevels['res_cost'] || 0;
        if (lvl > 0) {
            // 2% discount per level, minimum 10% of original cost
            return Math.max(0.1, 1 - (lvl * 0.02)); 
        }
    }
    return 1;
}

function cost(base, count) {
    // Calculate Standard Geometric Cost (Base * 1.15^count)
    let val = base * Math.pow(1.15, count);
    
    // Apply Research Discount
    val *= getResearchDiscount();
    
    return val;
}

function totalCost(base, count, amt, prestigeLevel, buyModeSetting) {
    const scaling = 1.15;
    const discount = getResearchDiscount();
    
    // Apply research discount to base, then calculate geometric sum
    const discountedBase = base * discount;
    const firstCost = discountedBase * Math.pow(scaling, count);
    
    // Standard Geometric Sum Formula with discount already applied
    const total = firstCost * (Math.pow(scaling, amt) - 1) / (scaling - 1);
    
    // LOGIC FIX: Apply discount if amt is >= 10 (covers both Buy x10 and Buy Max >= 10)
    // This prevents Buy Max from being more expensive than manual x10 buying
    const useDiscount = prestigeLevel >= 5 && amt >= 10;
    const prestigeDiscount = useDiscount ? 0.95 : 1;
    
    return total * prestigeDiscount;
}

function maxBuy(base, count, money) {
    const scaling = 1.15;
    const currentCost = cost(base, count);
    
    // FLOAT FIX: Use a small epsilon to prevent floating point lockout
    // if money is exactly equal to cost
    if ((money + 0.000001) < currentCost) return 0;
    
    const n = Math.floor(
        Math.log(1 + (money * (scaling - 1)) / currentCost) / Math.log(scaling)
    );
    
    return Math.max(0, n);
}