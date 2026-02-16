import { POKEMON_DB, ALL_TYPES } from './pokemon.js';
import { BIOMES } from './biomes.js';
import { TC, FR } from './constants.js';
import { POKEBALLS, ITEMS, BALL_DESC } from './items.js';
import { PokeImg, PBI } from './components.js';
import { CS } from './styles.js';
import { cr, wr } from './utils.js';

export function Home({s, u, hardReset}) {
  const tc = Object.keys(s.caught).length;
  const tp = POKEMON_DB.length;
  const pct = Math.round(tc/tp*100);

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
          <span style={{fontWeight:800,color:"#facc15"}}>{tc} / {tp}</span>
        </div>
        <div style={CS.pb}><div style={CS.pf(pct)}/></div>
        <div style={{textAlign:"right",fontSize:12,marginTop:6,color:"#94a3b8", fontWeight:600}}>{pct}% Complete</div>
      </div>
      <div style={{...CS.cd, display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12, textAlign:"center"}}>
        <div><div style={{fontSize:24,fontWeight:900,color:"#fbbf24"}}>₽{s.money.toLocaleString()}</div><div style={{fontSize:11,color:"#64748b",fontWeight:700,textTransform:"uppercase",marginTop:2}}>Money</div></div>
        <div><div style={{fontSize:24,fontWeight:900,color:"#f87171"}}>{POKEBALLS.reduce((a,b)=>a+(s.inv[b.id]||0),0)}</div><div style={{fontSize:11,color:"#64748b",fontWeight:700,textTransform:"uppercase",marginTop:2}}>Balls</div></div>
        <div><div style={{fontSize:24,fontWeight:900,color:"#4ade80"}}>{Object.values(s.caught).reduce((a,b)=>a+b,0)}</div><div style={{fontSize:11,color:"#64748b",fontWeight:700,textTransform:"uppercase",marginTop:2}}>Caught</div></div>
      </div>
      {s.lure>0&&<div style={{...CS.cd,background:"rgba(250,204,21,0.1)", border:"1px solid rgba(250,204,21,0.2)"}}>🧲 Lure Active — {s.lure} encounters left</div>}
      {s.smoke>0&&<div style={{...CS.cd,background:"rgba(56,189,248,0.1)", border:"1px solid rgba(56,189,248,0.2)"}}>💨 Smoke Active — {s.smoke} encounters left</div>}
      <div style={{textAlign:"center",marginTop:24, display:"flex", justifyContent:"center", gap:12}}>
        <button className="btn" style={CS.bt("#ef4444")} onClick={()=>u({screen:"biomes"})}>🌍 Start Exploring</button>
        <button className="btn" style={CS.bt("#475569")} onClick={hardReset}>🗑️ Reset Save</button>
      </div>
    </div>
  );
}

export function Biomes({s, u, encounter}) {
  const hb = Object.entries(s.inv).some(([k,v])=>POKEBALLS.find(b=>b.id===k)&&v>0);

  return (
    <div style={CS.ct} className="fade-in">
      <h2 style={CS.tt}>🌍 Choose a Biome</h2>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",gap:12}}>
        {Object.entries(BIOMES).map(([k,b])=>{
          const bp=POKEMON_DB.filter(p=>p.biome===k);const ct=bp.filter(p=>s.caught[p.id]).length;
          return(<div key={k} className="card-hover" style={CS.bc(b.color,s.biome===k)} onClick={()=>u({biome:k})}>
            <div style={{fontSize:36,marginBottom:8,filter:"drop-shadow(0 2px 4px rgba(0,0,0,0.3))"}}>{b.emoji}</div>
            <div style={{fontWeight:800,fontSize:15,color:"#fff"}}>{b.name}</div>
            <div style={{fontSize:11,color:"rgba(255,255,255,0.7)",marginBottom:8,lineHeight:1.3}}>{b.desc}</div>
            <div style={{display:"inline-block",background:"rgba(0,0,0,0.3)",padding:"2px 8px",borderRadius:12,fontSize:11,fontWeight:700,color:"#facc15"}}>{ct} / {bp.length}</div>
          </div>);
        })}
      </div>
      {s.biome&&<div style={{textAlign:"center",marginTop:24}} className="fade-in">
        {!hb?<div style={{background:"rgba(239,68,68,0.1)",color:"#fca5a5",padding:"12px",borderRadius:12,fontWeight:600, border:"1px solid rgba(239,68,68,0.2)"}}>⚠️ You need Poké Balls to explore!</div>
        :<button className="btn" style={{...CS.bt("#22c55e"), padding:"14px 32px", fontSize: 16}} onClick={()=>{u({screen:"encounter"});encounter();}}>🔍 Search in {BIOMES[s.biome].name}!</button>}
      </div>}
    </div>
  );
}

