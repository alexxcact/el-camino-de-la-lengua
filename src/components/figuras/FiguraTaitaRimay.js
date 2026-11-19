// Taita Rimay, el guía: espíritu anciano hecho de luz dorada y semitransparente.
// Dibujado por completo con primitivas de react-native-svg (sin imágenes ni filtros).
// Las coordenadas calzan con assets/images/personajes/figuras/taita_rimay.png (500 x 560).
// Estilo: casi sin tinta; los bordes son líneas de luz dorada y todo deja ver el fondo.
import React from 'react';
import Svg, {
  G, Path, Circle, Ellipse, Defs, LinearGradient, RadialGradient, Stop,
} from 'react-native-svg';

export const VIEWBOX = '0 0 500 560';
// Recorte cuadrado de cabeza y hombros para miniaturas (centrado en la cara).
export const BUSTO_VIEWBOX = '143 66 150 150';

const SEPIA = '#5a3a18';       // rasgos finos de la cara
const SEPIA_OSC = '#3e2810';
const LUZ = '#f5d890';         // filo de luz dorada (sustituye a la tinta)
const LUZ_CLARA = '#fff2c0';

// ---------------------------------------------------------------------------
// Helpers geométricos (se evalúan una sola vez al cargar el módulo).
// ---------------------------------------------------------------------------
const r1 = (n) => Math.round(n * 10) / 10;

// Evalúa una cadena de curvas cúbicas [p0, c1, c2, p1, c1, c2, p2, ...].
function muestrear(pts, pasos = 12) {
  const out = [];
  for (let s = 0; s + 3 < pts.length; s += 3) {
    const [a, b, c, d] = [pts[s], pts[s + 1], pts[s + 2], pts[s + 3]];
    for (let i = s === 0 ? 0 : 1; i <= pasos; i++) {
      const t = i / pasos, u = 1 - t;
      out.push([
        u * u * u * a[0] + 3 * u * u * t * b[0] + 3 * u * t * t * c[0] + t * t * t * d[0],
        u * u * u * a[1] + 3 * u * u * t * b[1] + 3 * u * t * t * c[1] + t * t * t * d[1],
      ]);
    }
  }
  return out;
}

// Cinta ahusada: forma rellena que sigue la curva con ancho variable.
// inicio/fin: fracción del seno en cada punta (0 = punta afilada).
// giro > 0: la cinta se retuerce (se estrecha y vuelve a abrirse) como humo.
function cinta(pts, ancho, { inicio = 0.12, fin = 0.04, onda = 0.3, fase = 0, giro = 0, desv = 0 } = {}) {
  const m = muestrear(pts);
  const n = m.length;
  const izq = [], der = [];
  for (let i = 0; i < n; i++) {
    const p = m[i];
    const a = m[Math.max(0, i - 1)], b = m[Math.min(n - 1, i + 1)];
    let tx = b[0] - a[0], ty = b[1] - a[1];
    const l = Math.hypot(tx, ty) || 1;
    tx /= l; ty /= l;
    const t = i / (n - 1);
    const env = Math.pow(Math.max(0, Math.sin(Math.PI * (inicio + t * (1 - inicio - fin)))), 0.6);
    const tw = giro ? 0.18 + 0.82 * Math.abs(Math.cos(t * giro * Math.PI + fase * 0.5)) : 1;
    const w = (ancho / 2) * env * tw * (1 + onda * Math.sin(t * 11 + fase));
    // desv desplaza la cinta hacia un lado (para núcleos y brillos internos)
    const o = desv * (ancho / 2) * env;
    izq.push([p[0] - ty * (w + o), p[1] + tx * (w + o)]);
    der.push([p[0] + ty * (w - o), p[1] - tx * (w - o)]);
  }
  const todo = izq.concat(der.reverse());
  return 'M' + todo.map(([x, y]) => `${r1(x)},${r1(y)}`).join('L') + 'Z';
}

// Trazo abierto que pasa por la cadena de cúbicas.
function curva(pts) {
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 1; i + 2 < pts.length; i += 3) {
    d += `C${pts[i][0]},${pts[i][1]} ${pts[i + 1][0]},${pts[i + 1][1]} ${pts[i + 2][0]},${pts[i + 2][1]}`;
  }
  return d;
}

// Hebras finas paralelas a un mechón (desplazadas a lo ancho).
function hebras(pts, ancho, desp) {
  const a = pts[0], d = pts[pts.length - 1];
  let nx = -(d[1] - a[1]), ny = d[0] - a[0];
  const l = Math.hypot(nx, ny) || 1;
  nx /= l; ny /= l;
  return desp.map((k) => {
    const o = pts.map(([x, y], i) => {
      const f = k * ancho * 0.5 * (i === pts.length - 1 ? 0.1 : i === 0 ? 0.7 : 1);
      return [r1(x + nx * f), r1(y + ny * f)];
    });
    return curva(o);
  }).join('');
}

// Desplaza los puntos de control de una curva a lo largo de su normal local.
// f(i, n) da el factor de desplazamiento por punto (para afinar hacia la punta).
function desplazar(pts, dist, f = () => 1) {
  const n = pts.length;
  return pts.map(([x, y], i) => {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(n - 1, i + 1)];
    let nx = -(b[1] - a[1]), ny = b[0] - a[0];
    const l = Math.hypot(nx, ny) || 1;
    const k = dist * f(i, n);
    return [r1(x + (nx / l) * k), r1(y + (ny / l) * k)];
  });
}

// Divide cada mechón en varias hebras finas ahusadas (aspecto de pelo/humo).
// Devuelve dos paths compuestos (tono claro y tono medio) para ahorrar elementos.
function mechonesFinos(lista, k = 5) {
  const tonos = ['', ''];
  lista.forEach(([pts, w], m) => {
    for (let j = 0; j < k; j++) {
      const o = -0.42 + (0.84 * j) / (k - 1);
      const desp = desplazar(pts, o * w, (i, n) => 1 - 0.75 * (i / (n - 1)) ** 2);
      // cada hebra termina un poco antes o después (puntas desiguales)
      const corta = (j + m) % 3 === 1 ? 0.88 : 1;
      const fin = desp[desp.length - 1], prev = desp[desp.length - 2];
      if (corta < 1) desp[desp.length - 1] = [r1(prev[0] + (fin[0] - prev[0]) * corta), r1(prev[1] + (fin[1] - prev[1]) * corta)];
      const ancho = w * (0.36 - Math.abs(o) * 0.2);
      tonos[(j + m) % 2] += cinta(desp, ancho, { inicio: 0.3, fin: 0, onda: 0.18, fase: j * 1.3 + m });
    }
  });
  return tonos;
}

// Banda vertical de rombos concéntricos con bordes en zigzag (tejido andino).
function bandaRombos(cx, y0, y1, w, incl = 0) {
  let d = '';
  const h = w * 1.35;
  for (let y = y0; y + h <= y1 + 0.1; y += h) {
    const x = cx + incl * (y - y0), ym = y + h / 2;
    for (const k of [1, 0.55]) {
      const hw = (w / 2) * k, hh = (h / 2) * k;
      d += `M${r1(x)},${r1(ym - hh)}L${r1(x + hw)},${r1(ym)}L${r1(x)},${r1(ym + hh)}L${r1(x - hw)},${r1(ym)}Z`;
    }
  }
  for (const lado of [-1, 1]) {
    const xs = cx + lado * (w / 2 + 3);
    d += `M${r1(xs)},${y0}L${r1(xs + incl * (y1 - y0))},${y1}`;
  }
  return d;
}

