// Greca de espiral cuadrada (como las de los tejidos y la cerámica pasta):
// módulos cuadrados unidos, cada uno con una espiral de ángulos rectos.
// Devuelve un path de trazo (sin relleno) para una banda de `ancho` × `alto`.
const r1 = (n) => Math.round(n * 10) / 10;

export function pathGreca(ancho, alto) {
  const g = alto / 6;          // celda de la cuadrícula
  const m = g * 6;             // ancho de cada módulo
  let d = '';
  for (let x = 0; x < ancho + m; x += m) {
    // Espiral: sube por la izquierda, recorre arriba, baja por la derecha y se enrolla hacia dentro.
    const P = [
      [x + g * 0.5, alto - g * 0.5],
      [x + g * 0.5, g * 0.5],
      [x + g * 5, g * 0.5],
      [x + g * 5, alto - g * 1.6],
      [x + g * 2, alto - g * 1.6],
      [x + g * 2, g * 2],
      [x + g * 3.6, g * 2],
      [x + g * 3.6, g * 3.3],
    ];
    d += `M${P.map(([a, b]) => `${r1(a)} ${r1(b)}`).join(' L')} `;
    // Base que une un módulo con el siguiente.
    d += `M${r1(x + g * 0.5)} ${r1(alto - g * 0.5)} L${r1(x + m + g * 0.5)} ${r1(alto - g * 0.5)} `;
  }
  return { d, trazo: g * 0.55 };
}
