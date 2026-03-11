import { buildingDefs, tabs } from './data.js';
import { resources, resourceRates, gameState } from './state.js';
import { getCost, getPrice, formatName, fmtIO, checkAfford } from './utils.js';

window.switchTab = function(id, navEl) {
    document.querySelectorAll('.tab-content').forEach(e => e.classList.remove('active-tab'));
    const targetTab = document.getElementById(`tab-${id}`);
    if(targetTab) targetTab.classList.add('active-tab');
    document.querySelectorAll('.nav-item').forEach(e => e.classList.remove('active'));
    navEl.classList.add('active');
};

export function initMarket() {
    const mkt = document.getElementById('market-buttons');
    if(!mkt) return;
    mkt.innerHTML = '';
    
    const sellList = ['ironOre', 'copperOre', 'coal', 'ironIngot', 'copperIngot', 'steelIngot', 'plastic', 'circuit'];
    sellList.forEach(r => {
        const price = getPrice(r) * 10;
        const btn = document.createElement('div');
        btn.className = 'market-row';
        btn.id = `mkt-btn-${r}`;
        btn.onclick = () => window.sellResource(r, 10);
        btn.innerHTML = `
            <div class="mkt-left"><span class="mkt-icon">📦</span><span class="mkt-name">10 ${formatName(r)}</span></div>
            <div class="mkt-right"><span class="mkt-price">+${price}</span><span class="mkt-currency">MC</span></div>
        `;
        mkt.appendChild(btn);
    });
}

export function rebuildTabs() {
    const nav = document.getElementById('nav-list');
    nav.innerHTML = '';
    const container = document.getElementById('tab-container');
    container.innerHTML = '';

    tabs.forEach(t => {
        if (t.id === 'nuclear' && gameState.stage < 4) return;
        if (t.id === 'advanced' && gameState.stage < 2) return;

        const li = document.createElement('li');
        li.className = 'nav-item';
        li.innerHTML = `${t.icon} ${t.name}`;
        li.onclick = () => window.switchTab(t.id, li);
        nav.appendChild(li);

        const div = document.createElement('div');
        div.id = `tab-${t.id}`;
        div.className = 'tab-content';
        div.innerHTML = `<h2 class="tab-header">${t.name}</h2><div class="grid-container" id="grid-${t.id}"></div>`;
        container.appendChild(div);

        const grid = div.querySelector('.grid-container');
        for (const [key, def] of Object.entries(buildingDefs)) {
            if (def.tab !== t.id) continue;
            if (def.stage > gameState.stage) continue;
            if (def.type === 'milestone' && def.unlocks <= gameState.stage) continue;
            grid.appendChild(createCard(key, def));
        }
    });
    
    if(!document.querySelector('.active-tab') && nav.firstChild) nav.firstChild.click();
}

function createCard(key, def) {
    const d = document.createElement('div');
    d.className = 'card';
    const ins = fmtIO(def.inputs);
    const outs = fmtIO(def.outputs);
    const pwr = def.power > 0 ? `<span class="t-green">+${def.power} MW</span>` : (def.power < 0 ? `<span class="t-red">${def.power} MW</span>` : '');
    const isChecked = gameState.buildings[key].active ? 'checked' : '';

    d.innerHTML = `
        <div class="card-top">
            <div>
                <div class="b-title">${def.name}</div>
                <div class="b-sub">${def.type==='milestone'?'RESEARCH':`Tier ${def.stage}`} &nbsp; ${pwr}</div>
            </div>
            ${def.type!=='milestone' ? `<div class="b-count" id="count-${key}">0</div>` : ''}
        </div>
        ${def.type!=='milestone' ? `<div class="prog-bar"><div class="prog-fill" id="fill-${key}"></div></div>` : ''}
        <div class="io-box">
            ${def.type==='milestone' ? '<div style="color:#fff;margin-bottom:5px">🔓 Unlocks New Technology</div>' : ''}
            <div class="io-row"><span class="t-mute">Base IN: ${ins}</span></div>
            <div class="io-row"><span class="t-white">Base OUT: ${outs}</span></div>
            ${def.type!=='milestone' ? `<div id="stats-${key}" class="live-stats"></div>` : ''}
        </div>
        <div class="card-actions">
            <button class="build-btn" id="btn-${key}" onclick="window.build('${key}')">
                ${def.type==='milestone'?'🔬 UNLOCK':'🔨 BUILD'} <div class="cost-text" id="cost-${key}"></div>
            </button>
            ${def.type!=='milestone' ? `<div class="toggle-wrap"><input type="checkbox" class="tgl-inp" id="tgl-${key}" ${isChecked} onchange="window.toggle('${key}',this)"><label for="tgl-${key}" class="tgl-lbl"></label></div>` : ''}
        </div>
    `;
    return d;
}

export function updateStageDisplay() {
    const stageEl = document.getElementById('current-stage');
    if(stageEl) stageEl.innerText = gameState.stage;
}

