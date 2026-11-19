// FiguraKinti — Kinti, el Caminante, dibujado 100 % con primitivas SVG.
// Calca la silueta, el rostro y los colores del recorte
// assets/images/personajes/figuras/kinti.png (268 x 560), para que la figura
// calce en la misma posicion que el PNG (cabeza, manos, pies, piedra).
// Componente puro: sin hooks, sin estado, sin imagenes, sin filtros.
import React from 'react';
import Svg, {
  G, Path, Circle, Ellipse, Defs, LinearGradient, RadialGradient, Stop, ClipPath,
} from 'react-native-svg';

export const VIEWBOX = '0 0 268 560';
// Recorte cuadrado de cabeza y hombros (miniaturas de 26-64 px)
export const BUSTO_VIEWBOX = '66 -4 118 118';

const TINTA = '#1e140c';
const OCRE = '#b48a56';
const OXIDO = '#8a3a22';

// ---------------------------------------------------------------------------
// Ayudantes geometricos (se evaluan una vez al cargar el modulo)
// ---------------------------------------------------------------------------
const f1 = (v) => (Math.round(v * 10) / 10).toString();

// Curva suave Catmull-Rom que pasa por los puntos [x0,y0,x1,y1,...]
function suave(p, cerrado = true, tension = 1) {
  const n = p.length / 2;
  const P = (i) => {
    if (cerrado) { const k = ((i % n) + n) % n; return [p[2 * k], p[2 * k + 1]]; }
    const k = Math.max(0, Math.min(n - 1, i)); return [p[2 * k], p[2 * k + 1]];
  };
  let d = `M${f1(p[0])},${f1(p[1])}`;
  const tramos = cerrado ? n : n - 1;
  for (let i = 0; i < tramos; i++) {
    const p0 = P(i - 1); const p1 = P(i); const p2 = P(i + 1); const p3 = P(i + 2);
    const t = tension / 6;
    const c1 = [p1[0] + (p2[0] - p0[0]) * t, p1[1] + (p2[1] - p0[1]) * t];
    const c2 = [p2[0] - (p3[0] - p1[0]) * t, p2[1] - (p3[1] - p1[1]) * t];
    d += `C${f1(c1[0])},${f1(c1[1])} ${f1(c2[0])},${f1(c2[1])} ${f1(p2[0])},${f1(p2[1])}`;
  }
  return cerrado ? d + 'Z' : d;
}

const rombo = (cx, cy, w, h) =>
  `M${f1(cx)},${f1(cy - h)}L${f1(cx + w)},${f1(cy)}L${f1(cx)},${f1(cy + h)}L${f1(cx - w)},${f1(cy)}Z`;

const lerp = (a, b, t) => a + (b - a) * t;
// pseudoaleatorio determinista
const ruido = (i) => { const s = Math.sin(i * 12.9898 + 78.233) * 43758.5453; return s - Math.floor(s); };

// Puntos equiespaciados a lo largo de una polilinea
function muestrear(pl, paso) {
  const out = [];
  for (let i = 0; i < pl.length - 2; i += 2) {
    const x0 = pl[i]; const y0 = pl[i + 1]; const x1 = pl[i + 2]; const y1 = pl[i + 3];
    const L = Math.hypot(x1 - x0, y1 - y0); const k = Math.max(1, Math.round(L / paso));
    for (let j = 0; j < k; j++) out.push([lerp(x0, x1, j / k), lerp(y0, y1, j / k)]);
  }
  out.push([pl[pl.length - 2], pl[pl.length - 1]]);
  return out;
}

// Flecos: trazos cortos colgando de una linea de dobladillo
function flecos(pl, paso, largo, semilla) {
  let d = '';
  muestrear(pl, paso).forEach(([x, y], i) => {
    const l = largo * (0.75 + 0.45 * ruido(i + semilla));
    const dx = (ruido(i * 3 + semilla) - 0.5) * 2.2;
    d += `M${f1(x)},${f1(y)}l${f1(dx)},${f1(l)}`;
  });
  return d;
}

function enPolilinea(pl, t) {
  const seg = []; let tot = 0;
  for (let i = 0; i < pl.length - 2; i += 2) {
    const L = Math.hypot(pl[i + 2] - pl[i], pl[i + 3] - pl[i + 1]); seg.push(L); tot += L;
  }
  let d = t * tot;
  for (let k = 0; k < seg.length; k++) {
    if (d <= seg[k] || k === seg.length - 1) {
      const u = Math.min(1, d / seg[k]);
      return [lerp(pl[2 * k], pl[2 * k + 2], u), lerp(pl[2 * k + 1], pl[2 * k + 3], u)];
    }
    d -= seg[k];
  }
  return [pl[pl.length - 2], pl[pl.length - 1]];
}
const bez = (a, b, c, d, u) => {
  const v = 1 - u;
  return [
    v * v * v * a[0] + 3 * v * v * u * b[0] + 3 * v * u * u * c[0] + u * u * u * d[0],
    v * v * v * a[1] + 3 * v * v * u * b[1] + 3 * v * u * u * c[1] + u * u * u * d[1],
  ];
};

// Muestrea una curva (funcion u -> [x,y]) a pasos de longitud ~igual,
// devolviendo punto, tangente y normal unitarias.
function recorrer(fn, paso) {
  const fino = []; for (let i = 0; i <= 80; i++) fino.push(fn(i / 80));
  const acum = [0];
  for (let i = 1; i < fino.length; i++) acum.push(acum[i - 1] + Math.hypot(fino[i][0] - fino[i - 1][0], fino[i][1] - fino[i - 1][1]));
  const L = acum[acum.length - 1]; const n = Math.max(2, Math.round(L / paso));
  const out = []; let j = 1;
  for (let k = 0; k <= n; k++) {
    const s = (k / n) * L;
    while (j < acum.length - 1 && acum[j] < s) j++;
    const a = fino[j - 1]; const b = fino[j];
    const u = (s - acum[j - 1]) / ((acum[j] - acum[j - 1]) || 1);
    const tx = b[0] - a[0]; const ty = b[1] - a[1]; const tl = Math.hypot(tx, ty) || 1;
    out.push({ x: lerp(a[0], b[0], u), y: lerp(a[1], b[1], u), tx: tx / tl, ty: ty / tl, nx: -ty / tl, ny: tx / tl });
  }
  return out;
}
const linea = (pts, off) => pts.map((p, i) => `${i ? 'L' : 'M'}${f1(p.x + p.nx * off)},${f1(p.y + p.ny * off)}`).join('');
const zigzag = (pts, amp) => pts.map((p, i) => { const s = i % 2 ? amp : -amp; return `${i ? 'L' : 'M'}${f1(p.x + p.nx * s)},${f1(p.y + p.ny * s)}`; }).join('');
const rombosEn = (pts, a, b, cada = 1) => pts.filter((p, i) => i % cada === 0 && i > 0 && i < pts.length - 1).map((p) =>
  `M${f1(p.x + p.tx * a)},${f1(p.y + p.ty * a)}L${f1(p.x + p.nx * b)},${f1(p.y + p.ny * b)}L${f1(p.x - p.tx * a)},${f1(p.y - p.ty * a)}L${f1(p.x - p.nx * b)},${f1(p.y - p.ny * b)}Z`).join('');

// ---------------------------------------------------------------------------
// Formas base (coordenadas del viewBox 268 x 560)
// ---------------------------------------------------------------------------

// Piedra plana bajo los pies
const PIEDRA = suave([
  48, 478, 23, 477, 15, 486, 19, 497, 25, 506, 12, 517, 2, 529, 6, 540, 22, 546, 36, 555,
  62, 551, 104, 551, 140, 548, 162, 556, 184, 551, 216, 547, 245, 543, 264, 545, 261, 533,
  265, 522, 244, 519, 233, 510, 214, 506, 192, 494, 176, 482, 130, 479, 90, 480,
]);
const PIEDRA_CARA = suave([
  26, 482, 60, 479, 120, 482, 175, 486, 205, 500, 232, 514, 214, 522, 160, 524, 100, 520,
  50, 516, 24, 508, 20, 494,
]);
// Manchas de la textura de la piedra
const PIEDRA_MANCHAS = (() => {
  let d = '';
  for (let i = 0; i < 26; i++) {
    const x = 20 + ruido(i * 7 + 1) * 225; const y = 490 + ruido(i * 5 + 2) * 50;
    const rx = 1.5 + ruido(i + 9) * 4; const ry = rx * 0.45;
    d += `M${f1(x - rx)},${f1(y)}a${f1(rx)},${f1(ry)} 0 1,0 ${f1(rx * 2)},0a${f1(rx)},${f1(ry)} 0 1,0 ${f1(-rx * 2)},0Z`;
  }
  return d;
})();

