function fmt(n) {
    if (isNaN(n)) return "0";
    if (!isFinite(n)) return "∞";
    if (n < 1000000) return Math.floor(n).toLocaleString();
    
    const s = [
        "","k","M","B","T","Qa","Qi","Sx","Sp","Oc","No","Dc",
        "Ud","Dd","Td","Qad","Qid","Sxd","Spd","Ocd","Nod","Vg","Uvg"
    ];
    
    const i = Math.floor(Math.log10(n) / 3);
    let v = parseFloat((n / Math.pow(1000, i)).toFixed(2));
    
    // If within standard suffixes
    if (i < s.length) {
        return v + s[i];
    }
    
    // Fallback to AA, AB, AC scaling for massive numbers
    const extendedIndex = i - s.length;
    const firstLetter = String.fromCharCode(65 + Math.floor(extendedIndex / 26));
    const secondLetter = String.fromCharCode(65 + (extendedIndex % 26));
    
    return v + firstLetter + secondLetter;
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
    
    const useDiscount = prestigeLevel >= 5 && amt >= 10;
    const prestigeDiscount = useDiscount ? 0.95 : 1;
    
    return total * prestigeDiscount;
}

function maxBuy(base, count, money, prestigeLevel) {
    const scaling = 1.15;
    const researchDiscount = getResearchDiscount();
    
    const effectiveBase = base * researchDiscount;
    const currentCost = effectiveBase * Math.pow(scaling, count);
    
    if ((money + 0.000001) < currentCost) return 0;
    
    const calcN = (p_base) => {
        const p_curr = p_base * Math.pow(scaling, count);
        if (!isFinite(p_curr) || p_curr <= 0) return 0;
        const result = Math.floor(
            Math.log(1 + (money * (scaling - 1)) / p_curr) / Math.log(scaling)
        );
        return isFinite(result) && result > 0 ? result : 0;
    };

    let n = calcN(effectiveBase);

    if (prestigeLevel >= 5) {
        if (n >= 10) {
            n = calcN(effectiveBase * 0.95);
        } else {
            const costOf10 = totalCost(base, count, 10, prestigeLevel, 10);
            if (money >= costOf10) {
                n = calcN(effectiveBase * 0.95);
            }
        }
    }
    
    return Math.max(0, n);
}