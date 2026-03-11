// ===== UTILITY FUNCTIONS =====

// Calculates cumulative geometric growth 
// Formula: Base * (Mult^Count - 1) / (Mult - 1)
export function getGeom(baseCap, count, mult = 1.15) {
    if (count <= 0) return 0;
    if (mult === 1) return baseCap * count;
    return baseCap * (Math.pow(mult, count) - 1) / (mult - 1);
}

// Formats seconds into h/m/s
export function formatTime(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${h}h ${m}m ${s}s`;
}

// Simple logging system for the UI
export function log(msg, type = "") {
    const d = document.createElement('div');
    d.className = `log-msg ${type}`;
    d.innerText = msg;
    const overlay = document.getElementById('log-overlay');
    
    if (overlay) {
        overlay.prepend(d);
        if (overlay.children.length > 5) overlay.lastChild.remove();
        setTimeout(() => { if (d.parentNode) d.remove(); }, 3000);
    }
}

// Number formatter to make big numbers readable (e.g., 1.5M instead of 1500000)
export function formatNumber(num) {
    if (num < 1000) return Math.floor(num).toString();
    const suffixes = ["", "k", "M", "B", "T", "Qa", "Qi"];
    const suffixNum = Math.floor(("" + Math.floor(num)).length / 3);
    
    let shortValue = parseFloat((suffixNum !== 0 ? (num / Math.pow(1000, suffixNum)) : num).toPrecision(3));
    if (shortValue % 1 !== 0) shortValue = shortValue.toFixed(1);
    
    return shortValue + suffixes[suffixNum];
}