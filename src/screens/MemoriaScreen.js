import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { ui } from '../theme/ui';
import { palabras, mundos, shuffle } from '../data/datos';
import { useJuego } from '../context/JuegoContext';
import Acompanante from '../components/Acompanante';
import BotonGlow from '../components/BotonGlow';
import Confeti from '../components/Confeti';
import PishkuMascota from '../components/PishkuMascota';
import PalabraIlustrada from '../components/PalabraIlustrada';
import { sonar } from '../utils/sonidos';
import { vibrar } from '../utils/feedback';
import { distinguirDibujos } from '../utils/ejercicios';

const PARES = 6;
const COLUMNAS = 3;
const SEPARACION = 12;

// ── Carta individual con volteo (rotateY, useNativeDriver) ──
function Carta({ carta, faceUp, resuelta, onPress, ancho, posicion }) {
  const flip = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const a = Animated.timing(flip, {
      toValue: faceUp || resuelta ? 1 : 0,
      duration: 280,
      useNativeDriver: true,
    });
    a.start();
    return () => a.stop();
  }, [faceUp, resuelta]);

  const backRotate  = flip.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] });
  const frontRotate = flip.interpolate({ inputRange: [0, 1], outputRange: ['180deg', '360deg'] });

  return (
    <TouchableOpacity
      style={[cs.slot, { width: ancho, height: Math.round(ancho / 0.82) }]}
      onPress={onPress}
      disabled={faceUp || resuelta}
      accessible
      accessibilityRole="button"
      accessibilityLabel={faceUp || resuelta
        ? `${carta.tipo === 'past' ? carta.contenido : carta.palabra.e}${resuelta ? ', pareja encontrada' : ''}`
        : `Carta ${posicion}, oculta`}
      accessibilityHint={faceUp || resuelta ? undefined : 'Toca para descubrirla'}
      accessibilityState={{ disabled: faceUp || resuelta, selected: faceUp || resuelta }}
      activeOpacity={0.9}
    >
      {/* Dorso (símbolo Pasto) */}
      <Animated.View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={[cs.cara, cs.dorso, { transform: [{ perspective: 800 }, { rotateY: backRotate }] }]}>
        <View style={cs.marcoDorso} />
        <View style={cs.rombo} />
        <View style={cs.romboInner} />
      </Animated.View>

      {/* Frente de lectura: palabra o ilustración. */}
      <Animated.View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={[
        cs.cara, cs.frente,
        resuelta && cs.frenteResuelta,
        { transform: [{ perspective: 800 }, { rotateY: frontRotate }] },
      ]}>
        {carta.tipo === 'emoji'
          ? <>
              <PalabraIlustrada palabra={carta.palabra} tamano={Math.min(88, Math.round(ancho * (carta.etiquetaDibujo ? 0.52 : 0.66)))} />
              {carta.etiquetaDibujo && <Text style={cs.etiqueta} numberOfLines={2} adjustsFontSizeToFit minimumFontScale={0.85}>{carta.etiquetaDibujo}</Text>}
            </>
          : <>
              <Text style={cs.tipoCarta}>Pastoker</Text>
              <Text style={cs.past} numberOfLines={2} adjustsFontSizeToFit minimumFontScale={0.7}>{carta.contenido}</Text>
            </>}
        {resuelta && <View style={cs.sello}><Text style={cs.selloTxt}>✓</Text></View>}
      </Animated.View>
    </TouchableOpacity>
  );
}

