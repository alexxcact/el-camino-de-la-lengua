import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { ui, radii } from '../theme/ui';
import FiguraMini from '../components/FiguraMini';
import PersonajeVivo from '../components/PersonajeVivo';
import { personajes, palabras } from '../data/datos';
import { imgMundoColor } from '../data/imagenes';
import { mundoFondo, palabrasDePersonaje, cajaFigura } from '../data/personajesUtil';
import { elegirLinea } from '../data/dialogos';
import { numeroDe } from '../data/reacciones';
import { rachaVigente } from '../context/logica';
import { useJuego } from '../context/JuegoContext';
import { abrirPalabraEnDiccionario } from '../utils/navegacion';

const { width, height } = Dimensions.get('window');

// Altura del hero y de la figura del héroe (de pie sobre su escenario), según el
// alto de la ventana para dejar sitio al selector y a la descripción.
const ALTO_HERO = Math.round(Math.min(400, Math.max(300, height * 0.46)));
const TAM_HEROE = Math.round(ALTO_HERO * 0.475);

// Gestos que recorre el personaje al tocarlo en el hero.
const CICLO_ANIMOS = ['feliz', 'sorprendido', 'travieso', 'pensativo'];

export default function PersonajesScreen({ navigation }) {
  const { estado } = useJuego();
  const [idx, setIdx] = useState(0);
  const [toques, setToques] = useState(0);
  const [animo, setAnimo] = useState('neutral');
  const [linea, setLinea] = useState(null);

  const p = personajes[idx];
  const fondo = mundoFondo(p.id);
  const imgFondo = fondo != null ? imgMundoColor[fondo] : null;
  // El bocadillo se apoya justo sobre la cabeza de la figura (no en un top fijo).
  const geoHeroe = cajaFigura(p.id, TAM_HEROE);

  // Chips: palabras de sus escenas; la Niebla muestra las que tiene escondidas en Repaso.
  const chips = useMemo(() => {
    if (p.id === 'chutun') {
      const ids = [...new Set(estado?.palabrasFalladas || [])];
      return ids
        .map(id => palabras.find(w => w.id === id))
        .filter(Boolean)
        .map(w => ({ palabra: w, vista: true }));
    }
    return palabrasDePersonaje(p.id).map(w => ({
      palabra: w,
      vista: !!estado?.palabrasVistas?.has(w.id),
    }));
  }, [p.id, estado]);

  const elegir = (i) => {
    if (i === idx) return;
    setIdx(i);
    setAnimo('neutral');
    setLinea(null);
    setToques(0);
  };

  const tocarHero = () => {
    const animoNuevo = CICLO_ANIMOS[toques % CICLO_ANIMOS.length];
    const ctx = { n: numeroDe(p.id, estado, rachaVigente(estado)), nombre: estado?.nombreJugador || '' };
    const nueva = elegirLinea({ personaje: p.id, momento: 'heroe', ctx, ultima: linea?.id });
    setAnimo(animoNuevo);
    setToques(t => t + 1);
    setLinea(nueva);
  };

  const abrirChip = (chip) => {
    if (!chip.vista || !navigation) return;
    abrirPalabraEnDiccionario(navigation, chip.palabra.id);
  };

  // El héroe aparece de pie sobre su escenario, sin marco: el fondo del mundo
  // se atenúa arriba para el texto y se funde con la noche abajo.
  const heroContenido = (
    <>
      <LinearGradient
        colors={['rgba(11,31,42,0.55)', 'rgba(11,31,42,0.12)', 'rgba(11,31,42,0.35)', colors.noche]}
        locations={[0, 0.4, 0.9, 1]}
        style={StyleSheet.absoluteFill}
      />
      <View style={s.heroTxt}>
        <Text style={s.heroNombre}>{p.nombre}</Text>
        <Text style={s.heroRol}>{p.rol}</Text>
      </View>
      <View style={s.escenario} pointerEvents="box-none">
        <PersonajeVivo
          key={p.id}
          personaje={p.id}
          animo={animo}
          pulso={toques}
          tamano={TAM_HEROE}
          onPress={tocarHero}
          accessibilityLabel={`${p.nombre}. Toca para escuchar`}
        />
      </View>
      <View style={[s.burbujaWrap, { bottom: geoHeroe.alto - 6 }]} pointerEvents="none" accessibilityLiveRegion="polite">
        {linea ? (
          <View style={[s.burbuja, { borderColor: p.color }]}>
            <Text style={s.burbujaTxt}>{linea.texto}</Text>
            <View style={[s.burbujaCola, { borderTopColor: p.color }]} />
          </View>
        ) : (
          <Text style={s.heroHint}>Toca al personaje para escuchar</Text>
        )}
      </View>
    </>
  );

  const tituloChips = p.id === 'chutun' ? 'Palabras que escondo' : 'Palabras que me acompañan';

  return (
    <View style={s.container}>

      {/* Hero: personaje vivo sobre el fondo de su mundo */}
      {imgFondo ? (
        <ImageBackground source={imgFondo} style={s.hero} resizeMode="cover">
          {heroContenido}
        </ImageBackground>
      ) : (
        <View style={s.hero}>
          <LinearGradient colors={colors.gradAurora} style={StyleSheet.absoluteFill} />
          {heroContenido}
        </View>
      )}

      <ScrollView style={s.content} contentContainerStyle={{ padding: 16, paddingBottom: 30 }} showsVerticalScrollIndicator={false}>

        <View style={s.seccionPill}>
          <Text style={s.seccionPillTxt}>HÉROES DEL CAMINO</Text>
        </View>

        {/* Selector de miniaturas */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.minisWrap}>
          {personajes.map((pj, i) => (
            <TouchableOpacity
              key={pj.id}
              onPress={() => elegir(i)}
              style={[s.mini, i === idx && s.miniOn]}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel={pj.nombre}
              accessibilityState={{ selected: i === idx }}
            >
              <FiguraMini personaje={pj.id} ancho={76} alto={78} animo={i === idx ? 'feliz' : 'neutral'} style={i !== idx && s.miniApagado} />
              <View style={[s.miniSuelo, { backgroundColor: i === idx ? colors.doradoNeon : pj.color }]} />
              <Text style={[s.miniNom, i === idx && { color: colors.doradoNeon }]}>{pj.nombre}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Descripción */}
        <View style={[s.descCard, { borderLeftColor: p.color }]}>
          <Text style={s.descLbl}>DESCRIPCIÓN</Text>
          <Text style={s.descTxt}>{p.desc}</Text>
        </View>

        {/* Palabras del personaje */}
        {chips.length > 0 && (
          <View style={s.palabrasCard}>
            <Text style={s.descLbl}>{tituloChips.toUpperCase()}</Text>
            <View style={s.chipsWrap}>
              {chips.map(chip => (
                <TouchableOpacity
                  key={chip.palabra.id}
                  style={[s.chip, !chip.vista && s.chipOculto]}
                  onPress={() => abrirChip(chip)}
                  disabled={!chip.vista}
                  activeOpacity={0.8}
                  accessibilityRole="button"
                  accessibilityLabel={chip.vista ? `Ver ${chip.palabra.p} en el diccionario` : 'Palabra por descubrir'}
                >
                  <Text style={[s.chipTxt, !chip.vista && s.chipTxtOculto]}>
                    {chip.vista ? chip.palabra.p : '¿?'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.noche },

  // Hero
  hero:       { width, height: ALTO_HERO, overflow: 'hidden' },
  heroTxt:    { position: 'absolute', top: 12, left: 16, right: 16 },
  heroNombre: { color: colors.cielo, fontSize: 30, fontFamily: fonts.extra, textShadowColor: 'rgba(11,31,42,0.8)', textShadowRadius: 8 },
  heroRol:    { color: colors.turquesaSuave, fontSize: 12, fontFamily: fonts.medium, fontStyle: 'italic', marginTop: 2, letterSpacing: 1 },
  // La figura se apoya en la base del hero, centrada.
  escenario:  { position: 'absolute', left: 0, right: 0, bottom: 0, alignItems: 'center' },
  burbujaWrap:{ position: 'absolute', left: 16, right: 16, alignItems: 'center' },
  heroHint:   { ...ui.caption, color: colors.turquesaSuave, textAlign: 'center', textShadowColor: 'rgba(11,31,42,0.9)', textShadowRadius: 6 },
  burbuja:    {
    maxWidth: width - 48, paddingHorizontal: 14, paddingVertical: 10,
    borderRadius: radii.md, borderWidth: 1.5, backgroundColor: 'rgba(8,26,34,0.92)',
  },
  burbujaTxt: { color: colors.cielo, fontSize: 14, fontFamily: fonts.semibold, textAlign: 'center', lineHeight: 20 },
  // Colita del bocadillo apuntando al personaje (abajo).
  burbujaCola:{
    position: 'absolute', bottom: -10, alignSelf: 'center', width: 0, height: 0,
    borderLeftWidth: 9, borderRightWidth: 9, borderTopWidth: 10,
    borderLeftColor: 'transparent', borderRightColor: 'transparent',
  },

  // Scroll content
  content:       { flex: 1 },
  seccionPill:   { ...ui.pill, marginBottom: 12, marginTop: 4 },
  seccionPillTxt:{ ...ui.pillTxt },

  // Miniaturas
  minisWrap:   { gap: 14, paddingVertical: 12, paddingRight: 10, paddingLeft: 2, marginBottom: 6 },
  mini:        { alignItems: 'center', width: 80 },
  miniOn:      { transform: [{ scale: 1.08 }] },
  miniApagado: { opacity: 0.75 },
  miniSuelo:   { width: 40, height: 3, borderRadius: 2, marginTop: 2 },
  miniNom:     { fontSize: 11, fontFamily: fonts.semibold, color: colors.turquesaSuave, marginTop: 6, textAlign: 'center' },

  // Descripción
  descCard: { ...ui.card, padding: 16, marginTop: 8, borderLeftWidth: 4 },
  descLbl:  { fontSize: 10, color: colors.turquesaSuave, fontFamily: fonts.bold, letterSpacing: 3, marginBottom: 8 },
  descTxt:  { ...ui.body, fontSize: 14 },

  // Palabras del personaje
  palabrasCard:  { ...ui.card, padding: 16, marginTop: 12 },
  chipsWrap:     { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip:          { ...ui.pill, minHeight: 40, justifyContent: 'center', paddingHorizontal: 14 },
  chipOculto:    { ...ui.chip, minHeight: 40, justifyContent: 'center', paddingHorizontal: 14, opacity: 0.7 },
  chipTxt:       { ...ui.pillTxt, fontSize: 14 },
  chipTxtOculto: { ...ui.chipTxt },
});
