// Uma, la tejedora — figura vectorial dibujada con primitivas de react-native-svg.
// Calca la ilustración de referencia (assets/images/personajes/figuras/uma.png, 560x469):
// abuela sentada con las piernas cruzadas sobre una estera de paja, tejiendo en un
// telar de cintura que se extiende en diagonal hacia la izquierda.
// Componente puro: sin hooks ni estado; la expresión cambia según `animo`.
import React from 'react';
import Svg, {
  G, Path, Circle, Ellipse, Rect, Line, Polygon, Polyline, Defs, LinearGradient,
  RadialGradient, Stop, ClipPath,
} from 'react-native-svg';

export const VIEWBOX = '0 0 560 469';
export const BUSTO_VIEWBOX = '244 30 160 160';

const TINTA = '#1e140c'; // contorno exterior
const TINTA2 = '#3a2416'; // líneas interiores

// Paleta muestreada de la referencia
const C = {
  esteraLuz: '#e8bd68', estera: '#d2a24e', esteraSom: '#9a6a2c', esteraOsc: '#6e4a1e',
  falda: '#263432', faldaSom: '#121c1c', faldaLuz: '#4f5a46', faldaBrillo: '#7a7a58',
  piel: '#a8643a', pielLuz: '#c88a55', pielClara: '#dca06c', pielSom: '#7a4426', pielOsc: '#4e2814',
  blusa: '#8a4428', blusaLuz: '#b0623a', blusaSom: '#4e2014',
  chaleco: '#86906a', chalecoLuz: '#b8c09a', chalecoSom: '#4c5a44',
  bordado: '#a0602f', bordadoLuz: '#e8b46a', bordadoMed: '#c9823e',
  teal: '#2e5a5c', tealSom: '#183436', tealLuz: '#4f8a80',
  rojo: '#8a3a28', rojoOsc: '#561c14', mostaza: '#bc8c3c', naranja: '#c4763a', morado: '#56385a', oro: '#dcae5c',
  crema: '#e6d6b0', verdeBanda: '#55634a',
  paja: '#b8894a', pajaLuz: '#dcb26a', pajaSom: '#7a5530',
  pelo: '#7a766f', peloLuz: '#d4d0c8', peloSom: '#2c2826',
  madera: '#b98a4c', maderaLuz: '#e0b46e', maderaSom: '#6e4a24',
  tela: '#a07a44', telaLuz: '#d2ae74', telaSom: '#76552e', telaOsc: '#4a3018',
  bolso: '#7a4828', bolsoRojo: '#8a3020', bolsoOcre: '#b8823e', bolsoSom: '#3a1a0e', bolsoFondo: '#5a2416',
  cola: '#5e5032', colaSom: '#342a18',
  suela: '#3a2416', correa: '#5c3a22', correaLuz: '#8a5e36',
  brillo: '#ffe08a',
};

// ---------- helpers de patrones ----------
function zigzag(x0, x1, y, amp, paso) {
  let d = `M${x0},${y}`;
  let arriba = true;
  for (let x = x0 + paso / 2; x <= x1 + 0.01; x += paso / 2) {
    d += ` L${x.toFixed(1)},${(arriba ? y - amp : y + amp).toFixed(1)}`;
    arriba = !arriba;
  }
  return d;
}

function rombos(x0, x1, yc, h, w, paso = w) {
  let d = '';
  for (let x = x0; x + w <= x1 + 0.01; x += paso) {
    d += `M${x},${yc} L${x + w / 2},${yc - h} L${x + w},${yc} L${x + w / 2},${yc + h} Z `;
  }
  return d;
}

// Celosía diagonal (dos familias de líneas) dentro de una caja
function celosia(x0, y0, x1, y1, paso) {
  let d = '';
  const alto = y1 - y0;
  for (let x = x0 - alto; x < x1; x += paso) {
    d += `M${x},${y1} L${x + alto},${y0} M${x},${y0} L${x + alto},${y1} `;
  }
  return d;
}

// Estera en espiga: bloques de trazos diagonales que alternan de sentido
function espiga(x0, x1, y0, y1, t) {
  let d = '';
  let fila = 0;
  for (let y = y0; y < y1; y += t, fila++) {
    let col = 0;
    for (let x = x0 + (fila % 2) * (t / 2); x < x1; x += t, col++) {
      const sube = (col + fila) % 2 === 0;
      for (let k = 0.2; k < 1; k += 0.3) {
        d += sube
          ? `M${(x + t * k).toFixed(1)},${(y + t).toFixed(1)} L${(x + t * k + t * 0.35).toFixed(1)},${y.toFixed(1)} `
          : `M${x.toFixed(1)},${(y + t * k).toFixed(1)} L${(x + t).toFixed(1)},${(y + t * k + t * 0.3).toFixed(1)} `;
      }
    }
  }
  return d;
}

// Familia de curvas cuadráticas desplazadas (rayas del chal que siguen el pliegue)
function franjas(lista, p0, c, p1, dir) {
  return lista.map((r, i) => {
    const o = r.off;
    const d = `M${p0[0] + dir[0] * o},${p0[1] + dir[1] * o} Q${c[0] + dir[0] * o},${c[1] + dir[1] * o} ${p1[0] + dir[0] * o},${p1[1] + dir[1] * o}`;
    return <Path key={i} d={d} stroke={r.color} strokeWidth={r.ancho} fill="none" strokeDasharray={r.dash} opacity={r.op} />;
  });
}


// Rayas del chal: bloques que se repiten (rojo ladrillo, mostaza, naranja, morado, verde claro) sobre fondo teal
function rayasChal(desde, hasta, paso) {
  const r = [];
  for (let o = desde; o < hasta; o += paso) {
    r.push(
      { off: o, ancho: 6.5, color: C.rojo },
      { off: o + 4.6, ancho: 1.6, color: C.mostaza },
      { off: o + 7.6, ancho: 3, color: C.naranja, op: 0.9 },
      { off: o + 10.8, ancho: 1.4, color: C.mostaza, dash: '3 2' },
      { off: o + 15.5, ancho: 5, color: C.morado },
      { off: o + 23, ancho: 2, color: C.tealLuz, op: 0.75 },
    );
  }
  return r;
}

// Varios círculos en un solo path (menos nodos para Android)
function circulos(lista, escala) {
  return lista.map(([x, y, r]) => {
    const k = r * escala;
    return `M${x - k},${y} a${k},${k} 0 1,0 ${2 * k},0 a${k},${k} 0 1,0 ${-2 * k},0 Z`;
  }).join(' ');
}

// Rombo escalonado (motivo andino) centrado en (cx, cy): anillos concéntricos
function romboEscalonado(cx, cy, w, h, n) {
  const capas = [];
  for (let i = 0; i < n; i++) {
    const k = 1 - i / n;
    capas.push(`M${cx - w * k},${cy} L${cx},${cy - h * k} L${cx + w * k},${cy} L${cx},${cy + h * k} Z`);
  }
  return capas;
}


// Muestrea un path "M x,y C ..." (solo curvas cúbicas) y devuelve puntos con su normal
function muestrasCurva(d, porTramo = 14) {
  const n = d.match(/-?\d+(\.\d+)?/g).map(Number);
  const pts = [];
  let x0 = n[0], y0 = n[1];
  for (let i = 2; i + 5 < n.length; i += 6) {
    const [a, b, c, e, f, g] = n.slice(i, i + 6);
    for (let k = pts.length ? 1 : 0; k <= porTramo; k++) {
      const t = k / porTramo, u = 1 - t;
      const x = u * u * u * x0 + 3 * u * u * t * a + 3 * u * t * t * c + t * t * t * f;
      const y = u * u * u * y0 + 3 * u * u * t * b + 3 * u * t * t * e + t * t * t * g;
      const dx = 3 * u * u * (a - x0) + 6 * u * t * (c - a) + 3 * t * t * (f - c);
      const dy = 3 * u * u * (b - y0) + 6 * u * t * (e - b) + 3 * t * t * (g - e);
      const l = Math.hypot(dx, dy) || 1;
      pts.push([x, y, -dy / l, dx / l]);
    }
    x0 = f; y0 = g;
  }
  return pts;
}

// Zigzag que sigue una curva (cenefas bordadas del ruedo), desplazado `off` sobre la normal
function zigzagCurva(pts, off, amp, cada = 1) {
  let d = '';
  pts.forEach(([x, y, nx, ny], i) => {
    if (i % cada) return;
    const o = off + ((i / cada) % 2 ? amp : -amp);
    d += `${d ? 'L' : 'M'}${(x + nx * o).toFixed(1)},${(y + ny * o).toFixed(1)} `;
  });
  return d;
}

// Rombos pequeños repartidos a lo largo de la curva
function rombosCurva(pts, off, r, cada) {
  let d = '';
  pts.forEach(([x, y, nx, ny], i) => {
    if (i % cada) return;
    const cx = x + nx * off, cy = y + ny * off;
    const tx = ny, ty = -nx; // tangente
    d += `M${(cx + tx * r).toFixed(1)},${(cy + ty * r).toFixed(1)} L${(cx + nx * r).toFixed(1)},${(cy + ny * r).toFixed(1)} L${(cx - tx * r).toFixed(1)},${(cy - ty * r).toFixed(1)} L${(cx - nx * r).toFixed(1)},${(cy - ny * r).toFixed(1)} Z `;
  });
  return d;
}

const DESTELLOS = [[178, 300, 2], [222, 309, 2.4], [186, 316, 1.6], [316, 344, 2.4], [330, 352, 1.8], [356, 358, 2.4], [420, 318, 2], [432, 322, 1.6], [262, 322, 1.6], [478, 292, 1.8], [436, 296, 1.4]];

// ---------- rostro y expresiones ----------
const OJO_LEJOS = { x: 299.5, y: 95.5, a: 5.6 }; // ojo izquierdo del espectador (escorzado)
const OJO_CERCA = { x: 326, y: 95.5, a: 7.6 };
const IRIS = '#3a2010';

