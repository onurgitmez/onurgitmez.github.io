let floatingTextCount = 0;
const MAX_FLOATING_TEXTS = 10;
const getEl = (id) => document.getElementById(id);
const domCache = [];

function createUI() {
    const board = getEl('game-board');
    board.innerHTML = '';
    domCache.length = 0;
    
    businesses.forEach((b, i) => {
        const card = document.createElement('div');
        card.className = 'business-card';
        card.setAttribute('data-index', i);
        
        card.innerHTML = `
            <div class="tier-indicator tier-${b.tier}"></div>
            <div class="card-header">
                <div>
                    <div class="business-name">${emojis[i]} ${b.name}</div>
                </div>
                <div class="business-count" data-count="${i}">0</div>
            </div>
            <div class="card-stats">
                <div class="stat-row"><span class="stat-label">Per unit:</span><span class="stat-income" data-income="${i}">$0/s</span></div>
                <div class="stat-row"><span class="stat-label">Total:</span><span class="stat-total" data-total="${i}">$0/s</span></div>
                
                <div class="multiplier-badge" data-mult-badge="${i}" style="display:none">
                    ✨ <span data-mult-val="${i}">1.00x</span>
                    <div class="multiplier-tooltip" data-mult-tooltip="${i}"></div>
                </div>

                <div data-milestone="${i}"></div>
            </div>
            <div class="affordability-bar"><div class="affordability-progress" data-progress="${i}" style="width:0%"></div></div>
            <div class="buy-controls">
                <button type="button" class="buy-button" data-buy="${i}">Buy $0</button>
                <button type="button" class="buy-max-button" data-max="${i}">Max (0)</button>
            </div>
        `;
        board.appendChild(card);
        
        domCache[i] = {
            card: card,
            count: card.querySelector(`[data-count="${i}"]`),
            income: card.querySelector(`[data-income="${i}"]`),
            total: card.querySelector(`[data-total="${i}"]`),
            progress: card.querySelector(`[data-progress="${i}"]`),
            buyBtn: card.querySelector(`[data-buy="${i}"]`),
            maxBtn: card.querySelector(`[data-max="${i}"]`),
            multBadge: card.querySelector(`[data-mult-badge="${i}"]`),
            multVal: card.querySelector(`[data-mult-val="${i}"]`),
            multTooltip: card.querySelector(`[data-mult-tooltip="${i}"]`)
        };

        domCache[i].buyBtn.addEventListener('click', (e) => buyBiz(i, e));
        domCache[i].maxBtn.addEventListener('click', (e) => buyMax(i, e));
    });
}

function updateUIDisplay(getMultiplierFn, getMultiplierBreakdownFn) {
    const moneyEl = getEl('money');
    const incEl = getEl('income');
    const moneyText = fmt(game.money);
    const incText = fmt(game.totalIncome);
    
    if (moneyEl.textContent !== moneyText) moneyEl.textContent = moneyText;
    if (incEl.textContent !== incText) incEl.textContent = incText;
    
    const comboDisplay = getEl('combo-display');
    if (game.comboCount >= 5) {
        if (!comboDisplay.classList.contains('active')) comboDisplay.classList.add('active');
        getEl('combo-mult').textContent = game.comboMult.toFixed(1);
        getEl('combo-count').textContent = game.comboCount;
    } else {
        if (comboDisplay.classList.contains('active')) comboDisplay.classList.remove('active');
    }

    businesses.forEach((b, i) => {
        const els = domCache[i];
        if (!els) return;

        const c = cost(b.cost, b.count);
        const canBuy = game.money >= c;
        const bcost = settings.buyMode === 1 ? c : totalCost(b.cost, b.count, settings.buyMode, game.prestigeLevel, settings.buyMode);
        
        // FIX: Passed game.prestigeLevel to maxBuy to ensure UI reflects bulk discount availability
        const maxA = maxBuy(b.cost, b.count, game.money, game.prestigeLevel);
        
        const mult = getMultiplierFn(i); 
        const income = b.income * mult * (1 + (game.prestigeLevel * 0.10)) * game.eventMultiplier * game.comboMult;
        const totalIncome = income * b.count;
        const aff = Math.min(100, (game.money / c) * 100);
        
        if (els.card.classList.contains('affordable') !== canBuy) els.card.classList.toggle('affordable', canBuy);
        if (els.count.textContent != b.count) els.count.textContent = b.count;

        const incomeTxt = `$${fmt(income)}/s`;
        if (els.income.textContent !== incomeTxt) els.income.textContent = incomeTxt;

        const totalTxt = `$${fmt(totalIncome)}/s`;
        if (els.total.textContent !== totalTxt) els.total.textContent = totalTxt;
        
        if (mult > 1) {
            els.multBadge.style.display = 'inline-block';
            els.multVal.textContent = mult.toFixed(2) + 'x';
            const tooltipTxt = getMultiplierBreakdownFn(i);
            if (els.multTooltip.textContent !== tooltipTxt) els.multTooltip.textContent = tooltipTxt;
        } else {
            els.multBadge.style.display = 'none';
        }

        els.progress.style.width = aff + '%';
        
        const shouldDisable = game.money < bcost;
        if (els.buyBtn.disabled !== shouldDisable) els.buyBtn.disabled = shouldDisable;
        
        const btnText = `Buy ${settings.buyMode>1?'x'+settings.buyMode:''} $${fmt(bcost)}`;
        if (els.buyBtn.textContent !== btnText) els.buyBtn.textContent = btnText;
        
        const maxText = `Max (${maxA})`;
        if (els.maxBtn.textContent !== maxText) els.maxBtn.textContent = maxText;
        
        const maxDisable = maxA === 0;
        if (els.maxBtn.disabled !== maxDisable) els.maxBtn.disabled = maxDisable;
    });

    if (game.currentEvent) {
        const remaining = Math.max(0, game.eventEndTime - Date.now());
        getEl('event-timer').textContent = Math.ceil(remaining / 1000) + 's';
        if (!getEl('event-banner').classList.contains('active')) {
            getEl('event-banner').classList.add('active');
            getEl('event-icon').textContent = game.currentEvent.icon;
            getEl('event-title').textContent = game.currentEvent.name;
            getEl('event-desc').textContent = game.currentEvent.desc;
        }
    } else {
        if (getEl('event-banner').classList.contains('active')) {
            getEl('event-banner').classList.remove('active');
        }
    }
}