export function Encounter({s, u, encounter, throwBall, useI}) {
  const pk = s.wild;
  if(!pk) return (
    <div style={CS.ct} className="fade-in"><div style={{...CS.cd,textAlign:"center", padding: 32}}>
      {s.msg&&<p style={{fontSize:16,fontWeight:700,marginBottom:20, color:"#94a3b8"}}>{s.msg}</p>}
      <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
        <button className="btn" style={CS.bt("#22c55e")} onClick={encounter}>🔍 Search Again</button>
        <button className="btn" style={CS.bt("#4f46e5")} onClick={()=>u({screen:"biomes",msg:null})}>🗺️ Change Biome</button>
      </div>
    </div></div>
  );
  
  const rate = cr(pk, s.ball, s.item);
  const cp = Math.round(rate*100);
  const sh = s.anim==="shake", ca = s.anim==="caught", fl = s.anim==="fled";
  const owned = s.caught[pk.id] || 0; 

  return (
    <div style={CS.ct} className="fade-in">
      <div style={{...CS.cd,textAlign:"center",position:"relative",overflow:"hidden",background:`linear-gradient(180deg,${BIOMES[s.biome]?.color}55, rgba(15,23,42,0.8))`}}>
        <div style={{fontSize:12,color:"rgba(255,255,255,0.6)",fontWeight:700,marginBottom:12,textTransform:"uppercase",letterSpacing:"1px"}}>{BIOMES[s.biome]?.emoji} {BIOMES[s.biome]?.name}</div>
        
        <div style={{height: 160, display:"flex", alignItems:"center", justifyContent:"center"}}>
          {!sh&&!ca&&<div style={{opacity:fl?0:1,transition:"all 0.4s",animation:fl?"none":"bounce 2s ease-in-out infinite"}}><PokeImg id={pk.id} size={140} rarity={pk.rarity}/></div>}
          {sh&&<div style={{animation:"shake 0.4s ease infinite"}}><PBI type={s.ball} size={64}/></div>}
          {ca&&<div style={{fontSize:56,animation:"pop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)"}}>✨🎉✨</div>}
        </div>

        <h2 style={{fontSize:24,fontWeight:900,margin:"12px 0 8px"}}>{pk.name} <span style={{fontSize:14,color:"#64748b"}}>#{String(pk.id).padStart(3, '0')}</span></h2>
        
        <div style={{display:"flex",gap:8,justifyContent:"center",marginBottom:16,flexWrap:"wrap"}}>
          <span style={{padding:"4px 12px",borderRadius:12,background:TC[pk.type],fontSize:12,fontWeight:800,color:"#fff",boxShadow:"0 2px 4px rgba(0,0,0,0.2)"}}>{pk.type}</span>
          <span style={{...CS.rb(pk.rarity), padding:"4px 12px", borderRadius:12, fontSize:12, boxShadow:"0 2px 4px rgba(0,0,0,0.2)"}}>{pk.rarity}</span>
          {owned > 0 ? (
            <span style={{padding:"4px 12px",borderRadius:12,background:"rgba(34, 197, 94, 0.15)",border:"1px solid rgba(34, 197, 94, 0.4)",fontSize:12,fontWeight:800,color:"#4ade80"}}>✅ OWNED: {owned}</span>
          ) : (
            <span style={{padding:"4px 12px",borderRadius:12,background:"rgba(24acc15, 0.15)",border:"1px solid rgba(250, 204, 21, 0.4)",fontSize:12,fontWeight:800,color:"#facc15", animation:"pulse 2s infinite"}}>✨ NEW!</span>
          )}
        </div>

        <div style={{background:"rgba(0,0,0,0.2)", padding:"12px", borderRadius:12}}>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:12,fontWeight:700,marginBottom:6, color:"#cbd5e1"}}>
            <span>Catch Rate</span><span style={{color:cp>70?"#4ade80":cp>30?"#facc15":"#f87171"}}>{cp}%</span>
          </div>
          <div style={CS.pb}><div style={CS.pf(cp,cp>70?"#22c55e":cp>30?"#facc15":"#ef4444")}/></div>
        </div>

        {s.msg&&<p style={{marginTop:16,fontSize:15,fontWeight:800,color:ca?"#4ade80":fl?"#f87171":"#facc15", animation:"pop 0.3s ease"}}>{s.msg}</p>}
      </div>

      {!sh&&!ca&&!fl&&<div className="fade-in">
        <div style={CS.cd}>
          <div style={{fontSize:13,fontWeight:800,marginBottom:10,color:"#94a3b8",textTransform:"uppercase"}}>Select Ball</div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            {POKEBALLS.map(b=>{const c=s.inv[b.id]||0;const sel=s.ball===b.id;return(
              <button key={b.id} className={c>0?"btn":""} onClick={()=>c>0&&u({ball:b.id})} style={{flex:1,minWidth:70,padding:"10px 4px",borderRadius:12,border:sel?"2px solid #3b82f6":"2px solid rgba(255,255,255,0.05)",background:sel?"rgba(59,130,246,0.15)":"rgba(255,255,255,0.03)",color:c>0?"#fff":"#475569",cursor:c>0?"pointer":"not-allowed",textAlign:"center"}}>
                <PBI type={b.id} size={28}/>
                <div style={{marginTop:6,fontSize:11,fontWeight:700}}>{b.name}</div>
                <div style={{fontSize:10,color:c>0?"#94a3b8":"#475569",fontWeight:600}}>x{c}</div>
              </button>
            );})}
          </div>
        </div>

        <div style={CS.cd}>
          <div style={{fontSize:13,fontWeight:800,marginBottom:10,color:"#94a3b8",textTransform:"uppercase"}}>Use Item</div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            {ITEMS.filter(i=>i.catchBonus>0).map(i=>{const c=s.inv[i.id]||0;const sel=s.item===i.id;return(
              <button key={i.id} className={c>0?"btn":""} onClick={()=>c>0&&useI(i.id)} style={{padding:"8px 16px",borderRadius:10,border:sel?"2px solid #facc15":"2px solid rgba(255,255,255,0.05)",background:sel?"rgba(250,204,21,0.15)":"rgba(255,255,255,0.03)",color:c>0?"#fff":"#475569",cursor:c>0?"pointer":"not-allowed",fontSize:13,fontWeight:700}}>
                {i.emoji} {i.name} <span style={{opacity:0.6,marginLeft:4}}>x{c}</span>
              </button>
            );})}
          </div>
        </div>

        <div style={{display:"flex",gap:12,justifyContent:"center",marginTop:8}}>
          <button className="btn" style={{...CS.bt("#ef4444"), padding:"14px 40px", fontSize:16, boxShadow:"0 4px 14px rgba(239,68,68,0.4)"}} onClick={throwBall} disabled={s.inv[s.ball]<=0}>🎯 Throw!</button>
          <button className="btn" style={{...CS.bt("#475569"), padding:"14px 24px"}} onClick={()=>u({wild:null,anim:null,msg:null,item:null})}>🏃 Run</button>
        </div>
      </div>}
    </div>
  );
}