// Greca escalonada horizontal (pend = pendiente).
function greca(x0, x1, y, alto = 5, paso = 7, pend = 0) {
  let d = `M${x0},${r1(y)}`;
  for (let x = x0, j = 0; x < x1; x += paso, j++) {
    const yy = y + pend * (x - x0);
    const up = j % 2 === 0 ? -alto : 0;
    d += `L${r1(x)},${r1(yy + up)}L${r1(x + paso)},${r1(yy + up + pend * paso)}`;
  }
  return d;
}

// Zigzag horizontal (dientes de sierra) entre dos alturas.
function zigzag(x0, x1, y, alto = 4, paso = 6, pend = 0) {
  let d = '';
  for (let x = x0, j = 0; x <= x1; x += paso / 2, j++) {
    d += `${j ? 'L' : 'M'}${r1(x)},${r1(y + pend * (x - x0) + (j % 2 ? -alto : 0))}`;
  }
  return d;
}

// Lengua de fuego alta y estrecha: base en (x ± w, base) y punta en (tx, ty).
function lengua(x, w, tx, ty, base = 506, s = 1) {
  const h = base - ty;
  const mx = (x + tx) / 2 + s * w * 0.3, my = base - h * 0.5;
  return `M${x - w},${base}C${x - w * 1.2},${base - h * 0.28} ${mx - w * 0.95},${my + h * 0.1} ${mx - w * 0.5},${my}`
    + `C${mx - w * 0.15},${my - h * 0.2} ${tx - s * w * 0.35},${ty + h * 0.22} ${tx},${ty}`
    + `C${tx + s * w * 0.1},${ty + h * 0.25} ${mx + w * 0.7},${my - h * 0.12} ${mx + w * 0.55},${my + h * 0.05}`
    + `C${mx + w * 0.9},${my + h * 0.2} ${x + w * 1.25},${base - h * 0.22} ${x + w},${base}Z`;
}

// ---------------------------------------------------------------------------
// Humo / cintas de luz: [puntos, ancho, opacidad, giro]
// ---------------------------------------------------------------------------
const HUMO_ATRAS = [
  // voluta sobre el hombro izquierdo
  [[[170, 196], [142, 186], [118, 172], [112, 156], [106, 140], [124, 132], [138, 146]], 14, 0.55, 1.2],
  // gran lazo izquierdo que baja ondulando hasta la fogata
  [[[132, 236], [96, 252], [70, 282], [62, 318], [54, 356], [40, 392], [58, 424], [78, 452], [122, 458], [160, 474]], 20, 0.6, 2.2],
  // arco grande que sale tras la mano alzada, sube a la derecha y baja por el costado
  [[[300, 214], [316, 178], [340, 150], [372, 140], [404, 130], [438, 140], [452, 168], [466, 200], [452, 236], [430, 262]], 18, 0.6, 2.4],
  // humo que se escapa del pelo por arriba
  [[[272, 46], [286, 34], [296, 26], [292, 12], [288, 2], [300, -2], [308, 8]], 10, 0.55, 1],
  [[[296, 70], [312, 58], [322, 44], [336, 40], [350, 36], [358, 46], [352, 56]], 8, 0.45, 1],
  // cinta derecha que desciende hacia la fogata
  [[[420, 300], [434, 336], [424, 370], [394, 388], [360, 404], [318, 414], [296, 448]], 20, 0.55, 2],
];

const HUMO_FRENTE = [
  // la cinta que sujeta la mano del pecho y cae enroscándose hasta el fuego
  [[[240, 300], [228, 334], [198, 352], [172, 374], [146, 398], [140, 430], [166, 452], [190, 468], [204, 484], [200, 506]], 20, 0.65, 2.6],
  // banda baja izquierda que entra en la fogata
  [[[34, 410], [70, 424], [104, 434], [132, 444], [156, 456], [170, 478], [180, 502]], 16, 0.55, 1.6],
  // gran S derecha
  [[[388, 324], [412, 340], [414, 368], [388, 388], [356, 406], [318, 402], [292, 410], [266, 420], [256, 446], [262, 478]], 20, 0.6, 2.8],
  // voluta fina que sube por el pecho
  [[[266, 300], [256, 324], [266, 348], [256, 370], [246, 392], [226, 406], [214, 424]], 12, 0.5, 1.6],
  // hilo que sube junto al brazo izquierdo
  [[[96, 330], [80, 360], [70, 392], [78, 420]], 9, 0.45, 1],
];

// ---------------------------------------------------------------------------
// Cabello: masa translúcida + penachos afilados que suben a la derecha como humo
// ---------------------------------------------------------------------------
const PELO_MASA =
  'M184,180C170,170 160,150 158,128C156,106 156,86 162,70C170,50 188,38 212,34C236,30 262,30 286,32' +
  'C300,34 308,46 308,60C308,76 314,92 308,108C302,124 294,140 282,152C274,162 266,172 256,178' +
  'C254,150 254,120 250,100C236,90 204,90 188,100C186,126 186,152 184,180Z';

// [curva, ancho, tono] tono 0 = luz, 1 = medio. Nacen en la raíz y terminan en punta;
// suben primero y luego el viento los barre hacia la derecha.
const PENACHOS = [
  [[[184, 110], [164, 92], [160, 64], [180, 48], [198, 36], [226, 30], [250, 28], [270, 26], [286, 14], [298, 2]], 22, 1],
  [[[196, 98], [186, 74], [200, 54], [226, 48], [252, 42], [272, 40], [290, 34], [306, 28], [318, 16], [330, 14]], 20, 0],
  [[[214, 94], [212, 74], [236, 62], [260, 58], [280, 56], [296, 54], [314, 40]], 18, 1],
  [[[234, 94], [250, 80], [272, 76], [290, 76], [304, 76], [316, 66], [330, 52]], 16, 0],
  [[[246, 104], [266, 98], [284, 100], [296, 104], [306, 106], [316, 100], [326, 88]], 13, 1],
  [[[252, 122], [270, 122], [282, 132], [290, 140], [296, 146], [304, 146], [312, 138]], 10, 0],
  [[[186, 168], [166, 152], [160, 128], [164, 106], [166, 90], [170, 74], [184, 62]], 16, 0],
  [[[184, 182], [168, 172], [160, 158], [160, 142]], 10, 1],
  [[[204, 92], [196, 70], [210, 52], [234, 46], [256, 42], [274, 40], [292, 30]], 14, 0],
  [[[180, 72], [168, 54], [182, 38], [204, 36]], 12, 1],
];

const PELO_FINOS = mechonesFinos(PENACHOS, 5);

// Hilos sueltos que se deshacen en luz.
const PELO_HILOS =
  'M292,10C296,2 304,-2 310,-8M318,18C324,10 332,6 338,-2M312,44C320,36 326,28 334,24' +
  'M324,58C330,50 334,42 342,36M166,90C156,82 154,70 160,58' +
  'M172,66C166,54 170,44 180,36M304,130C310,138 316,138 322,132';

