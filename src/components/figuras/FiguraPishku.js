// Pishku, el Ave mensajera: colibrí andino dibujado solo con vectores
// (react-native-svg). Calca la ilustración de referencia
// assets/images/personajes/figuras/pishku.png (560×475): vuelo de perfil hacia
// la derecha, alas iridiscentes alzadas, cuerpo esmeralda con garganta
// azul-violeta, greca andina en el pecho, pico rojo abierto y cola abierta.
// Componente puro: sin hooks, sin estado, sin imágenes ni filtros.
import React from 'react';
import Svg, {
  G, Path, Circle, Defs, LinearGradient, RadialGradient, Stop, ClipPath,
} from 'react-native-svg';

export const VIEWBOX = '0 0 560 475';
// Cabeza y pico, cuadrado centrado en la cara.
export const BUSTO_VIEWBOX = '368 44 192 192';
// Hombro del ala delantera (donde se articula con el cuerpo).
export const ALA_PIVOTE = { x: 300, y: 170 };

const TINTA = '#1e140c';

// ---------- utilidades geométricas (se calculan una sola vez) ----------
const r1 = n => Math.round(n * 10) / 10;
const P = ([x, y]) => `${r1(x)} ${r1(y)}`;

// Curva suave (Catmull-Rom → Bézier cúbica) que pasa por todos los puntos.
function curva(pts, cerrada = true, k = 1) {
  const n = pts.length;
  const at = i => (cerrada ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))]);
  let d = `M${P(pts[0])}`;
  const fin = cerrada ? n : n - 1;
  for (let i = 0; i < fin; i++) {
    const p0 = at(i - 1), p1 = at(i), p2 = at(i + 1), p3 = at(i + 2);
    const c1 = [p1[0] + ((p2[0] - p0[0]) / 6) * k, p1[1] + ((p2[1] - p0[1]) / 6) * k];
    const c2 = [p2[0] - ((p3[0] - p1[0]) / 6) * k, p2[1] - ((p3[1] - p1[1]) / 6) * k];
    d += `C${P(c1)} ${P(c2)} ${P(p2)}`;
  }
  return cerrada ? d + 'Z' : d;
}
const poli = pts => 'M' + pts.map(P).join('L') + 'Z';