// Piernas
const PIERNA_I = suave([
  70, 300, 112, 300, 124, 350, 118, 372, 108, 395, 103, 420, 102, 452, 100, 468, 60, 470,
  54, 452, 57, 424, 60, 400, 63, 380, 64, 342,
]);
const PIERNA_D = suave([
  122, 300, 182, 300, 183, 352, 182, 395, 180, 432, 182, 452, 178, 470, 134, 470, 133, 452,
  134, 420, 133, 390, 128, 360,
]);
const PUNO_I = suave([52, 452, 76, 449, 102, 452, 103, 462, 100, 472, 78, 474, 54, 472, 51, 462]);
const PUNO_D = suave([133, 453, 158, 450, 183, 450, 184, 461, 180, 475, 156, 476, 134, 473, 132, 463]);

// Alpargatas tejidas: izquierda en escorzo (punta hacia abajo-izquierda),
// derecha de lado (punta a la derecha)
const SANDALIA_I = suave([
  64, 497, 74, 492, 88, 493, 97, 497, 101, 507, 102, 520, 99, 531, 91, 539, 77, 543, 63, 541,
  55, 533, 55, 520, 59, 507,
]);
const SANDALIA_D = suave([
  143, 493, 152, 487, 167, 491, 182, 495, 198, 500, 212, 506, 218, 514, 212, 520, 190, 521,
  165, 518, 146, 514, 140, 504,
]);

// Coleta y pelo de atras (masa del pelo detras de la cabeza)
const PELO_ATRAS = suave([
  118, 2, 136, 2, 152, 7, 162, 16, 167, 28, 166, 42, 160, 50, 140, 50, 112, 56, 104, 70,
  98, 80, 93, 88, 88, 96, 83, 100, 79, 94, 81, 86, 82, 76, 78, 62, 77, 46, 79, 30, 86, 16,
  96, 8, 106, 4,
]);
// Mechones sueltos que asoman del contorno (puntas)
const PELO_PUNTAS = 'M97,8Q92,4.4 88,3.2M145,3.4Q148.6,0.8 152.6,0.6M161,11Q165,8.6 169.4,9.4M81.4,62Q77.6,64 75,67.6M166.6,28Q169.6,30 170.6,33.6';

// Poncho: contorno completo (sin flecos)
const PONCHO = suave([
  108, 103, 96, 104, 76, 108, 60, 115, 52, 124, 38, 150, 26, 175, 17, 200, 15, 235, 15, 268,
  12, 298, 14, 318, 22, 333, 32, 347, 40, 354, 55, 347, 75, 344, 95, 337, 116, 324, 135, 310,
  148, 302, 165, 314, 182, 330, 192, 344, 198, 343, 201, 330, 202, 295, 212, 268, 217, 240,
  212, 226, 207, 205, 203, 190, 196, 177, 190, 162, 183, 140, 174, 124, 160, 112, 146, 103,
  142, 120, 138, 136, 128, 122, 116, 110,
]);
// Linea del dobladillo para los flecos (de izquierda a derecha)
const HEM_I = [26, 340, 40, 354, 55, 347, 75, 344, 95, 337, 116, 324, 135, 310, 147, 302];
const HEM_D = [149, 303, 165, 314, 182, 330, 192, 344, 198, 343];

// Interior oscuro del poncho bajo el brazo derecho
const HUECO_D = suave([188, 233, 213, 231, 211, 262, 203, 292, 200, 336, 192, 330, 188, 292, 186, 256]);
// Sombra bajo el brazo izquierdo
const HUECO_I = suave([52, 228, 100, 226, 112, 238, 104, 250, 60, 252, 44, 242]);

// Panel derecho (borde frontal del poncho que cae vertical)
const PANEL_D = suave([
  146, 103, 160, 112, 174, 124, 183, 140, 190, 162, 196, 177, 203, 190, 207, 205, 212, 226,
  188, 232, 184, 260, 186, 300, 190, 334, 182, 330, 165, 314, 150, 303, 148, 250, 147, 200,
  146, 150,
], true, 0.6);

// Correa de la mochila: del hombro a la mochila (pasa bajo la mano)
const CORREA = [153, 104, 154, 140, 147, 184, 137, 214, 122, 243, 110, 258];

// Mochila tejida: bolsa redondeada, mas ancha abajo, con solapa
const MOCHILA = suave([
  48, 247, 80, 245, 110, 250, 112, 272, 107, 300, 101, 321, 91, 331, 72, 335, 52, 331,
  39, 320, 33, 301, 35, 279, 42, 259,
], true, 0.9);
const SOLAPA = suave([46, 246, 80, 244, 111, 249, 111, 258, 110, 266, 80, 264, 44, 262, 45, 254], true, 0.5);
// Fuelle lateral: la correa baja por el costado derecho de la bolsa
const FUELLE = [111, 254, 109, 280, 104, 304, 97, 328];

// Manga y mano izquierda (agarra la correa)
const MANGA_I = suave([58, 210, 80, 205, 101, 203, 106, 216, 103, 229, 82, 233, 62, 234, 54, 224]);
const MANO_I = suave([
  103, 207, 110, 200, 121, 196, 133, 195, 141, 196.5, 145.5, 200, 147.5, 204, 146, 207.5, 147.6, 211.5,
  145.6, 214.5, 146.6, 218.2, 144.2, 221, 144, 224, 139, 226.5, 126, 227, 113, 225, 105, 220, 102, 213,
], true, 0.9);
// Manga y mano derecha (palma arriba, dedos que rodean el glifo)
const MANGA_D = suave([198, 203, 210, 199, 218, 206, 219, 220, 215, 230, 204, 233, 196, 222]);
const PALMA_D = suave([
  214, 213, 222, 211, 231, 210, 240, 212, 250, 214, 257, 218, 258, 226, 251, 232, 240, 236,
  227, 236, 217, 232,
], true, 0.9);
// Dedos: [x0,y0, cx,cy, x1,y1] (de la palma hacia la punta, curvados hacia arriba)
const DEDOS_D = [
  [240, 223, 237.4, 215, 239.6, 208.6], [245.4, 224, 244.2, 214, 246, 207.2], [250.8, 223.6, 251, 214, 252.6, 208],
  [255.8, 222, 258, 216, 257.6, 211],
];
const PULGAR_D = 'M224,217Q228,209 234.5,204.5';
// Glifo dorado: hoja irregular, ondulada y algo inclinada
const GLIFO = suave([
  229, 167, 236, 165, 243, 166.6, 250, 165, 256.5, 166.6, 255, 173, 256, 180, 253.6, 187,
  254, 193, 249, 197, 244, 199.5, 240, 204.5, 236.6, 201, 233, 197.5, 229, 195, 230, 188,
  227.6, 181, 229, 174,
], true, 0.6);

// Cara, cuello y oreja
const CUELLO = suave([107, 74, 122, 86, 140, 92, 144, 104, 141, 122, 137, 138, 124, 124, 112, 108, 107, 90]);
const CARA = suave([
  105, 42, 111, 30, 125, 21, 145, 17, 159, 21, 165, 33, 165.5, 46, 164.5, 58, 162.5, 68, 159.6, 77,
  155, 85, 148.5, 90.5, 140, 92, 130, 89.5, 119.5, 83.5, 110.5, 75, 105.5, 65, 104, 53,
]);
const OREJA = suave([95.5, 53.5, 100.5, 55, 103.2, 61, 102.3, 69, 99.6, 74.6, 95.5, 75.6, 91.9, 70.6, 90.1, 61.6, 91.9, 55.6]);
// Flequillo: cubre la frente a la izquierda y deja ver una cuna de frente a la derecha
const FLEQUILLO = suave([
  78, 44, 79, 30, 84, 18, 93, 9, 105, 3, 120, 0.5, 136, 1, 150, 4, 160, 10, 166, 19, 168, 30,
  166, 42, 162.5, 35, 160, 28, 156, 25, 150, 24.6, 145.6, 27.4, 142.4, 32, 140.5, 38.5, 136.5, 31,
  132, 33.5, 127.5, 40, 124.5, 33, 120.5, 36, 117, 41.5, 113.5, 38, 109.5, 43, 108, 50, 107, 56,
  104, 54, 99, 51, 93, 52, 89, 57, 87, 66, 86, 76, 82, 70, 79, 58,
], true, 0.8);
// Separaciones entre mechones (lineas finas de la coronilla a las puntas)
const PELO_LINEAS =
  'M118,16Q125,24 125.5,37M109,20Q115,28 117,39M128,14Q137,22 140.5,37M99,22Q105,32 109.5,42' +
  'M90,26Q95,38 100,50M86,34Q84,50 87,70M152,12Q161,20 164.5,38M134,16Q136,24 133,33';
const PELO_BRILLOS = 'M104,10Q112,8 118,13M128,6Q136,6 141,11M89,27Q91,33 91,40M156,14Q160,18 161,24';

// ---------------------------------------------------------------------------
// Patrones del tejido (paths compuestos)
// ---------------------------------------------------------------------------