function Ojos({ animo, ojosCerrados }) {
  const els = [];
  const pliegue = (o, dy = 0) => `M${o.x - o.a * 0.95},${o.y - 3.5 + dy} Q${o.x},${o.y - 6.5 + dy} ${o.x + o.a},${o.y - 4 + dy}`;
  const bolsa = o => `M${o.x - o.a * 0.75},${o.y + 4.5} Q${o.x},${o.y + 7.5} ${o.x + o.a * 0.85},${o.y + 3.8} M${o.x - o.a * 0.4},${o.y + 7.5} Q${o.x + o.a * 0.1},${o.y + 9.5} ${o.x + o.a * 0.7},${o.y + 7}`;
  if (ojosCerrados) {
    [OJO_LEJOS, OJO_CERCA].forEach((o, i) => {
      els.push(<Path key={'c' + i} d={`M${o.x - o.a},${o.y - 0.5} Q${o.x},${o.y + 3.8} ${o.x + o.a},${o.y - 1}`} stroke={TINTA} strokeWidth={2.4} fill="none" strokeLinecap="round" />);
      els.push(<Path key={'l' + i} d={`M${o.x - o.a * 0.45},${o.y + 2} L${o.x - o.a * 0.6},${o.y + 4.2} M${o.x + o.a * 0.1},${o.y + 2.8} L${o.x + o.a * 0.05},${o.y + 5.2} M${o.x + o.a * 0.6},${o.y + 1.4} L${o.x + o.a * 0.78},${o.y + 3.6}`} stroke={TINTA} strokeWidth={1.4} strokeLinecap="round" fill="none" />);
      els.push(<Path key={'p' + i} d={pliegue(o) + ' ' + bolsa(o)} stroke={C.pielOsc} strokeWidth={1} fill="none" opacity={0.6} />);
    });
    return els;
  }
  if (animo === 'feliz') {
    // ojos risueños: arcos hacia arriba, mejillas subidas y patas de gallo
    [OJO_LEJOS, OJO_CERCA].forEach((o, i) => {
      els.push(<Path key={'f' + i} d={`M${o.x - o.a},${o.y + 1.5} Q${o.x},${o.y - 4} ${o.x + o.a},${o.y + 0.8}`} stroke={TINTA} strokeWidth={2.3} fill="none" strokeLinecap="round" />);
      els.push(<Path key={'m' + i} d={`M${o.x - o.a * 0.8},${o.y + 6} Q${o.x},${o.y + 2.5} ${o.x + o.a * 0.85},${o.y + 5.2}`} stroke={C.pielOsc} strokeWidth={1.1} fill="none" opacity={0.75} />);
      els.push(<Path key={'q' + i} d={pliegue(o, -1)} stroke={C.pielOsc} strokeWidth={0.9} fill="none" opacity={0.5} />);
    });
    els.push(<Ellipse key="mj" cx={333} cy={105} rx={9} ry={4} fill={C.pielClara} opacity={0.4} />);
    els.push(<Path key="pg" d="M345,93 L351,90 M345.5,96.5 L352,96.5 M345,100 L350.5,103.5" stroke={C.pielOsc} strokeWidth={1} strokeLinecap="round" opacity={0.75} />);
    return els;
  }
  if (animo === 'sorprendido') {
    // ojos bien abiertos, parecidos entre sí, con iris marrón
    [[OJO_LEJOS, 3.8, 4.2], [OJO_CERCA, 5.6, 4.8]].forEach(([o, rx, ry], i) => {
      const cy = o.y - 1.5;
      els.push(<Ellipse key={'b' + i} cx={o.x} cy={cy} rx={rx} ry={ry} fill="#efe2cc" stroke={TINTA} strokeWidth={1.5} />);
      els.push(<Circle key={'i' + i} cx={o.x - rx * 0.12} cy={cy + 0.3} r={ry * 0.72} fill="#6a3c1c" />);
      els.push(<Circle key={'p' + i} cx={o.x - rx * 0.12} cy={cy + 0.3} r={ry * 0.36} fill="#1c0f08" />);
      els.push(<Circle key={'r' + i} cx={o.x - rx * 0.4} cy={cy - 1.2} r={0.9} fill="#fff" />);
      els.push(<Path key={'q' + i} d={pliegue(o, -3.5)} stroke={C.pielOsc} strokeWidth={1} fill="none" opacity={0.7} />);
    });
    return els;
  }
  if (animo === 'travieso') {
    // guiño del ojo lejano y ojo cercano entreabierto, mirando de reojo
    const o = OJO_LEJOS;
    els.push(<Path key="g" d={`M${o.x - o.a - 0.5},${o.y + 0.5} Q${o.x},${o.y - 3.5} ${o.x + o.a + 0.5},${o.y + 1}`} stroke={TINTA} strokeWidth={2.6} fill="none" strokeLinecap="round" />);
    els.push(<Path key="g2" d={`M${o.x - o.a * 0.7},${o.y + 4.5} Q${o.x},${o.y + 2} ${o.x + o.a * 0.8},${o.y + 4}`} stroke={C.pielOsc} strokeWidth={1.1} fill="none" />);
    const p = OJO_CERCA;
    els.push(<Path key="o" d={`M${p.x - p.a},${p.y} Q${p.x},${p.y - 5} ${p.x + p.a},${p.y - 1} Q${p.x},${p.y + 3.2} ${p.x - p.a},${p.y} Z`} fill="#efe2cc" stroke={TINTA} strokeWidth={1.3} />);
    els.push(<Circle key="i" cx={p.x - 4} cy={p.y - 0.5} r={2.6} fill="#6a3c1c" />);
    els.push(<Circle key="i2" cx={p.x - 4} cy={p.y - 0.5} r={1.3} fill="#1c0f08" />);
    els.push(<Path key="t" d={`M${p.x - p.a - 1},${p.y - 0.5} Q${p.x},${p.y - 5.5} ${p.x + p.a + 1},${p.y - 1.5}`} stroke={TINTA} strokeWidth={2.2} fill="none" strokeLinecap="round" />);
    els.push(<Path key="q" d={bolsa(p) + ' ' + pliegue(p, -1)} stroke={C.pielOsc} strokeWidth={1} fill="none" opacity={0.6} />);
    return els;
  }
  // neutral / pensativo: párpados pesados y bajos, mirando el tejido (o de lado si piensa)
  const piensa = animo === 'pensativo';
  [OJO_LEJOS, OJO_CERCA].forEach((o, i) => {
    if (piensa) {
      els.push(<Path key={'e' + i} d={`M${o.x - o.a},${o.y} Q${o.x},${o.y - 3.5} ${o.x + o.a},${o.y - 1} Q${o.x},${o.y + 2.6} ${o.x - o.a},${o.y} Z`} fill="#e8d8c0" />);
      els.push(<Circle key={'r' + i} cx={o.x + o.a * 0.4} cy={o.y - 0.8} r={i ? 2.4 : 1.6} fill={IRIS} />);
      els.push(<Path key={'p' + i} d={`M${o.x - o.a - 0.5},${o.y + 0.2} Q${o.x},${o.y - 4.2} ${o.x + o.a + 0.5},${o.y - 1.4}`} stroke={TINTA} strokeWidth={2.2} fill="none" strokeLinecap="round" />);
    } else {
      // rendija oscura bajo el párpado caído
      els.push(<Path key={'e' + i} d={`M${o.x - o.a * 0.75},${o.y + 0.6} Q${o.x},${o.y + 3.4} ${o.x + o.a * 0.8},${o.y + 0.2} Q${o.x},${o.y + 1.8} ${o.x - o.a * 0.75},${o.y + 0.6} Z`} fill={IRIS} />);
      els.push(<Path key={'p' + i} d={`M${o.x - o.a - 0.5},${o.y - 0.6} Q${o.x},${o.y + 1.8} ${o.x + o.a + 0.5},${o.y - 1.2}`} stroke={TINTA} strokeWidth={2.2} fill="none" strokeLinecap="round" />);
    }
    els.push(<Path key={'q' + i} d={pliegue(o) + ' ' + bolsa(o)} stroke={C.pielOsc} strokeWidth={1} fill="none" opacity={0.6} />);
  });
  return els;
}

function Cejas({ animo }) {
  const formas = {
    neutral: ['M292.5,89 Q298,87.6 304,88.6', 'M316,88.2 Q327,85.6 340,87.6'],
    feliz: ['M292.5,88 Q298,86.2 304,87.4', 'M316,87 Q327,84 340,86.4'],
    pensativo: ['M292.5,90 Q298,89.4 304,90.4', 'M316,86 Q327,80.5 340,84.5'],
    sorprendido: ['M292,85 Q298,81.5 304.5,83.5', 'M315.5,83 Q327,77.5 340.5,81.5'],
    travieso: ['M292.5,91 Q298,90.6 304,91.4', 'M316,85.5 Q327,80 340,84'],
  };
  const d = (formas[animo] || formas.neutral).join(' ');
  return (
    <G>
      {/* ceja rala y canosa: sombra del arco ciliar + pelitos grises finos */}
      <Path d={d} stroke={C.pielOsc} strokeWidth={2.4} strokeLinecap="round" fill="none" opacity={0.35} />
      <Path d={d} stroke="#9a9086" strokeWidth={1.1} strokeLinecap="round" fill="none" strokeDasharray="2.5 1" opacity={0.85} />
    </G>
  );
}

function Boca({ animo }) {
  switch (animo) {
    case 'feliz':
      return (
        <G>
          <Path d="M307,125 Q320,132.5 335,122.5 Q320,128 307,125 Z" fill="#4e1a12" stroke={TINTA} strokeWidth={1.5} strokeLinejoin="round" />
          <Path d="M312,126.2 Q320,128 329,125.4 L328.6,126.6 Q320,129.4 312.4,127.4 Z" fill="#e8dcc4" opacity={0.85} />
          <Path d="M304.5,122 Q305.5,125 308,126 M335.5,120 Q338,122 337.5,125.5" stroke={C.pielOsc} strokeWidth={1.1} fill="none" />
          <Path d="M313,132 Q320,134 328,130.5" stroke={C.pielOsc} strokeWidth={0.9} fill="none" opacity={0.5} />
        </G>
      );
    case 'pensativo':
      return (
        <G>
          <Path d="M309,127.4 Q317,127.4 324,126 Q329,124.6 333,121.6" stroke={TINTA2} strokeWidth={1.7} fill="none" strokeLinecap="round" />
          <Path d="M313,131 Q319,131.5 325,129.5" stroke={C.pielOsc} strokeWidth={1} fill="none" opacity={0.6} />
        </G>
      );
    case 'sorprendido':
      return (
        <G>
          <Ellipse cx={319} cy={128} rx={4.2} ry={5.2} fill="#3e140c" stroke={TINTA} strokeWidth={1.6} />
          <Path d="M316,131.5 Q319,133 322,131.5" stroke="#9a4a3a" strokeWidth={1.2} fill="none" />
        </G>
      );
    case 'travieso':
      return (
        <G>
          <Path d="M307,126.5 Q318,128.5 327,124 Q331,122 334,118.5" stroke={TINTA2} strokeWidth={1.8} fill="none" strokeLinecap="round" />
          <Path d="M332.5,117.5 Q336,119.5 335.5,123.5" stroke={C.pielOsc} strokeWidth={1.1} fill="none" />
          <Path d="M315,130.5 Q322,132 328,129" stroke={C.pielClara} strokeWidth={1.3} fill="none" opacity={0.5} />
        </G>
      );
    default:
      return (
        <G>
          {/* labios finos, comisuras hundidas */}
          <Path d="M307,125.2 Q318,124.4 332,123.2" stroke={C.pielSom} strokeWidth={2} fill="none" opacity={0.5} strokeLinecap="round" />
          <Path d="M306,126.2 C312,127.8 319,128 325,127 C329,126.3 332,125 334.5,123.4" stroke={TINTA2} strokeWidth={1.6} fill="none" strokeLinecap="round" />
          <Path d="M311,130.2 Q318,131.6 326,129.6" stroke={C.pielClara} strokeWidth={1.3} fill="none" opacity={0.45} />
          <Path d="M334.5,123.4 Q336.5,124.8 336.4,127" stroke={C.pielOsc} strokeWidth={1} fill="none" opacity={0.7} />
        </G>
      );
  }
}