// Mechones finos que caen sobre las sienes y funden la cara con el pelo.
const SIENES = [
  [[[190, 96], [182, 112], [182, 130], [180, 150]], 6],
  [[[250, 96], [258, 112], [258, 132], [262, 150]], 6],
  [[[196, 92], [204, 88], [216, 86], [226, 86]], 4],
];

// Nacimiento del pelo peinado hacia atrás: tapa el borde alto de la frente.
const PELO_FRENTE =
  'M180,108C184,96 192,88 202,89C208,85 216,84 223,87C231,84 242,86 249,92C255,96 259,102 260,108' +
  'C262,96 256,84 244,78C230,72 208,72 194,78C184,84 178,96 180,108Z';

// ---------------------------------------------------------------------------
// Ruana / poncho
// ---------------------------------------------------------------------------
const MANGA_IZQ =
  'M136,226C114,236 96,256 86,284C76,314 70,350 70,388C70,404 74,418 80,428' +
  'C100,432 124,430 146,422C142,384 148,350 160,320L150,250Z';
const MANGA_DER =
  'M292,214C326,224 362,236 398,244L412,266C404,290 396,314 386,336' +
  'C374,362 362,386 352,410C342,414 330,414 322,410C320,370 316,330 308,300Z';
const CUERPO =
  'M140,214C164,204 192,200 220,202C252,200 286,206 306,218C322,246 332,288 338,334' +
  'C342,368 344,400 340,430C300,438 252,440 214,438C180,438 156,432 140,424C140,364 146,306 150,256Z';
// Contornos de luz del poncho (se desvanecen hacia abajo con un gradiente).
const BORDES_PONCHO =
  'M136,226C114,236 96,256 86,284C76,314 70,350 70,388C70,404 74,418 80,428' +
  'M146,422C142,384 148,350 160,320' +
  'M306,218C322,246 332,288 338,334C342,368 344,400 340,430' +
  'M292,214C326,224 362,236 398,244' +
  'M412,266C404,290 396,314 386,336C374,362 362,386 352,410' +
  'M308,300C316,330 320,370 322,410';
// Pliegues verticales en sombra.
const PLIEGUES =
  'M142,262C138,312 138,362 142,414M198,300C196,344 198,384 200,428M262,292C268,334 270,374 268,432' +
  'M314,256C324,304 330,354 332,424M116,300C106,340 102,372 104,420M346,300C350,330 352,360 350,400';
// Tejido: columnas de rombos finas + grecas.
const TEJIDO_ROMBOS =
  bandaRombos(170, 262, 412, 13, -0.04) +
  bandaRombos(288, 268, 410, 13, 0.03) +
  bandaRombos(106, 340, 416, 12, -0.08) +
  bandaRombos(364, 300, 396, 11, -0.12);
// Banda de greca que cruza el pecho a la altura del puño + cenefas de hombro y puños.
const TEJIDO_BANDAS =
  greca(146, 340, 296, 5, 7, 0.01) + zigzag(146, 340, 306, 4, 7, 0.01) +
  'M146,286L340,288M146,312L340,314' +
  greca(150, 214, 246, 4, 6, 0.04) + greca(232, 302, 250, 4, 6, -0.03) +
  // puño de la manga izquierda (vertical)
  'M150,292L158,334M162,290L170,332' + 'M152,296L160,300L154,306L162,310L156,316L164,320L158,326L166,330' +
  // puño de la manga derecha (diagonal hacia la muñeca)
  'M372,248L388,330M384,252L398,322' + 'M375,258L386,262L378,272L390,276L380,288L392,292L382,304L394,308L384,318';

// Chal / rebozo: masa trasera, vuelta del cuello y pliegue diagonal sobre el pecho.
const CHAL_MASA =
  'M120,232C126,206 146,186 170,176C176,172 180,168 184,166C186,178 196,190 208,196' +
  'C216,200 224,200 232,196C244,190 252,178 256,166C262,170 270,176 280,182C302,194 318,210 320,232' +
  'C316,254 300,266 270,272C238,278 196,278 166,270C140,262 122,250 120,232Z';
// Pliegues del chal: [curva, ancho] (gruesos, envolviendo el cuello y en diagonal).
const PLIEGUES_CHAL = [
  // vuelta alta que sube tapando la mandíbula
  [[[176, 170], [186, 192], [204, 202], [222, 204], [240, 204], [256, 190], [266, 168]], 14],
  // segunda vuelta alrededor del cuello
  [[[150, 196], [176, 214], [206, 222], [228, 222], [254, 220], [282, 208], [304, 194]], 16],
  // gran pliegue que baja en diagonal desde el hombro derecho hacia la izquierda
  [[[304, 206], [282, 226], [250, 240], [220, 248], [190, 254], [158, 260], [128, 254]], 18],
  // caída sobre el hombro izquierdo
  [[[160, 186], [140, 200], [126, 222], [122, 246], [120, 262], [124, 280], [132, 292]], 14],
  // caída corta sobre el hombro derecho
  [[[280, 186], [298, 196], [312, 212], [318, 232]], 12],
];

// ---------------------------------------------------------------------------
// Manos
// ---------------------------------------------------------------------------
// Mano alzada: palma abierta hacia arriba y hacia el espectador; pulgar a la izquierda
// y los cuatro dedos juntos, levemente abiertos y curvados hacia arriba.
const MANO_DER =
  'M392,252C398,244 403,236 406,226C409,216 412,206 416,199C419,193 426,194 425,201' +
  'C424,210 421,220 421,229C424,222 428,212 432,204C434,199 440,198 440,204' +
  'L441,206C442,200 446,196 450,197C454,198 454,203 452,208' +
  'C455,204 459,204 459,209C459,214 457,218 455,222' +
  'C458,220 461,222 460,228C459,236 456,244 452,250' +
  'C446,258 432,266 416,268C406,268 398,262 392,252Z';
// separaciones entre dedos y pliegues de la palma
const DEDOS_DER = 'M440,205C439,214 438,224 436,232M452,208C450,218 447,228 444,236M455,222C453,230 450,238 447,244';
const ANTEBRAZO_DER = 'M390,246C396,244 402,242 408,240L414,262C408,266 400,268 392,268Z';

// Mano del pecho: dorso arriba, dedos recogidos a la derecha sujetando la cinta.
const MANO_IZQ =
  'M180,296C192,290 206,286 220,286C230,286 238,288 242,292C248,294 250,300 246,303' +
  'C251,306 251,312 246,314C250,317 249,323 244,325C246,329 243,334 236,333' +
  'C228,334 216,334 206,331C196,328 188,325 182,322Z';
// pliegues entre los dedos recogidos (de arriba abajo)
const DEDOS_IZQ = 'M246,303Q236,301 226,304M246,314Q236,312 225,315M244,325Q234,323 223,326';
const ANTEBRAZO_IZQ = 'M132,300C148,296 166,294 182,294L186,324C168,328 150,332 134,334C128,324 128,310 132,300Z';

