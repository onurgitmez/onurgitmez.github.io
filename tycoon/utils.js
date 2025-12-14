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

function cost(base, count) {
    // 1. Calculate Standard Geometric Cost (Base * 1.15^count)
    let val = base * Math.pow(1.15, count);
    
    // 2. Apply "Efficient Logistics" Research Discount
    if (typeof game !== 'undefined' && game.researchLevels) {
        const lvl = game.researchLevels['res_cost'] || 0;
        if (lvl > 0) {
            // 2% discount per level
            const discount = Math.max(0.1, 1 - (lvl * 0.02)); 
            val *= discount;
        }
    }
    return val;
}

function totalCost(base, count, amt, prestigeLevel, buyModeSetting) {
    const scaling = 1.15;
    // NOTE: cost() already applies the Research discount to the first item
    const firstCost = cost(base, count);
    
    // Standard Geometric Sum Formula
    const total = firstCost * (Math.pow(scaling, amt) - 1) / (scaling - 1);
    
    const discount = prestigeLevel >= 5 && buyModeSetting === 10 ? 0.95 : 1;
    
    return total * discount;
}

function maxBuy(base, count, money) {
    const scaling = 1.15;
    const currentCost = cost(base, count);
    
    if (money < currentCost) return 0;
    
    const n = Math.floor(
        Math.log(1 + (money * (scaling - 1)) / currentCost) / Math.log(scaling)
    );
    
    return Math.max(0, n);
}