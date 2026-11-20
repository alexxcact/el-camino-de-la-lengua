// ───────────────────────────────────────────────────────────────
// Sol de los Pastos: emblema de la app (ícono, pantalla de inicio).
// Sigue la estructura de las cerámicas pastas (p. ej. platos de Tuza): un
// cuadrado hueco al centro; ocho triángulos, dos por lado, que forman la
// estrella de ocho puntas con una "V" en cada punto cardinal; un anillo que la
// encierra; una franja de dientes de sierra y un borde de círculo doble.
// Geometría pura en un lienzo de 100×100 (centro 50,50): la usan el componente
// SolPasto y el script que genera los PNG del ícono (scripts/gen-iconos.mjs).
// ───────────────────────────────────────────────────────────────

export const PALETA_SOL = {
  noche: '#0B1F2A',
  nocheAlta: '#123544',
  dorado: '#FAC775',
  terracota: '#D9643A',
  crema: '#F4E6C8',
  turquesa: '#1D9E75',
};

const r2 = (n) => Math.round(n * 100) / 100;
const polar = (r, ang) => [50 + r * Math.cos(ang), 50 + r * Math.sin(ang)];
const pathDe = (pts) => `M${pts.map(([x, y]) => `${r2(x)} ${r2(y)}`).join(' L')} Z`;

// Gira el punto (x, y) relativo al centro un ángulo `a`.
function girar([x, y], a) {
  const c = Math.cos(a);
  const s = Math.sin(a);
  return [50 + x * c - y * s, 50 + x * s + y * c];
}

// Estrella de ocho puntas: por cada lado del cuadrado (semilado h), dos
// triángulos con la base en cada mitad del lado. El borde exterior de cada uno
// sigue casi la prolongación del lado del cuadrado y el interior converge al
// centro del lado: entre las dos puntas queda la "V" de cada punto cardinal y
// entre lados, el hueco ancho de las diagonales (como en las cerámicas).
function estrella(h, alto) {
  const out = [];
  const x = h * 0.9;
  for (let k = 0; k < 4; k++) {
    const a = (k * Math.PI) / 2;
    // Lado de arriba antes de girar (y negativa = arriba).
    out.push(pathDe([[-h, -h], [0, -h], [-x, -alto]].map(p => girar(p, a))));
    out.push(pathDe([[0, -h], [h, -h], [x, -alto]].map(p => girar(p, a))));
  }
  return out;
}

// Franja de dientes de sierra entre r0 y r1 (n dientes hacia afuera).
function dientes(n, r0, r1) {
  const out = [];
  const paso = (2 * Math.PI) / n;
  for (let i = 0; i < n; i++) {
    const a0 = -Math.PI / 2 + i * paso;
    out.push(pathDe([polar(r0, a0), polar(r0, a0 + paso), polar(r1, a0 + paso / 2)]));
  }
  return out;
}

// Capas del sol, de atrás hacia adelante: { d | circulo, fill, stroke?, sw?, opacity? }.
// conBorde=false quita la franja y el círculo doble (versión mínima).
export function capasSol({ conBorde = true } = {}) {
  const P = PALETA_SOL;
  const capas = [];
  if (conBorde) {
    capas.push({ circulo: { cx: 50, cy: 50, r: 47.5 }, fill: 'none', stroke: P.dorado, sw: 2.4 });
    capas.push({ circulo: { cx: 50, cy: 50, r: 44 }, fill: 'none', stroke: P.dorado, sw: 1 });
    for (const d of dientes(24, 35.5, 43)) capas.push({ d, fill: P.terracota });
    capas.push({ circulo: { cx: 50, cy: 50, r: 35 }, fill: 'none', stroke: P.dorado, sw: 1 });
  }
  // Anillo que encierra la estrella.
  capas.push({ circulo: { cx: 50, cy: 50, r: 31.5 }, fill: 'none', stroke: P.dorado, sw: 2.6 });
  // Estrella de ocho puntas en dorado.
  for (const d of estrella(9, 29.8)) capas.push({ d, fill: P.dorado });
  // Cuadrado hueco con la marca del centro (tres trazos, como en los platos).
  capas.push({ d: pathDe([[41, 41], [59, 41], [59, 59], [41, 59]]), fill: P.noche, stroke: P.dorado, sw: 1.4 });
  for (const y of [45.6, 50, 54.4]) capas.push({ d: pathDe([[45, y - 1], [55, y - 1], [55, y + 1], [45, y + 1]]), fill: P.crema });
  return capas;
}

// SVG en texto (para generar PNG fuera de la app).
export function svgSol({ tam = 100, conBorde = true } = {}) {
  const el = capasSol({ conBorde }).map(c => {
    const op = c.opacity != null ? ` opacity="${c.opacity}"` : '';
    const st = c.stroke ? ` stroke="${c.stroke}" stroke-width="${c.sw}"` : '';
    if (c.circulo) return `<circle cx="${c.circulo.cx}" cy="${c.circulo.cy}" r="${c.circulo.r}" fill="${c.fill}"${st}${op}/>`;
    return `<path d="${c.d}" fill="${c.fill}"${st}${op}/>`;
  }).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${tam}" height="${tam}" viewBox="0 0 100 100">${el}</svg>`;
}