// ---------------------------------------------------------------------------
// Rostro según el ánimo
// ---------------------------------------------------------------------------
function Ojo({ cx, cy, lado, animo, cerrado, guino }) {
  const w = 7.6;
  // cuenca en sombra (bajo el arco de la ceja)
  const cuenca = (
    <Path
      d={`M${cx - w - 3},${cy - 1}Q${cx},${cy - 10} ${cx + w + 3},${cy - 1}Q${cx},${cy + 4} ${cx - w - 3},${cy - 1}Z`}
      fill="#6a4318" opacity={0.35}
    />
  );
  // bolsas y arrugas bajo el ojo + patas de gallo
  const ext = lado < 0 ? cx - w : cx + w;
  const bajo = (
    <Path
      d={`M${cx - w + 1},${cy + 4}Q${cx},${cy + 8} ${cx + w - 1},${cy + 4}M${cx - w + 2},${cy + 8}Q${cx},${cy + 11} ${cx + w - 2},${cy + 7.5}`
        + `M${ext + lado * 2},${cy - 2}L${ext + lado * 7},${cy - 4}M${ext + lado * 2},${cy + 1}L${ext + lado * 8},${cy + 1.5}M${ext + lado * 1},${cy + 4}L${ext + lado * 6},${cy + 7}`}
      stroke={SEPIA} strokeWidth={0.8} fill="none" opacity={0.6} strokeLinecap="round"
    />
  );
  if (cerrado || guino) {
    const feliz = animo === 'feliz' || guino;
    const d = feliz
      ? `M${cx - w},${cy + 1}Q${cx},${cy - 4} ${cx + w},${cy + 1}`
      : `M${cx - w},${cy - 1}Q${cx},${cy + 3} ${cx + w},${cy - 1}`;
    return (
      <G>
        {cuenca}
        {/* párpado pesado cerrado + pestañas cortas */}
        <Path d={`M${cx - w - 1},${cy - 2}Q${cx},${cy - 7} ${cx + w + 1},${cy - 2}`} stroke={SEPIA} strokeWidth={0.9} fill="none" opacity={0.55} />
        <Path d={d} stroke={SEPIA_OSC} strokeWidth={1.7} fill="none" strokeLinecap="round" opacity={0.9} />
        <Path
          d={`M${cx - 3},${cy + (feliz ? -1 : 1.5)}l-0.8,2.2M${cx + 1},${cy + (feliz ? -1.6 : 2)}l0,2.3M${cx + 4.5},${cy + (feliz ? -0.6 : 1.4)}l0.8,2.1`}
          stroke={SEPIA_OSC} strokeWidth={0.8} fill="none" opacity={0.6} strokeLinecap="round"
        />
        {bajo}
      </G>
    );
  }
  const abierto = animo === 'sorprendido' ? 5 : animo === 'feliz' ? 2 : 3;
  const m = animo === 'pensativo' ? [2, -1.2] : animo === 'travieso' ? [1.5, 0.2] : [0, 0];
  const rI = animo === 'sorprendido' ? 2.8 : 2.5;
  const caida = animo === 'sorprendido' ? 0.4 : 1;
  return (
    <G>
      {cuenca}
      {/* globo ocular (rendija) */}
      <Path
        d={`M${cx - w},${cy}Q${cx - 1},${cy - abierto * 1.4} ${cx + w},${cy - 0.2}Q${cx},${cy + abierto * 0.9} ${cx - w},${cy}Z`}
        fill="#e8cf98"
      />
      <Circle cx={cx + m[0]} cy={cy - 0.3 + m[1]} r={rI} fill="#7a5a2c" />
      <Circle cx={cx + m[0]} cy={cy - 0.3 + m[1]} r={rI * 0.5} fill="#22140a" />
      <Circle cx={cx + m[0] + 0.9} cy={cy - 1.3 + m[1]} r={0.75} fill="#fff6d8" />
      {/* párpado superior pesado que cae sobre el ojo (más hacia el rabillo externo) */}
      <Path
        d={`M${cx - w - 1},${cy + 0.3}Q${cx - 1},${cy - abierto * 1.5} ${cx + w + 1},${cy}`
          + `L${cx + w + 1},${cy - 1.2 * caida}Q${cx},${cy - abierto * 1.5 - 3.4} ${cx - w - 1},${cy - 1}Z`}
        fill="#b8864a" opacity={0.9}
      />
      <Path
        d={`M${cx - w - 1},${cy + 0.3}Q${cx - 1},${cy - abierto * 1.5} ${cx + w + 1.5},${cy + 0.5 * caida}`}
        stroke={SEPIA_OSC} strokeWidth={1.4} fill="none" strokeLinecap="round"
      />
      {/* pliegue del párpado */}
      <Path
        d={`M${cx - w},${cy - abierto - 2.4}Q${cx},${cy - abierto * 1.9 - 3} ${cx + w + 1.5},${cy - abierto - 0.6 * caida}`}
        stroke={SEPIA} strokeWidth={0.9} fill="none" opacity={0.75}
      />
      {bajo}
    </G>
  );
}

