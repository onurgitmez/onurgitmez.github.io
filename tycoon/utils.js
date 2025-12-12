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

function getScaling() {
    // Helper to get current scaling factor safely
    // Default to 1.15 if game state isn't loaded yet
    if (typeof game === 'undefined' || !game.researchUnlocked) return 1.15;
    return game.researchUnlocked.includes('res_cheaper') ? 1.14 : 1.15;
}

function cost(base, count) {
    return base * Math.pow(getScaling(), count);
}

function totalCost(base, count, amt, prestigeLevel, buyModeSetting) {
    const scaling = getScaling();
    const discount = prestigeLevel >= 5 && buyModeSetting === 10 ? 0.95 : 1;
    
    // Geometric Series Sum Formula: Sum = a * (r^n - 1) / (r - 1)
    // a = cost of first item (current cost)
    // r = scaling factor
    // n = amount to buy
    const firstCost = cost(base, count);
    
    // Use precise formula instead of loop for performance & accuracy
    const total = firstCost * (Math.pow(scaling, amt) - 1) / (scaling - 1);
    
    return total * discount;
}

function maxBuy(base, count, money) {
    const scaling = getScaling();
    const currentCost = cost(base, count);
    
    if (money < currentCost) return 0;
    
    // Geometric Series Inverse Formula
    // Derived from: Money = Cost * (r^n - 1) / (r - 1)
    // Solved for n
    const n = Math.floor(
        Math.log(1 + (money * (scaling - 1)) / currentCost) / Math.log(scaling)
    );
    
    return Math.max(0, n);
}