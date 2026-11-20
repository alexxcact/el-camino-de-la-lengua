// ───────────────────────────────────────────────────────────────
// El secreto de tu apellido: lógica pura (sin React).
// Busca lo que el jugador escribe entre los apellidos documentados en los
// libros fuente. No inventa etimologías: si un apellido no está, lo dice.
// ───────────────────────────────────────────────────────────────

export const normalizarApellido = (t) => String(t || '')
  .trim()
  .toLowerCase()
  .normalize('NFD')
  .replace(/[̀-ͯ]/g, '')
  .replace(/[^a-zñ]/g, '');

// Índice forma normalizada → entrada (incluye variantes que da el libro).
export function indiceApellidos(lista) {
  const idx = new Map();
  for (const a of lista) {
    for (const forma of [a.apellido, ...(a.variantes || [])]) {
      const k = normalizarApellido(forma);
      if (k && !idx.has(k)) idx.set(k, a);
    }
  }
  return idx;
}

// Partículas que no son apellidos ("de la Cruz", "del Castillo"...).
const PARTICULAS = new Set(['de', 'del', 'la', 'las', 'los', 'el', 'y', 'e']);

// Separa lo escrito en apellidos (admite "Cuaspud Tarapués", "cuaspud-tepud"...).
export function partesDe(texto) {
  return String(texto || '')
    .split(/[\s,;/\-]+/)
    .map(p => p.trim())
    .filter(p => normalizarApellido(p).length >= 2 && !PARTICULAS.has(normalizarApellido(p)));
}

// Devuelve { encontrados: [{ escrito, entrada }], noEncontrados: [escrito] }.
// Un mismo apellido escrito dos veces (o con su variante) cuenta una vez.
export function buscarApellidos(texto, lista) {
  const idx = indiceApellidos(lista);
  const encontrados = [];
  const noEncontrados = [];
  const vistos = new Set();
  for (const escrito of partesDe(texto)) {
    const k = normalizarApellido(escrito);
    const entrada = idx.get(k);
    const clave = entrada ? `e:${entrada.apellido}` : `n:${k}`;
    if (vistos.has(clave)) continue;
    vistos.add(clave);
    if (entrada) encontrados.push({ escrito, entrada });
    else noEncontrados.push(escrito);
  }
  return { encontrados, noEncontrados };
}

// Lectura pasta de derecha a izquierda (solo piezas con significado).
export function lecturaApellido(entrada) {
  return entrada.piezas.filter(p => !p.enlace && p.sig).map(p => p.sig).reverse();
}
