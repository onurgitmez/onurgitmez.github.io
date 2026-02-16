import { POKEMON_DB, ALL_TYPES, EVOLUTIONS } from './pokemon.js';
import { BIOMES } from './biomes.js';
import { TC, FR } from './constants.js';
import { POKEBALLS, ITEMS, BALL_DESC } from './items.js';
import { PokeImg, PokeBallIcon } from './components.js';
import { CS } from './styles.js';
import { catchRate, weightedRandom } from './utils.js';

const getOwnedCount = (caughtRecord) => {
  if (!caughtRecord) return 0;
  return Object.values(caughtRecord.normal).reduce((a, b) => a + b, 0) + Object.values(caughtRecord.shiny).reduce((a, b) => a + b, 0);
};

export function Home({state, updateState, hardReset}) {
  const totalCaught = Object.keys(state.caught).filter(id => getOwnedCount(state.caught[id]) > 0).length;
  const totalPokemon = POKEMON_DB.length;
  const percentComplete = Math.round(totalCaught / totalPokemon * 100);
  const totalOwnedInstances = Object.values(state.caught).reduce((acc, c) => acc + getOwnedCount(c), 0);

  return (
    <div style={CS.ct} className="fade-in">
      <div style={{textAlign:"center", margin:"24px 0 32px"}}>
        <div style={{fontSize:64, marginBottom: 8, animation: "bounce 3s infinite"}}>🎯</div>
        <h1 style={{fontSize:32, fontWeight:900, marginBottom:4, letterSpacing:"-0.5px"}}>Pokémon Catcher</h1>
        <p style={{color:"#94a3b8", fontSize:14, fontWeight: 600}}>All 251 Gen I & II · 10 Biomes · Catch 'em all!</p>
      </div>
      <div style={CS.cd}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
          <span style={{fontWeight:700,fontSize:15}}>Pokédex Completion</span>
          <span style={{fontWeight:800,color:"#facc15"}}>{totalCaught} / {totalPokemon}</span>
        </div>
        <div style={CS.pb}><div style={CS.pf(percentComplete)}/></div>
        <div style={{textAlign:"right",fontSize:12,marginTop:6,color:"#94a3b8", fontWeight:600}}>{percentComplete}% Complete</div>
      </div>
      <div style={{...CS.cd, display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12, textAlign:"center"}}>
        <div><div style={{fontSize:24,fontWeight:900,color:"#fbbf24"}}>₽{state.money.toLocaleString()}</div><div style={{fontSize:11,color:"#64748b",fontWeight:700,textTransform:"uppercase",marginTop:2}}>Money</div></div>
        <div><div style={{fontSize:24,fontWeight:900,color:"#f87171"}}>{POKEBALLS.reduce((a,b)=>a+(state.inv[b.id]||0),0)}</div><div style={{fontSize:11,color:"#64748b",fontWeight:700,textTransform:"uppercase",marginTop:2}}>Balls</div></div>
        <div><div style={{fontSize:24,fontWeight:900,color:"#4ade80"}}>{totalOwnedInstances}</div><div style={{fontSize:11,color:"#64748b",fontWeight:700,textTransform:"uppercase",marginTop:2}}>Caught</div></div>
      </div>
      {state.lure>0&&<div style={{...CS.cd,background:"rgba(250,204,21,0.1)", border:"1px solid rgba(250,204,21,0.2)"}}>🧲 Lure Active — {state.lure} encounters left</div>}
      {state.smoke>0&&<div style={{...CS.cd,background:"rgba(56,189,248,0.1)", border:"1px solid rgba(56,189,248,0.2)"}}>💨 Smoke Active — {state.smoke} encounters left</div>}
      {state.shinyLureActive>0&&<div style={{...CS.cd,background:"rgba(168,85,247,0.1)", border:"1px solid rgba(168,85,247,0.2)"}}>✨ Shiny Charm Active — {state.shinyLureActive} encounters left</div>}
      <div style={{textAlign:"center",marginTop:24, display:"flex", justifyContent:"center", gap:12}}>
        <button className="btn" style={CS.bt("#ef4444")} onClick={()=>updateState({screen:"biomes"})}>🌍 Start Exploring</button>
        <button className="btn" style={CS.bt("#475569")} onClick={hardReset}>🗑️ Reset Save</button>
      </div>
    </div>
  );
}

