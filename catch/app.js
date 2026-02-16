import { POKEMON_DB } from './pokemon.js';
import { POKEBALLS, ITEMS } from './items.js';
import { FR } from './constants.js';
import { INIT, wr, cr } from './utils.js';
import { Home, Biomes, Encounter, Pokedex, Shop, Bag } from './screens.js';
import { CS } from './styles.js';

const { useState, useEffect, useRef } = React;

export function App() {
  const [s, setS] = useState(() => {
    const saved = localStorage.getItem("pokeCatcherSave");
    if (saved) {
      try {
        return { ...INIT, ...JSON.parse(saved), screen: "home", wild: null, anim: null, msg: null };
      } catch (e) {
        console.error("Save file corrupted, starting fresh.");
      }
    }
    return INIT;
  });

  const ref = useRef(null);
  const u = (c) => setS(p => ({ ...p, ...c }));

  useEffect(() => {
    const { money, inv, caught, seen, lure, smoke } = s;
    localStorage.setItem("pokeCatcherSave", JSON.stringify({ money, inv, caught, seen, lure, smoke }));
  }, [s.money, s.inv, s.caught, s.seen, s.lure, s.smoke]);

  const hardReset = () => {
    if (window.confirm("Are you sure you want to wipe your save? This cannot be undone!")) {
      localStorage.removeItem("pokeCatcherSave");
      setS(INIT);
    }
  };

  const tc = Object.keys(s.caught).length;
  const tp = POKEMON_DB.length;
  const hb = Object.entries(s.inv).some(([k, v]) => POKEBALLS.find(b => b.id === k) && v > 0);

  const encounter = () => {
    const pool = POKEMON_DB.filter(p => p.biome === s.biome);
    const pk = wr(pool, s.lure > 0);
    u({ wild: pk, msg: null, anim: null, item: null, lure: Math.max(0, s.lure - 1), smoke: Math.max(0, s.smoke - 1), seen: { ...s.seen, [pk.id]: true } });
  };

  const throwBall = () => {
    if (!s.wild) return;
    if (s.inv[s.ball] <= 0) { u({ msg: "No balls of that type!" }); return; }
    const ni = { ...s.inv, [s.ball]: s.inv[s.ball] - 1 };
    if (s.item && ["razz", "golden_razz"].includes(s.item)) ni[s.item] = Math.max(0, (ni[s.item] || 0) - 1);
    u({ inv: ni, anim: "shake" });
    const rate = cr(s.wild, s.ball, s.item);
    const caught = Math.random() < rate;
    ref.current = setTimeout(() => {
      if (caught) {
        const nc = { ...s.caught, [s.wild.id]: (s.caught[s.wild.id] || 0) + 1 };
        u({ anim: "caught", caught: nc, msg: `✨ Gotcha! ${s.wild.name} was caught!` });
        ref.current = setTimeout(() => u({ wild: null, anim: null, item: null }), 1800);
      } else {
        const fled = s.smoke > 0 ? false : Math.random() < FR[s.wild.rarity];
        if (fled) { u({ anim: "fled", msg: `💨 ${s.wild.name} fled!` }); ref.current = setTimeout(() => u({ wild: null, anim: null, item: null }), 1500); }
        else { u({ anim: "broke", msg: `Ball broke free! ${s.wild.name} is still there.`, item: null }); ref.current = setTimeout(() => u({ anim: null }), 800); }
      }
    }, 1500);
  };

  const useI = (id) => {
    if (id === "lure") { if (s.inv.lure <= 0) return; u({ inv: { ...s.inv, lure: s.inv.lure - 1 }, lure: s.lure + 3, msg: "🧲 Lure active! Rarer spawns for 3 encounters." }); }
    else if (id === "repel_flee") { if (s.inv.repel_flee <= 0) return; u({ inv: { ...s.inv, repel_flee: s.inv.repel_flee - 1 }, smoke: s.smoke + 3, msg: "💨 Smoke Ball! No fleeing for 3 encounters." }); }
    else u({ item: s.item === id ? null : id });
  };

  const buy = (id, price) => { if (s.money < price) return; u({ money: s.money - price, inv: { ...s.inv, [id]: (s.inv[id] || 0) + 1 } }); };
  const sell = (pid) => { const c = s.caught[pid] || 0; if (c <= 1) return; const p = POKEMON_DB.find(x => x.id === parseInt(pid)); u({ money: s.money + p.sellPrice, caught: { ...s.caught, [pid]: c - 1 } }); };

  return (
    <div style={CS.app}>
      <div style={CS.hdr}>
        <div style={CS.logo} onClick={() => u({ screen: "home", wild: null, anim: null, msg: null })}>⚪ PokéCatch</div>
        <div style={{ display: "flex", gap: 16, alignItems: "center", fontSize: 14, fontWeight: 800 }}>
          <span style={{ color: "#facc15", background: "rgba(250,204,21,0.1)", padding: "4px 10px", borderRadius: 8 }}>₽ {s.money.toLocaleString()}</span>
          <span style={{ color: "#4ade80", background: "rgba(74,222,128,0.1)", padding: "4px 10px", borderRadius: 8 }}>📖 {tc}/{tp}</span>
        </div>
        <div style={CS.nav}>
          {[["home", "🏠 Home"], ["biomes", "🌍 Explore"], ["pokedex", "📖 Dex"], ["shop", "🏪 Shop"], ["bag", "🎒 Bag"]].map(([sc, ic]) => (
            <button key={sc} className="nav-btn" style={CS.nb(s.screen === sc)} onClick={() => u({ screen: sc, wild: null, anim: null, msg: null })}>{ic}</button>
          ))}
        </div>
      </div>

      {s.screen === "home" && <Home s={s} u={u} hardReset={hardReset} />}
      {s.screen === "biomes" && <Biomes s={s} u={u} encounter={encounter} />}
      {s.screen === "encounter" && <Encounter s={s} u={u} encounter={encounter} throwBall={throwBall} useI={useI} />}
      {s.screen === "pokedex" && <Pokedex s={s} />}
      {s.screen === "shop" && <Shop s={s} u={u} buy={buy} sell={sell} />}
      {s.screen === "bag" && <Bag s={s} u={u} useI={useI} />}

      {tc === tp && <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.9)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }} className="fade-in">
        <div style={{ background: "linear-gradient(145deg,#1e293b,#0f172a)", borderRadius: 24, padding: 48, textAlign: "center", maxWidth: 420, border: "2px solid #facc15", boxShadow: "0 0 80px rgba(250,204,21,0.4)" }}>
          <div style={{ fontSize: 72, marginBottom: 16, animation: "bounce 2s infinite" }}>🏆</div>
          <h2 style={{ fontSize: 28, fontWeight: 900, color: "#facc15", marginBottom: 8 }}>POKÉDEX COMPLETE!</h2>
          <p style={{ fontSize: 15, color: "#cbd5e1", fontWeight: 600, lineHeight: 1.5 }}>Incredible! You have caught all {tp} Pokémon. You are a true Pokémon Master!</p>
          <button className="btn" style={{ ...CS.bt("#facc15"), color: "#0f172a", marginTop: 24, padding: "12px 32px", fontSize: 16 }} onClick={() => alert("Thanks for playing!")}>Claim Title</button>
        </div>
      </div>}
    </div>
  );
}