// ---------- geometría compartida ----------
const ESTERA = 'M4,380 L104,355 L300,384 L500,440 L503,462 L470,467 L150,467 L119,461 L94,452 L6,424 Z';
const FALDA = 'M134,290 C170,280 300,282 470,285 L492,332 L488,430 L470,447 L385,457 C362,458 340,454 318,446 C290,437 262,428 236,417 C222,412 210,410 198,406 C180,400 162,394 146,390 C128,385 112,381 101,377 C101,364 105,352 111,343 C117,322 123,305 134,290 Z';
const RUEDO = 'M101,377 C112,381 128,385 146,390 C162,394 180,400 198,406 C210,410 222,412 236,417 C262,428 290,437 318,446 C340,454 362,458 385,457';
const SOBRE = 'M104,351 C138,357 170,369 204,381 C242,395 290,409 330,421 C352,428 372,435 392,441';
const P_RUEDO = muestrasCurva(RUEDO, 16);
const P_SOBRE = muestrasCurva(SOBRE, 22);
const CHAL_DER = 'M318,160 C336,140 360,116 384,94 L404,92 L416,110 L429,123 C440,134 446,144 450,154 L470,219 L479,263 L484,280 L497,343 C488,336 478,322 468,306 C455,282 430,256 400,236 C380,223 360,212 340,205 L330,194 Z';
const CHAL_IZQ = 'M322,160 C316,150 310,143 303,136 C297,140 293,146 289,152 C278,170 262,195 246,222 C270,215 296,205 332,193 Z';
const BOLSO = 'M405,334 C430,327 460,321 486,318 C500,345 513,392 519,428 C512,443 496,449 472,451 C452,452 436,449 427,445 C418,410 411,370 405,334 Z';
// Tira ancha del bolso: lazo arriba a la izquierda y caída por delante del costado
const TIRA_BOLSO = 'M412,336 C406,326 392,326 386,334 C381,342 381,350 381.5,360 C383,392 390,424 401,457 L423,452 C411,420 402,388 400,356 C400,348 403,342 410,342 Z';
// Bandas del bolso: [y en el borde izquierdo, grosor, color]
const BANDAS_BOLSO = [[342, 10, '#a8703a'], [355, 3, '#2a120a'], [405, 3, '#2a120a'], [414, 10, '#a8703a'], [425, 3, '#2a120a'], [436, 14, '#7a2c1a']];
// Curva de banda: baja un poco en el centro y sube hacia la derecha (bolso ladeado)
function curvaBolso(y) {
  return `M396,${y} Q452,${y + 4} 528,${y - 14}`;
}
function zigzagBolso(y, amp) {
  let d = '';
  for (let i = 0; i <= 26; i++) {
    const t = i / 26;
    const x = 396 + 132 * t;
    const yc = (1 - t) * (1 - t) * y + 2 * (1 - t) * t * (y + 4) + t * t * (y - 14);
    d += `${i ? 'L' : 'M'}${x.toFixed(1)},${(yc + (i % 2 ? -amp : amp)).toFixed(1)} `;
  }
  return d;
}
const CARA = 'M291,72 C288,80 288,89 290,96 C292,103 294.5,109 297,114.5 C299,119 300.5,123 301.5,127.5 C303,134.5 309,140.5 318,143.5 C330,146.5 343,143.5 350.5,136.5 C357.5,129 360,118 360,104 L361,74 C340,69 311,69 291,72 Z';
const PELO = 'M344,66 C364,61 384,64 392,77 C398,88 398,103 394,114 C390,124 385,131 378,136 L368,132 L360,120 L358,92 Z';
const COPA = 'M292,48 C292,32 296,18 302,8 C318,3 345,1 358,3 C366,14 372,28 376,42 C350,48 318,50 292,48 Z';
const BRIM = 'M264,62 C264,54 282,49 300,46 L380,39 C393,38 405,40 404,46 C403,52 396,55 388,58 C362,68 326,72 292,71 C276,70 264,68 264,62 Z';
const BRAZO_D = 'M350,218 C385,222 425,240 448,268 C458,282 459,298 446,304 C426,309 396,305 372,300 L364,262 C360,246 356,230 350,218 Z';
const MANGA_I = 'M302,204 C286,208 268,214 256,220 C248,224 242,230 240,240 C239,252 246,262 260,263 L292,262 C298,244 302,224 302,204 Z';
// Pies: izquierdo del espectador (de perfil, dedos a la izquierda) y derecho (bajo la falda)
const PIES = [
  {
    suela: 'M73,404 C72,392 79,382.5 91,381.5 C112,380.5 146,382.5 176,388 L181,421 C151,429 118,431 97,429 C83,427 74,417 73,404 Z',
    canto: 'M80,424 C95,429 130,429 168,422',
    pie: 'M80,404 C80,394 86,387.5 95,386.5 C116,385.5 146,387 173,392 L176,418 C150,424 120,425 100,423 C88,421 80,413 80,404 Z',
    arco: 'M98,416 C120,419 150,417 176,410 L178,428 L96,428 Z',
    luz: [140, 395, 30, 5],
    dedos: [[91.5, 393, 6.6, 5.2], [87.6, 401.4, 4.6, 3.7], [87, 408.4, 4.3, 3.4], [88.2, 414.8, 3.9, 3.1], [91.8, 420.4, 3.3, 2.6]],
    tira: 'M124,386.5 C120,397 115,410 111,424',
    ancho: 6.5,
    dedo: 'M98,396 C104,397.5 110,399 116,402',
  },
  {
    suela: 'M199,433 C198,421 204,411.5 214.5,410.5 C230,409.5 248,412.5 263,418.5 L266,451 C250,458 228,459 213,456 C203,453 199,444 199,433 Z',
    canto: 'M205,452 C218,457 240,457 258,452',
    pie: 'M205,433 C205,424 210,416.5 218,415.5 C232,414.5 247,417.5 260,423 L262,448 C248,453 230,454 218,451 C209,449 205,441 205,433 Z',
    arco: 'M216,446 C230,448 246,447 262,442 L262,456 L212,456 Z',
    luz: [244, 424, 12, 4],
    // se ve la planta: suela oscura con los dedos asomando por el borde
    planta: true,
    dedos: [[216.5, 421.5, 5.2, 4.2], [214, 429, 4.2, 3.5], [213.6, 435.8, 3.9, 3.2], [215, 442, 3.5, 2.9], [218.6, 447, 2.9, 2.4]],
  },
];

const NUDO = 'M317,171 C319,163 330,159 339,162 C347,165 350,174 346,182 C342,190 332,194 323,191 C316,188 314,179 317,171 Z';

// Telar: marco local con x a lo largo del tejido (0..307) e y a lo ancho (0..65)
const TELAR = 'matrix(0.9434,0.3318,-0.9176,0.3976,105,196)';