function showToast(msg) {
    const toast = getEl('toast');
    getEl('toast-text').textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

function showFloat(x, y, text) {
    if (floatingTextCount >= MAX_FLOATING_TEXTS) return;
    floatingTextCount++;
    const div = document.createElement('div');
    div.className = 'floating-text';
    div.textContent = text;
    div.style.left = x + 'px';
    div.style.top = y + 'px';
    document.body.appendChild(div);
    setTimeout(() => { div.remove(); floatingTextCount--; }, 2000);
}

function spawnMysteryDrop(callback) {
    const drop = document.createElement('div');
    drop.className = 'mystery-drop';
    drop.innerHTML = '🎁';
    const x = Math.random() * (window.innerWidth - 100) + 20;
    const y = Math.random() * (window.innerHeight - 100) + 20;
    drop.style.left = x + 'px';
    drop.style.top = y + 'px';
    drop.onclick = () => {
        callback(); 
        drop.remove();
        showFloat(x, y, "BONUS!");
    };
    document.body.appendChild(drop);
    setTimeout(() => { if (document.body.contains(drop)) drop.remove(); }, 10000);
}

function renderUpgrades() {
    const list = getEl('upgrades-list');
    list.innerHTML = '';
    let affordable = 0;
    upgrades.forEach(u => {
        const c = u.cost * Math.pow(3, u.level);
        const canBuy = game.money >= c && u.level < u.max;
        if (canBuy) affordable++;
        const item = document.createElement('div');
        item.className = 'upgrade-item';
        item.innerHTML = `
            <div class="upgrade-header">
                <div class="upgrade-name">${u.name}</div>
                <div class="upgrade-level">Lv ${u.level}/${u.max}</div>
            </div>
            <div class="upgrade-description">${u.desc}</div>
            <button type="button" class="upgrade-button" onclick="buyUpgrade('${u.id}')" ${!canBuy || u.level >= u.max ? 'disabled' : ''}>
                ${u.level >= u.max ? 'MAX' : `Upgrade $${fmt(c)}`}
            </button>
        `;
        list.appendChild(item);
    });
    getEl('bulk-btn').textContent = `🚀 Buy All Affordable (${affordable})`;
    getEl('bulk-btn').disabled = affordable === 0;
}

function renderResearch() {
    const list = getEl('research-list');
    list.innerHTML = '';
    const kpDisplay = getEl('kp-display');
    if(kpDisplay) kpDisplay.textContent = game.knowledgePoints;
    
    researchData.forEach(r => {
        const level = game.researchLevels[r.id] || 0;
        const currentCost = Math.floor(r.baseCost * Math.pow(r.costScale, level));
        const canAfford = game.knowledgePoints >= currentCost;
        const isMax = level >= r.max;

        let currentEffect = '';
        if (r.type === 'cost_reduction') {
            const discount = level * r.val * 100;
            currentEffect = `Current: ${discount}% cost reduction`;
        } else if (r.type === 'income_boost') {
            const boost = level * r.val * 100;
            currentEffect = `Current: +${boost}% income`;
        } else if (r.type === 'event_freq') {
            const freq = level * r.val * 100;
            currentEffect = `Current: +${freq}% spawn rate`;
        } else if (r.type === 'kp_boost') {
            const kpBoost = level * r.val * 100;
            currentEffect = `Current: +${kpBoost}% KP`;
        }

        const item = document.createElement('div');
        item.className = `upgrade-item ${level > 0 ? 'unlocked' : ''}`;
        if (level > 0) {
            item.style.borderColor = 'var(--accent-secondary)';
            item.style.background = 'linear-gradient(135deg, rgba(123, 44, 191, 0.1), rgba(0,0,0,0))';
        }
        item.innerHTML = `
            <div class="upgrade-header">
                <div class="upgrade-name">${r.name}</div>
                <div class="upgrade-level">${isMax ? 'MAX' : 'Lvl ' + level + '/' + r.max}</div>
            </div>
            <div class="upgrade-description">${r.desc}${level > 0 ? ' (' + currentEffect + ')' : ''}</div>
            ${!isMax ? `
                <button type="button" class="upgrade-button" 
                    style="background: linear-gradient(135deg, var(--accent-secondary), var(--accent-tertiary))"
                    onclick="buyResearch('${r.id}')" 
                    ${!canAfford ? 'disabled' : ''}>
                    Upgrade (Cost: ${currentCost} KP)
                </button>
            ` : '<div style="color:var(--success);font-weight:bold;text-align:center">MAXED OUT</div>'}
        `;
        list.appendChild(item);
    });
}

function renderAchievements() {
    const list = getEl('achievements-list');
    list.innerHTML = '';
    achievementList.forEach(a => {
        const unlocked = game.unlockedAchievements.includes(a.id);
        const item = document.createElement('div');
        item.className = `achievement-item ${unlocked ? 'unlocked' : ''}`;
        item.innerHTML = `
            <div class="achievement-icon">${a.icon}</div>
            <div class="achievement-info">
                <div class="achievement-name">${a.name}</div>
                <div class="achievement-desc">${a.desc}</div>
            </div>
            ${a.reward > 0 ? `<div class="achievement-reward">$${fmt(a.reward)}</div>` : ''}
        `;
        list.appendChild(item);
    });
}

function renderStats() {
    const seconds = (Date.now() - game.startTime) / 1000;
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    getEl('stat-time').textContent = `${h}h ${m}m`;

    getEl('stat-earned').textContent = '$' + fmt(game.totalEarned);
    getEl('stat-spent').textContent = '$' + fmt(game.totalSpent);
    getEl('stat-clicks').textContent = game.totalClicks.toLocaleString();
    getEl('stat-events').textContent = game.eventsWitnessed;
    
    const owned = businesses.reduce((acc, b) => acc + b.count, 0);
    getEl('stat-businesses').textContent = owned.toLocaleString();

    const unlockedAch = game.unlockedAchievements.length;
    const totalAch = achievementList.length;
    getEl('stat-achievements').textContent = `${unlockedAch}/${totalAch}`;

    let bestBiz = null;
    let maxIncome = -1;
    
    businesses.forEach((b, i) => {
        const mult = getMultiplier(i);
        const income = b.income * b.count * mult;
        if (income > maxIncome) {
            maxIncome = income;
            bestBiz = b;
        }
    });

    getEl('stat-profitable').textContent = bestBiz && maxIncome > 0 
        ? `${bestBiz.name} ($${fmt(maxIncome)}/s)` 
        : "None";
}

function updatePrestigeModal() {
    const baseReq = 10000000;
    const difficultyMult = Math.pow(2.5, game.prestigeLevel); 
    const minRequired = baseReq * difficultyMult;

    const pRewardEl = getEl('prestige-reward');
    const pBtn = getEl('prestige-btn');

    pRewardEl.textContent = (game.prestigeLevel + 1) * 10;

    if (game.lifetimeEarned < minRequired) {
        pBtn.disabled = true;
        pBtn.textContent = `Need $${fmt(minRequired)} Lifetime Earnings`;
        pBtn.style.opacity = "0.5";
        pBtn.style.cursor = "not-allowed";
    } else {
        let kpBase = Math.floor(Math.sqrt(game.lifetimeEarned / baseReq));
        if (kpBase < 1) kpBase = 1;
        
        pBtn.disabled = false;
        pBtn.textContent = `🌟 ASCEND (+${kpBase} KP) 🌟`;
        pBtn.style.opacity = "1";
        pBtn.style.cursor = "pointer";
    }
}