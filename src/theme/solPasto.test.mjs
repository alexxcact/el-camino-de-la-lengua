import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { capasSol, svgSol, PALETA_SOL } from './solPasto.js';

test('el Sol de los Pastos: estrella de ocho triángulos, cuadrado hueco y coordenadas válidas', () => {
  const capas = capasSol();
  assert.equal(capas.filter(c => c.d && c.fill === PALETA_SOL.dorado).length, 8, 'ocho triángulos de la estrella');
  assert.equal(capas.filter(c => c.d && c.fill === PALETA_SOL.terracota).length, 24, 'franja de dientes de sierra');
  for (const c of capas) {
    if (c.d) assert.doesNotMatch(c.d, /NaN|undefined/);
    if (c.d) for (const n of c.d.match(/-?\d+(\.\d+)?/g)) assert.ok(+n >= 0 && +n <= 100, `fuera del lienzo: ${n}`);
  }
  assert.equal(capasSol({ conBorde: false }).some(c => c.circulo?.r === 47.5), false, 'sin borde en la versión mínima');
  assert.match(svgSol(), /^<svg [^>]*viewBox="0 0 100 100"/);
});

test('la pantalla de inicio usa el emblema en código, no la imagen genérica', () => {
  const src = fs.readFileSync('src/screens/BienvenidaScreen.js', 'utf8');
  assert.ok(src.includes('<SolPasto'));
  assert.ok(!src.includes('icon.png'));
  assert.ok(src.includes('<BotonGlow'), 'se conserva el botón');
  assert.ok(!/75 palabras|AUKUSAN/.test(src), 'sin datos ni fuentes en la portada');
  const app = JSON.parse(fs.readFileSync('app.json', 'utf8')).expo;
  assert.equal(app.android.adaptiveIcon.backgroundColor, PALETA_SOL.noche);
  assert.match(fs.readFileSync('android/app/src/main/res/values/colors.xml', 'utf8'), new RegExp(`iconBackground">${PALETA_SOL.noche}<`));
});