// Panel izquierdo: familia de curvas que nacen en la correa / escote, suben al
// hombro y bajan por el brazo hasta el dobladillo (el tejido que envuelve).
const BORDE_IN = [110, 106, 134, 132, 139, 170, 135, 215, 122, 250, 110, 300];
const BORDE_EXT = [62, 116, 44, 142, 28, 176, 18, 214, 15, 260, 14, 300, 18, 332, 40, 352, 80, 344, 106, 334];
function curvaIzq(t) {
  const S = enPolilinea(BORDE_IN, t);
  const E = enPolilinea(BORDE_EXT, Math.min(1, 0.1 + t * 0.95));
  const C1 = [lerp(S[0], E[0], 0.33), lerp(S[1], E[1], 0.33) - 6];
  const C2 = [lerp(S[0], E[0], 0.7), lerp(S[1], E[1], 0.7) - 3];
  return (u) => bez(S, C1, C2, E, u);
}
// Secuencia de bandas tejidas del panel izquierdo
const BANDAS_I = [
  [0.06, 'rombos'], [0.12, 'lineas'], [0.17, 'lineas'], [0.23, 'chevron'], [0.29, 'lineas'],
  [0.35, 'rombos'], [0.41, 'lineas'], [0.47, 'lineas'], [0.53, 'chevron'], [0.59, 'lineas'],
  [0.66, 'rombos'], [0.72, 'lineas'], [0.78, 'lineas'], [0.85, 'chevron'], [0.91, 'lineas'], [0.97, 'rombos'],
];
const TEJIDO_I = (() => {
  const g = { fondo: '', ocre: '', fino: '', rombos: '', rombosIn: '', chevron: '' };
  BANDAS_I.forEach(([t, tipo]) => {
    const pts = recorrer(curvaIzq(t), 2.8);
    if (tipo === 'lineas') {
      g.fino += linea(pts, -2.2) + linea(pts, 0) + linea(pts, 2.2);
    } else {
      g.fondo += linea(pts, 0);
      g.ocre += linea(pts, -4) + linea(pts, 4);
      if (tipo === 'rombos') {
        g.rombos += rombosEn(pts, 2.8, 2.8, 2);
        g.rombosIn += rombosEn(pts, 1, 1, 2);
      } else {
        g.chevron += zigzag(pts, 2.4);
      }
    }
  });
  return g;
})();
// Racimo de rombos rojos concentricos en el pecho izquierdo
const RACIMO = [[107, 158], [118, 180]];
const RACIMO_1 = RACIMO.map(([x, y]) => rombo(x, y, 10, 13)).join('');
const RACIMO_2 = RACIMO.map(([x, y]) => rombo(x, y, 6.8, 9)).join('');
const RACIMO_3 = RACIMO.map(([x, y]) => rombo(x, y, 3.6, 5)).join('');
// Banda de rombos a lo largo del escote en V (lado izquierdo)
const ESCOTE = recorrer((u) => [lerp(112, 134, u), lerp(110, 136, u)], 4.5);
const ESCOTE_BANDA = linea(ESCOTE, 0);
const ESCOTE_ROMBOS = rombosEn(ESCOTE, 2.2, 2.3);

// Cadenas de rombos (bandas verticales)
function cadena(x0, y0, x1, y1, n, w, h) {
  let d = '';
  for (let i = 0; i < n; i++) {
    const t = (i + 0.5) / n;
    d += rombo(lerp(x0, x1, t), lerp(y0, y1, t), w, h);
  }
  return d;
}
// Columna principal de rombos grandes (centro oscuro) y columna fina
const ROMBOS_D_1 = cadena(163, 124, 168, 304, 8, 7.5, 11.2);
const ROMBOS_D_2 = cadena(163, 124, 168, 304, 8, 4.6, 7);
const ROMBOS_D_3 = cadena(163, 124, 168, 304, 8, 2, 3);
const ROMBOS_D_FINOS = cadena(181, 150, 186, 236, 9, 2.6, 4.6);
// Lineas verticales del panel derecho (franjas finas)
const LINEAS_D = (() => {
  let d = '';
  [152.5, 155, 175, 177.5, 191, 193.5].forEach((x, i) => {
    d += `M${x},${108 + i * 4}Q${x + 3},220 ${x + (i < 4 ? 2 : -2)},${305 + i * 5}`;
  });
  return d;
})();
// Franjas oxido del panel derecho
const FRANJAS_D = 'M158.5,110Q161,210 159,306M172,124Q175,220 174,318';
// Banda frontal del poncho (bajo la mano)
const BANDA_FRONTAL = cadena(148, 232, 150, 300, 6, 2.8, 5.5);

// Pliegues de caida: del hombro al fleco
const PLIEGUES = 'M46,150Q34,240 30,336M70,170Q62,250 60,342M96,230Q92,290 92,336' +
  'M128,140Q136,210 132,300M178,140Q184,200 182,248';
const PLIEGUES_LUZ = 'M56,140Q46,230 42,330M82,200Q76,270 76,338M168,128Q186,160 192,190M196,182Q204,200 208,222';

const FLECOS_I = flecos(HEM_I, 2.4, 11, 3);
const FLECOS_D = flecos(HEM_D, 2.4, 12, 41);

// Mochila: bandas y motivos
// Celosia ocre (rombitos en rejilla) entre y0 e y1
function celosia(y0, y1, x0, x1, paso) {
  let d = ''; const h = y1 - y0;
  for (let x = x0 - h; x < x1; x += paso) {
    d += `M${f1(x)},${y0}L${f1(x + h)},${y1}M${f1(x + h)},${y0}L${f1(x)},${y1}`;
  }
  return d;
}
const MOCHILA_CELOSIA = celosia(251, 262, 34, 114, 4.4) + celosia(305, 313, 30, 112, 4.4);
const MOCHILA_PUNTOS = (() => {
  let d = '';
  for (let x = 38; x <= 110; x += 4.2) d += `M${f1(x)},268h2`;
  for (let x = 34; x <= 108; x += 4.2) d += `M${f1(x)},302h2`;
  return d;
})();
// Gran X roja y rombo central
const MOCHILA_X = 'M38,272L104,300M38,300L104,272';
const MOCHILA_ROMBO_1 = rombo(71, 286, 13, 11);
const MOCHILA_ROMBO_2 = rombo(71, 286, 8, 6.8);
const MOCHILA_ROMBO_3 = rombo(71, 286, 3.4, 3);
// Crucecitas en los triangulos
const MOCHILA_CRUCES = [[48, 286], [94, 286], [71, 276.2], [71, 296]].map(([x, y]) =>
  `M${x - 2.2},${y}h4.4M${x},${y - 2.2}v4.4`).join('');
const FUELLE_PUNTOS = (() => {
  let d = '';
  muestrear(FUELLE, 5).forEach(([x, y], i) => { if (i % 1 === 0) d += `M${f1(x - 1.2)},${f1(y)}a1.2,1.8 0 1,0 2.4,0a1.2,1.8 0 1,0 -2.4,0Z`; });
  return d;
})();
// Tejido de la correa (zigzag ocre)
const CORREA_ZIG = zigzag(recorrer((u) => enPolilinea(CORREA, u), 2.6), 1.8);

// ---------------------------------------------------------------------------
// Rostro y expresiones
// ---------------------------------------------------------------------------
// Ojo izquierdo (del espectador) mas ancho; el derecho se acorta por el giro 3/4
const OJO_I = { cx: 128.2, cy: 50.2, w: 7.6, h: 4.9 };
const OJO_D = { cx: 154.4, cy: 49.6, w: 5.3, h: 4.6 };
// Cejas: [inicio, cima, fin]
const CEJA_I = [[116.5, 42.8], [126, 37.2], [137.6, 40]];
const CEJA_D = [[146, 39.6], [153.4, 36.4], [161.8, 40.6]];

const ANIMOS = {
  neutral: { abre: 1, cejaI: [0, 0, 0], cejaD: [0, 0, 0], boca: 'neutral', mira: [1.4, -1] },
  feliz: { abre: 0.95, cejaI: [-1.4, -0.6, -1], cejaD: [-1.4, -1, -0.6], boca: 'sonrisa', mira: [1.2, -0.6], sonrie: true },
  pensativo: { abre: 0.9, cejaI: [1.6, 0.6, -0.4], cejaD: [-3, -2, -1], boca: 'ladeada', mira: [-1.8, -1.8] },
  sorprendido: { abre: 1.22, cejaI: [-4, -3.4, -3], cejaD: [-4, -3, -3.4], boca: 'o', mira: [0.4, -0.4] },
  travieso: { abre: 0.92, cejaI: [-2.6, -1.4, -3], cejaD: [1.6, 1.2, 1], boca: 'picara', mira: [2, -0.4], guino: true },
};