export function Biomes({state, updateState, encounter}) {
  const hasBalls = Object.entries(state.inv).some(([key, val]) => POKEBALLS.find(b => b.id === key) && val > 0);

  return (
    <div style={CS.ct} className="fade-in">
      <h2 style={CS.tt}>🌍 Choose a Biome</h2>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",gap:12}}>
        {Object.entries(BIOMES).map(([key, biome])=>{
          const biomePokemon = POKEMON_DB.filter(p => p.biome === key);
          const caughtInBiome = biomePokemon.filter(p => getOwnedCount(state.caught[p.id]) > 0).length;
          return(<div key={key} className="card-hover" style={CS.bc(biome.color,state.biome===key)} onClick={()=>updateState({biome:key})}>
            <div style={{fontSize:36,marginBottom:8,filter:"drop-shadow(0 2px 4px rgba(0,0,0,0.3))"}}>{biome.emoji}</div>
            <div style={{fontWeight:800,fontSize:15,color:"#fff"}}>{biome.name}</div>
            <div style={{fontSize:11,color:"rgba(255,255,255,0.7)",marginBottom:8,lineHeight:1.3}}>{biome.desc}</div>
            <div style={{display:"inline-block",background:"rgba(0,0,0,0.3)",padding:"2px 8px",borderRadius:12,fontSize:11,fontWeight:700,color:"#facc15"}}>{caughtInBiome} / {biomePokemon.length}</div>
          </div>);
        })}
      </div>
      {state.biome&&<div style={{textAlign:"center",marginTop:24}} className="fade-in">
        {!hasBalls?<div style={{background:"rgba(239,68,68,0.1)",color:"#fca5a5",padding:"12px",borderRadius:12,fontWeight:600, border:"1px solid rgba(239,68,68,0.2)"}}>⚠️ You need Poké Balls to explore!</div>
        :<button className="btn" style={{...CS.bt("#22c55e"), padding:"14px 32px", fontSize: 16}} onClick={()=>{updateState({screen:"encounter"});encounter();}}>🔍 Search in {BIOMES[state.biome].name}!</button>}
      </div>}
    </div>
  );
}

