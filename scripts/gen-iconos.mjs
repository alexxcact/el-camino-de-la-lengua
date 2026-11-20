// Genera los íconos de la app a partir del Sol de los Pastos (src/theme/solPasto.js).
// Uso: node scripts/gen-iconos.mjs <carpetaSalida>
// Produce tres PNG maestros de 1024×1024 con Chrome headless:
//   full.png  ícono cuadrado con fondo (icon.png / ic_launcher)
//   round.png ícono redondo con fondo (ic_launcher_round)
//   fg.png    primer plano transparente para el ícono adaptativo (zona segura 61 %)
// Luego scripts/gen-iconos.py los reduce a cada densidad de Android.
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execFileSync } from 'node:child_process';
import { capasSol, PALETA_SOL as P } from '../src/theme/solPasto.js';

const salida = process.argv[2];
if (!salida) { console.error('uso: gen-iconos.mjs <carpetaSalida>'); process.exit(1); }
fs.mkdirSync(salida, { recursive: true });

// Capas del sol como elementos SVG, escaladas a `lado` y centradas en (cx, cy).
function solEn(cx, cy, lado, opciones) {
  const el = capasSol(opciones).map(c => {
    const op = c.opacity != null ? ` opacity="${c.opacity}"` : '';
    const st = c.stroke ? ` stroke="${c.stroke}" stroke-width="${c.sw}"` : '';
    if (c.circulo) return `<circle cx="${c.circulo.cx}" cy="${c.circulo.cy}" r="${c.circulo.r}" fill="${c.fill}"${st}${op}/>`;
    return `<path d="${c.d}" fill="${c.fill}"${st}${op}/>`;
  }).join('');
  const k = lado / 100;
  return `<g transform="translate(${cx - lado / 2} ${cy - lado / 2}) scale(${k})">${el}</g>`;
}

// Franja tejida de rombos (como la tarjeta del día), de x0 a x1 a la altura y.
function franja(x0, x1, y, alto) {
  const paso = alto * 1.75;
  const m = alto / 2;
  let d = '';
  let r = '';
  for (let cx = x0 + paso / 2; cx < x1; cx += paso) {
    d += `M${cx - m} ${y + m} L${cx} ${y + 1} L${cx + m} ${y + m} L${cx} ${y + alto - 1} Z `;
    const t = m / 2.4;
    r += `M${cx - t} ${y + m} L${cx} ${y + m - t} L${cx + t} ${y + m} L${cx} ${y + m + t} Z `;
  }
  return `<path d="${d}" fill="none" stroke="${P.dorado}" stroke-width="${alto / 9}"/><path d="${r}" fill="${P.terracota}"/>`;
}

const fondo = `<defs><radialGradient id="g" cx="50%" cy="42%" r="70%">
  <stop offset="0%" stop-color="${P.nocheAlta}"/><stop offset="100%" stop-color="${P.noche}"/></radialGradient></defs>`;

const L = 1024;
const svgs = {
  // Cuadrado: fondo noche, sol grande y una franja tejida abajo.
  full: `<svg xmlns="http://www.w3.org/2000/svg" width="${L}" height="${L}" viewBox="0 0 ${L} ${L}">${fondo}
    <rect width="${L}" height="${L}" fill="url(#g)"/>
    ${solEn(L / 2, L * 0.46, L * 0.74, { conBorde: true })}
    ${franja(0, L, L * 0.86, L * 0.07)}</svg>`,
  // Redondo: disco noche con el sol.
  round: `<svg xmlns="http://www.w3.org/2000/svg" width="${L}" height="${L}" viewBox="0 0 ${L} ${L}">${fondo}
    <circle cx="${L / 2}" cy="${L / 2}" r="${L / 2}" fill="url(#g)"/>
    ${solEn(L / 2, L / 2, L * 0.8, { conBorde: true })}</svg>`,
  // Primer plano adaptativo: solo el sol dentro de la zona segura (66/108 ≈ 61 %; el sol llega justo a su borde).
  fg: `<svg xmlns="http://www.w3.org/2000/svg" width="${L}" height="${L}" viewBox="0 0 ${L} ${L}">
    ${solEn(L / 2, L / 2, L * 0.66, { conBorde: true })}</svg>`,
};

const chrome = process.env.CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
for (const [nombre, svg] of Object.entries(svgs)) {
  const html = `<html><body style="margin:0;background:transparent">${svg}</body></html>`;
  const tmp = path.join(os.tmpdir(), `icono-${nombre}-${process.pid}.html`);
  fs.writeFileSync(tmp, html);
  fs.writeFileSync(path.join(salida, `${nombre}.svg`), svg);
  execFileSync(chrome, [
    '--headless=new', '--disable-gpu', '--hide-scrollbars', '--default-background-color=00000000',
    `--screenshot=${path.resolve(salida, `${nombre}.png`)}`, `--window-size=${L},${L}`,
    `file:///${tmp.split(path.sep).join('/')}`,
  ], { stdio: 'ignore' });
  console.log('ok', nombre);
}
