// Renderiza un componente de figura (react-native-svg) a PNG con Chrome headless,
// junto a la imagen de referencia y una superposición al 50 %, para comparar.
// Uso: node scripts/figuras/preview.mjs <archivo.js> <salida.png> [--ref ref.png] [--export Nombre] [--props '{"animo":"feliz"}'] [--alto 700]
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execFileSync } from 'node:child_process';
import { montarComponente } from '../../src/test/componentHarness.mjs';

const args = process.argv.slice(2);
const opt = (n, d) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : d; };
const [archivo, salida] = args;
if (!archivo || !salida) { console.error('uso: preview.mjs <archivo.js> <salida.png> [--ref ref.png]'); process.exit(1); }
const ref = opt('--ref');
const exportName = opt('--export', 'default');
const props = JSON.parse(opt('--props', '{}'));
const alto = Number(opt('--alto', 700));

const TAGS = ['Svg','G','Path','Circle','Ellipse','Rect','Line','Polygon','Polyline','Defs','LinearGradient','RadialGradient','Stop','ClipPath','Mask','Use','Symbol','Text','TSpan'];
const svgMock = Object.fromEntries(TAGS.map(t => [t, t === 'Svg' ? 'svg' : t.charAt(0).toLowerCase() + t.slice(1)]));
svgMock.default = 'svg';
const app = montarComponente(archivo, { exportName, props, mocks: { 'react-native-svg': svgMock, 'react-native': { View: 'div', StyleSheet: { create: s => s } } } });

const SIN_KEBAB = new Set(['viewBox','gradientUnits','gradientTransform','preserveAspectRatio','clipPathUnits','maskUnits','patternUnits','fx','fy','cx','cy','rx','ry','x1','x2','y1','y2','dx','dy','href']);
const attr = k => SIN_KEBAB.has(k) ? k : k.replace(/[A-Z]/g, m => '-' + m.toLowerCase());
const esc = v => String(v).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');
function ser(n) {
  if (n == null || n === false || n === true) return '';
  if (Array.isArray(n)) return n.map(ser).join('');
  if (typeof n === 'string' || typeof n === 'number') return esc(n);
  if (typeof n.type === 'function') return ser(n.type(n.props));
  if (n.type && typeof n.type === 'object') n = { ...n, type: 'svg' }; // import por defecto de react-native-svg
  if (n.type === 'Fragment' || n.type === 'div') return ser(n.props.children);
  const { children, style, ...rest } = n.props || {};
  const a = Object.entries(rest).filter(([k, v]) => v != null && typeof v !== 'function' && typeof v !== 'object' && k !== 'key')
    .map(([k, v]) => ` ${attr(k)}="${esc(v)}"`).join('');
  const extra = n.type === 'svg' ? ' xmlns="http://www.w3.org/2000/svg"' : '';
  return `<${n.type}${extra}${a}>${ser(children)}</${n.type}>`;
}
let svg = ser(app.tree);
app.unmount?.();
svg = svg.replace(/<svg([^>]*?) width="[^"]*"/, '<svg$1').replace(/<svg([^>]*?) height="[^"]*"/, '<svg$1');
svg = svg.replace('<svg', `<svg style="height:${alto}px;width:auto;display:block"`);
const refTag = p => p ? `<img src="file:///${path.resolve(p).split(path.sep).join('/')}" style="height:${alto}px;display:block">` : '';
const html = `<html><body style="margin:0;background:#16202a;display:flex;gap:16px;padding:16px;align-items:flex-start">
<div>${svg}</div>${ref ? `<div>${refTag(ref)}</div><div style="position:relative">${refTag(ref)}<div style="position:absolute;inset:0;opacity:.55">${svg}</div></div>` : ''}
</body></html>`;
const tmp = path.join(os.tmpdir(), `figprev-${process.pid}.html`);
fs.writeFileSync(tmp, html);
fs.writeFileSync(salida.replace(/\.png$/, '.svg'), svg);
const chrome = process.env.CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const ancho = ref ? 2200 : 1000;
execFileSync(chrome, ['--headless=new', '--disable-gpu', '--hide-scrollbars', `--screenshot=${path.resolve(salida)}`, `--window-size=${ancho},${alto + 40}`, `file:///${tmp.split(path.sep).join('/')}`], { stdio: 'ignore' });
console.log('ok', salida);
