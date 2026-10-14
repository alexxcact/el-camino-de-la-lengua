// Tokens compartidos — aventura ilustrada andina.
// Fuente única de verdad del look de la app (derivada de la pantalla de Bienvenida).
// Úsalos en los StyleSheet de las pantallas para que TODO se vea consistente:
//   import { ui } from '../theme/ui';
//   const s = StyleSheet.create({ card: { ...ui.card }, ... });
//
// Reglas de oro:
//   - Tarjetas: ui.card (noche translúcida, esquinas 24, borde turquesa tenue, elevación).
//   - Etiquetas cortas / badges: ui.pill + ui.pillTxt (chip con borde dorado). NADA de emojis decorativos.
//   - Texto sobre fondo noche: colors.cielo (principal), colors.turquesaSuave (secundario), colors.doradoNeon (acentos/pastoker).
//   - Focos circulares (retratos, avatares, resultados): usar el componente <Medallon/>.
import { colors } from './colors';
import { fonts } from './fonts';

export const radii = { sm: 12, md: 18, lg: 24, pill: 999 };

// Padding estándar de una pantalla a pantalla completa (sin header de navegador).
export const screenPad = { paddingHorizontal: 22, paddingVertical: 24 };

export const ui = {
  // ── Tarjeta translúcida sobre la noche ──
  card: {
    borderRadius: radii.lg,
    backgroundColor: 'rgba(8,26,34,0.62)',
    borderWidth: 1,
    borderColor: colors.bordeSuave,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 2,
  },
  // Variante de tarjeta destacada (foco de la pantalla)
  cardDestacada: {
    borderRadius: radii.lg,
    backgroundColor: 'rgba(17,53,63,0.75)',
    borderWidth: 1.5,
    borderColor: 'rgba(250,199,117,0.4)',
    padding: 22,
    shadowColor: colors.doradoNeon,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 10,
    elevation: 3,
  },

  // ── Tarjeta CLARA (Fusión Híbrida) ──
  // Tarjeta blanca de contenido que FLOTA sobre el fondo noche. Trae el brillo y la
  // claridad alegre; combínala con un acento vivo (ver `acentos`/`acento(i)`) en el
  // icono, borde o barra inferior para el look de categorías por color.
  cardClara: {
    borderRadius: radii.lg,
    backgroundColor: colors.cartaClara,
    borderWidth: 1,
    borderColor: colors.cartaClaraBorde,
    overflow: 'hidden',          // para que una barra de color llegue al borde
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 4,
  },
  // Barra de etiqueta de color al pie de una tarjeta clara (estilo cuadrícula por categoría)
  barra:    { paddingVertical: 10, paddingHorizontal: 10, alignItems: 'center', justifyContent: 'center' },
  barraTxt: { color: '#fff', fontFamily: fonts.extra, fontSize: 15, letterSpacing: 0.3, textAlign: 'center' },
  // Caja de icono coloreada (acento vivo) dentro de una tarjeta clara
  iconoAcento: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  // Tipografía SOBRE tarjeta clara (texto oscuro)
  cardH:    { fontSize: 19, fontFamily: fonts.extra, color: colors.textoCarta },
  cardTxt:  { fontSize: 15, fontFamily: fonts.medium, color: colors.textoCarta, lineHeight: 21 },
  cardSubC: { fontSize: 13, fontFamily: fonts.medium, color: colors.textoCartaSuave, lineHeight: 19 },
  // Paleta rotatoria de acentos vivos (por categoría / índice)
  acentos: [colors.sol, colors.cieloVivo, colors.selva, colors.turquesa, colors.coral, colors.lila],

  // ── Chip / badge con borde dorado (reemplaza los rótulos con emoji) ──
  pill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: radii.pill,
    backgroundColor: 'rgba(250,199,117,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(250,199,117,0.5)',
  },
  pillTxt: { color: colors.doradoNeon, fontSize: 13, fontFamily: fonts.bold, letterSpacing: 0.5 },

  // Chip secundario (turquesa) para filtros/etiquetas neutras
  chip: {
    paddingHorizontal: 13,
    paddingVertical: 6,
    borderRadius: radii.pill,
    backgroundColor: 'rgba(93,202,165,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(93,202,165,0.4)',
  },
  chipTxt: { color: colors.turquesaSuave, fontSize: 14, fontFamily: fonts.semibold },

  // ── Separador fino ──
  divider: { height: 1, backgroundColor: 'rgba(93,202,165,0.28)' },

  // ── Tipografía (sobre fondo noche) ──
  h1:      { fontSize: 28, fontFamily: fonts.extra, color: colors.cielo, letterSpacing: 0.3 },
  h2:      { fontSize: 22, fontFamily: fonts.bold, color: colors.cielo },
  h3:      { fontSize: 17, fontFamily: fonts.bold, color: colors.cielo },
  body:    { fontSize: 16, fontFamily: fonts.regular, color: colors.cielo, lineHeight: 24 },
  bodyMed: { fontSize: 16, fontFamily: fonts.medium, color: colors.cielo, lineHeight: 24 },
  sub:     { fontSize: 14, fontFamily: fonts.medium, color: colors.turquesaSuave, lineHeight: 21 },
  caption: { fontSize: 12, fontFamily: fonts.medium, color: colors.turquesaSuave, lineHeight: 18 },
  // Palabra pastoker resaltada dentro de un texto
  pastoker:{ color: colors.doradoNeon, fontFamily: fonts.bold },

  // ── Halo (glow real en Android: círculos concéntricos translúcidos, NO shadowRadius) ──
  haloTurquesa: 'rgba(29,158,117,0.16)',
  haloDorado:   'rgba(250,199,117,0.12)',
  ringDorado:   'rgba(250,199,117,0.55)',
  ringTurquesa: 'rgba(93,202,165,0.55)',
};

// Devuelve un color de acento vivo rotando por índice (para categorías/misiones).
export const acento = (i = 0) => ui.acentos[((i % ui.acentos.length) + ui.acentos.length) % ui.acentos.length];