function ojo(o, A, cerrado, clipId, guino) {
  const { cx, cy, w } = o; const h = o.h * A.abre;
  if (cerrado || guino) {
    // guino: parpado curvado hacia arriba (feliz); cerrado: curva hacia abajo
    const d = guino
      ? `M${f1(cx - w)},${f1(cy + 1)}Q${f1(cx)},${f1(cy - 3.2)} ${f1(cx + w)},${f1(cy + 0.4)}`
      : `M${f1(cx - w)},${f1(cy)}Q${f1(cx)},${f1(cy + 3.2)} ${f1(cx + w)},${f1(cy - 0.6)}`;
    return (
      <G>
        <Path d={d} stroke={TINTA} strokeWidth={1.6} fill="none" strokeLinecap="round" />
        <Path d={`M${f1(cx + w - 0.4)},${f1(cy - 0.4)}l2,-1`} stroke={TINTA} strokeWidth={1.1} strokeLinecap="round" />
        <Path d={`M${f1(cx - w * 0.8)},${f1(cy - 3.4)}Q${f1(cx)},${f1(cy - 5)} ${f1(cx + w * 0.9)},${f1(cy - 3.2)}`} stroke="#5a2a16" strokeWidth={0.8} fill="none" opacity={0.5} />
      </G>
    );
  }
  const sup = `M${f1(cx - w)},${f1(cy + 0.9)}C${f1(cx - w * 0.6)},${f1(cy - h * 1.15)} ${f1(cx + w * 0.4)},${f1(cy - h * 1.3)} ${f1(cx + w)},${f1(cy - h * 0.12)}`;
  const inf = `Q${f1(cx + w * 0.05)},${f1(cy + h * (A.sonrie ? 0.45 : 1.0))} ${f1(cx - w)},${f1(cy + 0.9)}`;
  const forma = `${sup}${inf}Z`;
  const r = 3.5 + w * 0.08;
  const ix = cx + A.mira[0] * (w / 7.6); const iy = cy - h * 0.18 + A.mira[1] * 0.55;
  return (
    <G>
      <ClipPath id={clipId}><Path d={forma} /></ClipPath>
      <Path d={forma} fill="#e8d9c2" />
      <G clipPath={`url(#${clipId})`}>
        <Path d={forma} fill="#a8866a" opacity={0.5} transform={`translate(0 ${f1(-h * 0.62)})`} />
        <Ellipse cx={ix} cy={iy} rx={r * Math.min(1, 0.6 + w / 19)} ry={r} fill="url(#kinti_iris)" />
        <Ellipse cx={ix} cy={iy} rx={r * 0.46 * Math.min(1, 0.6 + w / 19)} ry={r * 0.46} fill="#0c0704" />
        <Path d={`M${f1(cx - w)},${f1(cy - h * 0.4)}Q${f1(cx)},${f1(cy - h * 1.1)} ${f1(cx + w)},${f1(cy - h * 0.6)}L${f1(cx + w)},${f1(cy - h * 2)}L${f1(cx - w)},${f1(cy - h * 2)}Z`} fill="#3a1e10" opacity={0.28} />
      </G>
      <Circle cx={ix + r * 0.38} cy={iy - r * 0.42} r={r * 0.3} fill="#ffffff" />
      <Circle cx={ix - r * 0.4} cy={iy + r * 0.38} r={r * 0.13} fill="#ffffff" opacity={0.75} />
      {/* parpado superior fino, mas grueso hacia el rabillo, y pestana */}
      <Path d={sup} stroke={TINTA} strokeWidth={1.35} fill="none" strokeLinecap="round" />
      <Path d={`M${f1(cx - w * 0.1)},${f1(cy - h * 1.02)}Q${f1(cx + w * 0.6)},${f1(cy - h * 0.98)} ${f1(cx + w)},${f1(cy - h * 0.12)}`} stroke={TINTA} strokeWidth={1.1} fill="none" strokeLinecap="round" />
      <Path d={`M${f1(cx + w - 0.3)},${f1(cy - h * 0.15)}l2.1,-1.3`} stroke={TINTA} strokeWidth={1.1} strokeLinecap="round" />
      {/* pliegue del parpado y parpado inferior */}
      <Path d={`M${f1(cx - w * 0.75)},${f1(cy - h - 1.6)}Q${f1(cx)},${f1(cy - h * 1.55 - 1.6)} ${f1(cx + w * 0.85)},${f1(cy - h * 0.8 - 1.4)}`} stroke="#4e2414" strokeWidth={0.8} fill="none" opacity={0.55} />
      <Path d={A.sonrie
        ? `M${f1(cx - w * 0.9)},${f1(cy + 1.8)}Q${f1(cx)},${f1(cy - h * 0.05 + 1.2)} ${f1(cx + w * 0.85)},${f1(cy + 0.8)}`
        : `M${f1(cx - w * 0.7)},${f1(cy + 1.8)}Q${f1(cx)},${f1(cy + h + 1.3)} ${f1(cx + w * 0.8)},${f1(cy + 0.8)}`}
        stroke="#6a341e" strokeWidth={0.8} fill="none" opacity={0.6} />
    </G>
  );
}

// Ceja gruesa y arqueada, afinada hacia la sien
function ceja(pts, aj, grosor) {
  const [[x0, y0], [xk, yk], [x1, y1]] = pts;
  const [dIn, dK, dOut] = aj;
  const a = [x0, y0 + dIn]; const k = [xk, yk + dK]; const b = [x1, y1 + dOut];
  // punto de control de la cuadratica para que la curva pase por la cima
  const qx = 2 * k[0] - (a[0] + b[0]) / 2; const qy = 2 * k[1] - (a[1] + b[1]) / 2;
  const d = `M${f1(a[0])},${f1(a[1] - grosor * 0.45)}Q${f1(qx)},${f1(qy - grosor * 0.5)} ${f1(b[0])},${f1(b[1])}` +
    `Q${f1(qx)},${f1(qy + grosor * 1.05)} ${f1(a[0])},${f1(a[1] + grosor * 0.55)}Z`;
  return <Path d={d} fill="#1b120b" stroke="#1b120b" strokeWidth={0.5} strokeLinejoin="round" />;
}

