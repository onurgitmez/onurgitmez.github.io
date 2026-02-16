import { RC } from './constants.js';

// Common styles object
export const CS = {
  app: { minHeight: "100vh", color: "#f8fafc", display: "flex", flexDirection: "column", alignItems: "center", paddingBottom: 60, background: "radial-gradient(circle at 50% -20%, #1e293b, #0f172a)" },
  hdr: { width: "100%", background: "rgba(15, 23, 42, 0.8)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100, flexWrap: "wrap", gap: 8 },
  logo: { fontSize: 22, fontWeight: 900, cursor: "pointer", background: "linear-gradient(90deg, #f87171, #facc15)", WebkitBackgroundClip: "text", color: "transparent" },
  nav: { display: "flex", gap: 6, flexWrap: "wrap" },
  nb: (a) => ({ padding: "8px 14px", borderRadius: 20, border: "1px solid rgba(255,255,255,0.1)", background: a ? "rgba(255,255,255,0.15)" : "transparent", color: a ? "#fff" : "#cbd5e1", fontWeight: 700, fontSize: 13, cursor: "pointer" }),
  ct: { width: "100%", maxWidth: 640, padding: "20px 16px" },
  cd: { background: "rgba(255,255,255,0.03)", backdropFilter: "blur(12px)", borderRadius: 16, border: "1px solid rgba(255,255,255,0.08)", padding: 20, marginBottom: 16, boxShadow: "0 4px 20px rgba(0,0,0,0.1)" },
  tt: { fontSize: 20, fontWeight: 800, marginBottom: 16, color: "#f8fafc" },
  bt: (bg="#dc2626") => ({ padding: "10px 24px", borderRadius: 12, border: "none", background: bg, color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer" }),
  pb: { height: 8, borderRadius: 4, background: "rgba(255,255,255,0.1)", overflow: "hidden" },
  pf: (p,c="#22c55e") => ({ height: "100%", width: `${p}%`, background: `linear-gradient(90deg, ${c}, ${c}dd)`, borderRadius: 4, transition: "width 0.5s cubic-bezier(0.4, 0, 0.2, 1)" }),
  rb: (r) => ({ display: "inline-block", padding: "2px 10px", borderRadius: 20, background: RC[r], color: r==="legendary"||r==="uncommon"?"#fff":"#0f172a", fontSize: 11, fontWeight: 800, textTransform: "uppercase" }),
  bc: (c,sel) => ({ background: `linear-gradient(145deg, ${c}dd, ${c}88)`, borderRadius: 16, padding: 16, cursor: "pointer", border: sel ? "2px solid #facc15" : "2px solid transparent", textAlign: "center", position: "relative", overflow: "hidden" }),
};
