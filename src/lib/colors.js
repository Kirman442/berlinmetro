import * as THREE from 'three';
import { DEPTH_MAX } from './model';

// шкала «по глубине», как у 3d-metro: охра → ржавый → бордо → индиго
const RAMP = ['#E8C27C', '#C9793A', '#8A3B55', '#3A3170'].map((c) => new THREE.Color(c));
const ABOVE = new THREE.Color('#9AA79A');
export function depthColor(rel) {
  if (rel >= -0.5) return ABOVE.clone();
  const t = Math.min(1, -rel / DEPTH_MAX) * (RAMP.length - 1);
  const i = Math.min(RAMP.length - 2, Math.floor(t));
  return RAMP[i].clone().lerp(RAMP[i + 1], t - i);
}
export const RAMP_CSS = 'linear-gradient(90deg,#E8C27C,#C9793A,#8A3B55,#3A3170)';
// −12 m statt −12,0 m; Nachkommastellen nur so viele wie im Wert (höchstens 2, z. B. −11,25 m aus der Quelle)
export const fmtM = (v, d = 2) => {
  const a = Math.abs(v);
  const t = Number(a.toFixed(d)).toString().replace('.', ',');
  return `${v < 0 ? '−' : v > 0 ? '+' : ''}${t}`;
};