function boca(tipo) {
  switch (tipo) {
    case 'sonrisa':
      return (
        <G>
          <Path d="M135,73.6Q145,86 156.5,72Q146,77.4 135,73.6Z" fill="#561f14" stroke="#2a120a" strokeWidth={1.1} strokeLinejoin="round" />
          <Path d="M137.8,75Q146,78.6 154,73.8L153.4,75.8Q146,80.2 138.4,76.6Z" fill="#f4ead8" />
          <Path d="M139,80.4Q146,84.6 152.6,79" stroke="#a65e3c" strokeWidth={1.5} fill="none" strokeLinecap="round" />
          <Path d="M133.4,72.6Q135,71.4 136.6,73.8M155.6,70.8Q157.6,70 158.4,72.4" stroke="#5a2a16" strokeWidth={0.9} fill="none" />
          <Path d="M141,86.4Q147,88.4 152,85.4" stroke="#5e2e1a" strokeWidth={0.9} fill="none" opacity={0.5} />
        </G>
      );
    case 'o':
      return (
        <G>
          <Ellipse cx={145.6} cy={78} rx={3.8} ry={4.8} fill="#4a1a10" stroke="#2a120a" strokeWidth={1.2} />
          <Ellipse cx={145.6} cy={80} rx={2.4} ry={2} fill="#a0493a" />
          <Path d="M141.4,73.4Q145.6,72 149.8,73.4" stroke="#7c3c26" strokeWidth={1.2} fill="none" opacity={0.8} />
        </G>
      );
    case 'ladeada':
      return (
        <G>
          <Path d="M137,76.8Q141,75.6 146,76Q150.6,74.8 154.4,73" stroke="#3a160c" strokeWidth={1.3} fill="none" strokeLinecap="round" />
          <Path d="M139.6,77.6Q146.4,81.8 152.4,76" stroke="#a65e3c" strokeWidth={2} fill="none" strokeLinecap="round" />
          <Path d="M142.6,78.6Q146.4,80 149.6,78" stroke="#d8956a" strokeWidth={0.8} fill="none" opacity={0.8} />
          <Path d="M154.4,73Q156.4,72.4 157,74.2" stroke="#5a2a16" strokeWidth={0.9} fill="none" />
        </G>
      );
    case 'picara':
      return (
        <G>
          <Path d="M136.6,76Q145,78.4 155.6,71.6" stroke="#3a160c" strokeWidth={1.4} fill="none" strokeLinecap="round" />
          <Path d="M154.2,72.6Q157.4,72.2 157.2,69.6" stroke="#3a160c" strokeWidth={1.1} fill="none" strokeLinecap="round" />
          <Path d="M139.6,77.6Q146.6,82 153,76.4" stroke="#a65e3c" strokeWidth={2} fill="none" strokeLinecap="round" />
          <Path d="M143,79Q146.6,80.4 150,78.6" stroke="#d8956a" strokeWidth={0.8} fill="none" opacity={0.8} />
        </G>
      );
    default:
      return (
        <G>
          {/* labio superior, comisura y labio inferior lleno y mas claro */}
          <Path d="M135.6,75.6Q139.6,72.8 144,73.4Q146,72.4 148.4,73.2Q152.4,72.4 155,74.4Q146,75.8 135.6,75.6Z" fill="#7a3a24" />
          <Path d="M135.4,75.6Q145,76.6 155.2,74.9" stroke="#3a160c" strokeWidth={1.25} fill="none" strokeLinecap="round" />
          <Path d="M137.4,76.3Q146,83 154,75.8Q146,77.4 137.4,76.3Z" fill="#94502f" />
          <Path d="M141.4,78.6Q146,80.4 150.4,78.2" stroke="#dc9a6c" strokeWidth={0.9} fill="none" opacity={0.85} />
          <Path d="M140.6,82.6Q146.4,84.6 151.4,81.8" stroke="#5e2e1a" strokeWidth={1.3} fill="none" opacity={0.45} />
        </G>
      );
  }
}

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------
export default function FiguraKinti({ width, height, animo = 'neutral', ojosCerrados = false, viewBox }) {
  const A = ANIMOS[animo] || ANIMOS.neutral;
  const guinoD = A.guino && !ojosCerrados;
  return (
    <Svg width={width} height={height} viewBox={viewBox || VIEWBOX}>
      <Defs>
        <RadialGradient id="kinti_piedra" cx="0.32" cy="0.15" r="0.95">
          <Stop offset="0" stopColor="#9a978c" />
          <Stop offset="0.4" stopColor="#77766e" />
          <Stop offset="0.75" stopColor="#56564f" />
          <Stop offset="1" stopColor="#3a3a35" />
        </RadialGradient>
        <RadialGradient id="kinti_tierra" cx="0.5" cy="0.5" r="0.5">
          <Stop offset="0" stopColor="#80653f" stopOpacity="0.95" />
          <Stop offset="1" stopColor="#6a5232" stopOpacity="0" />
        </RadialGradient>
        <LinearGradient id="kinti_pantalon" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor="#3e3427" />
          <Stop offset="0.35" stopColor="#5e503b" />
          <Stop offset="0.7" stopColor="#71614a" />
          <Stop offset="1" stopColor="#4e4232" />
        </LinearGradient>
        <LinearGradient id="kinti_poncho" x1="0" y1="0" x2="1" y2="0.25">
          <Stop offset="0" stopColor="#3e2a1a" />
          <Stop offset="0.3" stopColor="#5c4027" />
          <Stop offset="0.65" stopColor="#6e4e2e" />
          <Stop offset="1" stopColor="#866038" />
        </LinearGradient>
        <LinearGradient id="kinti_panel" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor="#664028" />
          <Stop offset="0.6" stopColor="#7e5532" />
          <Stop offset="1" stopColor="#94693c" />
        </LinearGradient>
        <RadialGradient id="kinti_piel" cx="0.74" cy="0.5" r="0.78">
          <Stop offset="0" stopColor="#c4824e" />
          <Stop offset="0.4" stopColor="#a6653c" />
          <Stop offset="0.8" stopColor="#80452a" />
          <Stop offset="1" stopColor="#6c3923" />
        </RadialGradient>
        <RadialGradient id="kinti_sombra" cx="0.5" cy="0.5" r="0.5">
          <Stop offset="0" stopColor="#3e1a0c" stopOpacity="0.55" />
          <Stop offset="1" stopColor="#3e1a0c" stopOpacity="0" />
        </RadialGradient>
        <RadialGradient id="kinti_luz" cx="0.5" cy="0.5" r="0.5">
          <Stop offset="0" stopColor="#e4a46a" stopOpacity="0.7" />
          <Stop offset="1" stopColor="#e4a46a" stopOpacity="0" />
        </RadialGradient>
        <RadialGradient id="kinti_rubor" cx="0.5" cy="0.5" r="0.5">
          <Stop offset="0" stopColor="#b85a3c" stopOpacity="0.18" />
          <Stop offset="1" stopColor="#c0503a" stopOpacity="0" />
        </RadialGradient>
        <RadialGradient id="kinti_iris" cx="0.45" cy="0.65" r="0.6">
          <Stop offset="0" stopColor="#8a5530" />
          <Stop offset="0.6" stopColor="#5a3119" />
          <Stop offset="1" stopColor="#2c160b" />
        </RadialGradient>
        <LinearGradient id="kinti_cuello" x1="0" y1="0" x2="1" y2="0.3">
          <Stop offset="0" stopColor="#4e2818" />
          <Stop offset="0.6" stopColor="#7c4428" />
          <Stop offset="1" stopColor="#8e5432" />
        </LinearGradient>
        <LinearGradient id="kinti_mano" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#ac6c40" />
          <Stop offset="1" stopColor="#6e3e25" />
        </LinearGradient>
        <RadialGradient id="kinti_palma" cx="0.4" cy="0.3" r="0.8">
          <Stop offset="0" stopColor="#f4b066" />
          <Stop offset="0.5" stopColor="#c47a44" />
          <Stop offset="1" stopColor="#7a4428" />
        </RadialGradient>
        <LinearGradient id="kinti_pelo" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#2c2824" />
          <Stop offset="0.5" stopColor="#191612" />
          <Stop offset="1" stopColor="#0e0c09" />
        </LinearGradient>
        <LinearGradient id="kinti_manga" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#dcd2bc" />
          <Stop offset="1" stopColor="#968a72" />
        </LinearGradient>
        <LinearGradient id="kinti_mochila" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#9a6a3a" />
          <Stop offset="1" stopColor="#6a4224" />
        </LinearGradient>
        <RadialGradient id="kinti_halo" cx="0.5" cy="0.5" r="0.5">
          <Stop offset="0" stopColor="#fff6c0" stopOpacity="0.95" />
          <Stop offset="0.35" stopColor="#ffd968" stopOpacity="0.55" />
          <Stop offset="1" stopColor="#ffb830" stopOpacity="0" />
        </RadialGradient>
        <LinearGradient id="kinti_glifo" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#fffbe4" />
          <Stop offset="0.55" stopColor="#f2e0a0" />
          <Stop offset="1" stopColor="#dcb458" />
        </LinearGradient>
        <LinearGradient id="kinti_sandalia" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#a6744a" />
          <Stop offset="1" stopColor="#5e3d25" />
        </LinearGradient>
        <ClipPath id="kinti_clipPoncho"><Path d={PONCHO} /></ClipPath>
        <ClipPath id="kinti_clipPanel"><Path d={PANEL_D} /></ClipPath>
        <ClipPath id="kinti_clipMochila"><Path d={MOCHILA} /></ClipPath>
        <ClipPath id="kinti_clipCara"><Path d={CARA} /></ClipPath>
        <ClipPath id="kinti_clipPelo"><Path d={FLEQUILLO} /></ClipPath>
        <ClipPath id="kinti_clipPiedra"><Path d={PIEDRA} /></ClipPath>
        <ClipPath id="kinti_clipCuello"><Path d={CUELLO} /></ClipPath>
        <ClipPath id="kinti_clipPiernas"><Path d={PIERNA_I + PIERNA_D} /></ClipPath>
      </Defs>

      {/* ---------- Piedra ---------- */}
      <Ellipse cx={136} cy={549} rx={128} ry={9} fill="#000" opacity={0.18} />
      <Path d={PIEDRA} fill="url(#kinti_piedra)" stroke={TINTA} strokeWidth={2.4} strokeLinejoin="round" />
      <G clipPath="url(#kinti_clipPiedra)">
        <Path d={PIEDRA_CARA} fill="#9c9a90" opacity={0.35} />
        {/* tierra en los bordes */}
        <Ellipse cx={22} cy={528} rx={26} ry={18} fill="url(#kinti_tierra)" />
        <Ellipse cx={246} cy={534} rx={30} ry={16} fill="url(#kinti_tierra)" />
        <Ellipse cx={30} cy={488} rx={18} ry={9} fill="url(#kinti_tierra)" opacity={0.6} />
        <Ellipse cx={188} cy={552} rx={30} ry={7} fill="url(#kinti_tierra)" opacity={0.7} />
        {/* textura de manchas */}
        <Path d={PIEDRA_MANCHAS} fill="#3c3d38" opacity={0.28} />
        <Path d={PIEDRA_MANCHAS} fill="#b8b4a6" opacity={0.22} transform="translate(9 -4)" />
        {/* sombra de contacto bajo los pies */}
        <Ellipse cx={136} cy={513} rx={72} ry={8} fill="#1a1a16" opacity={0.35} />
        {/* canto inferior en sombra */}
        <Path d="M0,528Q70,540 140,536Q210,534 268,530V560H0Z" fill="#26261f" opacity={0.35} />
      </G>
      {/* grietas */}
      <Path d="M36,519L52,525L62,522L80,529M168,529L184,521L198,525L212,522M108,541L122,535L134,538M226,512L238,520" stroke="#23231e" strokeWidth={1.3} fill="none" strokeLinejoin="round" strokeLinecap="round" opacity={0.85} />
      <Path d="M37,521L52,527M169,531L184,523" stroke="#b2ae9f" strokeWidth={0.8} fill="none" opacity={0.5} />
      {/* guijarros */}
      <Ellipse cx={33} cy={482} rx={12} ry={3.8} fill="#8c8a7e" stroke={TINTA} strokeWidth={1.1} />
      <Ellipse cx={118} cy={485} rx={11} ry={3.6} fill="#949284" stroke={TINTA} strokeWidth={1.1} />
      <Ellipse cx={226} cy={514} rx={6} ry={2.4} fill="#858376" stroke={TINTA} strokeWidth={1} />
      <Ellipse cx={22} cy={540} rx={5} ry={2} fill="#7e7a6c" stroke={TINTA} strokeWidth={0.9} />
      <Path d="M27,480.6Q33,479 38,480.4M113,483.6Q118,482.2 123,483.4" stroke="#c4c0b0" strokeWidth={1} fill="none" opacity={0.7} />

      {/* ---------- Piernas ---------- */}
      <Path d={PIERNA_I} fill="url(#kinti_pantalon)" stroke={TINTA} strokeWidth={2.2} strokeLinejoin="round" />
      <Path d={PIERNA_D} fill="url(#kinti_pantalon)" stroke={TINTA} strokeWidth={2.2} strokeLinejoin="round" />
      <G clipPath="url(#kinti_clipPiernas)">
        {/* sombra bajo el poncho y sombras laterales */}
        <Path d="M50,300H190V330Q120,346 50,336Z" fill="#2a2219" opacity={0.45} />
        <Path d="M96,330Q114,380 104,420Q100,440 102,456L92,456Q96,420 92,390Z" fill="#2a2219" opacity={0.35} />
        <Path d="M124,330Q140,390 138,456L132,456Q132,400 126,370Z" fill="#2a2219" opacity={0.45} />
        <Path d="M54,340Q52,400 54,456L64,456Q60,400 68,342Z" fill="#2a2219" opacity={0.3} />
        {/* luz en el frente de la pierna derecha */}
        <Path d="M160,340Q168,380 166,440" stroke="#90805f" strokeWidth={6} fill="none" opacity={0.25} strokeLinecap="round" />
        <Path d="M76,350Q86,380 80,430" stroke="#8a7a5a" strokeWidth={5} fill="none" opacity={0.22} strokeLinecap="round" />
      </G>
      {/* pliegues: costura, rodilla y entrepierna */}
      <Path d="M86,336Q92,372 86,402M112,318Q118,336 122,354M150,336Q156,372 152,404" stroke="#352d22" strokeWidth={1.2} fill="none" opacity={0.75} strokeLinecap="round" />
      <Path d="M64,398Q78,394 96,382M68,410Q84,404 100,398M136,396Q152,388 172,394M138,408Q154,402 170,408" stroke="#352d22" strokeWidth={1.2} fill="none" opacity={0.7} strokeLinecap="round" />
      <Path d="M66,436Q80,444 98,436M138,436Q156,444 176,436M70,424Q78,430 88,428M146,424Q156,430 166,428" stroke="#352d22" strokeWidth={1.1} fill="none" opacity={0.6} strokeLinecap="round" />
      <Path d="M66,396Q80,391 95,380M137,394Q152,386 170,392" stroke="#9a8a68" strokeWidth={1} fill="none" opacity={0.45} transform="translate(0 -2)" />
      {/* tobillos (piel) */}
      <Path d="M66,468L90,468Q92,486 95,502L63,502Q66,486 66,468Z" fill="#7e4a2e" stroke={TINTA} strokeWidth={1.6} />
      <Path d="M146,466L170,466Q170,482 176,498L146,498Q147,482 146,466Z" fill="#8a5434" stroke={TINTA} strokeWidth={1.6} />
      <Path d="M68,474Q72,486 70,500M148,472Q152,484 150,496" stroke="#4e2a18" strokeWidth={1.4} fill="none" opacity={0.6} />
      <Path d="M86,474Q88,488 90,500M164,472Q166,484 170,496" stroke="#b07048" strokeWidth={1.4} fill="none" opacity={0.6} />
      <Path d={PUNO_I} fill="#5e503c" stroke={TINTA} strokeWidth={2.2} strokeLinejoin="round" />
      <Path d={PUNO_D} fill="#685842" stroke={TINTA} strokeWidth={2.2} strokeLinejoin="round" />
      <Path d="M54,461Q78,465 102,460M135,462Q158,467 183,460" stroke={TINTA} strokeWidth={1.2} fill="none" />
      <Path d="M56,455Q78,452 100,455M137,456Q160,453 181,455" stroke="#a09070" strokeWidth={1} fill="none" opacity={0.6} />

      {/* ---------- Alpargatas tejidas ---------- */}
      <Path d={SANDALIA_I} fill="url(#kinti_sandalia)" stroke={TINTA} strokeWidth={2.2} strokeLinejoin="round" />
      <Path d={SANDALIA_D} fill="url(#kinti_sandalia)" stroke={TINTA} strokeWidth={2.2} strokeLinejoin="round" />
      {/* izquierda (escorzo): boca del empeine, tiras curvas alrededor de la punta y suela */}
      <Path d="M63,499Q80,510 98,498Q88,494 80,495Q70,494 63,499Z" fill="#6a3a22" stroke={TINTA} strokeWidth={1.4} strokeLinejoin="round" />
      <Path d="M67,500Q80,507 94,499.6" stroke="#3a1e10" strokeWidth={1.6} fill="none" opacity={0.7} />
      <Path d="M65,503Q80,512 97,502" stroke="#c8925c" strokeWidth={1.1} fill="none" opacity={0.85} />
      <Path d="M57,515Q76,524 101,512M56,522Q74,532 100,521M57,529Q72,539 97,529" stroke={TINTA} strokeWidth={1.2} fill="none" />
      <Path d="M57,518.5Q76,527.5 101,516M56.5,525.5Q74,535.5 99,525" stroke="#d09a62" strokeWidth={1} fill="none" opacity={0.75} strokeDasharray="2 1.6" />
      <Path d="M81,507Q80,522 76,540" stroke="#4e2e18" strokeWidth={1} fill="none" opacity={0.6} />
      <Path d="M55,530Q60,543 77,545Q92,544 99,533" stroke={TINTA} strokeWidth={5} fill="none" strokeLinecap="round" />
      <Path d="M55,530Q60,543 77,545Q92,544 99,533" stroke="#b48a5a" strokeWidth={2.6} fill="none" strokeLinecap="round" />
      <Path d="M56,530.5Q61,543.4 77,545.4Q92,544.4 98.6,533.4" stroke="#5a3a22" strokeWidth={2.6} fill="none" strokeDasharray="1.2 2" />
      {/* derecha: abertura, tiras cruzadas y suela */}
      <Path d="M147,494Q163,501 180,496" stroke={TINTA} strokeWidth={1.6} fill="none" />
      <Path d="M148,497Q164,503 180,499" stroke="#c8925c" strokeWidth={1.2} fill="none" opacity={0.8} />
      <Path d="M182,497Q187,507 186,518M192,500Q197,509 196,520M202,503Q207,511 206,519M172,498Q176,508 174,518" stroke={TINTA} strokeWidth={1.2} fill="none" />
      <Path d="M187,498Q192,508 191,519M197,501Q202,510 201,520M207,505Q211,511 211,518" stroke="#c8925c" strokeWidth={1} fill="none" opacity={0.75} strokeDasharray="2 1.6" />
      <Path d="M150,506Q180,512 214,510" stroke="#4e2e18" strokeWidth={1} fill="none" opacity={0.6} />
      <Path d="M141,511Q178,527 219,514" stroke={TINTA} strokeWidth={5} fill="none" strokeLinecap="round" />
      <Path d="M141,511Q178,527 219,514" stroke="#b48a5a" strokeWidth={2.6} fill="none" strokeLinecap="round" />
      <Path d="M142,511.5Q178,527.5 218,514.5" stroke="#5a3a22" strokeWidth={2.6} fill="none" strokeDasharray="1.2 2" />

      {/* ---------- Pelo de atras y coleta ---------- */}
      <Path d={PELO_PUNTAS} fill="none" stroke="#14110e" strokeWidth={1.5} strokeLinecap="round" />
      <Path d={PELO_ATRAS} fill="url(#kinti_pelo)" stroke={TINTA} strokeWidth={2.4} strokeLinejoin="round" />
      <Path d="M84,78Q87,90 83,98M89,82Q91,90 87,96" stroke="#4a4540" strokeWidth={1} fill="none" opacity={0.5} />

      {/* ---------- Cuello ---------- */}
      <Path d={CUELLO} fill="url(#kinti_cuello)" stroke={TINTA} strokeWidth={1.5} />
      <G clipPath="url(#kinti_clipCuello)">
        {/* sombra que proyecta la mandibula */}
        <Path d="M104,78Q122,92 142,92L146,100Q124,102 104,90Z" fill="#3e1c0e" opacity={0.3} />
        <Path d="M108,84Q116,100 114,124L104,124Z" fill="#3e1c0e" opacity={0.35} />
      </G>
      {/* camiseta blanca en el escote */}
      <Path d="M116,112L137,139L141,118Z" fill="#a89a80" />
      <Path d="M114,108Q128,124 145,106L143,117Q132,130 117,117Z" fill="#dcd0b8" stroke={TINTA} strokeWidth={1.2} strokeLinejoin="round" />
      <Path d="M118,115Q129,124 142,114" stroke="#9a8c72" strokeWidth={0.9} fill="none" />

      {/* ---------- Poncho ---------- */}
      <Path d={PONCHO} fill="url(#kinti_poncho)" />
      <G clipPath="url(#kinti_clipPoncho)">
        {/* panel izquierdo: bandas tejidas que siguen la caida */}
        <Path d={TEJIDO_I.fondo} stroke="#3a2414" strokeWidth={8} fill="none" opacity={0.45} />
        <Path d={TEJIDO_I.ocre} stroke={OCRE} strokeWidth={0.8} fill="none" opacity={0.85} />
        <Path d={TEJIDO_I.fino} stroke={OCRE} strokeWidth={0.7} fill="none" opacity={0.55} />
        <Path d={TEJIDO_I.chevron} stroke="#b07a44" strokeWidth={1.2} fill="none" strokeLinejoin="round" />
        <Path d={TEJIDO_I.rombos} fill="#5a3820" stroke={OCRE} strokeWidth={0.7} />
        <Path d={TEJIDO_I.rombosIn} fill="#9a4426" />
        {/* racimo de rombos rojos en el pecho */}
        <Path d={RACIMO_1} fill="#7a321c" stroke={OCRE} strokeWidth={1} />
        <Path d={RACIMO_2} fill="#a04828" stroke="#4a1e10" strokeWidth={1} />
        <Path d={RACIMO_3} fill="#3a1a0e" stroke="#c89458" strokeWidth={0.7} />
        {/* banda de rombos del escote */}
        <Path d={ESCOTE_BANDA} stroke="#4a2414" strokeWidth={6.5} fill="none" />
        <Path d={ESCOTE_ROMBOS} fill="#9a4426" stroke={OCRE} strokeWidth={0.6} />
        {/* sombra bajo los brazos */}
        <Path d={HUECO_I} fill="#2e1e12" opacity={0.85} />
        {/* panel derecho iluminado */}
        <Path d={PANEL_D} fill="url(#kinti_panel)" stroke={TINTA} strokeWidth={1.4} />
        <G clipPath="url(#kinti_clipPanel)">
          <Path d={FRANJAS_D} stroke="#8a3a22" strokeWidth={4} fill="none" opacity={0.75} />
          <Path d={LINEAS_D} stroke={OCRE} strokeWidth={0.8} fill="none" opacity={0.7} />
          <Path d={ROMBOS_D_1} fill="#7a321c" stroke="#c89458" strokeWidth={1} />
          <Path d={ROMBOS_D_2} fill="#a04828" stroke="#4a1e10" strokeWidth={0.8} />
          <Path d={ROMBOS_D_3} fill="#2b1b10" />
          <Path d={ROMBOS_D_FINOS} fill="#8a3a22" stroke="#d0a466" strokeWidth={0.6} />
          <Path d={BANDA_FRONTAL} fill="#b88a50" stroke="#4a2212" strokeWidth={0.8} />
          <Path d="M151,110Q153,200 151,303" stroke={TINTA} strokeWidth={1.1} fill="none" opacity={0.55} />
        </G>
        {/* interior bajo el brazo derecho (marron oscuro con pliegue) */}
        <Path d={HUECO_D} fill="#3a2416" />
        <Path d="M196,240Q192,280 196,326" stroke="#1e140c" strokeWidth={1.4} fill="none" opacity={0.7} />
        <Path d="M205,246Q200,280 199,320" stroke="#5a3a24" strokeWidth={1.4} fill="none" opacity={0.7} />
        {/* pliegues de caida */}
        <Path d={PLIEGUES} stroke="#1e130b" strokeWidth={3} fill="none" opacity={0.3} strokeLinecap="round" />
        <Path d={PLIEGUES_LUZ} stroke="#d4a066" strokeWidth={2.2} fill="none" opacity={0.22} strokeLinecap="round" />
        {/* banda del borde inferior */}
        <Path d={suave(HEM_I, false)} stroke="#7a321c" strokeWidth={4} fill="none" transform="translate(0 -4)" />
        <Path d={suave(HEM_D, false)} stroke="#7a321c" strokeWidth={4} fill="none" transform="translate(0 -4)" />
        <Path d={suave(HEM_I, false)} stroke={OCRE} strokeWidth={0.8} fill="none" transform="translate(0 -7)" />
      </G>
      {/* flecos */}
      <Path d={FLECOS_I} stroke="#1c140c" strokeWidth={1.5} fill="none" strokeLinecap="round" />
      <Path d={FLECOS_D} stroke="#1c140c" strokeWidth={1.5} fill="none" strokeLinecap="round" />
      <Path d={FLECOS_I} stroke="#6e4a2c" strokeWidth={0.7} fill="none" transform="translate(0.6 0)" />
      <Path d={FLECOS_D} stroke="#7a5030" strokeWidth={0.7} fill="none" transform="translate(0.6 0)" />
      <Path d={PONCHO} fill="none" stroke={TINTA} strokeWidth={2.6} strokeLinejoin="round" />

      {/* ---------- Mochila tejida ---------- */}
      <Path d={MOCHILA} fill="url(#kinti_mochila)" stroke={TINTA} strokeWidth={2.4} strokeLinejoin="round" />
      <G clipPath="url(#kinti_clipMochila)">
        {/* bandas horizontales */}
        <Path d="M28,248H118V251H28Z" fill="#8a3420" />
        <Path d="M28,251H118V262H28Z" fill="#c08c4e" />
        <Path d="M28,265H118V271H28Z" fill="#3a1e12" />
        <Path d="M28,271H118V301H28Z" fill="#b8844a" />
        <Path d="M28,299H118V305H28Z" fill="#3a1e12" />
        <Path d="M28,305H118V313H28Z" fill="#c08c4e" />
        <Path d="M28,314H118V318H28Z" fill="#9a3a22" />
        <Path d="M28,320H118V322H28Z" fill="#c08c4e" opacity={0.7} />
        <Path d={MOCHILA_CELOSIA} stroke="#6a2e18" strokeWidth={0.8} fill="none" />
        <Path d={MOCHILA_PUNTOS} stroke="#e8d2a0" strokeWidth={1.8} fill="none" />
        {/* gran X oxido con rombo central y crucecitas */}
        <Path d={MOCHILA_X} stroke="#5a1e10" strokeWidth={7.5} fill="none" />
        <Path d={MOCHILA_X} stroke="#a43e24" strokeWidth={5} fill="none" />
        <Path d={MOCHILA_X} stroke="#d8a060" strokeWidth={0.8} fill="none" />
        <Path d={MOCHILA_ROMBO_1} fill="#a43e24" stroke="#5a1e10" strokeWidth={1.2} />
        <Path d={MOCHILA_ROMBO_2} fill="#d0a060" stroke="#5a1e10" strokeWidth={1} />
        <Path d={MOCHILA_ROMBO_3} fill="#8a3420" />
        <Path d={MOCHILA_CRUCES} stroke="#8a3420" strokeWidth={1.6} fill="none" />
        <Path d="M28,271H118M28,301H118" stroke="#2a140c" strokeWidth={0.8} />
        {/* volumen: lado derecho y fondo en sombra, luz a la izquierda */}
        <Path d="M96,248Q112,290 100,340L120,340V248Z" fill="#140805" opacity={0.35} />
        <Path d="M28,318Q70,332 118,316V340H28Z" fill="#140805" opacity={0.3} />
        <Path d="M42,262Q34,296 48,326" stroke="#ffe0b0" strokeWidth={5} opacity={0.1} fill="none" />
      </G>
      {/* solapa superior */}
      <Path d={SOLAPA} fill="#8a3420" stroke={TINTA} strokeWidth={1.6} strokeLinejoin="round" />
      <Path d="M48,252.5Q80,250.5 110,254.5" stroke="#c08c4e" strokeWidth={3} fill="none" />
      <Path d="M48,252.5Q80,250.5 110,254.5" stroke="#5a1e10" strokeWidth={0.9} fill="none" strokeDasharray="1.6 1.6" />
      <Path d="M47,259Q80,258 110,261" stroke="#3a1a0e" strokeWidth={1} fill="none" opacity={0.7} />
      <Path d={MOCHILA} fill="none" stroke={TINTA} strokeWidth={2.4} />
      {/* fuelle lateral (continuacion de la correa) */}
      <Path d={suave(FUELLE, false)} stroke={TINTA} strokeWidth={10} fill="none" strokeLinecap="round" />
      <Path d={suave(FUELLE, false)} stroke="#8a5030" strokeWidth={7.4} fill="none" strokeLinecap="round" />
      <Path d={FUELLE_PUNTOS} fill="#e0c48e" opacity={0.85} />

      {/* ---------- Correa ---------- */}
      <Path d={suave(CORREA, false)} stroke={TINTA} strokeWidth={9.5} fill="none" strokeLinecap="round" />
      <Path d={suave(CORREA, false)} stroke="#7e3a22" strokeWidth={7} fill="none" strokeLinecap="round" />
      <Path d={CORREA_ZIG} stroke="#d4a464" strokeWidth={0.9} fill="none" opacity={0.9} />

      {/* ---------- Brazo izquierdo: manga y puno sobre la correa ---------- */}
      <Path d={MANGA_I} fill="url(#kinti_manga)" stroke={TINTA} strokeWidth={1.8} strokeLinejoin="round" />
      <Path d="M66,214Q80,212 96,211M64,224Q80,222 98,222" stroke="#8a7c62" strokeWidth={1} fill="none" />
      <Path d={MANO_I} fill="url(#kinti_mano)" stroke={TINTA} strokeWidth={1.7} strokeLinejoin="round" />
      {/* dedos curvados sobre la correa (nudillos separados) */}
      {[[140.6, 204.6, 5.6, 3.4], [141.4, 210.6, 5.8, 3.3], [141, 216.4, 5.4, 3.2], [139.4, 221.8, 4.8, 3]].map(([x, y, rx, ry], i) => (
        <Ellipse key={`n${i}`} cx={x} cy={y} rx={rx} ry={ry} fill={i % 2 ? '#9a5a36' : '#a8683e'} stroke={TINTA} strokeWidth={1.1} />
      ))}
      <Path d="M139,203.4Q142.6,202.8 145.2,204M139.6,209.4Q143.4,208.8 146,210.2M139.4,215.2Q142.8,214.8 145,216" stroke="#d6965e" strokeWidth={0.9} fill="none" opacity={0.7} strokeLinecap="round" />
      <Path d="M134,202Q132.6,214 132,224" stroke="#4e2614" strokeWidth={1} fill="none" opacity={0.55} />
      {/* pulgar por encima de la correa */}
      <Path d="M124,203.6Q129,198 136,197.4Q142,197.2 144.4,200Q142.6,202.4 137,202.8Q130,203.4 126,206Z" fill="#b07044" />
      <Path d="M126,206Q130,203.4 137,202.8Q142.6,202.4 144.4,200" stroke="#3a1c0e" strokeWidth={1} fill="none" strokeLinecap="round" />
      <Path d="M128,201Q134,198.4 140,199" stroke="#dc9c64" strokeWidth={1} fill="none" opacity={0.7} strokeLinecap="round" />
      <Path d="M106,219Q118,225 134,224" stroke="#4e2614" strokeWidth={1} fill="none" opacity={0.6} />

      {/* ---------- Brazo derecho: manga, mano y glifo ---------- */}
      <Circle cx={242} cy={186} r={34} fill="url(#kinti_halo)" />
      <Path d={MANGA_D} fill="url(#kinti_manga)" stroke={TINTA} strokeWidth={1.8} strokeLinejoin="round" />
      <Path d={PALMA_D} fill="url(#kinti_palma)" stroke={TINTA} strokeWidth={1.7} strokeLinejoin="round" />
      <Path d="M220,230Q236,238 252,229" stroke="#4e2614" strokeWidth={1.1} fill="none" opacity={0.6} />
      {/* glifo: se apoya en la palma; los dedos lo rodean por delante */}
      <Path d={GLIFO} fill="url(#kinti_glifo)" stroke="#f8dc78" strokeWidth={2.6} strokeLinejoin="round" />
      <Path d={GLIFO} fill="none" stroke="#fff8d0" strokeWidth={0.9} strokeLinejoin="round" />
      <Path d="M235.5,184.5H249.5Q250,175.5 242.5,175.5Q235,175.5 235,184.5Q235,193 243.5,193Q247.5,193 250,190" stroke="#c49a40" strokeWidth={3.2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M233,170.5Q240,168 247,170" stroke="#ffffff" strokeWidth={1.4} fill="none" opacity={0.8} strokeLinecap="round" />
      <Ellipse cx={240} cy={214} rx={13} ry={6} fill="#ffd27a" opacity={0.5} />
      {DEDOS_D.map(([x0, y0, cx, cy, x1, y1], i) => (
        <G key={`d${i}`}>
          <Path d={`M${x0},${y0}Q${cx},${cy} ${x1},${y1}`} stroke={TINTA} strokeWidth={5.8} fill="none" strokeLinecap="round" />
          <Path d={`M${x0},${y0}Q${cx},${cy} ${x1},${y1}`} stroke={i < 2 ? '#c27a46' : '#a8663c'} strokeWidth={3.7} fill="none" strokeLinecap="round" />
        </G>
      ))}
      <Path d="M238.6,210Q240.4,212.4 241.6,216M244.6,209Q246,212 246.6,216" stroke="#f6c07a" strokeWidth={1} fill="none" opacity={0.7} strokeLinecap="round" />
      <Path d={PULGAR_D} stroke={TINTA} strokeWidth={6.8} fill="none" strokeLinecap="round" />
      <Path d={PULGAR_D} stroke="#d08a4e" strokeWidth={4.6} fill="none" strokeLinecap="round" />
      <Circle cx={243} cy={186} r={17} fill="url(#kinti_halo)" opacity={0.5} />

      {/* ---------- Cabeza ---------- */}
      <Path d={CARA} fill="url(#kinti_piel)" />
      <G clipPath="url(#kinti_clipCara)">
        {/* sombra suave del lado izquierdo y bajo el flequillo */}
        <Ellipse cx={107} cy={62} rx={16} ry={34} fill="url(#kinti_sombra)" />
        <Ellipse cx={140} cy={30} rx={30} ry={12} fill="url(#kinti_sombra)" />
        <Ellipse cx={152} cy={25} rx={12} ry={6} fill="url(#kinti_sombra)" />
        <Ellipse cx={128} cy={90} rx={22} ry={8} fill="url(#kinti_sombra)" opacity={0.7} />
        {/* luces: frente, pomulo derecho, menton */}
        <Ellipse cx={152} cy={31} rx={6} ry={4} fill="url(#kinti_luz)" opacity={0.45} />
        <Ellipse cx={158} cy={60} rx={6.5} ry={11} fill="url(#kinti_luz)" />
        <Ellipse cx={146} cy={86} rx={7} ry={3.6} fill="url(#kinti_luz)" opacity={0.8} />
        <Ellipse cx={121} cy={66} rx={8} ry={6} fill="url(#kinti_rubor)" />
        <Ellipse cx={157} cy={68} rx={5} ry={4} fill="url(#kinti_rubor)" />
      </G>
      {/* contorno fino de mejilla y menton */}
      <Path d="M165,40Q166,53 164.2,62Q162.4,72 159.4,78Q155,86 148.4,90.6Q141,93 131,89.8Q123,86 117,80.6" stroke={TINTA} strokeWidth={1.4} fill="none" strokeLinecap="round" />
      <Path d={OREJA} fill="#87492e" stroke={TINTA} strokeWidth={1.4} />
      <Path d="M95.4,57Q99.6,60 99,67Q97.4,71 95.2,69.6" stroke="#3e1f12" strokeWidth={1.1} fill="none" strokeLinecap="round" />
      <Path d="M97,63Q98.6,65 97.8,67.4" stroke="#b47450" strokeWidth={0.9} fill="none" />
      {/* nariz: recta, punta redondeada; definida por la sombra lateral, sin contorno completo */}
      <Path d="M142.4,46Q140,54 140.4,60.6Q141.4,64.6 145,64.4Q143,57 144.8,47Z" fill="#5a2814" opacity={0.45} />
      <Ellipse cx={148.2} cy={60.4} rx={4} ry={3.3} fill="#d2925c" opacity={0.6} />
      <Ellipse cx={147.6} cy={59.4} rx={2} ry={1.5} fill="#eab27a" opacity={0.7} />
      <Path d="M151.4,54.6Q155.6,58.8 154.6,62.6Q153.8,64.6 151.6,64.4" stroke="#4e2210" strokeWidth={1} fill="none" opacity={0.6} strokeLinecap="round" />
      <Path d="M141.4,62.4Q142.6,65.4 145.6,65Q147.6,66.4 149.6,65.2Q151.6,65.8 152.8,64.2" stroke="#3a180a" strokeWidth={0.9} fill="none" strokeLinecap="round" opacity={0.6} />
      <Path d="M143.4,64.2Q144.6,63.4 146,64.2M149.4,64.2Q150.8,63.2 152,64" stroke="#24100a" strokeWidth={1.2} fill="none" strokeLinecap="round" opacity={0.8} />
      <Path d="M143.6,67Q148,69 152.6,66.8" stroke="#6a341e" strokeWidth={1.6} fill="none" opacity={0.28} />
      {/* boca */}
      {boca(A.boca)}
      {/* ojos */}
      {ojo(OJO_I, A, ojosCerrados, 'kinti_ojoI', false)}
      {ojo(OJO_D, A, ojosCerrados, 'kinti_ojoD', guinoD)}
      {/* cejas */}
      {ceja(CEJA_I, A.cejaI, 3.4)}
      {ceja(CEJA_D, A.cejaD, 3)}
      {/* pelo: flequillo y mechones */}
      <Path d={FLEQUILLO} fill="url(#kinti_pelo)" stroke={TINTA} strokeWidth={2.2} strokeLinejoin="round" />
      <G clipPath="url(#kinti_clipPelo)">
        <Path d={PELO_LINEAS} stroke="#050403" strokeWidth={1} fill="none" strokeLinecap="round" opacity={0.85} />
        <Path d={PELO_BRILLOS} stroke="#6a655e" strokeWidth={1.6} fill="none" opacity={0.3} strokeLinecap="round" />
      </G>
      {/* atadura de la coleta: apenas un pliegue oscuro */}
      <Path d="M82,85Q86,87 90,85" stroke="#000000" strokeWidth={1.2} fill="none" strokeLinecap="round" opacity={0.6} />
    </Svg>
  );
}