export function Encounter({state, updateState, encounter, throwBall, useItem}) {
  const wildPokemon = state.wild;
  if(!wildPokemon) return (
    <div style={CS.ct} className="fade-in"><div style={{...CS.cd,textAlign:"center", padding: 32}}>
      {state.msg&&<p style={{fontSize:16,fontWeight:700,marginBottom:20, color:"#94a3b8"}}>{state.msg}</p>}
      <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
        <button className="btn" style={CS.bt("#22c55e")} onClick={encounter}>🔍 Search Again</button>
        <button className="btn" style={CS.bt("#4f46e5")} onClick={()=>updateState({screen:"biomes",msg:null})}>🗺️ Change Biome</button>
      </div>
    </div></div>
  );
  
  const rate = catchRate(wildPokemon, state.ball, state.item);
  const catchPercent = Math.round(rate*100);
  const isShaking = state.anim === "shake", isCaught = state.anim === "caught", isFled = state.anim === "fled";
  const ownedCount = getOwnedCount(state.caught[wildPokemon.id]); 

  return (
    <div style={CS.ct} className="fade-in">
      <div style={{...CS.cd,textAlign:"center",position:"relative",overflow:"hidden",background:`linear-gradient(180deg,${BIOMES[state.biome]?.color}55, rgba(15,23,42,0.8))`}}>
        <div style={{fontSize:12,color:"rgba(255,255,255,0.6)",fontWeight:700,marginBottom:12,textTransform:"uppercase",letterSpacing:"1px"}}>{BIOMES[state.biome]?.emoji} {BIOMES[state.biome]?.name}</div>
        
        <div style={{height: 160, display:"flex", alignItems:"center", justifyContent:"center"}}>
          {!isShaking&&!isCaught&&<div style={{opacity:isFled?0:1,transition:"all 0.4s",animation:isFled?"none":"bounce 2s ease-in-out infinite"}}><PokeImg id={wildPokemon.id} size={140} rarity={wildPokemon.rarity} shiny={state.wildShiny}/></div>}
          {isShaking&&<div style={{animation:"shake 0.4s ease infinite"}}><PokeBallIcon type={state.ball} size={64}/></div>}
          {isCaught&&<div style={{fontSize:56,animation:"pop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)"}}>✨🎉✨</div>}
        </div>

        <h2 style={{fontSize:24,fontWeight:900,margin:"12px 0 8px"}}>{state.wildShiny?'✨ ':''}{wildPokemon.name} <span style={{fontSize:14,color:"#64748b"}}>#{String(wildPokemon.id).padStart(3, '0')}</span></h2>
        
        <div style={{display:"flex",gap:8,justifyContent:"center",marginBottom:16,flexWrap:"wrap"}}>
          <span style={{padding:"4px 12px",borderRadius:12,background:TC[wildPokemon.type],fontSize:12,fontWeight:800,color:"#fff",boxShadow:"0 2px 4px rgba(0,0,0,0.2)"}}>{wildPokemon.type}</span>
          <span style={{...CS.rb(wildPokemon.rarity), padding:"4px 12px", borderRadius:12, fontSize:12, boxShadow:"0 2px 4px rgba(0,0,0,0.2)"}}>{wildPokemon.rarity}</span>
          <span style={{padding:"4px 12px",borderRadius:12,background:"rgba(168, 85, 247, 0.15)",border:"1px solid rgba(168, 85, 247, 0.4)",fontSize:12,fontWeight:800,color:"#c084fc"}}>Tier: {state.wildTier}</span>
          {ownedCount > 0 ? (
            <span style={{padding:"4px 12px",borderRadius:12,background:"rgba(34, 197, 94, 0.15)",border:"1px solid rgba(34, 197, 94, 0.4)",fontSize:12,fontWeight:800,color:"#4ade80"}}>✅ OWNED: {ownedCount}</span>
          ) : (
            <span style={{padding:"4px 12px",borderRadius:12,background:"rgba(250, 204, 21, 0.15)",border:"1px solid rgba(250, 204, 21, 0.4)",fontSize:12,fontWeight:800,color:"#facc15", animation:"pulse 2s infinite"}}>✨ NEW!</span>
          )}
        </div>

        <div style={{background:"rgba(0,0,0,0.2)", padding:"12px", borderRadius:12}}>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:12,fontWeight:700,marginBottom:6, color:"#cbd5e1"}}>
            <span>Catch Rate</span><span style={{color:catchPercent>70?"#4ade80":catchPercent>30?"#facc15":"#f87171"}}>{catchPercent}%</span>
          </div>
          <div style={CS.pb}><div style={CS.pf(catchPercent,catchPercent>70?"#22c55e":catchPercent>30?"#facc15":"#ef4444")}/></div>
        </div>

        {state.msg&&<p style={{marginTop:16,fontSize:15,fontWeight:800,color:isCaught?"#4ade80":isFled?"#f87171":"#facc15", animation:"pop 0.3s ease"}}>{state.msg}</p>}
      </div>

      {!isShaking&&!isCaught&&!isFled&&<div className="fade-in">
        <div style={CS.cd}>
          <div style={{fontSize:13,fontWeight:800,marginBottom:10,color:"#94a3b8",textTransform:"uppercase"}}>Select Ball</div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            {POKEBALLS.map(b=>{const c=state.inv[b.id]||0;const sel=state.ball===b.id;return(
              <button key={b.id} className={c>0?"btn":""} onClick={()=>c>0&&updateState({ball:b.id})} style={{flex:1,minWidth:70,padding:"10px 4px",borderRadius:12,border:sel?"2px solid #3b82f6":"2px solid rgba(255,255,255,0.05)",background:sel?"rgba(59,130,246,0.15)":"rgba(255,255,255,0.03)",color:c>0?"#fff":"#475569",cursor:c>0?"pointer":"not-allowed",textAlign:"center"}}>
                <PokeBallIcon type={b.id} size={28}/>
                <div style={{marginTop:6,fontSize:11,fontWeight:700}}>{b.name}</div>
                <div style={{fontSize:10,color:c>0?"#94a3b8":"#475569",fontWeight:600}}>x{c}</div>
              </button>
            );})}
          </div>
        </div>

        <div style={CS.cd}>
          <div style={{fontSize:13,fontWeight:800,marginBottom:10,color:"#94a3b8",textTransform:"uppercase"}}>Use Item</div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            {ITEMS.filter(i=>i.catchBonus>0).map(i=>{const c=state.inv[i.id]||0;const sel=state.item===i.id;return(
              <button key={i.id} className={c>0?"btn":""} onClick={()=>c>0&&useItem(i.id)} style={{padding:"8px 16px",borderRadius:10,border:sel?"2px solid #facc15":"2px solid rgba(255,255,255,0.05)",background:sel?"rgba(250,204,21,0.15)":"rgba(255,255,255,0.03)",color:c>0?"#fff":"#475569",cursor:c>0?"pointer":"not-allowed",fontSize:13,fontWeight:700}}>
                {i.emoji} {i.name} <span style={{opacity:0.6,marginLeft:4}}>x{c}</span>
              </button>
            );})}
          </div>
        </div>

        <div style={{display:"flex",gap:12,justifyContent:"center",marginTop:8}}>
          <button className="btn" style={{...CS.bt("#ef4444"), padding:"14px 40px", fontSize:16, boxShadow:"0 4px 14px rgba(239,68,68,0.4)"}} onClick={throwBall} disabled={state.inv[state.ball]<=0}>🎯 Throw!</button>
          <button className="btn" style={{...CS.bt("#475569"), padding:"14px 24px"}} onClick={()=>updateState({wild:null,anim:null,msg:null,item:null})}>🏃 Run</button>
        </div>
      </div>}
    </div>
  );
}