// ══════════════════════════════════════════════════════════
// MEMORIA ANDINA — memorama palabra ↔ dibujo
// ══════════════════════════════════════════════════════════
export default function MemoriaScreen({ route, navigation }) {
  const { mundoId, palabrasPractica, modoPractica = false } = route.params || {};
  const mundo = mundoId ? mundos.find(m => m.id === mundoId) : null;
  const { estado, ganarPuntos, completarMision, verificarLogros, marcarMemoriaPerfecta, completarPractica } = useJuego();
  const nombre = estado.nombreJugador || 'Caminante';

  const premiar = (n) => ganarPuntos(modoPractica ? Math.max(1, Math.round(n / 2)) : n);
  const fuente = modoPractica
    ? (palabrasPractica || [])
    : palabras.filter(p => mundo.palabrasIds.includes(p.id));
  const pares = Math.min(PARES, fuente.length); // pares reales del tablero (máx 6)

  const [cartas, setCartas] = useState([]);
  const [volteadas, setVolteadas] = useState([]);   // índices boca arriba (máx 2)
  const [resueltas, setResueltas] = useState(new Set());
  const [intentos, setIntentos] = useState(0);
  const [bloqueo, setBloqueo] = useState(false);
  const [fin, setFin] = useState(false);
  const [anchoTablero, setAnchoTablero] = useState(0);
  const timeoutRef = useRef(null);
  const anchoCarta = Math.max(1, Math.floor((anchoTablero - SEPARACION * (COLUMNAS - 1)) / COLUMNAS));

  useEffect(() => {
    const pals = distinguirDibujos(shuffle(fuente).slice(0, pares));
    const baraja = [];
    pals.forEach((p, i) => {
      baraja.push({ key: `p${i}`, grupo: i, tipo: 'past',  contenido: p.p });
      baraja.push({ key: `e${i}`, grupo: i, tipo: 'emoji', contenido: p.emoji, palabra: p, etiquetaDibujo: p.etiquetaDibujo });
    });
    setCartas(shuffle(baraja));
  }, []);

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  const tocar = (i) => {
    if (bloqueo) return;
    if (volteadas.includes(i)) return;
    if (resueltas.has(cartas[i].grupo)) return;
    if (volteadas.length === 0) {
      setVolteadas([i]);
      sonar.pop();
      return;
    }
    // segunda carta
    const primera = volteadas[0];
    const nuevas = [primera, i];
    setVolteadas(nuevas);
    setIntentos(n => n + 1);
    setBloqueo(true);

    if (cartas[primera].grupo === cartas[i].grupo) {
      sonar.acierto(); vibrar.suave();
      timeoutRef.current = setTimeout(() => {
        const r = new Set(resueltas);
        r.add(cartas[i].grupo);
        setResueltas(r);
        setVolteadas([]);
        setBloqueo(false);
        premiar(3);
        if (r.size === pares) finalizar();
      }, 600);
    } else {
      sonar.error(); vibrar.error();
      timeoutRef.current = setTimeout(() => {
        setVolteadas([]);
        setBloqueo(false);
      }, 850);
    }
  };

  const finalizar = () => {
    // menos intentos = más bonus (mínimo posible = nº de pares)
    const totalIntentos = intentos + 1;
    const bonus = Math.max(15, 45 - (totalIntentos - pares) * 5);
    if (!modoPractica) {
      completarMision(`memoria-${mundoId}`);
      ganarPuntos(bonus);
      if (totalIntentos === pares) marcarMemoriaPerfecta();
    } else {
      completarPractica();
    }
    verificarLogros();
    sonar.mision(); vibrar.exito();
    setFin(true);
  };

  if (cartas.length === 0) return <View style={s.bg} />;

  // ─── Resultado ───
  if (fin) {
    const perfecto = intentos === pares;
    return (
      <View style={s.resBg}>
        <LinearGradient colors={colors.gradAurora} style={StyleSheet.absoluteFill} />
        <ScrollView contentContainerStyle={s.resContent}>
          <PishkuMascota celebrando tamano={96} />
          <Text style={s.resTit}>{perfecto ? `¡Memoria perfecta, ${nombre}!` : `¡Muy bien, ${nombre}!`}</Text>
          <View style={s.scoreCard}>
            <Text style={s.scoreNum}>{intentos}</Text>
            <Text style={s.scoreLbl}>intentos</Text>
            {perfecto && <Text style={s.perfectoTxt}>¡Sin errores!</Text>}
          </View>
          <Acompanante
            personaje="uma"
            mensaje={`Pas wawa ${nombre}, tu memoria guarda las palabras como la tierra guarda las semillas.`}
          />
          <BotonGlow texto={modoPractica ? '← Volver a practicar' : '← Volver al mundo'} onPress={() => navigation.goBack()} variante="primario" tamano="lg" />
        </ScrollView>
        <Confeti activo cantidad={30} />
      </View>
    );
  }

  return (
    <View style={s.bg}>
      <ScrollView contentContainerStyle={s.contenido} showsVerticalScrollIndicator={false}>

        <View style={s.header}>
          <View style={s.headerTop}>
            <View style={s.headerPill}>
              <Text style={s.headerPillTxt}>{modoPractica ? 'Práctica libre' : mundo.titulo}</Text>
            </View>
            <Text style={s.headerInfo}>{intentos} {intentos === 1 ? 'intento' : 'intentos'}</Text>
          </View>
          <Text style={s.headerTitulo}>Una palabra, un dibujo</Text>
          <View style={s.progresoFila}>
            <View style={s.progresoBarra} accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: pares, now: resueltas.size }}>
              <View style={[s.progresoRelleno, { width: `${pares ? resueltas.size / pares * 100 : 0}%` }]} />
            </View>
            <Text style={s.parejasInfo} accessibilityLiveRegion="polite">{resueltas.size}/{pares} parejas</Text>
          </View>
        </View>

        <View
          style={s.tablero}
          onLayout={({ nativeEvent }) => setAnchoTablero(nativeEvent.layout.width)}
          testID="memoria-tablero"
        >
          {anchoTablero > 0 && cartas.map((c, i) => (
            <Carta
              key={c.key}
              carta={c}
              ancho={anchoCarta}
              posicion={i + 1}
              faceUp={volteadas.includes(i)}
              resuelta={resueltas.has(c.grupo)}
              onPress={() => tocar(i)}
            />
          ))}
        </View>

        <View style={{ marginTop: 14 }}>
          <Acompanante
            personaje="uma"
            mensaje="Voltea dos cartas y une cada palabra con su dibujo. Las parejas encontradas quedan marcadas."
          />
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  bg: { flex: 1, backgroundColor: colors.noche },
  contenido: { padding: 14, paddingBottom: 28, width: '100%', maxWidth: 600, alignSelf: 'center' },

  header:        { paddingHorizontal: 2, paddingTop: 2, paddingBottom: 16 },
  headerTop:     { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  headerPill:    { ...ui.pill, flexShrink: 1 },
  headerPillTxt: { ...ui.pillTxt },
  headerInfo:    { ...ui.sub },
  headerTitulo:  { ...ui.h2, fontSize: 21, marginBottom: 8 },
  progresoFila:  { flexDirection: 'row', alignItems: 'center', gap: 12 },
  progresoBarra: { flex: 1, height: 6, borderRadius: 3, overflow: 'hidden', backgroundColor: colors.cartaDorso },
  progresoRelleno: { height: '100%', borderRadius: 3, backgroundColor: colors.doradoNeon },
  parejasInfo:   { color: colors.doradoNeon, fontFamily: fonts.bold, fontSize: 14 },

  tablero: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start' },

  resBg:      { flex: 1 },
  resContent: { flexGrow: 1, padding: 22, justifyContent: 'center', alignItems: 'center' },
  resTit:     { fontSize: 23, fontFamily: fonts.extra, color: colors.doradoNeon, textAlign: 'center', marginTop: 18, textShadowColor: 'rgba(250,199,117,0.4)', textShadowRadius: 10 },
  scoreCard:  { ...ui.cardDestacada, alignItems: 'center', marginVertical: 20, alignSelf: 'stretch' },
  scoreNum:   { fontSize: 52, fontFamily: fonts.extra, color: colors.cielo },
  scoreLbl:   { fontSize: 13, color: colors.turquesaSuave, fontFamily: fonts.medium, marginTop: 2 },
  perfectoTxt:{ fontSize: 15, color: colors.doradoNeon, fontFamily: fonts.bold, marginTop: 10 },
});