// Pluma: banda que va de la base B a la punta T, con punta redondeada.
function plumaPts(B, T, wb, wt, curv = 0) {
  const dx = T[0] - B[0], dy = T[1] - B[1];
  const L = Math.hypot(dx, dy);
  const ux = dx / L, uy = dy / L, nx = -uy, ny = ux;
  const m = [B[0] + dx * 0.55 + nx * curv, B[1] + dy * 0.55 + ny * curv];
  const wm = (wb + wt) / 2 + wt * 0.15;
  const Tq = [T[0] - ux * wt * 0.9, T[1] - uy * wt * 0.9];
  return [
    [B[0] + nx * wb, B[1] + ny * wb],
    [m[0] + nx * wm, m[1] + ny * wm],
    [Tq[0] + nx * wt, Tq[1] + ny * wt],
    [T[0] + nx * wt * 0.45, T[1] + ny * wt * 0.45],
    T,
    [T[0] - nx * wt * 0.45, T[1] - ny * wt * 0.45],
    [Tq[0] - nx * wt, Tq[1] - ny * wt],
    [m[0] - nx * wm, m[1] - ny * wm],
    [B[0] - nx * wb, B[1] - ny * wb],
  ];
}
const pluma = (B, T, wb, wt, curv) => curva(plumaPts(B, T, wb, wt, curv));
// Pluma con la punta desflecada (barbas irregulares), para la cola.
function plumaDesflecada(B, T, wb, wt, curv, sem) {
  const p = plumaPts(B, T, wb, wt, curv);
  const dx = T[0] - B[0], dy = T[1] - B[1], L = Math.hypot(dx, dy);
  const ux = dx / L, uy = dy / L, nx = -uy, ny = ux;
  const rnd = semilla(sem);
  const punta = [0.78, 0.45, 0.12, -0.22, -0.55, -0.85].map((s, k) => {
    const atras = wt * 0.95 * s * s + (k % 2 ? 3 + rnd() * 4 : rnd() * 1.5);
    return [T[0] - ux * atras + nx * s * wt, T[1] - uy * atras + ny * s * wt];
  });
  return curva([p[0], p[1], p[2], ...punta, p[6], p[7], p[8]]);
}
// Pluma corta en forma de gota con punta redonda (cobertoras, escamas sueltas).
function gota(B, T, w, curv = 0) {
  const dx = T[0] - B[0], dy = T[1] - B[1], L = Math.hypot(dx, dy);
  const ux = dx / L, uy = dy / L, nx = -uy, ny = ux;
  const C = [T[0] - ux * w, T[1] - uy * w];
  const izq = [C[0] + nx * w, C[1] + ny * w], der = [C[0] - nx * w, C[1] - ny * w];
  const q1 = [B[0] + dx * 0.45 + nx * (w * 1.05 + curv), B[1] + dy * 0.45 + ny * (w * 1.05 + curv)];
  const q2 = [B[0] + dx * 0.45 - nx * (w * 1.05 - curv), B[1] + dy * 0.45 - ny * (w * 1.05 - curv)];
  const b1 = [B[0] + nx * w * 0.5, B[1] + ny * w * 0.5], b2 = [B[0] - nx * w * 0.5, B[1] - ny * w * 0.5];
  return `M${P(b1)}Q${P(q1)} ${P(izq)}A${r1(w)} ${r1(w)} 0 0 0 ${P(der)}Q${P(q2)} ${P(b2)}Z`;
}
// Mitad inferior (lado de fuga) de una pluma, para sombrearla.
function mediaPluma(B, T, wb, wt, curv = 0) {
  const p = plumaPts(B, T, wb, wt, curv);
  const dx = T[0] - B[0], dy = T[1] - B[1];
  const L = Math.hypot(dx, dy), nx = -dy / L, ny = dx / L;
  const m = [B[0] + dx * 0.55 + nx * curv, B[1] + dy * 0.55 + ny * curv];
  return curva([p[4], p[5], p[6], p[7], p[8], B, m, [T[0] - (dx / L) * wt * 1.4, T[1] - (dy / L) * wt * 1.4]]);
}
// Arco de la punta de una pluma (para el filo claro de las rémiges).
function filoPunta(B, T, wb, wt, curv = 0) {
  const p = plumaPts(B, T, wb, wt, curv);
  return `M${P(p[2])}Q${P(p[3])} ${P(p[4])}Q${P(p[5])} ${P(p[6])}`;
}
// Raquis (eje) de la pluma.
function raquis(B, T, curv = 0, desde = 0.08, hasta = 0.9) {
  const dx = T[0] - B[0], dy = T[1] - B[1];
  const L = Math.hypot(dx, dy);
  const nx = -dy / L, ny = dx / L;
  const a = [B[0] + dx * desde, B[1] + dy * desde];
  const b = [B[0] + dx * hasta, B[1] + dy * hasta];
  const c = [B[0] + dx * 0.55 + nx * curv * 1.1, B[1] + dy * 0.55 + ny * curv * 1.1];
  return `M${P(a)}Q${P(c)} ${P(b)}`;
}
function dentro(pt, pol) {
  let c = false;
  for (let i = 0, j = pol.length - 1; i < pol.length; j = i++) {
    const [xi, yi] = pol[i], [xj, yj] = pol[j];
    if ((yi > pt[1]) !== (yj > pt[1]) && pt[0] < ((xj - xi) * (pt[1] - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
}
// Pseudoaleatorio determinista para brillos.
function semilla(s) {
  let v = s;
  return () => { v = (v * 16807) % 2147483647; return (v - 1) / 2147483646; };
}
const circ = (x, y, r) => `M${r1(x - r)} ${r1(y)}a${r} ${r} 0 1 0 ${r * 2} 0a${r} ${r} 0 1 0 ${-r * 2} 0Z`;
const elipse = (x, y, rx, ry) => `M${r1(x - rx)} ${r1(y)}a${r1(rx)} ${r1(ry)} 0 1 0 ${r1(rx * 2)} 0a${r1(rx)} ${r1(ry)} 0 1 0 ${r1(-rx * 2)} 0Z`;
const rotar = (pts, ang, [cx, cy]) => {
  const a = (ang * Math.PI) / 180, c = Math.cos(a), s = Math.sin(a);
  return pts.map(([x, y]) => [cx + (x - cx) * c - (y - cy) * s, cy + (x - cx) * s + (y - cy) * c]);
};

// Agrupa elementos consecutivos con la misma clave en un solo path compuesto
// (menos nodos SVG para Android sin cambiar el orden de pintado entre grupos).
function agrupar(items, clave, dibujar) {
  const out = [];
  for (const it of items) {
    const k = clave(it);
    const ult = out[out.length - 1];
    if (ult && ult.k === k) { ult.d += dibujar(it); ult.items.push(it); } else out.push({ k, d: dibujar(it), items: [it] });
  }
  return out;
}

// ---------- ALA TRASERA (la de arriba, detrás del cuerpo) ----------
const ALA_T_SIL = [
  [223, 4], [231, 2], [252, 12], [270, 26], [292, 48], [316, 78], [338, 110], [352, 134], [364, 160],
  [352, 182], [322, 188], [292, 172], [266, 146], [248, 124], [238, 100], [232, 82], [229, 62], [223, 50], [221, 26],
];
const ALA_T_PLUMAS = [
  // [base, punta, ancho base, ancho punta, curvatura]
  [[300, 176], [224, 46], 5, 9, -4],
  [[305, 172], [223, 22], 5, 10, -4],
  [[312, 168], [229, 5], 5, 11, -3],
  [[318, 165], [250, 13], 5, 11, -3],
  [[325, 162], [270, 28], 5, 11, -2],
  [[332, 160], [292, 50], 5, 11, -2],
  [[340, 160], [316, 80], 5, 10, -1],
  [[348, 162], [338, 112], 5, 9, 0],
];
// Cobertoras del ala trasera: plumas redondeadas que se funden hacia el ala.
const ALA_T_COB_ZONA = [[300, 104], [324, 96], [344, 116], [364, 160], [352, 182], [318, 186], [298, 166], [292, 132]];
const ALA_T_COB = (() => {
  const out = [];
  for (let fila = 0; fila < 6; fila++) {
    for (let k = 0; k < 5; k++) {
      const T = [296 + k * 16 - fila * 2 + (fila % 2) * 8, 106 + fila * 14 + k * 5];
      if (!dentro(T, ALA_T_COB_ZONA)) continue;
      const B = [T[0] + 10, T[1] + 15];
      out.push({ B, T, fila });
    }
  }
  // de arriba hacia abajo: las filas cercanas al hombro quedan encima
  return out.sort((a, b) => a.fila - b.fila);
})();

// ---------- COLA ----------
const COLA = [
  // base, punta, ancho base, ancho punta, curvatura, tono
  { B: [262, 318], T: [84, 430], wb: 7, wt: 11, c: 6, g: 'a' },
  { B: [264, 326], T: [102, 452], wb: 7, wt: 13, c: 5, g: 'b' },
  { B: [268, 332], T: [148, 448], wb: 7, wt: 12, c: 4, g: 'a' },
  { B: [270, 336], T: [160, 460], wb: 7, wt: 14, c: 2, g: 'b' },
  { B: [274, 340], T: [190, 470], wb: 7, wt: 13, c: 1, g: 'a' },
  { B: [278, 342], T: [218, 464], wb: 7, wt: 12, c: 0, g: 'b' },
  { B: [282, 344], T: [238, 466], wb: 7, wt: 11, c: -1, g: 'a' },
  { B: [286, 344], T: [264, 428], wb: 7, wt: 10, c: -3, g: 'b' },
  { B: [290, 346], T: [281, 382], wb: 6, wt: 8, c: -2, g: 'a' },
];
// Pluma superior de la cola (oscura, con filo dorado-naranja).
const COLA_ROJA = { B: [258, 292], T: [96, 426], wb: 7, wt: 8, c: -1 };
// Cobertoras infracaudales: pizarra verdosa, medio tapadas por la cola.
const COLA_COB = [
  { B: [270, 312], T: [222, 360], wb: 5, wt: 9, c: 3 },
  { B: [278, 318], T: [234, 374], wb: 5, wt: 10, c: 2 },
  { B: [286, 322], T: [250, 382], wb: 5, wt: 10, c: 1 },
  { B: [294, 326], T: [266, 384], wb: 5, wt: 9, c: 0 },
  { B: [300, 330], T: [282, 374], wb: 5, wt: 8, c: -1 },
];
// Rabadilla: muchas plumitas en franja diagonal sobre el borde de la cola;
// un único degradado (verde → amarillo → naranja → rojo) las funde.
const RABADILLA = (() => {
  const out = [];
  const A = [278, 268], Z = [200, 336];
  const rnd = semilla(23);
  for (let fila = 0; fila < 3; fila++) {
    const n = 8 - fila;
    for (let i = 0; i < n; i++) {
      const t = (i + (fila % 2 ? 0.5 : 0.15)) / 8;
      const off = -6 + fila * 6.5;
      const T = [A[0] + (Z[0] - A[0]) * t + off * 0.66 - 8, A[1] + (Z[1] - A[1]) * t + off * 0.75 + 9];
      const L = 17 + rnd() * 6 - fila * 2;
      // apuntan hacia abajo-izquierda, a lo largo de la cola
      const B = [T[0] + L * 0.72, T[1] - L * 0.7];
      out.push({ B, T, w: 3.6 + rnd() * 0.8, fila });
    }
  }
  // de la cola hacia el cuerpo: las cercanas al lomo quedan encima
  return out.sort((a, b) => b.fila - a.fila || a.T[0] - b.T[0]);
})();

// ---------- CUERPO ----------
const CUERPO = [
  [468, 102.5], [452, 100], [432, 99], [412, 101], [396, 108], [384, 117], [378, 132], [370, 152],
  [348, 176], [312, 196], [282, 228], [262, 268], [252, 302], [262, 332], [286, 350], [314, 357],
  [342, 350], [370, 334], [394, 316], [414, 292], [432, 265], [441, 237], [448, 211], [463, 180],
  [482, 152], [492, 141], [472, 136], [462, 133], [472, 119], [484, 105.5],
];
const CUERPO_D = curva(CUERPO);

// Escamas del plumaje: diminutas en la cabeza, medianas en el cuello y
// grandes en el pecho. Cada una tiene centro claro (tres tonos iridiscentes)
// y borde oscuro tenue.
const ESCAMAS = (() => {
  const osc = ['', ''];
  const luz = ['', '', ''];
  const rnd = semilla(11);
  for (let y = 108, fila = 0; y < 352; fila++) {
    const s = y < 128 ? 2.4 : y < 160 ? 3.6 : y < 200 ? 5.4 : 8;
    for (let x0 = 244 + (fila % 2) * s; x0 < 496; x0 += s * 2) {
      const x = x0 + (rnd() - 0.5) * s * 0.35;
      if (!dentro([x, y], CUERPO) || !dentro([x, y + s * 1.3], CUERPO)) continue;
      if (x > 466 && y < 134) continue; // base del pico
      if (Math.hypot(x - 430, y - 128) < 17) continue; // alrededor del ojo
      const bajo = y > 312 && x > 300; // vientre en sombra: sin luz en la escama
      const yy = y + (rnd() - 0.5) * s * 0.25;
      osc[s < 4 ? 0 : 1] += `M${r1(x - s)} ${r1(yy)}q${r1(s * 0.15)} ${r1(s * 1.45)} ${r1(s)} ${r1(s * 1.45)}q${r1(s * 0.85)} 0 ${r1(s)} ${r1(-s * 1.45)}`;
      const t = x < 360 ? (rnd() < 0.72 ? 0 : 1) : x < 420 ? (rnd() < 0.6 ? 1 : 0) : (rnd() < 0.6 ? 2 : 1);
      if (!bajo) luz[t] += elipse(x - s * 0.12, yy + s * 0.5, s * 0.7, s * 0.52);
    }
    y += s * 1.15;
  }
  return { osc, luz };
})();

// Greca andina en relieve: espirales cuadradas escalonadas del mismo tono que
// el plumaje y una franja de rayado vertical, como un tejido sobre el pecho.
function greca(cx, cy, s) {
  const a = s, b = s * 0.55, c = s * 0.12;
  return `M${r1(cx - a)} ${r1(cy + a)}V${r1(cy - a)}H${r1(cx + a)}V${r1(cy + a)}H${r1(cx - b)}V${r1(cy - b)}H${r1(cx + b)}V${r1(cy + c)}H${r1(cx - c)}`;
}
function patron(ox, oy) {
  let d = '';
  for (const [x, y, t] of [[309, 276, 8], [336, 268, 7.5], [302, 302, 8], [329, 296, 8]]) d += greca(x + ox, y + oy, t);
  // franja de rayado vertical a la derecha, en un rombo alargado
  for (let i = 0; i < 6; i++) {
    const x = 349 + i * 4.2 + ox;
    d += `M${r1(x)} ${r1(276 - i * 1.6 + oy)}v${r1(22 - Math.abs(i - 2.5) * 2)}`;
  }
  return d;
}
const PATRON = patron(0, 0);
const PATRON_SOMBRA = patron(0.9, 1);

// ---------- ALA DELANTERA ----------
const ALA_D_SIL = [
  [2, 49], [4, 45], [30, 44], [54, 45], [66, 52], [94, 59], [131, 73], [196, 103], [246, 128],
  [276, 140], [306, 156], [332, 180], [342, 210], [336, 246], [314, 270], [288, 280], [262, 270],
  [243, 260], [236, 252], [229, 244], [214, 238], [205, 228], [192, 220], [174, 212], [144, 193],
  [116, 166], [100, 154], [84, 140], [64, 120], [42, 108], [35, 95], [20, 83], [12, 72], [9, 62],
];
const PUNTAS = [
  [3, 47], [8, 61], [14, 74], [29, 87], [38, 103], [57, 116], [76, 136], [100, 155],
  [128, 180], [158, 201], [183, 214], [204, 228], [222, 241], [238, 255], [254, 266],
];
const ALA_D_PLUMAS = PUNTAS.map((T0, i) => {
  const t = i / (PUNTAS.length - 1);
  const B = [258 + 34 * t, 140 + 120 * t];
  // la punta se retrae un poco hacia la base para calzar con la silueta
  const L0 = Math.hypot(T0[0] - B[0], T0[1] - B[1]);
  const T = [T0[0] + ((B[0] - T0[0]) / L0) * 3.5, T0[1] + ((B[1] - T0[1]) / L0) * 3.5];
  const sig = PUNTAS[Math.min(i + 1, PUNTAS.length - 1)];
  const ant = PUNTAS[Math.max(i - 1, 0)];
  const sep = Math.max(Math.hypot(sig[0] - T[0], sig[1] - T[1]), Math.hypot(ant[0] - T[0], ant[1] - T[1]));
  return { B, T, wb: 6, wt: Math.max(8.5, Math.min(15, sep * 0.56)), c: 9 - t * 6 };
});
// Álula / cobertoras del borde de ataque.
const ALULA = { B: [262, 140], T: [26, 47], wb: 6, wt: 8, c: 10 };
// Zona de cobertoras del ala delantera.
const ALA_D_COB_ZONA = [
  [204, 110], [232, 118], [262, 132], [302, 152], [332, 178], [342, 212], [338, 246], [320, 266],
  [298, 274], [282, 268], [264, 246], [246, 208], [226, 164], [212, 134],
];
// Cobertoras del ala delantera: filas de plumas alargadas que salen del
// hombro y apuntan hacia la punta del ala, como en la ilustración. La fila 0
// (la más externa y larga) es ciruela; luego verde oliva, verdes y, junto al
// cuerpo, teal-azul. Unas pocas plumas rojo oscuro entre las verdes.
// Puntas de la fila 0 (borde con las rémiges).
const ALA_D_FILO = [[204, 110], [210, 128], [220, 151], [233, 175], [248, 200], [262, 226], [276, 250], [290, 270], [304, 286]];
// Zona válida de las puntas: bajo el borde de ataque y antes del cuerpo.
const ALA_D_COB_LIM = [[200, 104], [246, 128], [276, 140], [306, 156], [334, 180], [348, 210], [342, 248], [318, 274], [292, 284], ...ALA_D_FILO.slice().reverse()];
const ALA_D_ROJAS = [[300, 204], [314, 226]];
const ALA_D_COB = (() => {
  const out = [];
  const rnd = semilla(5);
  // longitudes acumuladas del filo para repartir plumas por distancia
  const seg = [0];
  for (let i = 1; i < ALA_D_FILO.length; i++) seg.push(seg[i - 1] + Math.hypot(ALA_D_FILO[i][0] - ALA_D_FILO[i - 1][0], ALA_D_FILO[i][1] - ALA_D_FILO[i - 1][1]));
  const total = seg[seg.length - 1];
  const filo = l => {
    let i = 1;
    while (i < seg.length - 1 && seg[i] < l) i++;
    const t = (l - seg[i - 1]) / (seg[i] - seg[i - 1]);
    const [a, b] = [ALA_D_FILO[i - 1], ALA_D_FILO[i]];
    return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  };
  for (let fila = 0; fila < 11; fila++) {
    const paso = fila === 0 ? 10.5 : 12;
    for (let l = (fila % 2) * paso * 0.5; l <= total + 2; l += paso) {
      const u = Math.min(1, l / total);
      // dirección de la pluma: hacia la izquierda arriba, más hacia abajo al final
      const ang = (164 - u * 42) * Math.PI / 180;
      const d = [Math.cos(ang), Math.sin(ang)];
      const E = filo(Math.min(l, total));
      // las filas se apilan hacia el hombro (a la derecha, algo hacia arriba)
      const ao = (-16 - u * 14) * Math.PI / 180;
      const T = [E[0] + Math.cos(ao) * fila * 13 + (rnd() - 0.5) * 2, E[1] + Math.sin(ao) * fila * 13 + (rnd() - 0.5) * 2];
      if (fila > 0 && !dentro(T, ALA_D_COB_LIM)) continue;
      const L = fila === 0 ? 32 : 27;
      const B = [T[0] - d[0] * L, T[1] - d[1] * L];
      const lejos = Math.hypot(T[0] - 336, T[1] - 214);
      let tipo = fila === 0 ? 'ciruela' : fila === 1 ? 'oliva' : 'verde';
      if (fila >= 2 && (fila >= 6 || lejos < 22 || T[0] > 322)) tipo = 'union';
      if (tipo === 'verde' && ALA_D_ROJAS.some(([x, y]) => Math.hypot(T[0] - x, T[1] - y) < 6.5)) tipo = 'roja';
      out.push({ B, T, tipo, s: Math.floor(rnd() * 2), fila, w: fila === 0 ? 5.4 : 6 });
    }
  }
  // tejas: primero la fila externa; las del hombro quedan encima
  return out.sort((a, b) => a.fila - b.fila || b.T[1] - a.T[1]);
})();
const ALA_D_SIL_D = curva(ALA_D_SIL);
// Contorno abierto: solo el borde de ataque (el de fuga lo dan las plumas).
const ALA_D_CONTORNO = curva([[9, 62], ...ALA_D_SIL.slice(0, 11)], false);
const BRILLOS = (() => {
  const rnd = semilla(7);
  let d = '';
  for (let i = 0; i < 46; i++) {
    const x = 20 + rnd() * 240, y = 50 + rnd() * 190;
    if (!dentro([x, y], ALA_D_SIL) || dentro([x, y], ALA_D_COB_ZONA)) continue;
    d += circ(x, y, r1(0.5 + rnd() * 1.1));
  }
  return d;
})();
const BRILLOS_T = (() => {
  const rnd = semilla(31);
  let d = '';
  for (let i = 0; i < 24; i++) {
    const x = 225 + rnd() * 110, y = 6 + rnd() * 120;
    if (!dentro([x, y], ALA_T_SIL)) continue;
    d += circ(x, y, r1(0.5 + rnd() * 0.9));
  }
  return d;
})();
const BRILLOS_COLA = (() => {
  const rnd = semilla(19);
  let d = '';
  for (let i = 0; i < 20; i++) {
    const f = COLA[Math.floor(rnd() * COLA.length)];
    const t = 0.55 + rnd() * 0.38, w = (rnd() - 0.5) * 8;
    const dx = f.T[0] - f.B[0], dy = f.T[1] - f.B[1], L = Math.hypot(dx, dy);
    d += circ(f.B[0] + dx * t - (dy / L) * w, f.B[1] + dy * t + (dx / L) * w, r1(0.35 + rnd() * 0.55));
  }
  return d;
})();

// Plumón blanco-crema bajo el vientre, delante de las patas: mechones
// finos que caen hacia abajo-izquierda, con base marrón-rojiza.
const PLUMON = (() => {
  const O = [285, 316];
  const rnd = semilla(77);
  let blanco = '', gris = '';
  for (let i = 0; i < 15; i++) {
    const ang = ((68 + i * 7 + (rnd() - 0.5) * 6) * Math.PI) / 180;
    const L = 28 + rnd() * 12 - Math.abs(i - 7) * 1.1;
    const ux = Math.cos(ang), uy = Math.sin(ang), nx = -uy, ny = ux;
    const b0 = [O[0] + ux * 6, O[1] + uy * 6], w = 2.2 + rnd();
    const p = [O[0] + ux * L, O[1] + uy * L];
    const c = [O[0] + ux * L * 0.6 + nx * 2, O[1] + uy * L * 0.6 + ny * 2];
    const d = `M${P([b0[0] + nx * w, b0[1] + ny * w])}Q${P(c)} ${P(p)}Q${P([c[0] - nx * 3, c[1] - ny * 3])} ${P([b0[0] - nx * w, b0[1] - ny * w])}Z`;
    if (i % 3 === 1) gris += d; else blanco += d;
  }
  return { blanco, gris, base: elipse(285, 322, 15, 9) };
})();

// ---------- PICO ----------
const BISAGRA = [458, 133];
// Mandíbula superior fina: base ~17 px, comisura en (461,132).
// La base queda en diagonal, tapada por las plumas de la frente.
const PICO_SUP = [[483, 105.5], [512, 98], [532, 93], [545, 89.5], [548.5, 90.5], [546, 93.5], [512, 107.5], [480, 122], [461, 132], [470, 120]];
const PICO_SUP_D = pts => `M${P(pts[0])}L${P(pts[1])}Q${P(pts[2])} ${P(pts[3])}Q${P(pts[4])} ${P(pts[5])}Q${P(pts[6])} ${P(pts[7])}L${P(pts[8])}Q${P(pts[9])} ${P(pts[0])}Z`;
const PICO_INF = [[458, 133], [480, 134], [515, 131.5], [549, 129], [556.5, 130.5], [557, 134], [548, 135.5], [520, 137], [500, 140], [486, 145], [470, 146], [460, 143]];
const PICO_INF_D = pts => `M${P(pts[0])}L${P(pts[1])}Q${P(pts[2])} ${P(pts[3])}Q${P(pts[4])} ${P(pts[5])}L${P(pts[6])}Q${P(pts[7])} ${P(pts[8])}Q${P(pts[9])} ${P(pts[10])}Q${P(pts[11])} ${P(pts[0])}Z`;

// ---------- EXPRESIONES ----------
// pico: giro de la mandíbula inferior (°); picoSup: giro de la superior;
// parpado: cierre del párpado superior (0–1); inclina: >0 cae hacia la nuca;
// alegre: mejilla alzada; cresta: plumas de la coronilla erizadas;
// guino: ojo cerrado en «^»; ceja: arco sobre el ojo (solo algunos ánimos).
const ANIMOS = {
  neutral: { pico: 0, picoSup: 0, ojoR: 10, parpado: 0, inclina: 0, mira: [0, 0], alegre: 0, cresta: null, guino: false, ceja: null },
  feliz: { pico: 8, picoSup: -2, ojoR: 10, parpado: 0, inclina: 0, mira: [0.5, -3], alegre: 0.82, cresta: null, guino: false, ceja: null },
  pensativo: { pico: -7.5, picoSup: 0, ojoR: 10, parpado: 0.42, inclina: 0.4, mira: [-2.2, -2.6], alegre: 0, cresta: null, guino: false, ceja: null },
  sorprendido: { pico: 11, picoSup: -3.5, ojoR: 12.5, parpado: 0, inclina: 0, mira: [0, 0], alegre: 0, cresta: 'alta', guino: false, ceja: -7 },
  travieso: { pico: 3, picoSup: 0, ojoR: 10, parpado: 0, inclina: 0, mira: [0, 0], alegre: 0.5, cresta: 'nuca', guino: true, ceja: -4 },
};
const OJO = [430, 128];
// Tono de base y de punta (luz) de cada tipo de cobertora.
const COB_TONO = {
  ciruela: ['#3c2a3e', '#6e5068'], oliva: ['#26442a', '#5e8a3e'], verde: ['#1f5634', '#4e9c44'],
  verde2: ['#1a5c44', '#46a666'], roja: ['#4a1812', '#963420'], union: ['#14506e', '#2ea4a8'],
};
// Cobertoras agrupadas por fila y tono: un path de pluma y otro de luz en la punta.
const ALA_D_COB_GRUPOS = agrupar(
  ALA_D_COB,
  c => `${c.fila}|${c.tipo === 'verde' ? (c.s ? 'verde' : 'verde2') : c.tipo}`,
  ({ B, T, w, tipo }) => gota(B, T, w, tipo === 'ciruela' ? 1.5 : 0.8),
).map(g => ({
  ...g,
  luz: g.items.map(({ B, T, w }) => {
    const dx = T[0] - B[0], dy = T[1] - B[1], L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L;
    return gota([T[0] - ux * L * 0.62, T[1] - uy * L * 0.62], [T[0] - ux * 1.6, T[1] - uy * 1.6], w * 0.72, 0.4);
  }).join(''),
}));

// ---------- piezas ----------
function Degradados() {
  return (
    <Defs>
      <LinearGradient id="pishku_alaT" x1="226" y1="8" x2="340" y2="176" gradientUnits="userSpaceOnUse">
        <Stop offset="0" stopColor="#c4a0a4" />
        <Stop offset="0.35" stopColor="#ac98a6" />
        <Stop offset="0.58" stopColor="#8aa2aa" />
        <Stop offset="0.75" stopColor="#b0a66e" />
        <Stop offset="1" stopColor="#3a8a6c" />
      </LinearGradient>
      <RadialGradient id="pishku_alaTIris" cx="292" cy="112" r="56" gradientUnits="userSpaceOnUse">
        <Stop offset="0" stopColor="#5ed8c8" stopOpacity="0.45" />
        <Stop offset="0.6" stopColor="#e8c860" stopOpacity="0.25" />
        <Stop offset="1" stopColor="#e8c860" stopOpacity="0" />
      </RadialGradient>
      <LinearGradient id="pishku_cobT" x1="350" y1="190" x2="296" y2="100" gradientUnits="userSpaceOnUse">
        <Stop offset="0" stopColor="#1e6650" />
        <Stop offset="0.6" stopColor="#3a9a7a" />
        <Stop offset="1" stopColor="#8ad0b0" />
      </LinearGradient>
      <LinearGradient id="pishku_alaD" x1="150" y1="58" x2="86" y2="206" gradientUnits="userSpaceOnUse">
        <Stop offset="0" stopColor="#c49686" />
        <Stop offset="0.14" stopColor="#a87e74" />
        <Stop offset="0.25" stopColor="#9e706a" />
        <Stop offset="0.35" stopColor="#c8906a" />
        <Stop offset="0.45" stopColor="#e8b870" />
        <Stop offset="0.55" stopColor="#e0b08a" />
        <Stop offset="0.66" stopColor="#bca2b2" />
        <Stop offset="0.8" stopColor="#d4a292" />
        <Stop offset="1" stopColor="#a8767c" />
      </LinearGradient>
      <RadialGradient id="pishku_alaSombra" cx="284" cy="206" r="120" gradientUnits="userSpaceOnUse">
        <Stop offset="0" stopColor="#2e1426" stopOpacity="0.5" />
        <Stop offset="0.5" stopColor="#4a2436" stopOpacity="0.18" />
        <Stop offset="1" stopColor="#4a2436" stopOpacity="0" />
      </RadialGradient>
      {/* reflejo arcoíris transversal a las plumas */}
      <LinearGradient id="pishku_arcoiris" x1="0" y1="62" x2="-30" y2="138" gradientUnits="userSpaceOnUse">
        <Stop offset="0.02" stopColor="#f6a8c8" stopOpacity="0" />
        <Stop offset="0.14" stopColor="#f6a8c8" stopOpacity="0.5" />
        <Stop offset="0.28" stopColor="#b08af0" stopOpacity="0.55" />
        <Stop offset="0.42" stopColor="#6ab8f0" stopOpacity="0.55" />
        <Stop offset="0.55" stopColor="#70e0c8" stopOpacity="0.45" />
        <Stop offset="0.68" stopColor="#ffd860" stopOpacity="0.55" />
        <Stop offset="0.84" stopColor="#ffd860" stopOpacity="0" />
      </LinearGradient>
      <RadialGradient id="pishku_alaOro" cx="208" cy="152" r="62" gradientUnits="userSpaceOnUse">
        <Stop offset="0" stopColor="#ffd070" stopOpacity="0.6" />
        <Stop offset="0.6" stopColor="#f4b850" stopOpacity="0.25" />
        <Stop offset="1" stopColor="#f4c860" stopOpacity="0" />
      </RadialGradient>
      <LinearGradient id="pishku_rab" x1="278" y1="268" x2="190" y2="342" gradientUnits="userSpaceOnUse">
        <Stop offset="0" stopColor="#2e7a3a" />
        <Stop offset="0.3" stopColor="#6aa23a" />
        <Stop offset="0.5" stopColor="#b89a3a" />
        <Stop offset="0.7" stopColor="#c8642c" />
        <Stop offset="1" stopColor="#8a2a1e" />
      </LinearGradient>
      <LinearGradient id="pishku_colaA" x1="1" y1="0" x2="0" y2="1">
        <Stop offset="0" stopColor="#101834" />
        <Stop offset="0.3" stopColor="#152a52" />
        <Stop offset="0.56" stopColor="#156078" />
        <Stop offset="0.78" stopColor="#192650" />
        <Stop offset="0.9" stopColor="#4a2a40" />
        <Stop offset="1" stopColor="#8a3a2e" />
      </LinearGradient>
      <LinearGradient id="pishku_colaB" x1="1" y1="0" x2="0" y2="1">
        <Stop offset="0" stopColor="#12122e" />
        <Stop offset="0.35" stopColor="#1a2454" />
        <Stop offset="0.6" stopColor="#174a6c" />
        <Stop offset="0.82" stopColor="#1e1e44" />
        <Stop offset="0.93" stopColor="#5e2e3a" />
        <Stop offset="1" stopColor="#9a4630" />
      </LinearGradient>
      <LinearGradient id="pishku_colaBrillo" x1="1" y1="0" x2="0" y2="1">
        <Stop offset="0" stopColor="#5ae0e0" stopOpacity="0" />
        <Stop offset="0.55" stopColor="#3ab8d0" stopOpacity="0.3" />
        <Stop offset="1" stopColor="#5ae0e0" stopOpacity="0" />
      </LinearGradient>
      <LinearGradient id="pishku_colaRoja" x1="1" y1="0" x2="0" y2="1">
        <Stop offset="0" stopColor="#3a1e2a" />
        <Stop offset="0.4" stopColor="#24264e" />
        <Stop offset="0.85" stopColor="#2a2a52" />
        <Stop offset="1" stopColor="#8a3a2e" />
      </LinearGradient>
      <LinearGradient id="pishku_colaCob" x1="1" y1="0" x2="0" y2="1">
        <Stop offset="0" stopColor="#262b30" />
        <Stop offset="0.55" stopColor="#40484e" />
        <Stop offset="1" stopColor="#626a70" />
      </LinearGradient>
      <LinearGradient id="pishku_plumon" x1="0" y1="316" x2="0" y2="352" gradientUnits="userSpaceOnUse">
        <Stop offset="0" stopColor="#b07868" />
        <Stop offset="0.3" stopColor="#e8dcd4" />
        <Stop offset="1" stopColor="#ffffff" />
      </LinearGradient>
      <LinearGradient id="pishku_cuerpo" x1="330" y1="190" x2="474" y2="236" gradientUnits="userSpaceOnUse">
        <Stop offset="0" stopColor="#3aa846" />
        <Stop offset="0.42" stopColor="#22a464" />
        <Stop offset="0.64" stopColor="#1a8aa0" />
        <Stop offset="0.82" stopColor="#2c3496" />
        <Stop offset="1" stopColor="#170f52" />
      </LinearGradient>
      <RadialGradient id="pishku_luzLima" cx="356" cy="230" r="74" gradientUnits="userSpaceOnUse">
        <Stop offset="0" stopColor="#c6ea52" stopOpacity="0.6" />
        <Stop offset="0.55" stopColor="#7cd04a" stopOpacity="0.35" />
        <Stop offset="1" stopColor="#7cd04a" stopOpacity="0" />
      </RadialGradient>
      <RadialGradient id="pishku_luzTurq" cx="392" cy="236" r="42" gradientUnits="userSpaceOnUse">
        <Stop offset="0" stopColor="#36e0c0" stopOpacity="0.55" />
        <Stop offset="1" stopColor="#36e0c0" stopOpacity="0" />
      </RadialGradient>
      <RadialGradient id="pishku_cabeza" cx="420" cy="116" r="52" gradientUnits="userSpaceOnUse">
        <Stop offset="0" stopColor="#4cbc48" stopOpacity="0.95" />
        <Stop offset="0.6" stopColor="#2a9a4a" stopOpacity="0.6" />
        <Stop offset="1" stopColor="#1c8a5a" stopOpacity="0" />
      </RadialGradient>
      <LinearGradient id="pishku_vientre" x1="0" y1="280" x2="0" y2="358" gradientUnits="userSpaceOnUse">
        <Stop offset="0" stopColor="#141c54" stopOpacity="0" />
        <Stop offset="1" stopColor="#120e40" stopOpacity="0.8" />
      </LinearGradient>
      <RadialGradient id="pishku_violeta" cx="372" cy="326" r="74" gradientUnits="userSpaceOnUse">
        <Stop offset="0" stopColor="#6a3fb0" stopOpacity="0.9" />
        <Stop offset="0.55" stopColor="#4a2f8c" stopOpacity="0.6" />
        <Stop offset="1" stopColor="#4a2f8c" stopOpacity="0" />
      </RadialGradient>
      <RadialGradient id="pishku_calido" cx="272" cy="292" r="56" gradientUnits="userSpaceOnUse">
        <Stop offset="0" stopColor="#d24a22" stopOpacity="0.92" />
        <Stop offset="0.55" stopColor="#b0302a" stopOpacity="0.6" />
        <Stop offset="1" stopColor="#c0402a" stopOpacity="0" />
      </RadialGradient>
      <RadialGradient id="pishku_garganta" cx="470" cy="196" r="66" gradientUnits="userSpaceOnUse">
        <Stop offset="0" stopColor="#0a0a30" stopOpacity="0.92" />
        <Stop offset="0.5" stopColor="#141448" stopOpacity="0.6" />
        <Stop offset="1" stopColor="#1c1a6a" stopOpacity="0" />
      </RadialGradient>
      <RadialGradient id="pishku_frente" cx="464" cy="112" r="24" gradientUnits="userSpaceOnUse">
        <Stop offset="0" stopColor="#2e9a6a" stopOpacity="0.95" />
        <Stop offset="1" stopColor="#2e9a6a" stopOpacity="0" />
      </RadialGradient>
      <RadialGradient id="pishku_mejilla" cx="400" cy="160" r="22" gradientUnits="userSpaceOnUse">
        <Stop offset="0" stopColor="#5a3ef0" />
        <Stop offset="0.6" stopColor="#3a24c0" stopOpacity="0.95" />
        <Stop offset="1" stopColor="#2a1a90" stopOpacity="0.2" />
      </RadialGradient>
      <LinearGradient id="pishku_antifaz" x1="410" y1="0" x2="460" y2="0" gradientUnits="userSpaceOnUse">
        <Stop offset="0" stopColor="#0a120e" stopOpacity="0" />
        <Stop offset="0.35" stopColor="#0a120e" stopOpacity="0.75" />
        <Stop offset="1" stopColor="#060a08" stopOpacity="0.95" />
      </LinearGradient>
      <LinearGradient id="pishku_pico" x1="458" y1="0" x2="558" y2="0" gradientUnits="userSpaceOnUse">
        <Stop offset="0" stopColor="#7a1a12" />
        <Stop offset="0.22" stopColor="#a82a1c" />
        <Stop offset="0.65" stopColor="#d0402a" />
        <Stop offset="0.92" stopColor="#b8382a" />
        <Stop offset="1" stopColor="#5a1a12" />
      </LinearGradient>
      <LinearGradient id="pishku_parpado" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0" stopColor="#36a456" />
        <Stop offset="1" stopColor="#228c62" />
      </LinearGradient>
      <RadialGradient id="pishku_parpadoC" cx="430" cy="127" r="15" gradientUnits="userSpaceOnUse">
        <Stop offset="0" stopColor="#30a05c" />
        <Stop offset="0.65" stopColor="#279260" />
        <Stop offset="1" stopColor="#279260" stopOpacity="0" />
      </RadialGradient>
      <LinearGradient id="pishku_cresta" x1="0" y1="84" x2="0" y2="112" gradientUnits="userSpaceOnUse">
        <Stop offset="0" stopColor="#8ad050" />
        <Stop offset="0.4" stopColor="#38a456" />
        <Stop offset="1" stopColor="#1e7a4e" />
      </LinearGradient>
      <RadialGradient id="pishku_iris" cx="0.45" cy="0.4" r="0.6">
        <Stop offset="0" stopColor="#5a4a44" />
        <Stop offset="0.6" stopColor="#221a18" />
        <Stop offset="1" stopColor="#0a0808" />
      </RadialGradient>
      <LinearGradient id="pishku_pata" x1="0" y1="0" x2="1" y2="0">
        <Stop offset="0" stopColor="#1e1e22" />
        <Stop offset="0.45" stopColor="#3a3a3e" />
        <Stop offset="0.7" stopColor="#5e5e64" />
        <Stop offset="1" stopColor="#26262a" />
      </LinearGradient>
      <ClipPath id="pishku_clipAlaD">
        <Path d={ALA_D_SIL_D} />
      </ClipPath>
      <ClipPath id="pishku_clipCuerpo">
        <Path d={CUERPO_D} />
      </ClipPath>
    </Defs>
  );
}

function AlaTrasera() {
  const sil = curva(ALA_T_SIL);
  return (
    <G>
      <Path d={sil} fill="url(#pishku_alaT)" fillOpacity={0.88} stroke={TINTA} strokeWidth={2.2} strokeLinejoin="round" />
      {ALA_T_PLUMAS.map(([B, T, wb, wt, c], i) => (
        <Path key={`t${i}`} d={pluma(B, T, wb, wt, c)} fill="url(#pishku_alaT)" fillOpacity={0.85} stroke="#4e3a44" strokeWidth={1} strokeOpacity={0.5} />
      ))}
      <Path d={sil} fill="url(#pishku_alaTIris)" />
      <Path d={ALA_T_PLUMAS.map(([B, T, , , c]) => raquis(B, T, c, 0.2, 0.92)).join('')} stroke="#f4ece6" strokeWidth={0.9} strokeOpacity={0.5} fill="none" />
      <Path d={BRILLOS_T} fill="#ffffff" fillOpacity={0.65} />
      {agrupar(ALA_T_COB, c => c.fila, ({ B, T }) => gota(B, T, 6.5)).map(({ k: fila, d }) => (
        <Path key={`tc${fila}`} d={d} fill="url(#pishku_cobT)" fillOpacity={0.5 + fila * 0.09} stroke="#14281e" strokeWidth={0.9} strokeOpacity={0.35 + fila * 0.08} />
      ))}
    </G>
  );
}

function Cola() {
  return (
    <G>
      {COLA.map(({ B, T, wb, wt, c, g }, i) => (
        <Path key={`c${i}`} d={plumaDesflecada(B, T, wb, wt, c, 40 + i)} fill={`url(#pishku_cola${g === 'a' ? 'A' : 'B'})`} stroke={TINTA} strokeWidth={1.5} strokeLinejoin="round" />
      ))}
      <Path d={COLA.map(({ B, T, c }) => pluma(B, T, 2, 4, c)).join('')} fill="url(#pishku_colaBrillo)" />
      <Path d={COLA.map(({ B, T, c }) => raquis(B, T, c, 0.15, 0.92)).join('')} stroke="#6ab8c0" strokeWidth={0.9} strokeOpacity={0.4} fill="none" />
      {/* filos cálidos en las puntas */}
      <Path d={COLA.map(({ B, T, wb, wt, c }) => filoPunta(B, T, wb, wt * 0.8, c)).join('')} stroke="#e0a070" strokeWidth={1.1} strokeOpacity={0.4} fill="none" />
      <Path d={BRILLOS_COLA} fill="#a8f0ec" fillOpacity={0.7} />
      <Path d={pluma(COLA_ROJA.B, COLA_ROJA.T, COLA_ROJA.wb, COLA_ROJA.wt, COLA_ROJA.c)} fill="url(#pishku_colaRoja)" stroke={TINTA} strokeWidth={1.5} />
      {/* filo dorado-naranja de la pluma superior */}
      <Path d={curva(plumaPts(COLA_ROJA.B, COLA_ROJA.T, COLA_ROJA.wb - 1.6, COLA_ROJA.wt - 1.6, COLA_ROJA.c).slice(0, 4), false)} stroke="#e8a050" strokeWidth={2} strokeOpacity={0.8} fill="none" strokeLinecap="round" />
      <Path d={raquis(COLA_ROJA.B, COLA_ROJA.T, COLA_ROJA.c, 0.1, 0.92)} stroke="#6ab8c8" strokeWidth={0.9} strokeOpacity={0.45} fill="none" />
    </G>
  );
}

// Cobertoras infracaudales (debajo del vientre, sobre la cola).
function CoberterasCola() {
  return (
    <G>
      {COLA_COB.map(({ B, T, wb, wt, c }, i) => (
        <React.Fragment key={`cc${i}`}>
          <Path d={pluma(B, T, wb, wt, c)} fill="url(#pishku_colaCob)" stroke={TINTA} strokeWidth={1.2} />
          <Path d={mediaPluma(B, T, wb, wt, c)} fill="#14181c" fillOpacity={0.35} />
        </React.Fragment>
      ))}
      <Path d={COLA_COB.map(({ B, T, c }) => raquis(B, T, c, 0.2, 0.88)).join('')} stroke="#a8b4b8" strokeWidth={0.8} strokeOpacity={0.45} fill="none" />
      {/* dibujo en relieve tenue */}
      <Path d={COLA_COB.map(({ B, T }) => {
        const dx = T[0] - B[0], dy = T[1] - B[1], L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L;
        let d = '';
        for (let t = 0.4; t < 0.9; t += 0.16) {
          const m = [B[0] + dx * t, B[1] + dy * t];
          d += `M${P([m[0] - uy * 4 - ux * 3, m[1] + ux * 4 - uy * 3])}L${P(m)}L${P([m[0] + uy * 4 - ux * 3, m[1] - ux * 4 - uy * 3])}`;
        }
        return d;
      }).join('')} stroke="#c8d4d4" strokeWidth={0.8} strokeOpacity={0.35} fill="none" />
      {/* las plumas centrales de la cola pasan por encima del borde inferior */}
      {COLA.slice(7).map(({ B, T, wb, wt, c, g }, i) => (
        <Path key={`cs${i}`} d={plumaDesflecada(B, T, wb, wt, c, 47 + i)} fill={`url(#pishku_cola${g === 'a' ? 'A' : 'B'})`} stroke={TINTA} strokeWidth={1.5} strokeLinejoin="round" />
      ))}
    </G>
  );
}

function Cuerpo() {
  return (
    <G>
      <Path d={CUERPO_D} fill="url(#pishku_cuerpo)" />
      <G clipPath="url(#pishku_clipCuerpo)">
        <Path d={CUERPO_D} fill="url(#pishku_luzLima)" />
        <Path d={CUERPO_D} fill="url(#pishku_luzTurq)" />
        <Path d={CUERPO_D} fill="url(#pishku_cabeza)" />
        <Path d={CUERPO_D} fill="url(#pishku_garganta)" />
        <Path d={CUERPO_D} fill="url(#pishku_frente)" />
        <Path d={CUERPO_D} fill="url(#pishku_vientre)" />
        <Path d={CUERPO_D} fill="url(#pishku_violeta)" />
        <Path d={CUERPO_D} fill="url(#pishku_calido)" />
        {/* mancha violeta de la mejilla */}
        <Path d="M378 176C384 164 396 153 410 149C419 147 426 150 423 156C419 163 406 170 394 175C386 178 380 180 378 176Z" fill="url(#pishku_mejilla)" />
        <Path d="M384 170C394 161 404 155 416 152" stroke="#9a8cff" strokeWidth={1.4} strokeOpacity={0.6} fill="none" strokeLinecap="round" />
        {/* escamas: centro claro y borde oscuro tenue */}
        <Path d={ESCAMAS.luz[0]} fill="#c8f45a" fillOpacity={0.26} />
        <Path d={ESCAMAS.luz[1]} fill="#4ef0d0" fillOpacity={0.26} />
        <Path d={ESCAMAS.luz[2]} fill="#8a78ff" fillOpacity={0.3} />
        <Path d={ESCAMAS.osc[0]} stroke="#04221a" strokeWidth={0.8} strokeOpacity={0.3} fill="none" strokeLinejoin="round" />
        <Path d={ESCAMAS.osc[1]} stroke="#04221a" strokeWidth={1.8} strokeOpacity={0.32} fill="none" strokeLinejoin="round" />
        {/* greca andina en relieve (sombra desplazada + luz) */}
        <Path d={PATRON_SOMBRA} stroke="#1a1006" strokeWidth={1.2} strokeOpacity={0.45} fill="none" strokeLinejoin="round" />
        <Path d={PATRON} stroke="#d8c470" strokeWidth={1.1} strokeOpacity={0.55} fill="none" strokeLinejoin="round" />
        {/* luz cálida en la nuca y la coronilla */}
        <Path d="M374 146C378 130 384 116 398 107C410 101 424 99 440 100" stroke="#f0d890" strokeWidth={3.2} strokeOpacity={0.5} fill="none" strokeLinecap="round" />
        <Path d="M378 128l7 3M381 120l7 4M386 112l6 5M393 106l5 6M401 102l4 6" stroke="#f4e0a0" strokeWidth={1.6} strokeOpacity={0.55} strokeLinecap="round" />
      </G>
      <Path d={CUERPO_D} fill="none" stroke={TINTA} strokeWidth={2.2} strokeLinejoin="round" />
    </G>
  );
}

// Plumón blanco-crema y rabadilla (encima del contorno del cuerpo).
function Plumajes() {
  return (
    <G>
      <Path d={PLUMON.base} fill="#8a3a2a" fillOpacity={0.55} />
      <Path d={PLUMON.gris} fill="#a09898" />
      <Path d={PLUMON.blanco} fill="url(#pishku_plumon)" stroke="#6a5a58" strokeWidth={0.5} strokeOpacity={0.4} />
      {agrupar(RABADILLA, r => r.fila, ({ B, T, w }) => pluma(B, T, w * 0.7, w, 1.2)).map(({ k, d }) => (
        <Path key={`rb${k}`} d={d} fill="url(#pishku_rab)" stroke="#3a1a0c" strokeWidth={0.7} strokeOpacity={0.3} strokeLinejoin="round" />
      ))}
    </G>
  );
}

function Patas() {
  // tarso corto y grueso; dedos curvados que se cierran como un puño
  const pata = (x, y, g) => {
    const q = rotar([
      [-2.8, 0], [2.8, 0], [3.2, 12], [9, 13], [12.5, 17], [11.5, 22], [10.5, 25.5], [7.5, 26], [6.6, 24.2],
      [8.6, 21.4], [7.4, 19], [4.6, 18.6], [3.4, 20], [4.6, 23.6], [2, 27.4], [-1, 27], [-2, 25], [-0.6, 22], [-1.8, 20],
      [-4.8, 21], [-8, 24.4], [-9.4, 22.4], [-8, 18], [-5, 15.4], [-3.2, 12], [-2.8, 0],
    ].map(([a, b]) => [x + a, y + b]), g, [x, y]);
    let d = `M${P(q[0])}L${P(q[1])}L${P(q[2])}`;
    for (let i = 3; i + 2 < q.length; i += 3) d += `C${P(q[i])} ${P(q[i + 1])} ${P(q[i + 2])}`;
    return d + 'Z';
  };
  const escamas = (x, y, g) => {
    const q = rotar([[-2.6, 3.5], [2.6, 3.5], [-2.8, 7], [2.8, 7], [-3, 10.5], [3, 10.5], [5, 15], [8, 17], [-1, 19], [2, 19.5], [-4, 16.5], [-6, 19]].map(([a, b]) => [x + a, y + b]), g, [x, y]);
    let d = '';
    for (let i = 0; i < q.length; i += 2) d += `M${P(q[i])}Q${P([(q[i][0] + q[i + 1][0]) / 2, (q[i][1] + q[i + 1][1]) / 2 + 1.2])} ${P(q[i + 1])}`;
    return d;
  };
  return (
    <G>
      <Path d={pata(309, 341, -6) + pata(340, 345, -10)} fill="url(#pishku_pata)" stroke={TINTA} strokeWidth={1.3} strokeLinejoin="round" />
      <Path d={escamas(309, 341, -6) + escamas(340, 345, -10)} stroke="#7a7a82" strokeWidth={0.8} strokeOpacity={0.9} fill="none" strokeLinecap="round" />
    </G>
  );
}

// Párpado superior: segmento del círculo del ojo por encima de un borde
// curvo que va de yl (lado nuca) a yr (lado pico).
function parpadoSup(ox, oy, R, yl, yr, bow) {
  const lim = y => Math.max(oy - R + 0.6, Math.min(oy + R - 0.6, y));
  yl = lim(yl); yr = lim(yr);
  const xl = ox - Math.sqrt(R * R - (yl - oy) ** 2), xr = ox + Math.sqrt(R * R - (yr - oy) ** 2);
  const grande = (yl + yr) / 2 > oy ? 1 : 0;
  return { d: `M${r1(xl)} ${r1(yl)}A${R} ${R} 0 ${grande} 1 ${r1(xr)} ${r1(yr)}Q${ox} ${r1((yl + yr) / 2 + bow)} ${r1(xl)} ${r1(yl)}Z`, borde: `M${r1(xl)} ${r1(yl)}Q${ox} ${r1((yl + yr) / 2 + bow)} ${r1(xr)} ${r1(yr)}` };
}
// Párpado inferior: segmento por debajo de un borde curvo (bow>0 lo arquea hacia arriba).
function parpadoInf(ox, oy, R, y, bow) {
  y = Math.max(oy - R + 0.6, Math.min(oy + R - 0.6, y));
  const dx = Math.sqrt(R * R - (y - oy) ** 2);
  const grande = y < oy ? 1 : 0;
  return { d: `M${r1(ox + dx)} ${r1(y)}A${R} ${R} 0 ${grande} 1 ${r1(ox - dx)} ${r1(y)}Q${ox} ${r1(y - bow)} ${r1(ox + dx)} ${r1(y)}Z`, borde: `M${r1(ox - dx)} ${r1(y)}Q${ox} ${r1(y - bow)} ${r1(ox + dx)} ${r1(y)}` };
}

// Plumas erizadas de la coronilla (sorpresa / picardía).
function Cresta({ tipo }) {
  if (!tipo) return null;
  const d = {
    alta: 'M398 108L394 90L407 101L410 84L419 99L426 85L430 100L436 92L438 102Z',
    nuca: 'M386 116L370 104L388 108L378 94L394 104L392 92L402 104Z',
  }[tipo];
  return <Path d={d} fill="url(#pishku_cresta)" stroke={TINTA} strokeWidth={1.4} strokeLinejoin="round" />;
}

function Ojo({ e, ojosCerrados }) {
  const [ox, oy] = OJO;
  const R = e.ojoR;
  const Rr = R + 2.2; // anillo de piel
  // antifaz oscuro que rodea el ojo y lo une con la comisura del pico
  const antifaz = `M${ox - 16} ${oy + 1}C${ox - 14} ${oy - 12} ${ox + 2} ${oy - 17} ${ox + 13} ${oy - 10}C${ox + 20} ${oy - 6} ${ox + 26} ${oy - 3} ${ox + 31} ${oy + 1}L${ox + 31} ${oy + 5}C${ox + 24} ${oy + 5} ${ox + 18} ${oy + 9} ${ox + 8} ${oy + 13}C${ox - 4} ${oy + 16} ${ox - 15} ${oy + 10} ${ox - 16} ${oy + 1}Z`;
  const ceja = e.ceja != null ? `M${ox - 15} ${oy - 13 + e.ceja * 0.4}Q${ox - 1} ${r1(oy - 22 + e.ceja)} ${ox + 15} ${r1(oy - 15 + e.ceja * 0.3)}` : null;
  const cerrado = ojosCerrados || e.guino;
  const elementosCeja = ceja && <Path d={ceja} stroke={TINTA} strokeWidth={2.4} strokeLinecap="round" fill="none" />;
  if (cerrado) {
    // párpado del color de la cabeza que se funde; solo la línea de pestañas
    const arriba = e.alegre > 0 || e.guino; // «^» feliz / guiño
    const linea = e.guino && !ojosCerrados
      ? `M${ox - Rr + 1} ${oy + 4}Q${ox - 1} ${oy - 10} ${ox + Rr} ${oy + 1}`
      : arriba
      ? `M${ox - Rr + 1} ${oy + 3}Q${ox} ${oy - 8} ${ox + Rr - 1} ${oy + 3}`
      : `M${ox - Rr + 1} ${oy - 1}Q${ox} ${oy + 6} ${ox + Rr - 1} ${oy - 1}`;
    const brillo = arriba
      ? `M${ox - 6} ${oy - 6}Q${ox} ${oy - 10} ${ox + 6} ${oy - 6}`
      : `M${ox - 6} ${oy - 5}Q${ox} ${oy - 8} ${ox + 6} ${oy - 5}`;
    // con el ojo cerrado solo queda la raya oscura hacia la comisura
    const raya = `M${ox + 6} ${oy - 2}C${ox + 16} ${oy - 4} ${ox + 25} ${oy - 2} ${ox + 31} ${oy + 1}L${ox + 31} ${oy + 5}C${ox + 22} ${oy + 5} ${ox + 14} ${oy + 6} ${ox + 6} ${oy + 5}Z`;
    return (
      <G>
        <Path d={raya} fill="url(#pishku_antifaz)" />
        <Circle cx={ox} cy={oy - 1} r={Rr + 3} fill="url(#pishku_parpadoC)" />
        <Path d={brillo} stroke="#b8f080" strokeWidth={1.4} strokeOpacity={0.6} fill="none" strokeLinecap="round" />
        <Path d={linea} stroke={TINTA} strokeWidth={2.4} fill="none" strokeLinecap="round" />
        {elementosCeja}
      </G>
    );
  }
  const [mx, my] = e.mira;
  const sorpresa = R > 11;
  const yBorde = oy - Rr + e.parpado * 2 * Rr;
  const sup = e.parpado > 0 ? parpadoSup(ox, oy, Rr, yBorde + e.inclina * Rr * 0.6, yBorde - e.inclina * Rr * 0.6, 2.5) : null;
  const inf = e.alegre > 0 ? parpadoInf(ox, oy, Rr, oy + Rr * (1.05 - e.alegre * 0.95), Rr * 0.95 * e.alegre + 2) : null;
  const pupila = R * (sorpresa ? 0.4 : 0.55);
  return (
    <G>
      <Path d={antifaz} fill="url(#pishku_antifaz)" />
      {/* anillo de piel gris pálido; más claro hacia la nuca */}
      <Circle cx={ox} cy={oy} r={Rr} fill="#9a928c" stroke={TINTA} strokeWidth={1.3} />
      <Path d={`M${ox - 3} ${oy - Rr + 0.8}A${Rr - 0.8} ${Rr - 0.8} 0 0 0 ${ox - 3} ${oy + Rr - 0.8}`} stroke="#e8e0d8" strokeWidth={sorpresa ? 2.2 : 1.6} strokeOpacity={0.85} fill="none" />
      <Circle cx={ox} cy={oy} r={R} fill="url(#pishku_iris)" />
      <Circle cx={ox + mx} cy={oy + my} r={pupila} fill="#050404" />
      <Path d={`M${ox - R * 0.7} ${oy + R * 0.45}Q${ox} ${oy + R * 0.95} ${ox + R * 0.7} ${oy + R * 0.45}`} stroke="#8a90a8" strokeWidth={1} strokeOpacity={0.3} fill="none" strokeLinecap="round" />
      <Circle cx={ox + mx + R * 0.3} cy={oy + my - R * 0.33} r={R * (sorpresa ? 0.22 : 0.27)} fill="#ffffff" />
      <Circle cx={ox + mx - R * 0.32} cy={oy + my + R * 0.3} r={R * (sorpresa ? 0.14 : 0.1)} fill="#ffffff" fillOpacity={0.85} />
      {sup && <Path d={sup.d} fill="url(#pishku_parpado)" />}
      {sup && <Path d={sup.borde} stroke={TINTA} strokeWidth={2} fill="none" strokeLinecap="round" />}
      {inf && <Path d={inf.d} fill="url(#pishku_parpado)" />}
      {inf && <Path d={inf.borde} stroke={TINTA} strokeWidth={1.3} strokeOpacity={0.8} fill="none" strokeLinecap="round" />}
      {/* ojo alegre: párpado superior grueso y mejilla alzada con luz */}
      {e.alegre > 0 && <Path d={`M${ox - Rr} ${oy + 1}A${Rr} ${Rr} 0 0 1 ${ox + Rr} ${oy + 1}`} stroke={TINTA} strokeWidth={2.8} fill="none" strokeLinecap="round" />}
      {e.alegre > 0 && <Path d={`M${ox - Rr + 1} ${oy + Rr * 0.5 + 6}Q${ox} ${oy + Rr * 0.5 - 3} ${ox + Rr - 1} ${oy + Rr * 0.5 + 6}`} stroke="#c8f08a" strokeWidth={2} strokeOpacity={0.7} fill="none" strokeLinecap="round" />}
      {elementosCeja}
    </G>
  );
}

function Pico({ e }) {
  const inf = rotar(PICO_INF, e.pico, BISAGRA);
  const sup = rotar(PICO_SUP, e.picoSup, [461, 120]);
  // interior de la boca (rojo vino), solo cerca de la comisura
  const sb = rotar([[482, 121], [500, 112.5]], e.picoSup, [461, 120]);
  const ib = rotar([[500, 135], [480, 135], [459, 135]], e.pico, BISAGRA);
  const boca = `M460 131L${P(sb[0])}L${P(sb[1])}Q${P([(sb[1][0] + ib[0][0]) / 2 - 10, (sb[1][1] + ib[0][1]) / 2])} ${P(ib[0])}L${P(ib[1])}L${P(ib[2])}Z`;
  const brilloInf = rotar([[470, 137], [544, 132]], e.pico, BISAGRA);
  const brilloSup = rotar([[486, 108], [514, 100.5], [538, 94]], e.picoSup, [461, 120]);
  return (
    <G>
      {e.pico > -6 && <Path d={boca} fill="#5a161a" />}
      <Path d={PICO_INF_D(inf)} fill="url(#pishku_pico)" stroke={TINTA} strokeWidth={1.5} strokeLinejoin="round" />
      <Path d={PICO_SUP_D(sup)} fill="url(#pishku_pico)" stroke={TINTA} strokeWidth={1.5} strokeLinejoin="round" />
      {/* brillos del pico */}
      <Path d={`M${P(brilloSup[0])}Q${P(brilloSup[1])} ${P(brilloSup[2])}`} stroke="#ffb09a" strokeWidth={1.4} strokeOpacity={0.65} fill="none" strokeLinecap="round" />
      <Path d={`M${P(brilloInf[0])}L${P(brilloInf[1])}`} stroke="#f49a7a" strokeWidth={1.1} strokeOpacity={0.55} strokeLinecap="round" />
    </G>
  );
}

function AlaDelanteraPiezas() {
  const plumas = ALA_D_PLUMAS.slice().reverse();
  const sil = curva(ALA_D_SIL);
  const todas = [...ALA_D_PLUMAS, ALULA];
  return (
    <G>
      {/* primera pasada: tinta gruesa que solo asoma en el contorno exterior */}
      <Path d={plumas.map(({ B, T, wb, wt, c }) => pluma(B, T, wb, wt, c)).join('')} fill={TINTA} stroke={TINTA} strokeWidth={2.6} strokeLinejoin="round" />
      <Path d={sil} fill="url(#pishku_alaD)" />
      {plumas.map(({ B, T, wb, wt, c }, i) => (
        <React.Fragment key={`d${i}`}>
          <Path d={pluma(B, T, wb, wt, c)} fill="url(#pishku_alaD)" stroke="#2a1218" strokeWidth={1} strokeOpacity={0.45} strokeLinejoin="round" />
          <Path d={mediaPluma(B, T, wb, wt, c)} fill="#3a1a28" fillOpacity={0.2} />
        </React.Fragment>
      ))}
      <Path d={sil} fill="url(#pishku_alaSombra)" />
      <Path d={sil} fill="url(#pishku_arcoiris)" />
      <Path d={sil} fill="url(#pishku_alaOro)" />
      <Path d={pluma(ALULA.B, ALULA.T, ALULA.wb, ALULA.wt, ALULA.c)} fill="url(#pishku_alaD)" stroke="#4e2a32" strokeWidth={1} strokeOpacity={0.6} />
      <Path d={pluma(ALULA.B, ALULA.T, ALULA.wb, ALULA.wt, ALULA.c)} fill="#7a4650" fillOpacity={0.3} />
      <Path d={todas.map(({ B, T, c }) => raquis(B, T, c, 0.2, 0.93)).join('')} stroke="#5a2e38" strokeWidth={1} strokeOpacity={0.5} fill="none" />
      <Path d={todas.map(({ B, T, c }) => raquis(B, T, c + 1.5, 0.25, 0.88)).join('')} stroke="#fff2d8" strokeWidth={0.7} strokeOpacity={0.5} fill="none" />
      {/* filo crema en las puntas */}
      <Path d={ALA_D_PLUMAS.map(({ B, T, wb, wt, c }) => filoPunta(B, T, wb, wt * 0.82, c)).join('')} stroke="#fff0d8" strokeWidth={1} strokeOpacity={0.32} fill="none" strokeLinecap="round" />
      <Path d={BRILLOS} fill="#fffbe8" fillOpacity={0.85} />
      {/* luz del borde de ataque, solo sobre las rémiges */}
      <Path d="M58 49C110 62 170 88 232 118" stroke="#fff0d0" strokeWidth={1.4} strokeOpacity={0.45} fill="none" strokeLinecap="round" />
      <G clipPath="url(#pishku_clipAlaD)">
      {ALA_D_COB_GRUPOS.map(({ k, d, luz }, i) => (
        <React.Fragment key={`dc${i}`}>
          <Path d={d} fill={COB_TONO[k.split('|')[1]][0]} stroke={TINTA} strokeWidth={1.1} strokeOpacity={0.8} strokeLinejoin="round" />
          <Path d={luz} fill={COB_TONO[k.split('|')[1]][1]} fillOpacity={0.75} />
        </React.Fragment>
      ))}
      {/* brillo en la punta de cada cobertora */}
      <Path d={ALA_D_COB.filter(c => c.tipo !== 'ciruela').map(({ B, T, w }) => {
        const dx = T[0] - B[0], dy = T[1] - B[1], L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L;
        const a = [T[0] - ux * 10 - uy * w * 0.5, T[1] - uy * 10 + ux * w * 0.5], b = [T[0] - ux * 2.5, T[1] - uy * 2.5];
        return `M${P(a)}Q${P([T[0] - ux * 5 - uy * w * 0.55, T[1] - uy * 5 + ux * w * 0.55])} ${P(b)}`;
      }).join('')} stroke="#d6f06a" strokeWidth={1.3} strokeOpacity={0.45} fill="none" strokeLinecap="round" />
      <Path d={ALA_D_COB.filter(c => c.tipo === 'ciruela').map(({ B, T }) => raquis(B, T, 0, 0.3, 0.85)).join('')} stroke="#b896b0" strokeWidth={0.9} strokeOpacity={0.35} fill="none" />
      </G>
      <Path d={ALA_D_CONTORNO} fill="none" stroke={TINTA} strokeWidth={2.2} strokeLinejoin="round" strokeLinecap="round" />
    </G>
  );
}

export function PishkuAlaDelantera({ width, height, viewBox }) {
  return (
    <Svg width={width} height={height} viewBox={viewBox || VIEWBOX}>
      <Degradados />
      <AlaDelanteraPiezas />
    </Svg>
  );
}

export default function FiguraPishku({ width, height, animo = 'neutral', ojosCerrados = false, viewBox, sinAlaDelantera = false }) {
  const e = ANIMOS[animo] || ANIMOS.neutral;
  return (
    <Svg width={width} height={height} viewBox={viewBox || VIEWBOX}>
      <Degradados />
      <AlaTrasera />
      <Cola />
      <CoberterasCola />
      <Cuerpo />
      <Plumajes />
      <Patas />
      <Cresta tipo={e.cresta} />
      <Ojo e={e} ojosCerrados={ojosCerrados} />
      <Pico e={e} />
      {!sinAlaDelantera && <AlaDelanteraPiezas />}
    </Svg>
  );
}