export function Pokedex({s}) {
  const [f,sf]=React.useState("all");
  const [bf,sbf]=React.useState("all");
  const [q,sq]=React.useState("");
  const [tf,stf]=React.useState("all");
  
  const tc = Object.keys(s.caught).length;
  const tp = POKEMON_DB.length;
  
  const fl=POKEMON_DB.filter(p=>{
    if(f==="caught"&&!s.caught[p.id])return false;
    if(f==="missing"&&s.caught[p.id])return false;
    if(f==="seen"&&(!s.seen[p.id]||s.caught[p.id]))return false;
    if(bf!=="all"&&p.biome!==bf)return false;
    if(tf!=="all"&&p.type!==tf)return false;
    if(q&&!p.name.toLowerCase().includes(q.toLowerCase())&&!String(p.id).includes(q))return false;
    return true;
  });

  return (
    <div style={{...CS.ct, maxWidth: 800}} className="fade-in">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <h2 style={{...CS.tt, margin:0}}>📖 Pokédex</h2>
        <div style={{background:"rgba(250,204,21,0.1)", border:"1px solid rgba(250,204,21,0.3)", padding:"4px 12px", borderRadius:20, color:"#facc15", fontWeight:800, fontSize:14}}>{tc} / {tp}</div>
      </div>
      
      <input type="text" placeholder="Search by name or ID..." value={q} onChange={e=>sq(e.target.value)}
        style={{width:"100%",padding:"14px 16px",borderRadius:12,border:"1px solid rgba(255,255,255,0.1)",background:"rgba(0,0,0,0.2)",color:"#fff",fontSize:14,marginBottom:16,outline:"none",boxSizing:"border-box", fontWeight:600}}/>
      
      <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap"}}>
        {[["all","All"],["caught","✅ Caught"],["missing","❌ Missing"],["seen","👁️ Seen"]].map(([k,l])=>(
          <button key={k} className="nav-btn" onClick={()=>sf(k)} style={CS.nb(f===k)}>{l}</button>
        ))}
      </div>
      <div style={{display:"flex",gap:6,marginBottom:12,flexWrap:"wrap"}}>
        <button className="nav-btn" onClick={()=>sbf("all")} style={{...CS.nb(bf==="all"), fontSize:12}} >All Biomes</button>
        {Object.entries(BIOMES).map(([k,b])=>(
          <button key={k} className="nav-btn" onClick={()=>sbf(k)} style={{...CS.nb(bf===k),fontSize:12,padding:"6px 10px"}}>{b.emoji} {b.name}</button>
        ))}
      </div>
      <div style={{display:"flex",gap:6,marginBottom:20,flexWrap:"wrap"}}>
        <button className="nav-btn" onClick={()=>stf("all")} style={{...CS.nb(tf==="all"),fontSize:11,padding:"4px 10px"}}>All Types</button>
        {ALL_TYPES.map(t=>(
          <button key={t} className="nav-btn" onClick={()=>stf(tf===t?"all":t)} style={{fontSize:11,padding:"4px 10px",borderRadius:12,border:tf===t?"2px solid #fff":"2px solid transparent",background:TC[t]||"#888",color:"#fff",fontWeight:800,cursor:"pointer",opacity:tf===t?1:0.6, boxShadow: tf===t?"0 0 8px rgba(255,255,255,0.4)":""}}>{t}</button>
        ))}
      </div>
      
      <div style={{fontSize:13,color:"#64748b",fontWeight:700,marginBottom:12}}>{fl.length} Pokémon found</div>
      
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(110px,1fr))",gap:12}}>
        {fl.map(p=>{
          const own=s.caught[p.id]||0;const seen=s.seen[p.id];
          return(<div key={`${p.id}-${p.biome}`} className="card-hover" style={{...CS.cd,padding:"12px 8px",opacity:own?1:seen?0.7:0.3,textAlign:"center",position:"relative",marginBottom:0, background:own?`linear-gradient(180deg, ${TC[p.type]}22, rgba(255,255,255,0.02))`:"rgba(255,255,255,0.02)"}}>
            <div style={{fontSize:11,fontWeight:800,color:"#64748b"}}>#{String(p.id).padStart(3,'0')}</div>
            <div style={{height:60,display:"flex",alignItems:"center",justifyContent:"center", margin:"4px 0"}}>
              {seen?<PokeImg id={p.id} size={56} rarity={p.rarity}/>:<span style={{fontSize:32,filter:"grayscale(1) opacity(0.5)"}}>❓</span>}
            </div>
            <div style={{fontSize:12,fontWeight:800,lineHeight:1.2, color:seen?"#fff":"#64748b"}}>{seen?p.name:"???"}</div>
            {seen&&<div style={{display:"flex",gap:4,justifyContent:"center",marginTop:6,flexWrap:"wrap"}}>
              <span style={{padding:"2px 6px",borderRadius:6,background:TC[p.type],fontSize:9,fontWeight:800,color:"#fff"}}>{p.type}</span>
              <span style={{...CS.rb(p.rarity),fontSize:9,padding:"2px 6px",borderRadius:6}}>{p.rarity[0]}</span>
            </div>}
            {own>0&&<div style={{position:"absolute",top:6,right:6,background:"#22c55e",borderRadius:10,padding:"2px 6px",fontSize:10,fontWeight:900,color:"#fff",boxShadow:"0 2px 4px rgba(0,0,0,0.2)"}}>x{own}</div>}
            {seen&&<div style={{position:"absolute",top:6,left:6,fontSize:12,opacity:0.8}} title={BIOMES[p.biome].name}>{BIOMES[p.biome]?.emoji}</div>}
          </div>);
        })}
      </div>
    </div>
  );
}