// Las caras absolutas no aportan altura: la celda recibe dimensiones numéricas
// del ancho medido del tablero, incluso dentro del ScrollView de Android.
const cs = StyleSheet.create({
  slot: { marginBottom: SEPARACION, flexShrink: 0 },
  cara: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16, alignItems: 'center', justifyContent: 'center',
    backfaceVisibility: 'hidden',
  },
  dorso: {
    backgroundColor: colors.cartaDorso,
    borderWidth: 1, borderColor: colors.cartaBorde,
  },
  marcoDorso: { position: 'absolute', top: 7, left: 7, right: 7, bottom: 7, borderRadius: 10, borderWidth: 1, borderColor: colors.bordeSuave },
  rombo: {
    position: 'absolute', width: 30, height: 30,
    borderWidth: 1.5, borderColor: colors.doradoNeon,
    transform: [{ rotate: '45deg' }], opacity: 0.9,
  },
  romboInner: {
    width: 10, height: 10, backgroundColor: colors.doradoNeon,
    transform: [{ rotate: '45deg' }], opacity: 0.8,
  },
  frente: {
    backgroundColor: colors.crema,
    borderWidth: 2, borderColor: colors.arena,
    paddingHorizontal: 6, paddingVertical: 10,
  },
  frenteResuelta: { borderColor: colors.doradoNeon, backgroundColor: colors.cartaResuelta },
  tipoCarta: { fontSize: 11, color: colors.textoPapel, fontFamily: fonts.medium, marginBottom: 4 },
  etiqueta: { fontSize: 12, lineHeight: 15, color: colors.textoPapel, fontFamily: fonts.semibold, textAlign: 'center', marginTop: 3 },
  past:  { color: colors.noche, fontSize: 21, lineHeight: 27, fontFamily: fonts.extra, textAlign: 'center' },
  sello: { position: 'absolute', top: 4, right: 4, width: 20, height: 20, borderRadius: 10, backgroundColor: colors.verde, alignItems: 'center', justifyContent: 'center' },
  selloTxt: { color: colors.crema, fontFamily: fonts.bold, fontSize: 13, lineHeight: 18 },
});
