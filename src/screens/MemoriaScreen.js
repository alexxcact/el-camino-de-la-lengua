import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { palabras, mundos, shuffle } from '../data/datos';
import { useJuego } from '../context/JuegoContext';
import Acompanante from '../components/Acompanante';
import BotonGlow from '../components/BotonGlow';
import Confeti from '../components/Confeti';
import PishkuMascota from '../components/PishkuMascota';
import { sonar } from '../utils/sonidos';
import { vibrar } from '../utils/feedback';

const PARES = 6;

// ── Carta individual con volteo (rotateY, useNativeDriver) ──
function Carta({ carta, faceUp, resuelta, onPress }) {
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
      style={cs.slot}
      onPress={onPress}
      disabled={faceUp || resuelta}
      activeOpacity={0.9}
    >
      {/* Dorso (símbolo Pasto) */}
      <Animated.View style={[cs.cara, cs.dorso, { transform: [{ perspective: 800 }, { rotateY: backRotate }] }]}>
        <View style={cs.rombo} />
        <View style={cs.romboInner} />
      </Animated.View>

      {/* Frente (palabra o emoji) */}
      <Animated.View style={[
        cs.cara, cs.frente,
        resuelta && cs.frenteResuelta,
        { transform: [{ perspective: 800 }, { rotateY: frontRotate }] },
      ]}>
        {carta.tipo === 'emoji'
          ? <Text style={cs.emoji}>{carta.contenido}</Text>
          : <Text style={cs.past}>{carta.contenido}</Text>}
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
  const timeoutRef = useRef(null);

  useEffect(() => {
    const pals = shuffle(fuente).slice(0, pares);
    const baraja = [];
    pals.forEach((p, i) => {
      baraja.push({ key: `p${i}`, grupo: i, tipo: 'past',  contenido: p.p });
      baraja.push({ key: `e${i}`, grupo: i, tipo: 'emoji', contenido: p.emoji });
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
            {perfecto && <Text style={s.perfectoTxt}>🧩 ¡Sin errores!</Text>}
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
      <ScrollView contentContainerStyle={{ padding: 14 }} showsVerticalScrollIndicator={false}>

        <View style={s.header}>
          <View style={s.headerTop}>
            <Text style={s.headerBadge}>{modoPractica ? '🎯 Práctica libre' : `${mundo.emoji} ${mundo.titulo}`}</Text>
            <Text style={s.headerInfo}>✓ {resueltas.size}/{pares} · {intentos} intentos</Text>
          </View>
          <Text style={s.headerSub}>🧠 Encuentra las parejas: palabra ↔ dibujo</Text>
        </View>

        <View style={s.tablero}>
          {cartas.map((c, i) => (
            <Carta
              key={c.key}
              carta={c}
              faceUp={volteadas.includes(i)}
              resuelta={resueltas.has(c.grupo)}
              onPress={() => tocar(i)}
            />
          ))}
        </View>

        <View style={{ marginTop: 14 }}>
          <Acompanante
            personaje="uma"
            mensaje="Voltea dos cartas. Si la palabra y su dibujo coinciden, quedan encendidas. Cuantas menos intentes, más fuerte tu memoria."
          />
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  bg: { flex: 1, backgroundColor: colors.noche },

  header:      { marginBottom: 14, padding: 14, borderRadius: 16, backgroundColor: colors.nocheCard, borderWidth: 1, borderColor: 'rgba(93,202,165,0.18)' },
  headerTop:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  headerBadge: { color: colors.cielo, fontSize: 13, fontFamily: fonts.bold },
  headerInfo:  { color: colors.doradoNeon, fontSize: 12, fontFamily: fonts.bold },
  headerSub:   { color: colors.turquesaSuave, fontSize: 13, fontFamily: fonts.semibold },

  tablero: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },

  resBg:      { flex: 1 },
  resContent: { flexGrow: 1, padding: 22, justifyContent: 'center', alignItems: 'center' },
  resTit:     { fontSize: 23, fontFamily: fonts.extra, color: colors.doradoNeon, textAlign: 'center', marginTop: 18, textShadowColor: 'rgba(250,199,117,0.4)', textShadowRadius: 10 },
  scoreCard:  { alignItems: 'center', padding: 22, marginVertical: 20, borderRadius: 22, alignSelf: 'stretch', backgroundColor: colors.nocheCard, borderWidth: 2, borderColor: colors.doradoNeon },
  scoreNum:   { fontSize: 52, fontFamily: fonts.extra, color: colors.cielo },
  scoreLbl:   { fontSize: 13, color: colors.turquesaSuave, fontFamily: fonts.medium, marginTop: 2 },
  perfectoTxt:{ fontSize: 15, color: colors.doradoNeon, fontFamily: fonts.bold, marginTop: 10 },
});

// Carta: cada celda ~30% del ancho, las dos caras superpuestas
const cs = StyleSheet.create({
  slot: { width: '31%', aspectRatio: 0.82, marginBottom: 12 },
  cara: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 14, alignItems: 'center', justifyContent: 'center',
    backfaceVisibility: 'hidden',
  },
  dorso: {
    backgroundColor: colors.nocheCard,
    borderWidth: 1.5, borderColor: 'rgba(250,199,117,0.4)',
  },
  rombo: {
    position: 'absolute', width: 30, height: 30,
    borderWidth: 2, borderColor: colors.doradoNeon,
    transform: [{ rotate: '45deg' }], opacity: 0.5,
  },
  romboInner: {
    width: 10, height: 10, backgroundColor: colors.doradoNeon,
    transform: [{ rotate: '45deg' }], opacity: 0.8,
  },
  frente: {
    backgroundColor: colors.nocheProfundo,
    borderWidth: 2, borderColor: colors.turquesa,
    paddingHorizontal: 4,
  },
  frenteResuelta: { borderColor: colors.doradoNeon, backgroundColor: 'rgba(29,158,117,0.18)' },
  emoji: { fontSize: 40 },
  past:  { fontSize: 18, fontWeight: '900', color: colors.doradoNeon, fontFamily: 'serif', textAlign: 'center' },
});