export function Shop({s, u, buy, sell}) {
  const tc = Object.keys(s.caught).length;
  const tp = POKEMON_DB.length;

  return (
    <div style={CS.ct} className="fade-in">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <h2 style={{...CS.tt, margin:0}}>🏪 PokéMart</h2>
        <div style={{background:"rgba(250,204,21,0.1)", border:"1px solid rgba(250,204,21,0.3)", padding:"6px 16px", borderRadius:20, color:"#facc15", fontWeight:800, fontSize:16}}>₽ {s.money.toLocaleString()}</div>
      </div>
      <div style={{display:"flex",gap:8,marginBottom:20}}>
        <button className="nav-btn" style={CS.nb(!s.sell)} onClick={()=>u({sell:false})}>🛒 Buy Items</button>
        <button className="nav-btn" style={CS.nb(s.sell)} onClick={()=>u({sell:true})}>💰 Sell Pokémon</button>
      </div>
      {!s.sell?<>
        <h3 style={{fontSize:14,fontWeight:800,marginBottom:12,color:"#94a3b8",textTransform:"uppercase"}}>Poké Balls</h3>
        <div style={{display:"grid",gap:12,marginBottom:24}}>
          {POKEBALLS.map(b=>(<div key={b.id} className="card-hover" style={{...CS.cd,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 16px", marginBottom:0}}>
            <div style={{display:"flex",alignItems:"center",gap:14}}>
              <PBI type={b.id} size={36}/>
              <div><div style={{fontWeight:800,fontSize:15}}>{b.name}</div><div style={{fontSize:12,color:"#94a3b8",fontWeight:600}}>{BALL_DESC[b.id]} <span style={{color:"#cbd5e1"}}>· Own: {s.inv[b.id]||0}</span></div></div>
            </div>
            <button className="btn" style={CS.bt("#3b82f6",s.money<b.price)} onClick={()=>buy(b.id,b.price)} disabled={s.money<b.price}>₽ {b.price}</button>
          </div>))}
        </div>
        
        <h3 style={{fontSize:14,fontWeight:800,marginBottom:12,color:"#94a3b8",textTransform:"uppercase"}}>Special Items</h3>
        <div style={{display:"grid",gap:12}}>
          {ITEMS.map(i=>(<div key={i.id} className="card-hover" style={{...CS.cd,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 16px",marginBottom:0}}>
            <div style={{display:"flex",alignItems:"center",gap:14}}>
              <span style={{fontSize:32, filter:"drop-shadow(0 2px 4px rgba(0,0,0,0.2))"}}>{i.emoji}</span>
              <div><div style={{fontWeight:800,fontSize:15}}>{i.name}</div><div style={{fontSize:12,color:"#94a3b8",fontWeight:600}}>{i.desc} <span style={{color:"#cbd5e1"}}>· Own: {s.inv[i.id]||0}</span></div></div>
            </div>
            <button className="btn" style={CS.bt("#8b5cf6",s.money<i.price)} onClick={()=>buy(i.id,i.price)} disabled={s.money<i.price}>₽ {i.price}</button>
          </div>))}
        </div>
      </>:<>
        <div style={{background:"rgba(59,130,246,0.1)", border:"1px solid rgba(59,130,246,0.2)", padding:"12px 16px", borderRadius:12, marginBottom:20, display:"flex", alignItems:"center", gap:12}}>
          <span style={{fontSize:24}}>💡</span>
          <p style={{fontSize:13,color:"#bfdbfe",margin:0,fontWeight:600,lineHeight:1.4}}>Selling duplicates is a great way to earn money for better Poké Balls. The game automatically prevents you from selling your last copy of any Pokémon.</p>
        </div>
        
        {Object.entries(s.caught).filter(([,c])=>c>1).length===0
          ?<div style={{...CS.cd,textAlign:"center",color:"#64748b",fontWeight:700,padding:"40px 20px"}}>No duplicates available to sell.<br/><span style={{fontSize:12,fontWeight:500}}>Go catch some more!</span></div>
          :<div style={{display:"grid",gap:12}}>
            {Object.entries(s.caught).filter(([,c])=>c>1).map(([id,count])=>{
              const pk=POKEMON_DB.find(p=>p.id===parseInt(id));if(!pk)return null;
              return(<div key={id} className="card-hover" style={{...CS.cd,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 16px",marginBottom:0}}>
                <div style={{display:"flex",alignItems:"center",gap:12}}>
                  <PokeImg id={pk.id} size={48} rarity={pk.rarity}/>
                  <div><div style={{fontWeight:800,fontSize:15}}>{pk.name}</div><div style={{fontSize:12,color:"#94a3b8",fontWeight:600}}>Own: {count} <span style={{color:"#facc15"}}>· Value: ₽{pk.sellPrice}</span></div></div>
                </div>
                <button className="btn" style={{...CS.bt("#f59e0b"), padding:"8px 16px"}} onClick={()=>sell(id)}>Sell 1</button>
              </div>);
            })}
          </div>
        }
      </>}
    </div>
  );
}

export function Bag({s, u, useI}) {
  return (
    <div style={CS.ct} className="fade-in">
      <h2 style={CS.tt}>🎒 Your Bag</h2>
      <div style={CS.cd}>
        <h3 style={{fontSize:14,fontWeight:800,marginBottom:12,color:"#94a3b8",textTransform:"uppercase"}}>Poké Balls</h3>
        <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
          {POKEBALLS.map(b=>(<div key={b.id} style={{display:"flex",alignItems:"center",gap:8,fontSize:14, background:"rgba(0,0,0,0.2)", padding:"8px 16px", borderRadius:12}}>
            <PBI type={b.id} size={24}/><span style={{fontWeight:800}}>{b.name}</span><span style={{color:"#94a3b8",fontWeight:700}}>x{s.inv[b.id]||0}</span>
          </div>))}
        </div>
      </div>
      <div style={CS.cd}>
        <h3 style={{fontSize:14,fontWeight:800,marginBottom:12,color:"#94a3b8",textTransform:"uppercase"}}>Items</h3>
        <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
          {ITEMS.map(i=>(<div key={i.id} style={{display:"flex",alignItems:"center",gap:8,fontSize:14, background:"rgba(0,0,0,0.2)", padding:"8px 16px", borderRadius:12}}>
            <span style={{fontSize:20}}>{i.emoji}</span><span style={{fontWeight:800}}>{i.name}</span><span style={{color:"#94a3b8",fontWeight:700}}>x{s.inv[i.id]||0}</span>
          </div>))}
        </div>
      </div>
      
      <div style={CS.cd}>
        <h3 style={{fontSize:14,fontWeight:800,marginBottom:12,color:"#94a3b8",textTransform:"uppercase"}}>Field Abilities</h3>
        
        {s.lure>0&&<div style={{background:"rgba(250,204,21,0.1)", border:"1px solid rgba(250,204,21,0.2)", padding:"10px 16px", borderRadius:10, marginBottom:12, fontWeight:700, color:"#facc15", fontSize:13}}>🧲 Lure is currently active! ({s.lure} encounters remaining)</div>}
        {s.smoke>0&&<div style={{background:"rgba(56,189,248,0.1)", border:"1px solid rgba(56,189,248,0.2)", padding:"10px 16px", borderRadius:10, marginBottom:16, fontWeight:700, color:"#38bdf8", fontSize:13}}>💨 Smoke Ball is currently active! ({s.smoke} encounters remaining)</div>}
        
        <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
          <button className="btn" style={CS.bt("#a855f7",s.inv.lure<=0)} onClick={()=>useI("lure")} disabled={s.inv.lure<=0}>🧲 Use Lure ({s.inv.lure||0})</button>
          <button className="btn" style={CS.bt("#0ea5e9",s.inv.repel_flee<=0)} onClick={()=>useI("repel_flee")} disabled={s.inv.repel_flee<=0}>💨 Use Smoke ({s.inv.repel_flee||0})</button>
        </div>
      </div>
    </div>
  );
}
