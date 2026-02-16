import { spriteUrl } from './utils.js';
import { BALL_COLORS } from './items.js';

// Pokémon sprite image component
export function PokeImg({id, size=64, style={}, anim=false, rarity}) {
  const cls = `pixel-img ${rarity === 'legendary' ? 'pixel-img-legendary' : ''}`;
  return <img src={spriteUrl(id)} alt="" className={cls} style={{ width: size, height: size, ...style }} loading="lazy" />;
}

// Pokéball icon component
export function PBI({type, size=28}) {
  const [top, bot] = BALL_COLORS[type] || BALL_COLORS.pokeball;
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))" }}>
      <circle cx="20" cy="20" r="18" fill={bot} stroke="#1e293b" strokeWidth="2"/>
      <path d="M2,20 A18,18 0 0,1 38,20" fill={top} stroke="#1e293b" strokeWidth="2"/>
      <line x1="2" y1="20" x2="38" y2="20" stroke="#1e293b" strokeWidth="3"/>
      <circle cx="20" cy="20" r="6" fill="#fff" stroke="#1e293b" strokeWidth="2"/>
      <circle cx="20" cy="20" r="3" fill="#fff" stroke="#1e293b" strokeWidth="1.5"/>
    </svg>
  );
}
