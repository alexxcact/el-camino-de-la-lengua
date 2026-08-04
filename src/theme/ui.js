// Tokens de diseño compartidos — "Futurismo Andino" pulido.
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
    borderWidth: 1.5,
    borderColor: 'rgba(93,202,165,0.35)',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 6,
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
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 8,
  },

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
  pillTxt: { color: colors.doradoNeon, fontSize: 11, fontFamily: fonts.extra, letterSpacing: 3 },

  // Chip secundario (turquesa) para filtros/etiquetas neutras
  chip: {
    paddingHorizontal: 13,
    paddingVertical: 6,
    borderRadius: radii.pill,
    backgroundColor: 'rgba(93,202,165,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(93,202,165,0.4)',
  },
  chipTxt: { color: colors.turquesaSuave, fontSize: 12, fontFamily: fonts.semibold, letterSpacing: 0.5 },

  // ── Separador fino ──
  divider: { height: 1, backgroundColor: 'rgba(93,202,165,0.28)' },

  // ── Tipografía (sobre fondo noche) ──
  h1:      { fontSize: 28, fontFamily: fonts.extra, color: colors.cielo, letterSpacing: 0.3 },
  h2:      { fontSize: 22, fontFamily: fonts.bold, color: colors.cielo },
  h3:      { fontSize: 17, fontFamily: fonts.bold, color: colors.cielo },
  body:    { fontSize: 15, fontFamily: fonts.regular, color: colors.cielo, lineHeight: 22 },
  bodyMed: { fontSize: 15, fontFamily: fonts.medium, color: colors.cielo, lineHeight: 22 },
  sub:     { fontSize: 13, fontFamily: fonts.medium, color: colors.turquesaSuave, lineHeight: 19 },
  caption: { fontSize: 11, fontFamily: fonts.regular, color: colors.turquesaSuave, letterSpacing: 1, opacity: 0.75 },
  // Palabra pastoker resaltada dentro de un texto
  pastoker:{ color: colors.doradoNeon, fontFamily: fonts.bold },

  // ── Halo (glow real en Android: círculos concéntricos translúcidos, NO shadowRadius) ──
  haloTurquesa: 'rgba(29,158,117,0.16)',
  haloDorado:   'rgba(250,199,117,0.12)',
  ringDorado:   'rgba(250,199,117,0.55)',
  ringTurquesa: 'rgba(93,202,165,0.55)',
};