export default function FiguraUma({ width, height, animo = 'neutral', ojosCerrados = false, viewBox }) {
  return (
    <Svg width={width} height={height} viewBox={viewBox || VIEWBOX}>
      <Defs>
        <LinearGradient id="uma_estera" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor={C.esteraLuz} />
          <Stop offset="0.55" stopColor={C.estera} />
          <Stop offset="1" stopColor={C.esteraSom} />
        </LinearGradient>
        <RadialGradient id="uma_contacto" cx="0.5" cy="0.5" r="0.5">
          <Stop offset="0" stopColor="#2a1606" stopOpacity="0.55" />
          <Stop offset="1" stopColor="#2a1606" stopOpacity="0" />
        </RadialGradient>
        <LinearGradient id="uma_falda" x1="0" y1="0" x2="1" y2="0.6">
          <Stop offset="0" stopColor={C.faldaLuz} />
          <Stop offset="0.4" stopColor={C.falda} />
          <Stop offset="1" stopColor={C.faldaSom} />
        </LinearGradient>
        <RadialGradient id="uma_faldaLuz" cx="0.45" cy="0.4" r="0.55">
          <Stop offset="0" stopColor={C.faldaBrillo} stopOpacity="0.55" />
          <Stop offset="1" stopColor={C.faldaBrillo} stopOpacity="0" />
        </RadialGradient>
        {/* piel: luz desde la izquierda, sombra cálida a la derecha */}
        <LinearGradient id="uma_piel" x1="0" y1="0" x2="1" y2="0.25">
          <Stop offset="0" stopColor="#d4955a" />
          <Stop offset="0.32" stopColor="#c67b42" />
          <Stop offset="0.66" stopColor="#b06834" />
          <Stop offset="1" stopColor="#62351e" />
        </LinearGradient>
        <LinearGradient id="uma_mano" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor={C.pielLuz} />
          <Stop offset="0.55" stopColor={C.piel} />
          <Stop offset="1" stopColor={C.pielSom} />
        </LinearGradient>
        <LinearGradient id="uma_planta" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#6e4a30" />
          <Stop offset="0.6" stopColor="#4b3021" />
          <Stop offset="1" stopColor="#2e1c12" />
        </LinearGradient>
        <LinearGradient id="uma_pie" x1="0" y1="0" x2="0.3" y2="1">
          <Stop offset="0" stopColor={C.pielLuz} />
          <Stop offset="0.5" stopColor={C.piel} />
          <Stop offset="1" stopColor={C.pielOsc} />
        </LinearGradient>
        <RadialGradient id="uma_cuenca" cx="0.5" cy="0.4" r="0.5">
          <Stop offset="0" stopColor={C.pielOsc} stopOpacity="0.55" />
          <Stop offset="1" stopColor={C.pielOsc} stopOpacity="0" />
        </RadialGradient>
        <LinearGradient id="uma_blusa" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor={C.blusaLuz} />
          <Stop offset="0.5" stopColor={C.blusa} />
          <Stop offset="1" stopColor={C.blusaSom} />
        </LinearGradient>
        <LinearGradient id="uma_sombrero" x1="0" y1="0" x2="1" y2="0.3">
          <Stop offset="0" stopColor={C.pajaLuz} />
          <Stop offset="0.5" stopColor={C.paja} />
          <Stop offset="1" stopColor={C.pajaSom} />
        </LinearGradient>
        <LinearGradient id="uma_ala" x1="0" y1="0" x2="1" y2="0.5">
          <Stop offset="0" stopColor="#e2b86e" />
          <Stop offset="0.55" stopColor={C.paja} />
          <Stop offset="1" stopColor="#5e4024" />
        </LinearGradient>
        <LinearGradient id="uma_tela" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor={C.telaLuz} />
          <Stop offset="0.6" stopColor={C.tela} />
          <Stop offset="1" stopColor={C.telaSom} />
        </LinearGradient>
        <LinearGradient id="uma_sombra" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#000" stopOpacity="0" />
          <Stop offset="1" stopColor="#000" stopOpacity="0.5" />
        </LinearGradient>
        {/* sombra lateral global (luz desde la izquierda) */}
        <LinearGradient id="uma_lado" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor="#000" stopOpacity="0" />
          <Stop offset="0.5" stopColor="#000" stopOpacity="0.05" />
          <Stop offset="1" stopColor="#000" stopOpacity="0.4" />
        </LinearGradient>
        <LinearGradient id="uma_pelo" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#a6a29a" />
          <Stop offset="0.45" stopColor="#66625c" />
          <Stop offset="1" stopColor="#2e2a26" />
        </LinearGradient>
        <LinearGradient id="uma_cola" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor={C.cola} />
          <Stop offset="1" stopColor={C.colaSom} />
        </LinearGradient>
        <LinearGradient id="uma_bolso" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor="#000" stopOpacity="0.3" />
          <Stop offset="0.25" stopColor="#000" stopOpacity="0" />
          <Stop offset="0.7" stopColor="#000" stopOpacity="0.05" />
          <Stop offset="1" stopColor="#000" stopOpacity="0.5" />
        </LinearGradient>
        <ClipPath id="uma_clipEstera"><Path d={ESTERA} /></ClipPath>
        <ClipPath id="uma_clipFalda"><Path d={FALDA} /></ClipPath>
        <ClipPath id="uma_clipChalDer"><Path d={CHAL_DER} /></ClipPath>
        <ClipPath id="uma_clipChalIzq"><Path d={CHAL_IZQ} /></ClipPath>
        <ClipPath id="uma_clipTela"><Rect x={0} y={0} width={307} height={65} /></ClipPath>
        <ClipPath id="uma_clipBolso"><Path d={BOLSO} /></ClipPath>
        <ClipPath id="uma_clipCopa"><Path d={COPA} /></ClipPath>
        <ClipPath id="uma_clipBrazo"><Path d={BRAZO_D} /></ClipPath>
        <ClipPath id="uma_clipCara"><Path d={CARA} /></ClipPath>
        <ClipPath id="uma_clipPelo"><Path d={PELO} /></ClipPath>
        <ClipPath id="uma_clipPie0"><Path d={PIES[0].pie} /></ClipPath>
        <ClipPath id="uma_clipPie1"><Path d={PIES[1].pie} /></ClipPath>
        <ClipPath id="uma_clipNudo"><Path d={NUDO} /></ClipPath>
      </Defs>

      {/* ===== Estera de paja ===== */}
      <Path d={ESTERA} fill="url(#uma_estera)" />
      <G clipPath="url(#uma_clipEstera)">
        <Path d={espiga(-4, 520, 340, 470, 12)} stroke={C.esteraSom} strokeWidth={1.1} opacity={0.42} />
        <Path d={espiga(2, 520, 346, 470, 12)} stroke={C.esteraLuz} strokeWidth={0.9} opacity={0.35} />
        <Path d="M4,380 L104,355 L300,384 L500,440" stroke={C.esteraLuz} strokeWidth={3} fill="none" opacity={0.6} />
        {/* sombra de contacto bajo la figura */}
        <Ellipse cx={290} cy={445} rx={235} ry={32} fill="url(#uma_contacto)" />
        <Ellipse cx={130} cy={425} rx={70} ry={12} fill="url(#uma_contacto)" />
      </G>
      <Path d={ESTERA} fill="none" stroke={C.esteraOsc} strokeWidth={1.6} opacity={0.75} />
      {/* bordes deshilachados */}
      <Path d="M6,386 L2,389 M7,396 L2,398 M8,406 L3,409 M8,416 L3,419 M16,428 L13,433 M30,432 L28,437 M44,436 L41,441 M58,440 L56,445 M72,445 L70,449 M86,449 L84,454 M100,454 L99,459 M112,458 L111,463 M130,463 L129,467 M168,466 L168,469 M206,466 L207,469 M246,466 L245,469 M288,466 L289,469 M330,466 L330,469 M436,466 L437,469 M480,465 L483,468 M500,458 L504,460 M34,372 L32,368 M64,365 L62,361"
        stroke={C.esteraSom} strokeWidth={1.4} strokeLinecap="round" />

      {/* ===== Cola del chal tras el bolso (derecha) y plato de barro ===== */}
      <Path d="M484,280 L497,343 C505,358 512,372 522,382 C536,394 552,405 555,421 C551,430 543,433 542,441 C530,452 515,458 503,459 L486,440 Z" fill="url(#uma_cola)" stroke={TINTA} strokeWidth={2.4} strokeLinejoin="round" />
      <Path d="M500,352 C510,370 520,384 534,396 C544,404 550,412 552,420 M497,372 C508,392 520,410 538,428 M494,392 C504,412 516,430 532,446" stroke={C.colaSom} strokeWidth={2.2} fill="none" />
      <Path d="M503,360 C512,376 522,390 536,402 M500,382 C510,400 522,416 536,432" stroke={C.mostaza} strokeWidth={1.2} fill="none" opacity={0.55} />
      <Path d="M506,366 C515,382 526,394 540,406" stroke={C.rojo} strokeWidth={1.6} fill="none" opacity={0.6} />
      {/* fleco del chal */}
      <Path d="M542,441 L546,449 M546,436 L551,443 M550,431 L556,436 M538,445 L541,453" stroke={C.cola} strokeWidth={1.6} strokeLinecap="round" />
      <Ellipse cx={533} cy={455} rx={24} ry={8} fill="#4a2c18" stroke={TINTA} strokeWidth={1.8} />
      <Ellipse cx={530} cy={452} rx={17} ry={4.2} fill="#7a4e2c" opacity={0.9} />

      {/* ===== Pies con sandalias (asoman bajo el ruedo de la falda) ===== */}
      {PIES.map((p, k) => (
        <G key={'pie' + k}>
          {/* suela gruesa de la sandalia, visible alrededor de los dedos */}
          <Path d={p.suela} fill={C.suela} stroke={TINTA} strokeWidth={2.2} strokeLinejoin="round" />
          <Path d={p.canto} stroke="#7a5034" strokeWidth={1.3} fill="none" opacity={0.85} />
          {/* empeine con luz arriba y arco en sombra */}
          <Path d={p.pie} fill={p.planta ? 'url(#uma_planta)' : 'url(#uma_pie)'} stroke={TINTA2} strokeWidth={1.5} strokeLinejoin="round" />
          <G clipPath={`url(#uma_clipPie${k})`}>
            <Path d={p.arco} fill={C.pielOsc} opacity={0.4} />
            <Ellipse cx={p.luz[0]} cy={p.luz[1]} rx={p.luz[2]} ry={p.luz[3]} fill={C.pielClara} opacity={0.35} />
          </G>
          {/* dedos en hilera, el gordo arriba */}
          {p.dedos.map(([x, y, rx, ry], i) => (
            <Ellipse key={i} cx={x} cy={y} rx={rx} ry={ry} fill={i ? '#a9693c' : '#b8784a'} stroke={TINTA2} strokeWidth={1} />
          ))}
          {/* uñas y luz en la yema */}
          <Path d={circulos(p.dedos.map(([x, y, rx, ry]) => [x - rx * 0.3, y - ry * 0.2, Math.min(rx, ry) * 0.4]), 1)} fill="#d8a878" opacity={0.75} />
          {/* tira de cuero cruzando el empeine y dedo separador */}
          {p.tira && (
            <G>
              <Path d={p.tira} stroke="#2e1a0e" strokeWidth={p.ancho + 2.4} fill="none" strokeLinecap="round" />
              <Path d={p.tira} stroke={C.correa} strokeWidth={p.ancho} fill="none" strokeLinecap="round" />
              <Path d={p.tira} stroke={C.correaLuz} strokeWidth={1.2} fill="none" strokeLinecap="round" transform="translate(1.4,0)" opacity={0.8} />
              <Path d={p.dedo} stroke={C.correa} strokeWidth={2.2} fill="none" strokeLinecap="round" />
            </G>
          )}
        </G>
      ))}

      {/* ===== Falda ===== */}
      <Path d={FALDA} fill="url(#uma_falda)" />
      <G clipPath="url(#uma_clipFalda)">
        <Ellipse cx={265} cy={345} rx={150} ry={60} fill="url(#uma_faldaLuz)" />
        {/* crestas iluminadas de los grandes pliegues */}
        <Path d="M136,300 C152,290 182,290 204,296 C188,314 166,330 140,342 C132,330 130,314 136,300 Z M226,322 C262,314 300,318 332,330 C322,352 300,372 272,384 C248,372 230,350 226,322 Z M352,334 C372,330 392,334 410,342 C404,370 400,400 398,430 C388,404 372,370 352,334 Z"
          fill={C.faldaBrillo} opacity={0.18} />
        {/* sombra que proyecta el telar sobre el regazo */}
        <Path d="M128,296 L360,334 L352,350 L124,312 Z" fill="#000" opacity={0.18} />
        {/* valles de los pliegues que caen del regazo hacia el ruedo */}
        <Path d="M286,300 C262,312 236,336 216,366 C206,380 196,390 186,398 M298,306 C282,334 266,366 256,402 M314,308 C316,344 312,388 306,428 M334,306 C350,344 362,390 366,440 M384,306 C404,346 418,398 422,448 M226,294 C206,306 184,324 164,350 C156,360 150,370 146,382 M440,300 C456,344 464,396 462,446 M190,292 C172,302 156,318 144,336"
          stroke={C.faldaSom} strokeWidth={2.6} fill="none" strokeLinecap="round" opacity={0.6} />
        <Path d="M276,300 C252,318 226,342 204,374 M292,312 C278,340 266,368 262,404 M304,314 C302,348 296,386 288,424 M322,314 C336,348 344,388 346,436 M360,310 C378,346 390,392 394,446 M410,306 C426,346 438,396 442,448 M210,298 C190,314 172,334 158,360"
          stroke={C.faldaLuz} strokeWidth={5} fill="none" strokeLinecap="round" opacity={0.4} />
        <Path d="M276,300 C252,318 226,342 204,374 M322,314 C336,348 344,388 346,436 M410,306 C426,346 438,396 442,448"
          stroke={C.faldaBrillo} strokeWidth={1.6} fill="none" strokeLinecap="round" opacity={0.45} />
        {/* enagua inferior: cenefa roja con rombos y zigzag naranja */}
        <Path d={RUEDO} stroke={C.rojoOsc} strokeWidth={30} fill="none" transform="translate(0,-8)" />
        <Path d={RUEDO} stroke="#7e2a1e" strokeWidth={13} fill="none" transform="translate(0,-9)" />
        {/* zigzag naranja con rombos dorados (bordado del ruedo) */}
        <Path d={zigzagCurva(P_RUEDO, -9, 4, 1)} stroke={C.naranja} strokeWidth={2.2} fill="none" strokeLinejoin="round" />
        <Path d={rombosCurva(P_RUEDO, -9, 2, 2)} fill={C.oro} />
        <Path d={zigzagCurva(P_RUEDO, -14.5, 1.4, 1)} stroke="#c45a34" strokeWidth={1} fill="none" />
        <Path d={RUEDO} stroke={C.oro} strokeWidth={1.1} fill="none" transform="translate(0,-17)" />
        <Path d={RUEDO} stroke={C.oro} strokeWidth={1.1} fill="none" transform="translate(0,-2)" />
        {/* ruedo ondulado de la sobrefalda con su propia cenefa (zigzag claro sobre verde) */}
        <Path d="M104,354 C138,360 170,372 204,384 C242,398 290,412 330,424 C352,431 372,438 392,444" stroke={TINTA2} strokeWidth={14} fill="none" />
        <Path d="M104,351 C138,357 170,369 204,381 C242,395 290,409 330,421 C352,428 372,435 392,441" stroke={C.verdeBanda} strokeWidth={10} fill="none" />
        <Path d={zigzagCurva(P_SOBRE, 0, 2.6, 1)} stroke={C.crema} strokeWidth={1.3} fill="none" opacity={0.9} />
        <Path d={rombosCurva(P_SOBRE, 0, 1.3, 3)} fill={C.oro} />
        <Path d="M104,346 C138,352 170,364 204,376 C242,390 290,404 330,416 C352,423 372,430 392,436" stroke={C.oro} strokeWidth={1} fill="none" opacity={0.6} />
        <Path d="M104,357 C138,363 170,375 204,387 C242,401 290,415 330,427 C352,434 372,441 392,447" stroke="#9a3a26" strokeWidth={2} fill="none" opacity={0.9} />
        <Rect x={100} y={280} width={400} height={180} fill="url(#uma_lado)" />
      </G>
      <Path d={FALDA} fill="none" stroke={TINTA} strokeWidth={2.8} strokeLinejoin="round" />

      {/* ===== Bolso tejido (mochila blanda, ladeada) ===== */}
      {/* tira derecha que cae hacia la estera */}
      <Path d="M486,322 C500,346 520,380 548,420" stroke={TINTA} strokeWidth={13} fill="none" strokeLinecap="round" />
      <Path d="M486,322 C500,346 520,380 548,420" stroke="#7a4a28" strokeWidth={9.5} fill="none" strokeLinecap="round" />
      <Path d="M486,322 C500,346 520,380 548,420" stroke={C.bolsoOcre} strokeWidth={4} strokeDasharray="3 2" fill="none" opacity={0.85} />
      <Path d={BOLSO} fill={C.bolso} />
      <G clipPath="url(#uma_clipBolso)">
        {/* bandas tejidas que siguen la curva del cuerpo blando */}
        {BANDAS_BOLSO.map(([y, h, color], i) => (
          <Path key={'bb' + i} d={curvaBolso(y)} stroke={color} strokeWidth={h} fill="none" />
        ))}
        <Path d={`${zigzagBolso(347, 3.2)} ${zigzagBolso(414, 3.2)}`} stroke={C.oro} strokeWidth={1.4} fill="none" />
        <Path d={`${zigzagBolso(347, 1.2)} ${zigzagBolso(414, 1.2)}`} stroke={C.rojo} strokeWidth={0.9} fill="none" />
        <Path d={`${curvaBolso(356)} ${curvaBolso(405)} ${curvaBolso(426)}`} stroke={C.crema} strokeWidth={1.4} strokeDasharray="1.6 2.6" fill="none" opacity={0.8} />
        {/* campo central: rombos escalonados concéntricos (rojo, naranja, ocre) */}
        {[[438, 384], [482, 378], [526, 372], [394, 390]].map(([cx, cy], k) => (
          <G key={'rb' + k}>
            {romboEscalonado(cx, cy, 22, 21, 5).map((d, i) => (
              <Path key={i} d={d} fill={['#4a2414', C.bolsoRojo, C.naranja, C.bolsoOcre, '#3a1a0e'][i]} stroke="#2a120a" strokeWidth={0.7} />
            ))}
          </G>
        ))}
        <Path d="M416,362 L460,406 M460,362 L416,406 M460,356 L504,400 M504,356 L460,400" stroke="#2a120a" strokeWidth={1.2} opacity={0.6} />
        {/* volumen: lados en sombra, centro con luz, fondo redondeado oscuro */}
        <Path d="M400,320 L520,320 L520,460 L400,460 Z" fill="url(#uma_bolso)" />
        <Ellipse cx={462} cy={378} rx={30} ry={40} fill="#f0b870" opacity={0.08} />
        <Path d="M420,440 C445,452 485,450 520,432 L520,460 L410,460 Z" fill="#000" opacity={0.3} />
      </G>
      <Path d={BOLSO} fill="none" stroke={TINTA} strokeWidth={2.6} strokeLinejoin="round" />
      {/* boca abierta y fruncida, con sombra interior */}
      <Path d="M406,334 C430,325 462,320 487,318 C476,326 440,333 406,334 Z" fill="#1e0e06" />
      <Path d="M405,335 C432,334 466,327 488,319 L490,326 C466,335 432,342 407,342 Z" fill="#8a5a2e" stroke={TINTA} strokeWidth={1.5} strokeLinejoin="round" />
      <Path d="M413,336.5 L414,341.4 M422,336 L423,341 M431,335 L432,340 M440,333.6 L441,338.8 M449,332 L450,337.2 M458,330.4 L459,335.6 M467,328.4 L468,333.4 M476,325.8 L477.4,330.8 M484,322.6 L485.6,327.6" stroke={C.bolsoSom} strokeWidth={1.2} />
      {/* fleco inferior */}
      <Path d="M436,450 L435,456 M444,451 L443.6,457 M452,451.4 L452,457.4 M460,451.4 L460.4,457.4 M468,451 L469,457 M476,450 L477.6,455.6 M484,448.6 L486,454" stroke={C.bolsoOcre} strokeWidth={1.6} strokeLinecap="round" />
      {/* tira izquierda: sale de la boca, hace un lazo y baja pegada al costado */}
      <Path d={TIRA_BOLSO} fill="#8a5a30" stroke={TINTA} strokeWidth={2.2} strokeLinejoin="round" />
      <Path d="M391,346 C391,380 399,418 413,452" stroke={C.bolsoRojo} strokeWidth={3.4} fill="none" strokeDasharray="4 2 1 2" />
      <Path d="M386.5,348 C386.5,382 393.5,420 406,454 M396,345 C396.5,378 404,416 419,450" stroke={C.oro} strokeWidth={1} fill="none" opacity={0.75} />
      <Path d="M384,346 C384,380 391,420 404,456" stroke="#000" strokeWidth={2.4} fill="none" opacity={0.25} />

      {/* ===== Torso: blusa, bandas bordadas y chaleco ===== */}
      <Path d="M256,214 C276,205 302,198 345,198 C380,200 412,216 440,246 L458,292 L455,306 L262,302 C250,272 248,240 256,214 Z" fill="url(#uma_blusa)" stroke={TINTA} strokeWidth={2} />
      <Path d="M308,197 L344,199 L345,262 L310,262 Z" fill={C.chaleco} stroke={TINTA2} strokeWidth={1.6} />
      <Path d={`${rombos(308, 345, 210, 5, 9.25)} ${rombos(308, 345, 222, 5, 9.25)} ${rombos(308, 345, 234, 5, 9.25)} ${rombos(308, 345, 246, 5, 9.25)}`} fill="none" stroke={C.chalecoSom} strokeWidth={1.2} />
      <Path d={`${rombos(312.6, 340, 216, 2.2, 9.25)} ${rombos(312.6, 340, 240, 2.2, 9.25)}`} fill={C.chalecoLuz} />
      <Path d="M326,200 L326,262" stroke={C.chalecoSom} strokeWidth={1} opacity={0.5} />
      <Path d="M308,197 L345,199 L345,262 L310,262 Z" fill="url(#uma_lado)" />
      {/* bandas bordadas a ambos lados del chaleco */}
      <Path d="M290,204 L308,200 L310,262 L292,262 Z M344,200 L360,206 L362,262 L345,264 Z" fill={C.bordado} stroke={TINTA2} strokeWidth={1.5} />
      <Path d={`${zigzag(293, 306, 214, 2.5, 6)} ${zigzag(293, 306, 230, 2.5, 6)} ${zigzag(293, 306, 246, 2.5, 6)} ${zigzag(347, 359, 216, 2.5, 6)} ${zigzag(347, 359, 232, 2.5, 6)} ${zigzag(347, 359, 248, 2.5, 6)}`} stroke={C.bordadoLuz} strokeWidth={1.3} fill="none" />
      <Path d="M294,222 L306,222 M294,238 L306,238 M294,254 L307,254 M348,224 L360,224 M348,240 L360,240 M348,256 L361,256" stroke={C.bordadoLuz} strokeWidth={1.2} strokeDasharray="1.5 1.5" />

      {/* ===== Brazo izquierdo de ella (derecha del espectador) ===== */}
      <Path d={BRAZO_D} fill="url(#uma_blusa)" stroke={TINTA} strokeWidth={2.4} />
      <G clipPath="url(#uma_clipBrazo)">
        <Path d="M368,262 C392,254 424,262 446,288 C430,272 400,266 372,270 Z" fill={C.blusaSom} opacity={0.45} />
        {/* pliegues sueltos de la manga sobre el antebrazo */}
        <Path d="M384,250 C392,262 396,276 394,292 M402,252 C410,264 414,278 412,296 M424,262 C430,272 432,284 430,298" stroke={C.blusaSom} strokeWidth={2.2} fill="none" opacity={0.55} strokeLinecap="round" />
        <Path d="M388,252 C396,264 400,278 398,292 M406,254 C414,266 418,280 416,296" stroke={C.blusaLuz} strokeWidth={1.4} fill="none" opacity={0.45} strokeLinecap="round" />
        <Path d="M380,240 C405,246 430,262 446,282" stroke={C.blusaLuz} strokeWidth={5} fill="none" opacity={0.45} />
        <Path d="M370,286 C400,294 430,298 458,290 L458,312 L370,312 Z" fill={C.blusaSom} opacity={0.65} />
        <Path d="M382,277 C405,279 428,283 448,293" stroke={C.blusaLuz} strokeWidth={3} fill="none" opacity={0.4} />
        {/* pliegues del codo */}
        <Path d="M420,258 C428,262 434,268 438,276 M410,266 C418,268 426,274 430,282 M398,284 C410,286 420,290 428,296" stroke={TINTA2} strokeWidth={1.3} fill="none" opacity={0.7} />
      </G>
      <Path d="M368,262 C392,254 424,262 446,288" stroke={TINTA2} strokeWidth={1.2} fill="none" opacity={0.6} />

      {/* ===== Manga derecha de ella (izquierda del espectador) ===== */}
      <Path d={MANGA_I} fill="url(#uma_blusa)" stroke={TINTA} strokeWidth={2.4} />
      <Path d="M266,222 C260,234 260,250 268,262 M284,214 C278,232 278,248 284,262" stroke={C.blusaSom} strokeWidth={1.8} fill="none" />
      <Path d="M258,224 C266,222 276,222 284,226 M256,236 C264,234 272,236 278,240" stroke={TINTA2} strokeWidth={1.2} fill="none" opacity={0.6} />
      {/* banda bordada vertical del antebrazo */}
      <Path d="M268,216 L280,213 L281,262 L269,263 Z" fill={C.bordado} stroke={TINTA2} strokeWidth={1.2} />
      <Path d={`${zigzag(269, 280, 224, 2, 5.5)} ${zigzag(269, 280, 240, 2, 5.5)} ${zigzag(269, 280, 254, 2, 5.5)}`} stroke={C.bordadoLuz} strokeWidth={1.1} fill="none" />

      {/* ===== Telar de cintura ===== */}
      <G transform={TELAR}>
        {/* capa inferior del tejido (lazo de urdimbre que vuelve hacia la cintura) */}
        <Path d="M0,64 L300,64 L296,74 L0,88 Z" fill={C.telaSom} stroke={TINTA} strokeWidth={1.6} strokeLinejoin="round" />
        <Path d="M0,68 L298,67 M0,72 L297,69.5 M0,76 L296,71 M0,80 L250,72 M0,84 L120,79" stroke={C.telaLuz} strokeWidth={0.9} opacity={0.75} />
        <Path d="M0,0 L307,0 L307,65 L0,65 Z" fill="url(#uma_tela)" stroke={TINTA} strokeWidth={2.4} strokeLinejoin="round" />
        <G clipPath="url(#uma_clipTela)">
          {/* urdimbre visible en el extremo lejano (aún sin tejer) */}
          <Rect x={0} y={0} width={30} height={65} fill={C.telaLuz} opacity={0.5} />
          <Path d={Array.from({ length: 22 }, (_, i) => `M0,${1.5 + i * 3} L32,${1.5 + i * 3}`).join(' ')} stroke={C.telaSom} strokeWidth={0.9} opacity={0.8} />
          {/* tramado fino */}
          <Path d={Array.from({ length: 26 }, (_, i) => `M30,${1.25 + i * 2.5} L310,${1.25 + i * 2.5}`).join(' ')} stroke={C.telaSom} strokeWidth={0.5} opacity={0.45} />
          {/* bandas longitudinales con motivos distintos */}
          <Path d="M30,5 L310,5 M30,60 L310,60 M30,16 L310,16 M30,49 L310,49" stroke={C.telaOsc} strokeWidth={2} />
          <Path d={zigzag(30, 310, 10.5, 2.6, 7)} stroke={C.telaOsc} strokeWidth={1.3} fill="none" />
          <Path d={rombos(30, 310, 54.5, 3, 8)} fill={C.telaOsc} opacity={0.8} />
          {/* banda central: tres tramos con motivos diferentes */}
          <Path d={rombos(34, 120, 32.5, 13, 26)} fill="none" stroke={C.telaOsc} strokeWidth={1.8} />
          <Path d={rombos(40.5, 120, 32.5, 6.5, 13, 26)} fill={C.telaOsc} opacity={0.85} />
          <Path d={rombos(44, 120, 32.5, 2.5, 6, 26)} fill={C.telaLuz} />
          <Path d={`${zigzag(124, 214, 26, 7, 14)} ${zigzag(124, 214, 39, 7, 14)}`} stroke={C.telaOsc} strokeWidth={2.4} fill="none" />
          <Path d={zigzag(124, 214, 32.5, 3, 14)} stroke={C.telaLuz} strokeWidth={1.4} fill="none" />
          <Path d={Array.from({ length: 6 }, (_, i) => { const x = 222 + i * 15; return `M${x},24 L${x + 6},24 L${x + 6},30 L${x + 12},30 M${x},41 L${x + 6},41 L${x + 6},35 L${x + 12},35`; }).join(' ')} stroke={C.telaOsc} strokeWidth={2.2} fill="none" />
          <Path d={rombos(222, 310, 32.5, 2.5, 7.5, 15)} fill={C.telaOsc} />
          <Path d="M120,16 L120,49 M216,16 L216,49" stroke={C.telaOsc} strokeWidth={1.6} />
          {/* sombra de la mano sobre el tejido y del borde cercano */}
          <Ellipse cx={215} cy={20} rx={40} ry={22} fill={C.blusaSom} opacity={0.3} />
          <Rect x={0} y={45} width={310} height={20} fill="#000" opacity={0.12} />
        </G>
        {/* varilla lejana (de urdimbre), con terminaciones talladas y amarre */}
        <Line x1={-6} y1={-22} x2={-6} y2={97} stroke={TINTA} strokeWidth={12} strokeLinecap="round" />
        <Line x1={-6} y1={-22} x2={-6} y2={97} stroke={C.madera} strokeWidth={8} strokeLinecap="round" />
        <Line x1={-8} y1={-21} x2={-8} y2={96} stroke={C.maderaLuz} strokeWidth={2.4} strokeLinecap="round" />
        <Path d={Array.from({ length: 14 }, (_, i) => `M-10,${-16 + i * 8.2} L-2,${-13 + i * 8.2}`).join(' ')} stroke={C.maderaSom} strokeWidth={1.3} />
        <Ellipse cx={-6} cy={-28} rx={7} ry={4.5} fill={C.madera} stroke={TINTA} strokeWidth={1.8} />
        <Ellipse cx={-6} cy={103} rx={7} ry={4.5} fill={C.madera} stroke={TINTA} strokeWidth={1.8} />
        <Path d="M-14,86 L2,86 M-14,90 L2,90 M-14,-12 L2,-12 M-14,-8 L2,-8" stroke={TINTA} strokeWidth={2.2} />
        {/* varilla de paso y lizo con su espiral de hilo */}
        <Line x1={58} y1={-10} x2={58} y2={100} stroke={TINTA} strokeWidth={4.5} strokeLinecap="round" />
        <Line x1={58} y1={-10} x2={58} y2={100} stroke={C.maderaLuz} strokeWidth={2.2} strokeLinecap="round" />
        <Line x1={71} y1={-14} x2={71} y2={96} stroke={TINTA} strokeWidth={7} strokeLinecap="round" />
        <Line x1={71} y1={-14} x2={71} y2={96} stroke={C.madera} strokeWidth={4} strokeLinecap="round" />
        <Path d={Array.from({ length: 13 }, (_, i) => `M68,${-10 + i * 8} L74,${-7 + i * 8}`).join(' ')} stroke={C.telaLuz} strokeWidth={1.3} />
        {/* barra de pecho (extremo cercano) */}
        <Line x1={311} y1={-10} x2={311} y2={50} stroke={TINTA} strokeWidth={14} strokeLinecap="round" />
        <Line x1={311} y1={-10} x2={311} y2={50} stroke={C.madera} strokeWidth={10} strokeLinecap="round" />
        <Line x1={309} y1={-9} x2={309} y2={49} stroke={C.maderaLuz} strokeWidth={3} strokeLinecap="round" />
        <Path d="M306,2 L316,4 M306,16 L316,18 M306,30 L316,32 M306,44 L316,46" stroke={C.maderaSom} strokeWidth={1.4} />
      </G>
      {/* espada de tejer: tabla ancha y clara, cruzada en diagonal */}
      <Path d="M108,293 C116,281 158,252 208,217 C214,213 222,215 219,222 C192,248 152,278 124,294 C118,297 110,298 108,293 Z" fill={C.maderaLuz} stroke={TINTA} strokeWidth={2} strokeLinejoin="round" />
      <Path d="M118,290 C150,268 186,242 214,220" stroke={C.madera} strokeWidth={1.6} fill="none" />
      <Path d="M114,292 C146,268 182,242 210,219" stroke="#f2d49a" strokeWidth={1.2} fill="none" opacity={0.8} />

      {/* ===== Manos ===== */}
      {/* puño bordado y mano izquierda del espectador sujetando el borde del tejido */}
      <Path d="M233,222 L250,219 L254,261 L238,264 Z" fill={C.bordado} stroke={TINTA2} strokeWidth={1.6} />
      <Path d="M236,227 L251,225 M238,257 L253,255" stroke={C.bordadoLuz} strokeWidth={1.3} />
      <Path d={`${zigzag(237, 251, 236, 2, 5)} ${zigzag(238, 252, 247, 2, 5)}`} stroke={C.bordadoLuz} strokeWidth={1.1} fill="none" />
      {/* dorso de la mano */}
      <Path d="M238,225 C230,221 221,220 213,223 C208,226 206,231 207,236 L238,249 Z" fill="url(#uma_mano)" stroke={TINTA} strokeWidth={1.9} strokeLinejoin="round" />
      {/* dedos finos que envuelven el borde del tejido */}
      <Path d="M213,232 C206,232.5 200,235 199,238.5 C198.5,241 201,242.5 204,241.6 C209,240.6 215,240 221,240 Z" fill="url(#uma_mano)" stroke={TINTA} strokeWidth={1.5} strokeLinejoin="round" />
      <Path d="M219,239 C211,240 204.5,242.5 203.5,246 C203,248.5 205.5,249.8 208.5,249 C214,248 220,247.5 228,247 Z" fill="url(#uma_mano)" stroke={TINTA} strokeWidth={1.5} strokeLinejoin="round" />
      <Path d="M227,245 C220,246.5 215,249 214.5,251.8 C214.3,254 217,255 220,254.2 C226,252.8 232,252 238,250.5 Z" fill="url(#uma_mano)" stroke={TINTA} strokeWidth={1.5} strokeLinejoin="round" />
      {/* pulgar por encima */}
      <Path d="M222,223 C216,217.5 209,214.5 203.5,216 C200,217.5 201,221 204.5,222 C210,223.5 214,226 218,229 Z" fill="url(#uma_mano)" stroke={TINTA} strokeWidth={1.5} strokeLinejoin="round" />
      <Path d="M214,226 C220,228 228,229 234,228 M204,238.5 L207,238 M207.5,246.5 L210.5,246 M218,251.5 L221,251 M211,233 C213,234 215,234 217,233" stroke={C.pielOsc} strokeWidth={1} fill="none" strokeLinecap="round" />
      <Path d="M201.5,238.2 C202,236.8 203.6,236.4 204.6,237.4 M205.6,246 C206.2,244.6 207.8,244.2 208.8,245.2 M203.5,218.5 C204.4,217.4 206,217.2 207,218.4" stroke="#ecd0ac" strokeWidth={1.1} fill="none" strokeLinecap="round" />
      <Path d="M212,222.5 C220,220.5 228,221.5 234,225" stroke={C.pielClara} strokeWidth={1.4} fill="none" opacity={0.6} />

      {/* puño bordado y mano derecha del espectador tejiendo con la pallana */}
      <Path d="M339,262 L366,258 L372,299 L346,301 Z" fill={C.bordado} stroke={TINTA2} strokeWidth={1.6} />
      <Path d={`${zigzag(342, 368, 270, 2.5, 6)} ${zigzag(344, 370, 288, 2.5, 6)}`} stroke={C.bordadoLuz} strokeWidth={1.3} fill="none" />
      <Path d="M341,265 L367,262" stroke={C.bordadoMed} strokeWidth={2} />
      <Path d="M342,279 L369,276 M343,296 L371,294" stroke={C.bordadoLuz} strokeWidth={1.2} strokeDasharray="1.5 1.5" />
      {/* pallana (palito de escoger hilos) */}
      <Path d="M256,306 L294,284" stroke={TINTA} strokeWidth={3.6} strokeLinecap="round" />
      <Path d="M256,306 L294,284" stroke={C.maderaLuz} strokeWidth={1.8} strokeLinecap="round" />
      {/* mano estirada hacia la izquierda: escala horizontal anclada en la muñeca (x=347) */}
      <G transform="matrix(1.25,0,0,1,-86.75,0)">
      {/* pulgar apoyado en el tejido */}
      <Path d="M336,287 C326,289.5 318,292 313,295 C309.5,297.5 311,300.5 315,300 C324,299 334,297.5 346,296 Z" fill="url(#uma_mano)" stroke={TINTA} strokeWidth={1.5} strokeLinejoin="round" />
      {/* dorso de la mano, huesudo */}
      <Path d="M345,262 C333,257.5 318,257 306,259.5 C299,261 295,265 296,270 L305,284 C317,290 331,293 347,295 Z" fill="url(#uma_mano)" stroke={TINTA} strokeWidth={1.9} strokeLinejoin="round" />
      {/* dedos largos que cuelgan hacia el tejido y sujetan la pallana */}
      <Path d="M306,262 C299.5,266 295.5,273 294.5,281 C294,286 298,288.5 300.6,285.2 C302,279 305.5,273 311.5,268 Z" fill="url(#uma_mano)" stroke={TINTA} strokeWidth={1.4} strokeLinejoin="round" />
      <Path d="M312.5,268.5 C306.5,273.5 303.5,280.5 303.4,288 C303.4,292.6 308,293.8 309.4,290.2 C310.4,284.4 313.6,279.4 318.6,275 Z" fill="url(#uma_mano)" stroke={TINTA} strokeWidth={1.4} strokeLinejoin="round" />
      <Path d="M320.6,275.4 C315.6,280.4 313.4,286.4 314.2,292.2 C315,296.2 319.4,296.4 320.4,292.8 C321,288.4 323.6,284.4 327.6,281.4 Z" fill="url(#uma_mano)" stroke={TINTA} strokeWidth={1.4} strokeLinejoin="round" />
      {/* nudillos, tendones y uñas */}
      <Path d="M300,266 C303,268 305.5,269 308,269.4 M308,272 C310.5,274 313,275 315.5,275.4 M316,262 C321,268 328,274 338,279 M325,260.5 C330,266 336,269.5 344,271"
        stroke={C.pielOsc} strokeWidth={1} fill="none" strokeLinecap="round" />
      <Ellipse cx={303} cy={265} rx={2.2} ry={1.5} fill={C.pielClara} opacity={0.6} />
      <Ellipse cx={310.5} cy={271.5} rx={2} ry={1.4} fill={C.pielClara} opacity={0.55} />
      <Path d="M295.6,283.6 L298.2,285.4 M304.4,290.4 L307,292 M315.2,294 L317.8,295" stroke="#ecd0ac" strokeWidth={1.5} strokeLinecap="round" />
      <Path d="M304,261 C317,258 330,258.5 342,262" stroke={C.pielClara} strokeWidth={1.5} fill="none" opacity={0.6} />
      </G>

      {/* ===== Chal / rebozo a rayas (dominante verde-azulado) ===== */}
      {/* lado derecho (sobre la espalda y el hombro izquierdo de ella) */}
      <Path d={CHAL_DER} fill={C.teal} />
      <G clipPath="url(#uma_clipChalDer)">
        {franjas(rayasChal(10, 190, 32), [330, 200], [420, 240], [500, 340], [0.55, -0.83])}
        {/* cenefa ancha del borde: rombos crema sobre verde */}
        <Path d="M330,197 Q420,235 498,335" stroke={C.verdeBanda} strokeWidth={14} fill="none" />
        <Path d="M330,197 Q420,235 498,335" stroke={C.crema} strokeWidth={8} strokeDasharray="5 3" fill="none" opacity={0.8} />
        <Path d="M330,197 Q420,235 498,335" stroke={C.verdeBanda} strokeWidth={3.5} strokeDasharray="2 6" strokeDashoffset={-3} fill="none" />
        <Path d="M330,197 Q420,235 498,335" stroke={C.rojo} strokeWidth={1.6} strokeDasharray="1.5 6.5" strokeDashoffset={1} fill="none" />
        <Path d="M335,188 Q426,226 506,327 M326,205 Q414,245 490,343" stroke={C.rojoOsc} strokeWidth={2} fill="none" />
        {/* pliegues grandes de la tela */}
        <Path d="M380,122 C410,150 432,180 448,220 M360,140 C392,168 418,200 436,240 M410,110 C430,140 448,180 460,230" stroke={C.tealSom} strokeWidth={4} fill="none" opacity={0.45} />
        <Rect x={318} y={90} width={182} height={256} fill="url(#uma_lado)" />
        <Path d={CHAL_DER} fill="url(#uma_sombra)" opacity={0.35} />
      </G>
      <Path d={CHAL_DER} fill="none" stroke={TINTA} strokeWidth={2.8} strokeLinejoin="round" />
      <Path d="M380,122 C410,150 432,180 448,220 M360,140 C392,168 418,200 436,240" stroke={TINTA2} strokeWidth={1.2} fill="none" opacity={0.5} />

      {/* lado izquierdo (sobre el hombro derecho de ella) */}
      <Path d={CHAL_IZQ} fill={C.teal} />
      <G clipPath="url(#uma_clipChalIzq)">
        {franjas(rayasChal(2, 80, 30), [296, 140], [268, 184], [244, 224], [0.85, 0.52])}
        {/* hombro iluminado */}
        <Path d="M300,138 C288,156 272,182 256,212" stroke={C.tealLuz} strokeWidth={6} fill="none" opacity={0.35} />
        {/* cenefa del borde */}
        <Path d="M246,215 Q290,200 334,186" stroke={C.verdeBanda} strokeWidth={13} fill="none" />
        <Path d="M246,215 Q290,200 334,186" stroke={C.crema} strokeWidth={7} strokeDasharray="5 3" fill="none" opacity={0.8} />
        <Path d="M246,215 Q290,200 334,186" stroke={C.verdeBanda} strokeWidth={3} strokeDasharray="2 6" strokeDashoffset={-3} fill="none" />
        <Path d="M246,223 Q290,208 336,193" stroke={C.rojoOsc} strokeWidth={2.4} fill="none" />
      </G>
      <Path d={CHAL_IZQ} fill="none" stroke={TINTA} strokeWidth={2.8} strokeLinejoin="round" />

      {/* ===== Cuello y cuello de la blusa ===== */}
      <Path d="M318,136 L348,132 L352,156 C340,162 326,162 316,157 Z" fill={C.pielSom} stroke={TINTA} strokeWidth={1.8} />
      <Path d="M322,140 C332,146 342,146 350,140 L351,148 C342,152 330,151 320,146 Z" fill={C.pielOsc} opacity={0.4} />
      <Path d="M314,153 C328,161 344,160 354,150 L356,156 C346,166 328,167 314,160 Z" fill={C.crema} stroke={TINTA2} strokeWidth={1.2} />

      {/* ===== Nudo del chal: misma tela rayada, dos puntas y pliegues radiales ===== */}
      {/* pliegues que tiran hacia el nudo */}
      <Path d="M300,160 C308,165 314,170 317,177 M296,170 C304,174 310,178 314,183 M354,158 C346,164 339,170 336,177 M360,168 C352,172 345,177 340,182" stroke={TINTA2} strokeWidth={1.3} fill="none" opacity={0.75} />
      {/* puntas rayadas que cuelgan del nudo, abiertas en V sobre el chaleco */}
      <Path d="M321,184 C317,194 312,205 306,216 C310,219 315,220 319,219 C323,208 327,197 330,189 Z" fill={C.teal} stroke={TINTA} strokeWidth={1.7} strokeLinejoin="round" />
      <Path d="M322.6,186 C318.6,196 314,206 309,217 M326.6,187.5 C322.6,197 318.6,208 315.4,219.4" stroke={C.rojo} strokeWidth={2} fill="none" />
      <Path d="M324.6,186.8 C320.6,196.5 316.4,207 312.2,218.4" stroke={C.mostaza} strokeWidth={1} fill="none" />
      <Path d="M306,216 L304.5,221 M309.5,218 L308.5,223 M313,219 L312.6,224 M316.6,219.4 L316.8,224.4" stroke={C.teal} strokeWidth={1.4} strokeLinecap="round" />
      <Path d="M335,188 C339,197 344,206 350,214 C354,214 358,212 360,209 C354,201 348,192 343,183 Z" fill={C.teal} stroke={TINTA} strokeWidth={1.7} strokeLinejoin="round" />
      <Path d="M337.6,188 C341.6,197 346.4,205.6 352,213.6 M341.4,186 C345.6,195 350.6,203 356.4,211" stroke={C.rojo} strokeWidth={2} fill="none" />
      <Path d="M339.5,187 C343.6,196 348.4,204.4 354.2,212.6" stroke={C.mostaza} strokeWidth={1} fill="none" />
      <Path d="M350,214 L350,219 M353.6,213.4 L354.4,218.4 M357,211.6 L358.4,216.4" stroke={C.teal} strokeWidth={1.4} strokeLinecap="round" />
      {/* nudo: lazada retorcida de la misma tela, con rayas en diagonal */}
      <Path d="M317,171 C319,163 330,159 339,162 C347,165 350,174 346,182 C342,190 332,194 323,191 C316,188 314,179 317,171 Z" fill={C.teal} stroke={TINTA} strokeWidth={2} strokeLinejoin="round" />
      <G clipPath="url(#uma_clipNudo)">
        <Path d="M312,168 C322,166 334,172 344,184 M312,175 C322,173 332,179 340,191 M318,161 C328,160 340,165 350,175 M314,183 C320,182 326,186 330,194" stroke={C.rojo} strokeWidth={2.6} fill="none" />
        <Path d="M312,171.5 C322,169.5 333,175.5 342,187.5 M316,164.5 C326,163 337,168 347,179.5" stroke={C.mostaza} strokeWidth={1.1} fill="none" />
        <Path d="M313,179 C321,177.5 329,182 335,192" stroke={C.morado} strokeWidth={1.6} fill="none" />
        {/* volumen: luz arriba a la izquierda, sombra abajo a la derecha */}
        <Ellipse cx={326} cy={168} rx={8} ry={4} fill={C.tealLuz} opacity={0.45} />
        <Path d="M330,192 C340,190 347,183 348,174 L352,196 Z" fill="#000" opacity={0.3} />
      </G>
      {/* pliegue que retuerce la lazada */}
      <Path d="M324,162.5 C330,170 333,180 331,192" stroke={TINTA2} strokeWidth={1.5} fill="none" strokeLinecap="round" />
      <Path d="M317,176 C322,174 327,175 331,178" stroke={TINTA2} strokeWidth={1.1} fill="none" opacity={0.7} />

      {/* ===== Pelo plateado: recogido detrás de la oreja ===== */}
      <Path d={PELO} fill="url(#uma_pelo)" stroke={TINTA} strokeWidth={2.2} />
      <G clipPath="url(#uma_clipPelo)">
        {/* mechones oscuros en manojos */}
        <Path d="M350,68 C366,72 380,82 388,96 M358,78 C372,86 382,100 385,116 M368,98 C376,108 379,120 378,134 M376,68 C387,75 394,88 396,102 M390,116 C388,128 384,138 378,146 M362,108 C368,118 370,128 368,138"
          stroke={C.peloSom} strokeWidth={2.6} fill="none" opacity={0.85} />
        {/* mechones claros, plateados y blancos */}
        <Path d="M354,71 C369,75 381,86 389,100 M372,68 C384,74 392,86 395,100 M362,88 C373,96 379,108 382,120 M384,104 C390,114 391,126 386,138 M366,82 C374,88 380,96 383,106"
          stroke={C.peloLuz} strokeWidth={1.3} fill="none" opacity={0.75} />
        <Path d="M357,74 C370,79 380,88 386,98 M379,72 C388,80 393,90 394,100" stroke="#f4f2ec" strokeWidth={0.8} fill="none" opacity={0.5} />
        {/* trenza que cae tras la oreja */}
        <Path d="M374,112 C380,116 386,116 390,112 M372,120 C378,124 384,124 388,120 M370,128 C375,131 380,131 383,128" stroke={C.peloSom} strokeWidth={1.6} fill="none" />
        <Path d="M374,115 C379,118 384,118 388,115 M372,123 C377,126 382,126 386,123" stroke={C.peloLuz} strokeWidth={1.1} fill="none" opacity={0.8} />
      </G>

      {/* ===== Cara ===== */}
      <Path d={CARA} fill="url(#uma_piel)" />
      <G clipPath="url(#uma_clipCara)">
        {/* sombra bajo el ala del sombrero */}
        <Path d="M286,68 C312,66 343,66 366,70 L366,84 C345,78 315,77 286,84 Z" fill={C.pielOsc} opacity={0.4} />
        {/* cuencas hundidas bajo el arco ciliar */}
        <Ellipse cx={299} cy={94} rx={8} ry={5.5} fill="url(#uma_cuenca)" />
        <Ellipse cx={327} cy={93.5} rx={13} ry={6.5} fill="url(#uma_cuenca)" />
        {/* lado derecho del rostro (en sombra): mejilla caída hacia la oreja */}
        <Path d="M342,86 C353,98 356,118 349,140 C358,132 362,118 362,102 C362,92 353,86 342,86 Z" fill={C.pielSom} opacity={0.38} />
        {/* lado derecho de la nariz, en sombra */}
        <Path d="M306,93 C311,99 316,104 320,109 C317,111 313,111 309,110 C307,104 306,98 306,93 Z" fill={C.pielSom} opacity={0.55} />
        {/* luces: frente, pómulo cercano, dorso y punta de la nariz */}
        <Ellipse cx={310} cy={80} rx={16} ry={4.5} fill={C.pielClara} opacity={0.3} />
        <Ellipse cx={331} cy={108} rx={8} ry={4.2} fill={C.pielClara} opacity={0.16} />
        <Path d="M304.6,95 C304,101 303.8,107 305,112" stroke={C.pielClara} strokeWidth={2.4} fill="none" opacity={0.7} strokeLinecap="round" />
        <Ellipse cx={308.5} cy={113.5} rx={4} ry={3.4} fill={C.pielClara} opacity={0.45} />
        {/* mentón y papada en sombra */}
        <Path d="M306,134 C314,141 328,143 344,138 L352,150 L300,150 Z" fill={C.pielOsc} opacity={0.2} />
        <Ellipse cx={333} cy={116} rx={8} ry={5} fill="#b5523a" opacity={0.07} />
        {/* arrugas de la frente */}
        <Path d="M294,77.5 C306,75.5 324,75.2 346,77.5 M296,82 C308,80 324,79.8 342,82.2 M300,86 C306,85 312,85 316,85.6 M320,84.6 C328,83.8 336,84 343,85.4"
          stroke={C.pielOsc} strokeWidth={0.9} fill="none" strokeLinecap="round" opacity={animo === 'sorprendido' ? 0.8 : 0.5} />
        {/* patas de gallo en abanico */}
        <Path d="M337,93 L344,90.5 M337.6,96 L345,96 M337,99 L344,101.8 M339,102 L344.5,106 M291.5,94 L289.5,92.5 M292,97.5 L289.5,98.5"
          stroke={C.pielOsc} strokeWidth={0.9} fill="none" strokeLinecap="round" opacity={0.55} />
        {/* pliegue del pómulo y surco nasogeniano cercano */}
        <Path d="M321.5,111 C328,112.5 335,115.5 340,120.5 C343,125 343.5,131 341,136" stroke={C.pielOsc} strokeWidth={1.3} fill="none" strokeLinecap="round" opacity={0.75} />
        <Path d="M330,106.5 C336,108 341,110 345,113" stroke={C.pielOsc} strokeWidth={0.9} fill="none" strokeLinecap="round" opacity={0.45} />
        {/* surco lejano (junto al contorno izquierdo) */}
        <Path d="M297.5,100 C299,107 300.5,113 302.4,118.5" stroke={C.pielOsc} strokeWidth={1.2} fill="none" strokeLinecap="round" opacity={0.6} />
        {/* líneas verticales del labio superior, comisuras caídas y surco del mentón */}
        <Path d="M309,120.5 L309.6,123.6 M313,121 L313.3,124 M317,121.2 L317,124 M321,121 L320.8,123.6 M326,120.4 L325.6,123"
          stroke={C.pielOsc} strokeWidth={0.7} fill="none" opacity={0.42} />
        <Path d="M304.5,128 C305,131 306.5,133 308.5,134.5 M335.5,125 C337.5,128 337.8,131.5 336,134.5 M311,136.5 Q319,139.5 328,136.8"
          stroke={C.pielOsc} strokeWidth={0.9} fill="none" opacity={0.5} />
      </G>
      <Path d={CARA} fill="none" stroke={TINTA} strokeWidth={1.9} strokeLinejoin="round" />
      {/* nariz grande y aguileña: contorno del dorso, punta, aleta y fosa */}
      <Path d="M305.5,94.5 C303.6,100 302.8,106 303.4,111.5" stroke={TINTA2} strokeWidth={1.3} fill="none" strokeLinecap="round" opacity={0.8} />
      <Path d="M302.5,115 C305,119 310.5,120.6 315,118.6 C318,117.2 320.4,114.4 321.6,110.8 C321,108 318.5,106.6 315.5,107.4"
        stroke={TINTA2} strokeWidth={1.6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M312.2,117.4 C313.6,115.6 316.2,115.4 317.4,116.6 C316.4,118.2 313.8,118.6 312.2,117.4 Z" fill={C.pielOsc} />
      <Path d="M315,108.6 C317.4,109.6 318.8,111.6 318.6,114" stroke={C.pielClara} strokeWidth={1} fill="none" opacity={0.6} />
      {/* oreja y arete */}
      <Path d="M358,86 C367,82 373,90 372.5,102 C372,112 367,118 359,116 Z" fill="url(#uma_mano)" stroke={TINTA} strokeWidth={1.8} />
      <Path d="M362,92 C367,94 368.5,100 366.5,108 M362,98 C364,100 364.5,103 363,106" stroke={C.pielOsc} strokeWidth={1.2} fill="none" />
      <Path d="M366,115.5 C364,118 365,120 367,120.5" stroke={C.oro} strokeWidth={1.4} fill="none" />
      <Path d="M364.2,121 L369.8,121 L369,124 L365,124 Z" fill={C.oro} stroke={TINTA} strokeWidth={0.9} />
      <Path d="M365,124 C362.6,127 363.2,131.5 367,133 C370.8,131.5 371.4,127 369,124 Z" fill={C.crema} stroke={TINTA} strokeWidth={1} />
      <Path d="M365.5,127 L368.5,127 M366,130 L368,130" stroke={C.oro} strokeWidth={0.9} />
      <Circle cx={367} cy={134.6} r={1.2} fill={C.oro} stroke={TINTA} strokeWidth={0.6} />
      <Ojos animo={animo} ojosCerrados={ojosCerrados} />
      <Cejas animo={animo} />
      <Boca animo={animo} />
      {/* mechones plateados sobre la frente, recogidos hacia atrás */}
      <Path d="M292,72 C310,68 340,67 362,70 C364,75 364,80 362,85 C356,79 346,76 333,75 C319,74 305,74.5 294,76.5 C291.5,75.5 291,74 292,72 Z" fill="url(#uma_pelo)" stroke={TINTA2} strokeWidth={1.2} />
      <Path d="M298,73.5 C312,70.5 332,70 352,72.5 M340,73 C350,75 356,78 361,82" stroke={C.peloLuz} strokeWidth={1.1} fill="none" opacity={0.9} />
      <Path d="M306,75 C318,73 332,73 344,74.5" stroke={C.peloSom} strokeWidth={0.9} fill="none" opacity={0.6} />
      <Path d="M291.5,72 C287,77 285.5,84 287,92 C289,88 291,84.5 294,81.5 C294.5,78 294.5,75 295,73 Z" fill={C.pelo} stroke={TINTA} strokeWidth={1.2} />
      <Path d="M290,77 C289,81 288.5,85 288.5,88" stroke={C.peloLuz} strokeWidth={1} fill="none" />

      {/* ===== Sombrero de paja ===== */}
      <Path d={COPA} fill="url(#uma_sombrero)" stroke={TINTA} strokeWidth={2.6} strokeLinejoin="round" />
      <G clipPath="url(#uma_clipCopa)">
        <Path d={celosia(290, 12, 378, 42, 10)} stroke={C.pajaSom} strokeWidth={0.9} opacity={0.5} />
        <Path d={`${rombos(288, 380, 27, 13, 24)} ${rombos(288, 380, 27, 8, 24)} ${rombos(288, 380, 27, 3, 24)}`} fill="none" stroke={C.pajaSom} strokeWidth={1.2} opacity={0.75} />
        <Path d="M298,12 C318,8 342,7 360,9" stroke={C.pajaSom} strokeWidth={1.6} fill="none" />
        <Path d="M301,10 C298,24 296,38 296,50" stroke={C.pajaLuz} strokeWidth={4} fill="none" opacity={0.5} />
        <Rect x={288} y={0} width={90} height={52} fill="url(#uma_lado)" />
      </G>
      {/* ala: más ancha, curvada hacia abajo en los extremos */}
      <Path d={BRIM} fill="url(#uma_ala)" stroke={TINTA} strokeWidth={2.6} strokeLinejoin="round" />
      <Path d="M270,63 C292,68 330,68 360,61 C378,57 392,52 400,46" stroke={C.pajaSom} strokeWidth={1.4} fill="none" />
      <Path d="M280,56 C300,52 340,48 370,45" stroke="#ecc580" strokeWidth={2} fill="none" opacity={0.6} />
      <Path d="M268,65 C278,68 290,69.5 300,70" stroke="#5e4024" strokeWidth={2} fill="none" opacity={0.5} />
      {/* cinta tejida fina con rombos rojo, azul y verde */}
      <Path d="M291,46 C320,49 350,46 376,39.5 L378.5,49 C352,55.5 320,57.5 290,55.5 Z" fill="#6e3428" stroke={TINTA} strokeWidth={1.5} strokeLinejoin="round" />
      <Path d="M291,50.8 C320,53.5 350,50.5 377.5,44.3" stroke="#a8443a" strokeWidth={4.6} strokeDasharray="4 8" fill="none" />
      <Path d="M291,50.8 C320,53.5 350,50.5 377.5,44.3" stroke="#4a7c96" strokeWidth={4.6} strokeDasharray="4 8" strokeDashoffset={-4} fill="none" />
      <Path d="M291,50.8 C320,53.5 350,50.5 377.5,44.3" stroke="#6a9a5e" strokeWidth={4.6} strokeDasharray="4 8" strokeDashoffset={-8} fill="none" />
      <Path d="M291,50.8 C320,53.5 350,50.5 377.5,44.3" stroke={C.crema} strokeWidth={1.4} strokeDasharray="1 3" fill="none" opacity={0.9} />
      <Path d="M291,47.8 C320,50.6 350,47.6 376.6,41.2 M291,53.8 C320,56.4 350,53.4 378,47.4" stroke="#d29a7a" strokeWidth={0.9} fill="none" />
      <Path d="M291,46 C320,49 350,46 376,39.5 L378.5,49 C352,55.5 320,57.5 290,55.5 Z" fill="url(#uma_lado)" />

      {/* ===== Destellos y glifos dorados ===== */}
      <G>
        <Path d="M146,306 L153,302 L151,312 M160,316 C164,314 167,318 164,322 M286,326 L286,340 M286,326 L296,326 L292,332 L298,340 M442,304 L442,316 M442,304 L452,300 L452,312 M466,290 L472,286 L470,298 M412,322 L414,316"
          stroke={C.brillo} strokeWidth={4.5} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={0.25} />
        <Path d="M146,306 L153,302 L151,312 M160,316 C164,314 167,318 164,322 M286,326 L286,340 M286,326 L296,326 L292,332 L298,340 M442,304 L442,316 M442,304 L452,300 L452,312 M466,290 L472,286 L470,298 M412,322 L414,316"
          stroke={C.brillo} strokeWidth={1.8} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <Path d={circulos(DESTELLOS, 2.6)} fill={C.brillo} opacity={0.22} />
        <Path d={circulos(DESTELLOS, 1)} fill="#fff3c4" />
      </G>
    </Svg>
  );
}