function Rostro({ animo, ojosCerrados }) {
  const guinoIzq = animo === 'travieso' && !ojosCerrados;
  const feliz = animo === 'feliz';
  const sorp = animo === 'sorprendido';

  let cejas;
  switch (animo) {
    case 'sorprendido': cejas = ['M186,110Q196,98 208,104', 'M228,104Q240,98 250,110']; break;
    case 'pensativo': cejas = ['M187,119Q197,117 208,118', 'M228,113Q240,106 249,114']; break;
    case 'travieso': cejas = ['M187,121Q197,118 208,120', 'M228,113Q240,105 250,111']; break;
    case 'feliz': cejas = ['M187,117Q197,112 208,116', 'M228,116Q239,112 249,117']; break;
    default: cejas = ['M187,118Q197,113 208,116', 'M228,116Q239,113 249,118'];
  }

  let boca;
  switch (animo) {
    case 'feliz':
      // sonrisa cálida y cerrada: sube mejillas, sin abrir mucho la boca
      boca = (
        <G>
          <Path d="M204,162Q219,172 234,162Q219,167 204,162Z" fill="#6a3c18" opacity={0.85} />
          <Path d="M203,161Q219,173 235,161" stroke={SEPIA_OSC} strokeWidth={1.5} fill="none" strokeLinecap="round" />
          <Path d="M200,158Q201,161 204,162M234,162Q237,161 238,158" stroke={SEPIA_OSC} strokeWidth={1.1} fill="none" strokeLinecap="round" />
          <Path d="M210,171Q219,174 228,171" stroke={SEPIA} strokeWidth={0.8} fill="none" opacity={0.5} />
        </G>
      );
      break;
    case 'sorprendido':
      boca = (
        <G>
          <Ellipse cx={219} cy={167} rx={4} ry={4.8} fill="#4a2810" />
          <Path d="M214.5,165Q219,160.5 223.5,165" stroke="#d8a868" strokeWidth={1.2} fill="none" opacity={0.8} />
          <Path d="M215,171Q219,173.5 223,171" stroke="#c89858" strokeWidth={1} fill="none" opacity={0.7} />
        </G>
      );
      break;
    case 'pensativo':
      boca = <Path d="M206,165Q214,164 222,165Q229,165 233,161" stroke={SEPIA_OSC} strokeWidth={1.5} fill="none" strokeLinecap="round" />;
      break;
    case 'travieso':
      boca = <Path d="M204,165Q214,168 224,166Q232,164 237,158M235,162Q238,161 239,158" stroke={SEPIA_OSC} strokeWidth={1.5} fill="none" strokeLinecap="round" />;
      break;
    default:
      boca = (
        <G>
          <Path d="M206,164Q213,166.5 220,165.5Q227,166.5 233,162.5" stroke={SEPIA_OSC} strokeWidth={1.3} fill="none" strokeLinecap="round" opacity={0.85} />
          <Path d="M204,162.5Q205,164 206.5,164.5M232.5,163Q234.5,162 235,160" stroke={SEPIA_OSC} strokeWidth={0.9} fill="none" strokeLinecap="round" opacity={0.7} />
          <Path d="M209,158Q219,156 229,158" stroke={SEPIA} strokeWidth={0.8} fill="none" opacity={0.45} />
          <Path d="M209,170Q219,173 229,170" stroke={SEPIA} strokeWidth={0.9} fill="none" opacity={0.5} />
        </G>
      );
  }

  return (
    <G>
      {/* cara base: mandíbula ancha y pómulos marcados, sin contorno de tinta */}
      <Path
        d="M186,94C180,110 178,128 180,144C182,160 189,174 199,183C206,190 213,193 219,193C226,193 233,190 240,183C250,174 256,160 258,144C260,128 259,110 253,94C243,87 232,85 220,85C207,85 195,87 186,94Z"
        fill="url(#taita_piel)"
      />
      {/* sombras de volumen: costados, sienes, bajo los pómulos y lado derecho de la nariz */}
      <Path d="M250,104C256,124 256,146 250,162C246,172 240,180 234,186C244,170 248,150 247,128C247,118 248,110 250,104Z" fill="#7a5525" opacity={0.3} />
      <Path d="M190,146Q196,158 202,158Q196,150 194,140Z M248,146Q242,158 236,158Q242,150 244,140Z" fill="#7a5525" opacity={0.35} />
      {/* luz en pómulos, frente y caballete */}
      <Ellipse cx={198} cy={feliz ? 140 : 143} rx={12} ry={8} fill="url(#taita_pomulo)" opacity={feliz ? 1 : 0.8} />
      <Ellipse cx={240} cy={feliz ? 140 : 143} rx={11} ry={8} fill="url(#taita_pomulo)" opacity={feliz ? 0.9 : 0.6} />
      <Ellipse cx={219} cy={102} rx={24} ry={10} fill="url(#taita_pomulo)" />

      {/* arrugas de la frente (4) y entrecejo */}
      <Path
        d="M196,95Q206,92 218,94Q230,92 242,95M194,100Q206,97 219,99Q232,97 245,100M196,105Q207,102 218,104Q230,102 243,105M201,110Q210,108 216,109M223,109Q230,108 238,110M215,113Q216,117 215,121M223,113Q222,117 223,121"
        stroke={SEPIA} strokeWidth={0.85} fill="none" opacity={sorp ? 0.7 : 0.45} strokeLinecap="round"
      />
      <Path
        d="M195,96Q206,93 218,95M195,101Q206,98 219,100M197,106Q207,103 218,105"
        stroke="#f8dc9c" strokeWidth={0.7} fill="none" opacity={0.45} transform="translate(0,1.4)"
      />

      {/* cejas pobladas, claras */}
      <Path d={cejas[0] + cejas[1]} stroke="#5a3a18" strokeWidth={4} fill="none" strokeLinecap="round" opacity={0.35} transform="translate(0,1.4)" />
      <Path d={cejas[0] + cejas[1]} stroke="#e6c88a" strokeWidth={2.6} fill="none" strokeLinecap="round" opacity={0.9} />
      <Path d={cejas[0] + cejas[1]} stroke="#fff4d0" strokeWidth={0.8} fill="none" strokeLinecap="round" opacity={0.8} transform="translate(0.5,-0.7)" />

      <Ojo cx={198} cy={127} lado={-1} animo={animo} cerrado={ojosCerrados} guino={guinoIzq} />
      <Ojo cx={238} cy={127} lado={1} animo={animo} cerrado={ojosCerrados} guino={false} />

      {/* nariz ancha: caballete con luz, sombra lateral y aletas */}
      <Path d="M217,124C216,133 214,141 212,147L215,148C217,141 219,133 219,124Z" fill="#f6d898" opacity={0.3} />
      <Path d="M224,120C226,132 228,142 229,148C226,150 224,150 222,149C224,140 224,130 224,120Z" fill="#7a5525" opacity={0.4} />
      <Path d="M211,149C208,153 211,157 215,156C218,159 222,159 225,156C229,157 232,153 229,149" stroke={SEPIA_OSC} strokeWidth={1.2} fill="none" strokeLinecap="round" opacity={0.75} />
      <Path d="M213,155Q215,153 217,155M222,155Q224,153 226,155" stroke={SEPIA_OSC} strokeWidth={1.1} fill="none" opacity={0.6} />

      {/* surcos nasogenianos profundos */}
      <Path
        d={feliz
          ? 'M209,149C202,152 198,158 199,168M229,149C236,152 240,158 239,168'
          : 'M209,150C203,154 200,160 201,169M229,150C235,154 238,160 237,169'}
        stroke={SEPIA} strokeWidth={1.2} fill="none" opacity={0.55} strokeLinecap="round"
      />
      <Path
        d={feliz ? 'M207,150C200,155 197,162 199,170M231,150C238,155 241,162 239,170' : 'M207,151C201,157 199,164 201,172M231,151C237,157 239,164 237,172'}
        stroke="#f2cf86" strokeWidth={1} fill="none" opacity={0.4} transform="translate(-2,0)"
      />

      {boca}

      {/* perilla blanca muy tenue y arrugas del mentón */}
      <Path
        d="M211,181Q212,186 211,190M216,182Q218,187 216,193M222,182Q220,187 222,193M227,181Q226,186 227,190"
        stroke="#fff2c8" strokeWidth={0.8} fill="none" opacity={0.22} strokeLinecap="round"
      />
      <Path d="M210,177Q219,181 229,177" stroke={SEPIA} strokeWidth={0.8} fill="none" opacity={0.45} />
    </G>
  );
}

