import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { montarComponente } from '../test/componentHarness.mjs';

function textos(arbol) {
  const out = [];
  const rec = (n) => {
    if (Array.isArray(n)) return n.forEach(rec);
    if (!n || typeof n !== 'object') return;
    if (typeof n.type === 'function') return rec(n.type(n.props));
    if (n.type === 'Text') out.push([].concat(n.props.children).map(c => (typeof c === 'object' ? '' : String(c))).join(''));
    rec(n.props?.children);
  };
  rec(arbol);
  return out.join(' | ');
}

test('créditos: autoría, los dos libros con sus datos y cuánto se usa cada uno', () => {
  const app = montarComponente('src/screens/CreditosScreen.js', {});
  const t = textos(app.tree);
  assert.match(t, /DESARROLLADO POR \| Ing\. Alexander Cuaspud/);
  assert.doesNotMatch(t, /CREACIÓN|DISEÑO/);
  assert.match(t, /Lengua de los Pastos: Vocabulario Básico y Etimologías Sagradas/);
  assert.match(t, /Academia Nariñense de Historia \(ANH\), 2015/);
  assert.match(t, /ISBN 978-958-58150-8-7/);
  assert.match(t, /AUKUSAN – Nuestra Palabra Sagrada/);
  assert.match(t, /Cabildo Indígena del Gran Tescual/);
  assert.match(t, /74 \| significados de palabras del vocabulario/);
  assert.match(t, /4 \| tótems familiares/);
  assert.match(t, /pendiente de revisión con la comunidad/);
  app.unmount();
});

test('se llega a los créditos desde Progreso y el pie lleva la autoría', () => {
  const perfil = fs.readFileSync('src/screens/PerfilScreen.js', 'utf8');
  assert.ok(perfil.includes("navigate('Creditos')"));
  assert.ok(perfil.includes('Desarrollado por {AUTOR}'));
  const app = fs.readFileSync('App.js', 'utf8');
  const pila = app.slice(app.indexOf('function PerfilStackScreen'), app.indexOf('function TabIcon'));
  assert.ok(pila.includes('name="Creditos"'));
});
