import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

// La interfaz usa simbología pasta e íconos dibujados, no emojis.
const EMOJI = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{2B50}]/u;
const PERMITIDOS = new Set(['✓', '✔', '✦', '✕', '✖']); // signos tipográficos, no emojis

function archivos(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) return archivos(p);
    return p.endsWith('.js') ? [p] : [];
  });
}

test('las pantallas, componentes y avisos no muestran emojis', () => {
  const malos = [];
  for (const f of [...archivos('src/screens'), ...archivos('src/components'), 'src/utils/notificaciones.js', 'App.js']) {
    fs.readFileSync(f, 'utf8').split('\n').forEach((linea, i) => {
      const t = linea.trim();
      if (t.startsWith('//') || t.startsWith('*') || t.startsWith('/*')) return;
      const hallados = [...linea].filter(c => EMOJI.test(c) && !PERMITIDOS.has(c));
      if (hallados.length) malos.push(`${f}:${i + 1} ${hallados.join('')}`);
    });
  }
  assert.deepEqual(malos, []);
});
