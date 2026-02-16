import { POKEMON_DB } from './pokemon.js';
import { POKEBALLS, ITEMS } from './items.js';
import { FR } from './constants.js';
import { INIT, weightedRandom, catchRate, rollTier } from './utils.js';
import { Home, Biomes, Encounter, Pokedex, Shop, Bag } from './screens.js';
import { CS } from './styles.js';

const { useState, useEffect, useRef } = React;

export function App() {
  const [state, updateStateFn] = useState(() => {
    const saved = localStorage.getItem("pokeCatcherSave");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Migrate old save format to new Tier/Shiny system
        if (parsed.caught) {
          for (const id in parsed.caught) {
            if (typeof parsed.caught[id] === 'number') {
              const count = parsed.caught[id];
              parsed.caught[id] = { normal: { C: count, B: 0, A: 0, 'A+': 0, S: 0 }, shiny: { C: 0, B: 0, A: 0, 'A+': 0, S: 0 } };
            }
          }
        }
        return { ...INIT, ...parsed, screen: "home", wild: null, anim: null, msg: null };
      } catch (e) {
        console.error("Save file corrupted, starting fresh.");
      }
    }
    return INIT;
  });

  const ref = useRef(null);
  const updateState = (changes) => updateStateFn(prev => ({ ...prev, ...changes }));

  useEffect(() => {
    const { money, inv, caught, seen, lure, smoke, shinyLureActive } = state;
    localStorage.setItem("pokeCatcherSave", JSON.stringify({ money, inv, caught, seen, lure, smoke, shinyLureActive }));
  }, [state.money, state.inv, state.caught, state.seen, state.lure, state.smoke, state.shinyLureActive]);

  const hardReset = () => {
    if (window.confirm("Are you sure you want to wipe your save? This cannot be undone!")) {
      localStorage.removeItem("pokeCatcherSave");
      updateStateFn(INIT);
    }
  };

  const getOwnedCount = (caughtRecord) => {
    if (!caughtRecord) return 0;
    return Object.values(caughtRecord.normal).reduce((a, b) => a + b, 0) + Object.values(caughtRecord.shiny).reduce((a, b) => a + b, 0);
  };

  const totalCaught = Object.keys(state.caught).filter(id => getOwnedCount(state.caught[id]) > 0).length;
  const totalPokemon = POKEMON_DB.length;

  const encounter = () => {
    const pool = POKEMON_DB.filter(p => p.biome === state.biome);
    const wildPokemon = weightedRandom(pool, state.lure > 0);
    const isShiny = Math.random() < (state.shinyLureActive > 0 ? 0.05 : 0.005);
    const wildTier = rollTier();
    
    updateState({ 
      wild: wildPokemon, 
      wildShiny: isShiny,
      wildTier: wildTier,
      msg: null, anim: null, item: null, 
      lure: Math.max(0, state.lure - 1), 
      smoke: Math.max(0, state.smoke - 1), 
      shinyLureActive: Math.max(0, state.shinyLureActive - 1),
      seen: { ...state.seen, [wildPokemon.id]: true } 
    });
  };

  const throwBall = () => {
    if (!state.wild) return;
    if (state.inv[state.ball] <= 0) { updateState({ msg: "No balls of that type!" }); return; }
    
    const newInv = { ...state.inv, [state.ball]: state.inv[state.ball] - 1 };
    if (state.item && ["razz", "golden_razz"].includes(state.item)) newInv[state.item] = Math.max(0, (newInv[state.item] || 0) - 1);
    updateState({ inv: newInv, anim: "shake" });
    
    const rate = catchRate(state.wild, state.ball, state.item);
    const isCaught = Math.random() < rate;
    
    ref.current = setTimeout(() => {
      if (isCaught) {
        const currentCaught = state.caught[state.wild.id] || { normal: { C: 0, B: 0, A: 0, 'A+': 0, S: 0 }, shiny: { C: 0, B: 0, A: 0, 'A+': 0, S: 0 } };
        const variant = state.wildShiny ? 'shiny' : 'normal';
        const newCaughtRecord = {
          ...currentCaught,
          [variant]: {
            ...currentCaught[variant],
            [state.wildTier]: currentCaught[variant][state.wildTier] + 1
          }
        };
        const newCaught = { ...state.caught, [state.wild.id]: newCaughtRecord };
        
        updateState({ anim: "caught", caught: newCaught, msg: `✨ Gotcha! ${state.wildShiny ? 'Shiny ' : ''}${state.wild.name} (${state.wildTier} Tier) was caught!` });
        ref.current = setTimeout(() => updateState({ wild: null, anim: null, item: null }), 1800);
      } else {
        const isFled = state.smoke > 0 ? false : Math.random() < FR[state.wild.rarity];
        if (isFled) { 
          updateState({ anim: "fled", msg: `💨 ${state.wild.name} fled!` }); 
          ref.current = setTimeout(() => updateState({ wild: null, anim: null, item: null }), 1500); 
        } else { 
          updateState({ anim: "broke", msg: `Ball broke free! ${state.wild.name} is still there.`, item: null }); 
          ref.current = setTimeout(() => updateState({ anim: null }), 800); 
        }
      }
    }, 1500);
  };

  const useItem = (id) => {
    if (id === "lure") { if (state.inv.lure <= 0) return; updateState({ inv: { ...state.inv, lure: state.inv.lure - 1 }, lure: state.lure + 3, msg: "🧲 Lure active! Rarer spawns for 3 encounters." }); }
    else if (id === "repel_flee") { if (state.inv.repel_flee <= 0) return; updateState({ inv: { ...state.inv, repel_flee: state.inv.repel_flee - 1 }, smoke: state.smoke + 3, msg: "💨 Smoke Ball! No fleeing for 3 encounters." }); }
    else if (id === "shiny_lure") { if (state.inv.shiny_lure <= 0) return; updateState({ inv: { ...state.inv, shiny_lure: state.inv.shiny_lure - 1 }, shinyLureActive: state.shinyLureActive + 3, msg: "✨ Shiny Charm active! Boosted shiny odds for 3 encounters." }); }
    else updateState({ item: state.item === id ? null : id });
  };

  const buy = (id, price, amount = 1) => { 
    const totalCost = price * amount;
    if (state.money < totalCost) return; 
    updateState({ money: state.money - totalCost, inv: { ...state.inv, [id]: (state.inv[id] || 0) + amount } }); 
  };

  const sell = (pid, variant, tier, amount) => { 
    const currentCaught = state.caught[pid];
    if (!currentCaught || currentCaught[variant][tier] < amount) return; 
    
    const pokemon = POKEMON_DB.find(x => x.id === parseInt(pid)); 
    const tierMult = { 'C': 1, 'B': 1.5, 'A': 2, 'A+': 3, 'S': 5 }[tier];
    const shinyMult = variant === 'shiny' ? 10 : 1;
    const price = Math.floor(pokemon.sellPrice * tierMult * shinyMult) * amount;

    const newCaughtRecord = {
      ...currentCaught,
      [variant]: {
        ...currentCaught[variant],
        [tier]: currentCaught[variant][tier] - amount
      }
    };
    updateState({ money: state.money + price, caught: { ...state.caught, [pid]: newCaughtRecord } }); 
  };

  const evolve = (pid, evoData) => {
    if (state.money < evoData.cost) { alert("Not enough money to evolve!"); return; }
    
    const currentCaught = state.caught[pid];
    if (!currentCaught) return;
    
    let consumedTier = null;
    for (const t of ['C', 'B', 'A', 'A+', 'S']) {
       if (currentCaught.normal[t] > 0) {
           consumedTier = t;
           break;
       }
    }
    
    if (!consumedTier) {
        alert("You need a normal variant (not shiny) to evolve!"); 
        return;
    }

    const newCaughtBase = {
       ...currentCaught,
       normal: { ...currentCaught.normal, [consumedTier]: currentCaught.normal[consumedTier] - 1 }
    };

    const targetId = evoData.to;
    const targetCaught = state.caught[targetId] || { normal: { C: 0, B: 0, A: 0, 'A+': 0, S: 0 }, shiny: { C: 0, B: 0, A: 0, 'A+': 0, S: 0 } };
    const newCaughtTarget = {
       ...targetCaught,
       normal: { ...targetCaught.normal, [consumedTier]: targetCaught.normal[consumedTier] + 1 }
    };

    updateState({
       money: state.money - evoData.cost,
       caught: { ...state.caught, [pid]: newCaughtBase, [targetId]: newCaughtTarget },
       seen: { ...state.seen, [targetId]: true }
    });
  };

  return (
    <div style={CS.app}>
      <div style={CS.hdr}>
        <div style={CS.logo} onClick={() => updateState({ screen: "home", wild: null, anim: null, msg: null })}>⚪ PokéCatch</div>
        <div style={{ display: "flex", gap: 16, alignItems: "center", fontSize: 14, fontWeight: 800 }}>
          <span style={{ color: "#facc15", background: "rgba(250,204,21,0.1)", padding: "4px 10px", borderRadius: 8 }}>₽ {state.money.toLocaleString()}</span>
          <span style={{ color: "#4ade80", background: "rgba(74,222,128,0.1)", padding: "4px 10px", borderRadius: 8 }}>📖 {totalCaught}/{totalPokemon}</span>
        </div>
        <div style={CS.nav}>
          {[["home", "🏠 Home"], ["biomes", "🌍 Explore"], ["pokedex", "📖 Dex"], ["shop", "🏪 Shop"], ["bag", "🎒 Bag"]].map(([screenCode, iconLabel]) => (
            <button key={screenCode} className="nav-btn" style={CS.nb(state.screen === screenCode)} onClick={() => updateState({ screen: screenCode, wild: null, anim: null, msg: null })}>{iconLabel}</button>
          ))}
        </div>
      </div>

      {state.screen === "home" && <Home state={state} updateState={updateState} hardReset={hardReset} />}
      {state.screen === "biomes" && <Biomes state={state} updateState={updateState} encounter={encounter} />}
      {state.screen === "encounter" && <Encounter state={state} updateState={updateState} encounter={encounter} throwBall={throwBall} useItem={useItem} />}
      {state.screen === "pokedex" && <Pokedex state={state} evolve={evolve} />}
      {state.screen === "shop" && <Shop state={state} updateState={updateState} buy={buy} sell={sell} />}
      {state.screen === "bag" && <Bag state={state} updateState={updateState} useItem={useItem} />}

      {totalCaught === totalPokemon && <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.9)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }} className="fade-in">
        <div style={{ background: "linear-gradient(145deg,#1e293b,#0f172a)", borderRadius: 24, padding: 48, textAlign: "center", maxWidth: 420, border: "2px solid #facc15", boxShadow: "0 0 80px rgba(250,204,21,0.4)" }}>
          <div style={{ fontSize: 72, marginBottom: 16, animation: "bounce 2s infinite" }}>🏆</div>
          <h2 style={{ fontSize: 28, fontWeight: 900, color: "#facc15", marginBottom: 8 }}>POKÉDEX COMPLETE!</h2>
          <p style={{ fontSize: 15, color: "#cbd5e1", fontWeight: 600, lineHeight: 1.5 }}>Incredible! You have caught all {totalPokemon} Pokémon. You are a true Pokémon Master!</p>
          <button className="btn" style={{ ...CS.bt("#facc15"), color: "#0f172a", marginTop: 24, padding: "12px 32px", fontSize: 16 }} onClick={() => alert("Thanks for playing!")}>Claim Title</button>
        </div>
      </div>}
    </div>
  );
}