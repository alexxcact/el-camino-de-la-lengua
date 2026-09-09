// El mismo criterio se usa al premiar y al mostrar el resultado de una sesión.
export function sesionAprobada(aciertos, total) {
  return total > 0 && aciertos >= Math.ceil(total * 0.6);
}

// Conserva las palabras elegidas y distingue los dibujos repetidos con su
// significado. La etiqueta debe permanecer visible en cada opción o carta.
export function distinguirDibujos(lista) {
  const cantidades = new Map();
  lista.forEach(p => cantidades.set(p.emoji, (cantidades.get(p.emoji) || 0) + 1));
  return lista.map(p => ({
    ...p,
    etiquetaDibujo: cantidades.get(p.emoji) > 1 ? p.e : null,
  }));
}