// Cinta de humo luminosa: halo + cuerpo dorado + núcleo claro + filo de luz.
function Humo({ c, k }) {
  const [pts, ancho, op, giro] = c;
  const opts = { inicio: 0.0, fin: 0.0, fase: k * 1.7, onda: 0.22, giro };
  const cuerpo = cinta(pts, ancho, opts);
  const halo = cinta(pts, ancho * 2.2, { ...opts, giro: 0, onda: 0.15 });
  const nucleo = cinta(pts, ancho * 0.4, { ...opts, desv: -0.5 });
  return (
    <G opacity={op + 0.25}>
      <Path d={halo} fill="#c08a30" fillOpacity={0.15} />
      <Path d={cuerpo} fill="url(#taita_humo)" fillOpacity={0.5} />
      <Path d={nucleo} fill="#ffe9a8" fillOpacity={0.75} />
      <Path d={hebras(pts, ancho, [-0.45])} stroke={LUZ_CLARA} strokeWidth={1} fill="none" opacity={0.6} strokeLinecap="round" />
      <Path d={hebras(pts, ancho, [0.9, -1.1, 0.25])} stroke="#f0c870" strokeWidth={0.8} fill="none" opacity={0.35} strokeLinecap="round" />
    </G>
  );
}

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------
export default function FiguraTaitaRimay({ width, height, animo = 'neutral', ojosCerrados = false, viewBox }) {
  return (
    <Svg width={width} height={height} viewBox={viewBox || VIEWBOX}>
      <Defs>
        <RadialGradient id="taita_aura" cx="0.5" cy="0.5" r="0.5">
          <Stop offset="0" stopColor="#ffd77a" stopOpacity="0.14" />
          <Stop offset="0.5" stopColor="#e0a948" stopOpacity="0.05" />
          <Stop offset="0.85" stopColor="#e0a948" stopOpacity="0" />
        </RadialGradient>
        <LinearGradient id="taita_humo" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#ffe39a" />
          <Stop offset="0.5" stopColor="#e8b858" />
          <Stop offset="1" stopColor="#e0b050" />
        </LinearGradient>
        {/* tela del poncho: marrón-oliva oscuro que se desvanece abajo */}
        <LinearGradient id="taita_poncho" x1="0" y1="200" x2="0" y2="440" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#8e7448" stopOpacity="0.85" />
          <Stop offset="0.45" stopColor="#66522f" stopOpacity="0.72" />
          <Stop offset="0.8" stopColor="#4a3c26" stopOpacity="0.38" />
          <Stop offset="1" stopColor="#3a3020" stopOpacity="0" />
        </LinearGradient>
        <LinearGradient id="taita_ponchoLuz" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor="#e0b860" stopOpacity="0.3" />
          <Stop offset="0.5" stopColor="#e0b860" stopOpacity="0.05" />
          <Stop offset="1" stopColor="#e0b860" stopOpacity="0.2" />
        </LinearGradient>
        <LinearGradient id="taita_borde" x1="0" y1="210" x2="0" y2="440" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor={LUZ} stopOpacity="0.95" />
          <Stop offset="0.7" stopColor={LUZ} stopOpacity="0.6" />
          <Stop offset="1" stopColor={LUZ} stopOpacity="0" />
        </LinearGradient>
        <LinearGradient id="taita_manga" x1="0" y1="0" x2="0.3" y2="1">
          <Stop offset="0" stopColor="#b09060" stopOpacity="0.9" />
          <Stop offset="0.6" stopColor="#7e6640" stopOpacity="0.7" />
          <Stop offset="1" stopColor="#4a3c26" stopOpacity="0.15" />
        </LinearGradient>
        <LinearGradient id="taita_chal" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#b4945e" stopOpacity="0.92" />
          <Stop offset="1" stopColor="#7e663e" stopOpacity="0.85" />
        </LinearGradient>
        <LinearGradient id="taita_chalPliegue" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#ecd090" stopOpacity="0.92" />
          <Stop offset="0.5" stopColor="#b8985c" stopOpacity="0.88" />
          <Stop offset="1" stopColor="#7a6038" stopOpacity="0.88" />
        </LinearGradient>
        <RadialGradient id="taita_pomulo" cx="0.5" cy="0.5" r="0.5">
          <Stop offset="0" stopColor="#f2cf86" stopOpacity="0.55" />
          <Stop offset="1" stopColor="#f2cf86" stopOpacity="0" />
        </RadialGradient>
        <RadialGradient id="taita_piel" cx="0.47" cy="0.42" r="0.62">
          <Stop offset="0" stopColor="#e4b868" />
          <Stop offset="0.55" stopColor="#c89a50" />
          <Stop offset="1" stopColor="#8a6230" />
        </RadialGradient>
        <LinearGradient id="taita_peloMasa" x1="0.2" y1="1" x2="0.6" y2="0">
          <Stop offset="0" stopColor="#b48a44" stopOpacity="0.55" />
          <Stop offset="0.6" stopColor="#d9b060" stopOpacity="0.6" />
          <Stop offset="1" stopColor="#ecd08a" stopOpacity="0.55" />
        </LinearGradient>
        <LinearGradient id="taita_pelo" x1="0" y1="1" x2="1" y2="0">
          <Stop offset="0" stopColor="#f2d690" stopOpacity="0.95" />
          <Stop offset="0.6" stopColor="#fff2c0" stopOpacity="0.85" />
          <Stop offset="1" stopColor="#fff2c0" stopOpacity="0.3" />
        </LinearGradient>
        <LinearGradient id="taita_peloMedio" x1="0" y1="1" x2="1" y2="0">
          <Stop offset="0" stopColor="#d9b060" stopOpacity="0.9" />
          <Stop offset="0.6" stopColor="#ecca80" stopOpacity="0.75" />
          <Stop offset="1" stopColor="#f6dc9c" stopOpacity="0.25" />
        </LinearGradient>
        <RadialGradient id="taita_fuegoGlow" cx="0.5" cy="0.6" r="0.5">
          <Stop offset="0" stopColor="#fff2b0" stopOpacity="0.25" />
          <Stop offset="0.5" stopColor="#ffd060" stopOpacity="0.1" />
          <Stop offset="1" stopColor="#ffd060" stopOpacity="0" />
        </RadialGradient>
        <LinearGradient id="taita_llamaExt" x1="0" y1="1" x2="0" y2="0">
          <Stop offset="0" stopColor="#f4b048" stopOpacity="0.85" />
          <Stop offset="0.2" stopColor="#ffd060" stopOpacity="0.9" />
          <Stop offset="1" stopColor="#ffe080" stopOpacity="0.55" />
        </LinearGradient>
        <LinearGradient id="taita_llamaMed" x1="0" y1="1" x2="0" y2="0">
          <Stop offset="0" stopColor="#fff2c0" />
          <Stop offset="1" stopColor="#ffd868" stopOpacity="0.8" />
        </LinearGradient>
        <LinearGradient id="taita_llamaInt" x1="0" y1="1" x2="0" y2="0">
          <Stop offset="0" stopColor="#fffdf2" />
          <Stop offset="0.7" stopColor="#fff6d0" />
          <Stop offset="1" stopColor="#ffe8a0" stopOpacity="0.7" />
        </LinearGradient>
        <LinearGradient id="taita_mano" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#f0cc80" stopOpacity="0.92" />
          <Stop offset="1" stopColor="#b88a48" stopOpacity="0.85" />
        </LinearGradient>
      </Defs>

      {/* aura muy tenue que se desvanece antes del borde */}
      <Ellipse cx={230} cy={270} rx={200} ry={250} fill="url(#taita_aura)" />

      {/* humo detrás */}
      {HUMO_ATRAS.map((c, i) => <Humo key={`ha${i}`} c={c} k={i} />)}

      {/* ---------------- cabello (masa translúcida + penachos) ---------------- */}
      <G>
        <Path d={PELO_MASA} fill="#ffe7a0" opacity={0.12} stroke="#ffd877" strokeWidth={12} strokeOpacity={0.08} />
        <Path d={PELO_MASA} fill="url(#taita_peloMasa)" />
        {/* sombras internas entre mechones */}
        <Path d={PENACHOS.map(([p]) => curva(p)).join('')} stroke="#9a7030" strokeWidth={8} strokeOpacity={0.3} fill="none" strokeLinecap="round" transform="translate(0,5)" />
        {PENACHOS.map(([p, w, tono], i) => (
          <Path key={`pe${i}`} d={cinta(p, w, { inicio: 0.42, fin: 0, onda: 0.15, fase: i * 2 })}
            fill={tono ? 'url(#taita_peloMedio)' : 'url(#taita_pelo)'} opacity={0.55} />
        ))}
        <Path d={PELO_FINOS[1]} fill="#dcb466" opacity={0.7} />
        <Path d={PELO_FINOS[0]} fill="#fbe8b0" opacity={0.72} />
        <G fill="none" strokeLinecap="round">
          <Path d={PENACHOS.map(([p, w]) => hebras(p, w, [-0.5, 0.05])).join('')} stroke="#9a7030" strokeWidth={0.8} opacity={0.45} />
          <Path d={PELO_HILOS} stroke="#ffd877" strokeWidth={3} opacity={0.18} />
          <Path d={PELO_HILOS} stroke={LUZ_CLARA} strokeWidth={1.1} opacity={0.75} />
        </G>
      </G>

      {/* ---------------- poncho / ruana (tela de luz translúcida) ---------------- */}
      <G>
        <Path d={MANGA_IZQ} fill="url(#taita_manga)" />
        <Path d={MANGA_DER} fill="url(#taita_manga)" />
        <Path d={CUERPO} fill="url(#taita_poncho)" />
        <Path d={CUERPO} fill="url(#taita_ponchoLuz)" />
        {/* hondonadas: se ve la noche a través de la tela */}
        <G fill="#0e0b07">
          <Path d="M226,272C244,304 254,344 252,430C238,434 222,434 208,432C218,376 224,324 226,272Z" opacity={0.38} />
          <Path d="M180,330C192,352 198,384 198,430C184,430 166,426 154,420C156,384 166,352 180,330Z" opacity={0.18} />
          <Path d="M100,330C108,350 114,380 118,424C104,426 90,424 80,420C84,386 92,354 100,330Z" opacity={0.22} />
          <Path d="M364,300C372,330 376,360 372,392C366,400 360,404 354,406C358,370 362,334 364,300Z" opacity={0.2} />
        </G>
        <Path d="M96,290C86,330 84,370 88,420M124,270C116,320 114,370 118,420M330,300C340,330 352,360 360,400M372,280C370,310 364,340 356,370"
          stroke="#e8c47a" strokeWidth={5} fill="none" opacity={0.16} strokeLinecap="round" />
        <Path d={PLIEGUES} stroke="#1e140c" strokeWidth={2} fill="none" opacity={0.25} />
        <Path d={PLIEGUES} stroke={LUZ} strokeWidth={0.7} fill="none" opacity={0.25} transform="translate(2,0)" />
        {/* tejido en hilo de luz, fino y tenue */}
        <Path d={TEJIDO_ROMBOS} stroke="#ecd088" strokeWidth={0.9} fill="none" opacity={0.55} strokeLinejoin="round" />
        <Path d={TEJIDO_BANDAS} stroke="#f0d088" strokeWidth={0.9} fill="none" opacity={0.6} strokeLinejoin="round" />
        {/* V del cuello */}
        <Path d="M208,262L222,284L236,262" stroke="#f0d088" strokeWidth={1} fill="none" opacity={0.5} />
        {/* bordes de luz que se desvanecen hacia abajo */}
        <Path d={BORDES_PONCHO} stroke="#ffd877" strokeWidth={6} fill="none" opacity={0.12} strokeLinecap="round" />
        <Path d={BORDES_PONCHO} stroke="url(#taita_borde)" strokeWidth={1.5} fill="none" strokeLinecap="round" />
      </G>

      {/* brazo alzado: manga acampanada hasta la muñeca + palma abierta */}
      <G>
        <Path d={ANTEBRAZO_DER} fill="url(#taita_mano)" opacity={0.6} />
        <Path d="M396,246L410,268" stroke={LUZ} strokeWidth={1.3} fill="none" opacity={0.7} />
        {/* resplandor de la palma */}
        <Ellipse cx={428} cy={230} rx={30} ry={28} fill="#ffe9a8" opacity={0.12} />
        <Path d={MANO_DER} fill="url(#taita_mano)" />
        <Path d={DEDOS_DER} stroke={SEPIA} strokeWidth={0.9} fill="none" opacity={0.5} strokeLinecap="round" />
        <Path d={DEDOS_DER} stroke={LUZ_CLARA} strokeWidth={0.7} fill="none" opacity={0.5} strokeLinecap="round" transform="translate(1.2,0)" />
        {/* hueco de la palma y pliegues */}
        <Path d="M412,240Q422,246 432,240Q426,252 414,250Z" fill="#8a6230" opacity={0.35} />
        <Path d="M408,248Q418,244 428,248M420,229Q414,236 410,246" stroke={SEPIA} strokeWidth={0.8} fill="none" opacity={0.5} strokeLinecap="round" />
        <Path d={MANO_DER} fill="none" stroke={LUZ_CLARA} strokeWidth={1.3} strokeLinejoin="round" opacity={0.9} />
        <Path d={MANO_DER} fill="none" stroke="#ffd877" strokeWidth={5} strokeLinejoin="round" opacity={0.12} />
      </G>

      {/* cuello (se ve bajo el mentón) */}
      <Path d="M194,168L246,168L250,214L190,214Z" fill="#7a5428" opacity={0.9} />
      <Path d="M200,186C210,196 230,196 240,186L242,210L198,210Z" fill="#4a3216" opacity={0.5} />

      {/* chal / rebozo envolvente con pliegues gruesos */}
      <G>
        <Path d={CHAL_MASA} fill="url(#taita_chal)" />
        {PLIEGUES_CHAL.map(([p, w], i) => (
          <G key={`ch${i}`}>
            <Path d={cinta(p, w + 4, { inicio: 0.04, fin: 0.04, onda: 0.1, fase: i * 3 })} fill="#2e2414" opacity={0.35} transform="translate(0,4)" />
            <Path d={cinta(p, w, { inicio: 0.04, fin: 0.04, onda: 0.12, fase: i * 3 })} fill="url(#taita_chalPliegue)" />
          </G>
        ))}
        {/* filos de luz en la parte alta de cada vuelta */}
        <Path d={PLIEGUES_CHAL.map(([p, w]) => hebras(p, w, [-0.6])).join('')} stroke={LUZ} strokeWidth={1.3} fill="none" opacity={0.8} strokeLinecap="round" />
        <Path d={PLIEGUES_CHAL.map(([p, w]) => hebras(p, w, [0.2])).join('')} stroke="#2e2414" strokeWidth={0.9} fill="none" opacity={0.35} strokeLinecap="round" />
        <Path d={CHAL_MASA} fill="none" stroke={LUZ} strokeWidth={1.2} opacity={0.6} />
      </G>

      {/* cuello en sombra bajo el mentón, que el chal tapa en parte */}
      <Path d="M200,182C206,192 214,196 220,196C228,196 234,192 240,182C238,196 230,204 220,204C210,204 202,196 200,182Z" fill="#5a3e1c" opacity={0.35} />
      <Rostro animo={animo} ojosCerrados={ojosCerrados} />
      {/* la vuelta alta del chal pasa por delante de la mandíbula */}
      <Path d={cinta(PLIEGUES_CHAL[0][0], 14, { inicio: 0.04, fin: 0.04, onda: 0.12, fase: 0 })} fill="url(#taita_chalPliegue)" opacity={0.92} />
      <Path d={hebras(PLIEGUES_CHAL[0][0], 14, [-0.6])} stroke={LUZ} strokeWidth={1.3} fill="none" opacity={0.85} strokeLinecap="round" />

      {/* mechones finos sobre las sienes: funden cara y pelo */}
      <G>
        <Path d={PELO_FRENTE} fill="url(#taita_peloMedio)" opacity={0.95} />
        <Path d="M184,104C188,92 198,86 210,88M200,92C208,84 222,82 234,86M224,88C236,82 248,88 256,100M190,98C196,86 206,82 218,82" stroke={LUZ_CLARA} strokeWidth={1.1} fill="none" opacity={0.8} strokeLinecap="round" />
        {SIENES.map(([p, w], i) => (
          <Path key={`si${i}`} d={cinta(p, w * 0.7, { inicio: 0.3, fin: 0, onda: 0.1, fase: i })} fill="url(#taita_pelo)" opacity={0.45} />
        ))}
        <Path d={SIENES.map(([p, w]) => hebras(p, w, [0])).join('')} stroke={LUZ_CLARA} strokeWidth={0.8} fill="none" opacity={0.7} />
      </G>

      {/* antebrazo izquierdo en la manga ancha y mano que sujeta la cinta */}
      <G>
        <Path d={ANTEBRAZO_IZQ} fill="url(#taita_manga)" />
        <Path d="M132,300C148,296 166,294 182,294M134,334C150,332 168,328 186,324" stroke={LUZ} strokeWidth={1.2} fill="none" opacity={0.7} />
        {/* tramo de la cinta que pasa POR DETRÁS de los dedos */}
        <Path d={cinta([[248, 284], [240, 296], [236, 306], [238, 318]], 10, { inicio: 0, fin: 0, onda: 0 })} fill="#ffe9a8" opacity={0.5} />
        <Path d={MANO_IZQ} fill="url(#taita_mano)" />
        <Path d="M184,300C196,294 210,290 224,290" stroke={SEPIA} strokeWidth={0.8} fill="none" opacity={0.4} />
        <Path d={DEDOS_IZQ} stroke={SEPIA} strokeWidth={1.1} fill="none" opacity={0.6} strokeLinecap="round" />
        <Path d={DEDOS_IZQ} stroke={LUZ_CLARA} strokeWidth={0.7} fill="none" opacity={0.55} strokeLinecap="round" transform="translate(0,-1.8)" />
        <Path d="M222,290Q232,290 240,294" stroke={LUZ_CLARA} strokeWidth={1.2} fill="none" opacity={0.6} strokeLinecap="round" />
        {/* pulgar sobre el dorso */}
        <Path d="M200,296C210,292 222,294 230,300C226,302 216,302 206,300Z" fill="#e8c478" opacity={0.8} />
        <Path d="M200,296C210,292 222,294 230,300" stroke={SEPIA} strokeWidth={0.8} fill="none" opacity={0.5} />
        {/* tendones del dorso */}
        <Path d="M190,306Q204,304 216,306M192,314Q204,313 214,315" stroke={SEPIA} strokeWidth={0.7} fill="none" opacity={0.35} />
        <Path d={MANO_IZQ} fill="none" stroke={LUZ_CLARA} strokeWidth={1.2} opacity={0.85} />
        {/* tramo de la cinta que pasa POR DELANTE, entre los dedos */}
        <Path d={cinta([[236, 308], [238, 314], [242, 320], [246, 330]], 5, { inicio: 0, fin: 0, onda: 0 })} fill="#fff2c0" opacity={0.4} />
      </G>

      {/* humo por delante */}
      {HUMO_FRENTE.map((c, i) => <Humo key={`hf${i}`} c={c} k={i + 3} />)}

      {/* ---------------- fogata ---------------- */}
      <G>
        <Ellipse cx={222} cy={450} rx={110} ry={90} fill="url(#taita_fuegoGlow)" />
        {/* leños: siluetas oscuras apenas iluminadas */}
        <G fill="#1e140c" opacity={0.85}>
          <Path d="M156,512L222,500L224,508L160,522Z" />
          <Path d="M294,513L226,500L222,508L288,524Z" />
          <Path d="M198,528L230,498L236,503L206,534Z" />
          <Path d="M252,528L220,498L214,504L244,534Z" />
        </G>
        <Path d="M162,513L218,502M288,514L230,502M204,528L230,500M248,528L222,500" stroke="#c88a40" strokeWidth={0.9} opacity={0.45} />
        {/* lenguas altas y estrechas */}
        <G fill="url(#taita_llamaExt)">
          <Path d={lengua(222, 30, 218, 376, 506, 1)} />
          <Path d={lengua(190, 22, 176, 420, 506, -1)} />
          <Path d={lengua(256, 22, 270, 412, 506, 1)} />
          <Path d={lengua(174, 14, 164, 454, 506, -1)} />
          <Path d={lengua(274, 14, 286, 450, 506, 1)} />
        </G>
        <G fill="url(#taita_llamaMed)">
          <Path d={lengua(222, 24, 222, 398, 506, -1)} />
          <Path d={lengua(196, 16, 188, 434, 506, 1)} />
          <Path d={lengua(250, 16, 258, 428, 506, -1)} />
        </G>
        <G fill="url(#taita_llamaInt)">
          <Path d={lengua(222, 12, 224, 430, 506, 1)} opacity={0.85} />
          <Path d={lengua(206, 9, 202, 456, 506, -1)} />
          <Path d={lengua(240, 9, 244, 452, 506, 1)} />
        </G>
        {/* corazón azulado de la llama */}
        <Path d="M212,498C204,488 208,476 214,468C214,476 218,480 220,474C220,464 226,456 230,450C230,462 238,470 236,484C234,494 226,500 220,500C216,500 214,500 212,498Z" fill="#8fb0d0" opacity={0.3} />
        <Ellipse cx={222} cy={502} rx={40} ry={7} fill="#fff6d6" opacity={0.35} />
        {/* chispas */}
        <G fill="#fff6d0">
          <Circle cx={196} cy={384} r={1.6} opacity={0.9} />
          <Circle cx={244} cy={372} r={1.4} opacity={0.8} />
          <Circle cx={176} cy={414} r={1.3} opacity={0.8} />
          <Circle cx={266} cy={398} r={1.5} opacity={0.85} />
          <Circle cx={212} cy={354} r={1.1} opacity={0.7} />
          <Circle cx={236} cy={340} r={1} opacity={0.6} />
          <Circle cx={162} cy={440} r={1.2} opacity={0.75} />
          <Circle cx={286} cy={424} r={1.2} opacity={0.75} />
        </G>
      </G>

      {/* glifos y motas de luz flotando */}
      <G stroke="#f5d890" strokeWidth={1.4} fill="none" strokeLinecap="round" opacity={0.45}>
        <Path d="M404,140l6,0l0,8l-6,0M416,138l0,10l5,-5" />
        <Path d="M436,148l7,-2l-2,8l6,0" />
        <Path d="M458,196l6,0l-3,5l3,5l-6,0" />
        <Path d="M446,236l0,8l6,-4" />
        <Path d="M30,78l6,-4l0,10M44,72l6,0l0,8l-6,0l0,-4l6,0" />
        <Path d="M60,66l0,8l5,-4" />
      </G>
      <G fill="#ffeaa8">
        <Circle cx={60} cy={150} r={1.8} opacity={0.5} />
        <Circle cx={36} cy={240} r={1.5} opacity={0.4} />
        <Circle cx={470} cy={280} r={1.6} opacity={0.4} />
        <Circle cx={100} cy={100} r={1.3} opacity={0.4} />
        <Circle cx={380} cy={110} r={1.4} opacity={0.45} />
      </G>
    </Svg>
  );
}