export function updateMilestoneUI() {
    let nextMS = null;
    for(const [k, d] of Object.entries(buildingDefs)) {
        if (d.type === 'milestone' && d.unlocks > gameState.stage) { nextMS = d; break; }
    }
    const title = document.getElementById('ms-desc');
    const req = document.getElementById('ms-req');
    if(nextMS) {
        title.innerText = nextMS.name;
        let arr = [];
        for(const [r,v] of Object.entries(nextMS.cost)) arr.push(`${v} ${formatName(r)}`);
        req.innerText = "Req: " + arr.join(', ');
    } else {
        title.innerText = "All Technologies Unlocked";
        req.innerText = "🎯 Goal: Build Project Assembly";
    }
}

export function updateUI() {
    if(!gameState.systemReady) return;

    const bioDisp = document.getElementById('manual-status');
    if(bioDisp) bioDisp.innerHTML = `Biomass: ${Math.floor(resources.biomass)} | Stone: ${Math.floor(resources.stone)}`;
    
    const produced = Math.floor(gameState.power.produced);
    const demanded = Math.floor(gameState.power.demanded);
    document.getElementById('power-val').innerText = `${demanded} / ${produced} MW`;

    const bar = document.getElementById('power-bar');
    let pct = produced > 0 ? (demanded / produced) * 100 : (demanded > 0 ? 100 : 0);
    bar.style.width = `${Math.min(pct,100)}%`;
    bar.style.background = demanded > produced ? 'var(--danger)' : (pct > 90 ? '#f59e0b' : 'var(--power)');

    document.getElementById('credit-display').innerText = Math.floor(resources.credits);

    const tick = document.getElementById('storage-ticker');
    let html = '';
    for(const [r,v] of Object.entries(resources)) {
        if(v > 0.01 && !['credits','biomass','stone'].includes(r)) {
            const rate = resourceRates[r] || 0;
            let rateStr = rate > 0.05 ? `<span class="rate-pos">(+${rate.toFixed(1)}/s)</span>` : (rate < -0.05 ? `<span class="rate-neg">(${rate.toFixed(1)}/s)</span>` : '');
            html += `<div class="res-pill"><span>${formatName(r)}</span> ${Math.floor(v)} ${rateStr}</div>`;
        }
    }
    tick.innerHTML = html || '<div class="res-pill" style="opacity:0.5">No resources in storage</div>';

    ['ironOre', 'copperOre', 'coal', 'ironIngot', 'copperIngot', 'steelIngot', 'plastic', 'circuit'].forEach(r => {
        const btn = document.getElementById(`mkt-btn-${r}`);
        if(btn) {
            btn.style.opacity = resources[r] >= 10 ? '1' : '0.4';
            btn.style.cursor = resources[r] >= 10 ? 'pointer' : 'default';
        }
    });

    for(const [key, b] of Object.entries(gameState.buildings)) {
        const btn = document.getElementById(`btn-${key}`);
        if(!btn) continue;
        
        const cost = getCost(key);
        let costArr = [];
        for(const [r,v] of Object.entries(cost)) costArr.push(`${v} ${r==='credits'?'MC':formatName(r)}`);
        
        const costEl = document.getElementById(`cost-${key}`);
        if(costEl) costEl.innerText = costArr.join(', ');

        const canAfford = checkAfford(cost);
        btn.disabled = !canAfford;
        btn.style.opacity = canAfford ? 1 : 0.5;

        if(b.def.type !== 'milestone') {
            const countEl = document.getElementById(`count-${key}`);
            if(countEl) countEl.innerText = b.count;
            
            const fill = document.getElementById(`fill-${key}`);
            if(fill) {
                if(!b.active) { 
                    fill.style.width='100%'; fill.style.background='#64748b'; 
                } else {
                    fill.style.width = `${b.efficiency*100}%`;
                    fill.style.background = b.def.power > 0 
                        ? (b.efficiency === 0 ? 'var(--danger)' : 'var(--success)') 
                        : (b.efficiency > 0.9 ? 'var(--success)' : (b.efficiency > 0 ? '#fbbf24' : 'var(--danger)'));
                }
            }

            const statsEl = document.getElementById(`stats-${key}`);
            if(statsEl) {
                if (b.count > 0 && b.active) {
                    let statHtml = '';
                    if(Object.keys(b.def.inputs).length > 0) {
                        const inText = Object.entries(b.def.inputs).map(([r, q]) => `${(q * b.count * b.efficiency).toFixed(1)} ${formatName(r)}`).join(', ');
                        statHtml += `<div class="stat-row down">▼ ${inText}/s</div>`;
                    }
                    if(Object.keys(b.def.outputs).length > 0) {
                        const outText = Object.entries(b.def.outputs).map(([r, q]) => `${(q * b.count * b.efficiency).toFixed(1)} ${formatName(r)}`).join(', ');
                        statHtml += `<div class="stat-row up">▲ ${outText}/s</div>`;
                    }
                    statsEl.innerHTML = statHtml;
                    statsEl.style.display = 'block';
                } else if (b.count > 0 && !b.active) {
                    statsEl.innerHTML = '<span style="opacity:0.5; font-size:0.7em">-- OFFLINE --</span>';
                    statsEl.style.display = 'block';
                } else {
                    statsEl.style.display = 'none';
                }
            }
        }
    }
}