export function Pokedex({state, evolve}) {
  const [filter, setFilter] = React.useState("all");
  const [biomeFilter, setBiomeFilter] = React.useState("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState("all");
  
  const totalCaught = Object.keys(state.caught).filter(id => getOwnedCount(state.caught[id]) > 0).length;
  const totalPokemon = POKEMON_DB.length;
  
  const filteredList = POKEMON_DB.filter(p => {
    const owned = getOwnedCount(state.caught[p.id]);
    if(filter === "caught" && owned === 0) return false;
    if(filter === "missing" && owned > 0) return false;
    if(filter === "seen" && (!state.seen[p.id] || owned > 0)) return false;
    if(biomeFilter !== "all" && p.biome !== biomeFilter) return false;
    if(typeFilter !== "all" && p.type !== typeFilter) return false;
    if(searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase()) && !String(p.id).includes(searchQuery)) return false;
    return true;
  });

  return (
    <div style={{...CS.ct, maxWidth: 800}} className="fade-in">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <h2 style={{...CS.tt, margin:0}}>📖 Pokédex</h2>
        <div style={{background:"rgba(250,204,21,0.1)", border:"1px solid rgba(250,204,21,0.3)", padding:"4px 12px", borderRadius:20, color:"#facc15", fontWeight:800, fontSize:14}}>{totalCaught} / {totalPokemon}</div>
      </div>
      
      <input type="text" placeholder="Search by name or ID..." value={searchQuery} onChange={e=>setSearchQuery(e.target.value)}
        style={{width:"100%",padding:"14px 16px",borderRadius:12,border:"1px solid rgba(255,255,255,0.1)",background:"rgba(0,0,0,0.2)",color:"#fff",fontSize:14,marginBottom:16,outline:"none",boxSizing:"border-box", fontWeight:600}}/>
      
      <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap"}}>
        {[["all","All"],["caught","✅ Caught"],["missing","❌ Missing"],["seen","👁️ Seen"]].map(([k,l])=>(
          <button key={k} className="nav-btn" onClick={()=>setFilter(k)} style={CS.nb(filter===k)}>{l}</button>
        ))}
      </div>
      <div style={{display:"flex",gap:6,marginBottom:12,flexWrap:"wrap"}}>
        <button className="nav-btn" onClick={()=>setBiomeFilter("all")} style={{...CS.nb(biomeFilter==="all"), fontSize:12}} >All Biomes</button>
        {Object.entries(BIOMES).map(([k,b])=>(
          <button key={k} className="nav-btn" onClick={()=>setBiomeFilter(k)} style={{...CS.nb(biomeFilter===k),fontSize:12,padding:"6px 10px"}}>{b.emoji} {b.name}</button>
        ))}
      </div>
      <div style={{display:"flex",gap:6,marginBottom:20,flexWrap:"wrap"}}>
        <button className="nav-btn" onClick={()=>setTypeFilter("all")} style={{...CS.nb(typeFilter==="all"),fontSize:11,padding:"4px 10px"}}>All Types</button>
        {ALL_TYPES.map(t=>(
          <button key={t} className="nav-btn" onClick={()=>setTypeFilter(typeFilter===t?"all":t)} style={{fontSize:11,padding:"4px 10px",borderRadius:12,border:typeFilter===t?"2px solid #fff":"2px solid transparent",background:TC[t]||"#888",color:"#fff",fontWeight:800,cursor:"pointer",opacity:typeFilter===t?1:0.6, boxShadow: typeFilter===t?"0 0 8px rgba(255,255,255,0.4)":""}}>{t}</button>
        ))}
      </div>
      
      <div style={{fontSize:13,color:"#64748b",fontWeight:700,marginBottom:12}}>{filteredList.length} Pokémon found</div>
      
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(120px,1fr))",gap:12}}>
        {filteredList.map(p=>{
          const ownCount = getOwnedCount(state.caught[p.id]);
          const seen = state.seen[p.id];
          const hasShiny = state.caught[p.id] && Object.values(state.caught[p.id].shiny).reduce((a,b)=>a+b,0) > 0;
          const evoData = EVOLUTIONS[p.id];
          
          return(<div key={`${p.id}-${p.biome}`} className="card-hover" style={{...CS.cd,padding:"12px 8px",opacity:ownCount?1:seen?0.7:0.3,textAlign:"center",position:"relative",marginBottom:0, background:ownCount?`linear-gradient(180deg, ${TC[p.type]}22, rgba(255,255,255,0.02))`:"rgba(255,255,255,0.02)"}}>
            <div style={{fontSize:11,fontWeight:800,color:"#64748b"}}>#{String(p.id).padStart(3,'0')}</div>
            <div style={{height:60,display:"flex",alignItems:"center",justifyContent:"center", margin:"4px 0"}}>
              {seen?<PokeImg id={p.id} size={56} rarity={p.rarity} shiny={hasShiny}/>:<span style={{fontSize:32,filter:"grayscale(1) opacity(0.5)"}}>❓</span>}
            </div>
            <div style={{fontSize:12,fontWeight:800,lineHeight:1.2, color:seen?"#fff":"#64748b"}}>{seen?p.name:"???"}</div>
            {seen&&<div style={{display:"flex",gap:4,justifyContent:"center",marginTop:6,flexWrap:"wrap"}}>
              <span style={{padding:"2px 6px",borderRadius:6,background:TC[p.type],fontSize:9,fontWeight:800,color:"#fff"}}>{p.type}</span>
              <span style={{...CS.rb(p.rarity),fontSize:9,padding:"2px 6px",borderRadius:6}}>{p.rarity[0]}</span>
            </div>}
            {ownCount>0&&<div style={{position:"absolute",top:6,right:6,background:"#22c55e",borderRadius:10,padding:"2px 6px",fontSize:10,fontWeight:900,color:"#fff",boxShadow:"0 2px 4px rgba(0,0,0,0.2)"}}>x{ownCount}</div>}
            {seen&&<div style={{position:"absolute",top:6,left:6,fontSize:12,opacity:0.8}} title={BIOMES[p.biome].name}>{BIOMES[p.biome]?.emoji}</div>}
            
            {ownCount > 0 && evoData && (
               <button className="btn" onClick={(e) => { e.stopPropagation(); evolve(p.id, evoData); }} style={{marginTop: 8, ...CS.bt("#3b82f6"), fontSize: 10, padding: "4px 8px", width: "100%"}}>
                 Evolve (₽{evoData.cost})
               </button>
            )}
          </div>);
        })}
      </div>
    </div>
  );
}

export function Shop({state, updateState, buy, sell}) {
  const [shopCategory, setShopCategory] = React.useState("balls");

  const caughtList = Object.entries(state.caught).filter(([id, c]) => {
    return (Object.values(c.normal).reduce((a,b)=>a+b,0) + Object.values(c.shiny).reduce((a,b)=>a+b,0)) > 1;
  });

  return (
    <div style={CS.ct} className="fade-in">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <h2 style={{...CS.tt, margin:0}}>🏪 PokéMart</h2>
        <div style={{background:"rgba(250,204,21,0.1)", border:"1px solid rgba(250,204,21,0.3)", padding:"6px 16px", borderRadius:20, color:"#facc15", fontWeight:800, fontSize:16}}>₽ {state.money.toLocaleString()}</div>
      </div>
      <div style={{display:"flex",gap:8,marginBottom:20}}>
        <button className="nav-btn" style={CS.nb(!state.sell)} onClick={()=>updateState({sell:false})}>🛒 Buy</button>
        <button className="nav-btn" style={CS.nb(state.sell)} onClick={()=>updateState({sell:true})}>💰 Sell Pokémon</button>
      </div>

      {!state.sell ? <>
        <div style={{display:"flex",gap:8,marginBottom:16, background: "rgba(0,0,0,0.2)", padding: 6, borderRadius: 12}}>
          <button className="nav-btn" style={{...CS.nb(shopCategory==="balls"), flex: 1}} onClick={()=>setShopCategory("balls")}>Poké Balls</button>
          <button className="nav-btn" style={{...CS.nb(shopCategory==="items"), flex: 1}} onClick={()=>setShopCategory("items")}>Items</button>
        </div>

        {shopCategory === "balls" && <div style={{display:"grid",gap:12,marginBottom:24}} className="fade-in">
          {POKEBALLS.map(b=>(<div key={b.id} className="card-hover" style={{...CS.cd,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 16px", marginBottom:0}}>
            <div style={{display:"flex",alignItems:"center",gap:14}}>
              <PokeBallIcon type={b.id} size={36}/>
              <div><div style={{fontWeight:800,fontSize:15}}>{b.name}</div><div style={{fontSize:12,color:"#94a3b8",fontWeight:600}}>{BALL_DESC[b.id]} <span style={{color:"#cbd5e1"}}>· Own: {state.inv[b.id]||0}</span></div></div>
            </div>
            <div style={{display:"flex", flexDirection:"column", gap: 6}}>
              <button className="btn" style={{...CS.bt("#3b82f6"), padding:"6px 12px", fontSize: 12}} onClick={()=>buy(b.id,b.price, 1)} disabled={state.money<b.price}>Buy 1 (₽{b.price})</button>
              <button className="btn" style={{...CS.bt("#2563eb"), padding:"6px 12px", fontSize: 12}} onClick={()=>buy(b.id,b.price, 10)} disabled={state.money<b.price*10}>Buy 10 (₽{b.price*10})</button>
            </div>
          </div>))}
        </div>}
        
        {shopCategory === "items" && <div style={{display:"grid",gap:12}} className="fade-in">
          {ITEMS.map(i=>(<div key={i.id} className="card-hover" style={{...CS.cd,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 16px",marginBottom:0}}>
            <div style={{display:"flex",alignItems:"center",gap:14}}>
              <span style={{fontSize:32, filter:"drop-shadow(0 2px 4px rgba(0,0,0,0.2))"}}>{i.emoji}</span>
              <div><div style={{fontWeight:800,fontSize:15}}>{i.name}</div><div style={{fontSize:12,color:"#94a3b8",fontWeight:600}}>{i.desc} <span style={{color:"#cbd5e1"}}>· Own: {state.inv[i.id]||0}</span></div></div>
            </div>
            <div style={{display:"flex", flexDirection:"column", gap: 6}}>
              <button className="btn" style={{...CS.bt("#8b5cf6"), padding:"6px 12px", fontSize: 12}} onClick={()=>buy(i.id,i.price, 1)} disabled={state.money<i.price}>Buy 1 (₽{i.price})</button>
              <button className="btn" style={{...CS.bt("#7c3aed"), padding:"6px 12px", fontSize: 12}} onClick={()=>buy(i.id,i.price, 10)} disabled={state.money<i.price*10}>Buy 10 (₽{i.price*10})</button>
            </div>
          </div>))}
        </div>}
      </> : <>
        <div style={{background:"rgba(59,130,246,0.1)", border:"1px solid rgba(59,130,246,0.2)", padding:"12px 16px", borderRadius:12, marginBottom:20, display:"flex", alignItems:"center", gap:12}}>
          <span style={{fontSize:24}}>💡</span>
          <p style={{fontSize:13,color:"#bfdbfe",margin:0,fontWeight:600,lineHeight:1.4}}>Selling duplicates is a great way to earn money! Better tiers and shinies fetch a higher price. The game automatically prevents you from selling your last copy of a variant.</p>
        </div>
        
        {caughtList.length === 0
          ?<div style={{...CS.cd,textAlign:"center",color:"#64748b",fontWeight:700,padding:"40px 20px"}}>No duplicates available to sell.<br/><span style={{fontSize:12,fontWeight:500}}>Go catch some more!</span></div>
          :<div style={{display:"grid",gap:12}}>
            {caughtList.map(([id, counts]) => {
              const pokemon = POKEMON_DB.find(p => p.id === parseInt(id));
              if(!pokemon) return null;

              const totalNormal = Object.values(counts.normal).reduce((a,b)=>a+b,0);
              const totalShiny = Object.values(counts.shiny).reduce((a,b)=>a+b,0);

              const renderTierButtons = (variant, mult) => ['C','B','A','A+','S'].map(tier => {
                 const count = counts[variant][tier];
                 const totalOfVariant = variant === 'normal' ? totalNormal : totalShiny;
                 const sellableAmount = totalOfVariant - count >= 1 ? count : count - 1;
                 const tierMult = { 'C': 1, 'B': 1.5, 'A': 2, 'A+': 3, 'S': 5 }[tier];
                 const price = Math.floor(pokemon.sellPrice * tierMult * mult);

                 if (count === 0) return null;
                 
                 return (
                   <div key={tier} style={{display:'flex', alignItems:'center', justifyContent: 'space-between', background: 'rgba(0,0,0,0.2)', padding: '6px 12px', borderRadius: 8, marginBottom: 4}}>
                     <span style={{color: variant==='shiny'?'#facc15':'#cbd5e1', fontSize: 13, fontWeight: 700}}>
                       {variant==='shiny'?'✨ ':''}{tier} Tier (x{count})
                     </span>
                     {sellableAmount > 0 ? (
                        <button className="btn" style={{...CS.bt("#f59e0b"), padding:"4px 12px", fontSize: 11}} onClick={()=>sell(id, variant, tier, sellableAmount)}>Sell {sellableAmount} (₽{price * sellableAmount})</button>
                     ) : <span style={{fontSize: 10, color: '#64748b', fontWeight: 600}}>Protected</span>}
                   </div>
                 );
              });

              return (
                <div key={id} className="card-hover" style={{...CS.cd, padding:"16px", marginBottom:0}}>
                  <div style={{display:"flex",alignItems:"center",gap:12, marginBottom: 12}}>
                    <PokeImg id={pokemon.id} size={48} rarity={pokemon.rarity}/>
                    <div>
                       <div style={{fontWeight:800,fontSize:16}}>{pokemon.name}</div>
                       <div style={{fontSize:12,color:"#94a3b8",fontWeight:600}}>Base Value: <span style={{color:"#facc15"}}>₽{pokemon.sellPrice}</span></div>
                    </div>
                  </div>
                  <div>
                    {renderTierButtons('normal', 1)}
                    {renderTierButtons('shiny', 10)}
                  </div>
                </div>
              );
            })}
          </div>
        }
      </>}
    </div>
  );
}

export function Bag({state, updateState, useItem}) {
  return (
    <div style={CS.ct} className="fade-in">
      <h2 style={CS.tt}>🎒 Your Bag</h2>
      <div style={CS.cd}>
        <h3 style={{fontSize:14,fontWeight:800,marginBottom:12,color:"#94a3b8",textTransform:"uppercase"}}>Poké Balls</h3>
        <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
          {POKEBALLS.map(b=>(<div key={b.id} style={{display:"flex",alignItems:"center",gap:8,fontSize:14, background:"rgba(0,0,0,0.2)", padding:"8px 16px", borderRadius:12}}>
            <PokeBallIcon type={b.id} size={24}/><span style={{fontWeight:800}}>{b.name}</span><span style={{color:"#94a3b8",fontWeight:700}}>x{state.inv[b.id]||0}</span>
          </div>))}
        </div>
      </div>
      <div style={CS.cd}>
        <h3 style={{fontSize:14,fontWeight:800,marginBottom:12,color:"#94a3b8",textTransform:"uppercase"}}>Items</h3>
        <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
          {ITEMS.map(i=>(<div key={i.id} style={{display:"flex",alignItems:"center",gap:8,fontSize:14, background:"rgba(0,0,0,0.2)", padding:"8px 16px", borderRadius:12}}>
            <span style={{fontSize:20}}>{i.emoji}</span><span style={{fontWeight:800}}>{i.name}</span><span style={{color:"#94a3b8",fontWeight:700}}>x{state.inv[i.id]||0}</span>
          </div>))}
        </div>
      </div>
      
      <div style={CS.cd}>
        <h3 style={{fontSize:14,fontWeight:800,marginBottom:12,color:"#94a3b8",textTransform:"uppercase"}}>Field Abilities</h3>
        
        {state.lure>0&&<div style={{background:"rgba(250,204,21,0.1)", border:"1px solid rgba(250,204,21,0.2)", padding:"10px 16px", borderRadius:10, marginBottom:12, fontWeight:700, color:"#facc15", fontSize:13}}>🧲 Lure is active! ({state.lure} encounters left)</div>}
        {state.smoke>0&&<div style={{background:"rgba(56,189,248,0.1)", border:"1px solid rgba(56,189,248,0.2)", padding:"10px 16px", borderRadius:10, marginBottom:12, fontWeight:700, color:"#38bdf8", fontSize:13}}>💨 Smoke Ball is active! ({state.smoke} encounters left)</div>}
        {state.shinyLureActive>0&&<div style={{background:"rgba(168,85,247,0.1)", border:"1px solid rgba(168,85,247,0.2)", padding:"10px 16px", borderRadius:10, marginBottom:16, fontWeight:700, color:"#c084fc", fontSize:13}}>✨ Shiny Charm is active! ({state.shinyLureActive} encounters left)</div>}
        
        <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
          <button className="btn" style={CS.bt("#a855f7",state.inv.lure<=0)} onClick={()=>useItem("lure")} disabled={state.inv.lure<=0}>🧲 Use Lure ({state.inv.lure||0})</button>
          <button className="btn" style={CS.bt("#0ea5e9",state.inv.repel_flee<=0)} onClick={()=>useItem("repel_flee")} disabled={state.inv.repel_flee<=0}>💨 Use Smoke ({state.inv.repel_flee||0})</button>
          <button className="btn" style={CS.bt("#eab308",state.inv.shiny_lure<=0)} onClick={()=>useItem("shiny_lure")} disabled={state.inv.shiny_lure<=0}>✨ Use Shiny Charm ({state.inv.shiny_lure||0})</button>
        </div>
      </div>
    </div>
  );
}