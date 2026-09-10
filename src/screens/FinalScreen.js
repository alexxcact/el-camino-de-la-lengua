import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Image, StyleSheet, Animated, Dimensions, TouchableOpacity, Share } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { ui, radii } from '../theme/ui';
import { mundos } from '../data/datos';
import { imgMundoColor, imgMundoGris } from '../data/imagenes';
import { useJuego } from '../context/JuegoContext';
import ReveladoColor from '../components/ReveladoColor';
import Confeti from '../components/Confeti';
import ContadorAnimado from '../components/ContadorAnimado';
import MedallaPasto from '../components/MedallaPasto';
import Medallon from '../components/Medallon';
import { sonar } from '../utils/sonidos';
import { volverAlTerritorio } from '../utils/navegacion';

const { width: W } = Dimensions.get('window');

const RETRATOS = [
  { img: require('../../assets/images/personajes/taita_rimay.jpg'), color: '#8B4513', size: 64 },
  { img: require('../../assets/images/personajes/uma.jpg'),         color: '#7A1515', size: 64 },
  { img: require('../../assets/images/personajes/kinti.jpg'),       color: '#C49010', size: 92 },
  { img: require('../../assets/images/personajes/pishku.jpg'),      color: '#1A3A5C', size: 64 },
  { img: require('../../assets/images/personajes/chutun.jpg'),      color: '#2D5A16', size: 64 },
];

export default function FinalScreen({ navigation }) {
  const { estado, marcarFinalVisto } = useJuego();
  const nombre = estado.nombreJugador || 'Caminante';

  const [fase, setFase] = useState(0);   // 0 apertura · 1 escenarios · 2 personajes · 3 mensaje · 4 cierre
  const [escIdx, setEscIdx] = useState(0);
  const [confeti, setConfeti] = useState(false);

  const negro   = useRef(new Animated.Value(1)).current;
  const escFade = useRef(new Animated.Value(0)).current;
  const msgFade = useRef(new Animated.Value(0)).current;
  const persAnim = useRef(RETRATOS.map(() => new Animated.Value(0))).current;

  // Apertura: sonido + fade desde negro
  useEffect(() => {
    sonar.mundo();
    const a = Animated.timing(negro, { toValue: 0, duration: 1000, useNativeDriver: true });
    a.start();
    return () => a.stop();
  }, []);

  // Secuenciador por fase
  useEffect(() => {
    let t;
    if (fase === 0) {
      t = setTimeout(() => setFase(1), 3500);
    } else if (fase === 2) {
      const a = Animated.stagger(350, persAnim.map(v =>
        Animated.spring(v, { toValue: 1, friction: 5, tension: 70, useNativeDriver: true })));
      a.start();
      t = setTimeout(() => setFase(3), 3400);
      return () => { a.stop(); clearTimeout(t); };
    } else if (fase === 3) {
      const a = Animated.timing(msgFade, { toValue: 1, duration: 2500, useNativeDriver: true });
      a.start();
      t = setTimeout(() => setFase(4), 5000);
      return () => { a.stop(); clearTimeout(t); };
    } else if (fase === 4) {
      sonar.mundo();
      setConfeti(true);
    }
    return () => clearTimeout(t);
  }, [fase]);

  // Desfile de escenarios
  useEffect(() => {
    if (fase !== 1) return;
    if (escIdx >= mundos.length) { setFase(2); return; }
    escFade.setValue(0);
    const a = Animated.timing(escFade, { toValue: 1, duration: 600, useNativeDriver: true });
    a.start();
    const t = setTimeout(() => setEscIdx(i => i + 1), 3000);
    return () => { a.stop(); clearTimeout(t); };
  }, [fase, escIdx]);

  const saltar = () => { setEscIdx(mundos.length); setFase(4); };
  const salir = () => { marcarFinalVisto(); volverAlTerritorio(navigation); };
  const compartir = async () => {
    try {
      await Share.share({ message: `¡Completé El Camino de la Lengua y aprendí ${estado.palabrasVistas.size} entradas del vocabulario Pasto! 🌿 #PuebloPasto` });
    } catch (e) {}
  };

  const escMundo = mundos[Math.min(escIdx, mundos.length - 1)];

  return (
    <View style={s.cont}>
      {/* Fondo aurora para fases 2-4 */}
      {fase >= 2 && <LinearGradient colors={colors.gradAurora} style={StyleSheet.absoluteFill} />}

      {/* Fase 0 — laguna revelándose */}
      {fase === 0 && (
        <ReveladoColor
          imagenGris={imgMundoGris[5]}
          imagenColor={imgMundoColor[5]}
          revelado animarAhora
          style={StyleSheet.absoluteFill}
        />
      )}

      {/* Fase 1 — desfile de escenarios */}
      {fase === 1 && escIdx < mundos.length && (
        <Animated.View style={[StyleSheet.absoluteFill, { opacity: escFade }]}>
          <Image source={imgMundoColor[escMundo.id]} style={StyleSheet.absoluteFill} resizeMode="cover" />
          <LinearGradient colors={['transparent', 'rgba(11,31,42,0.85)']} style={StyleSheet.absoluteFill} />
          <View style={s.escTxt}>
            <MedallaPasto mundoId={escMundo.id} ganada tamano={56} />
            <Text style={s.escNom}>{escMundo.titulo}</Text>
            <Text style={s.escSub}>{escMundo.subtitulo}</Text>
          </View>
        </Animated.View>
      )}

      {/* Fase 2 — personajes */}
      {fase === 2 && (
        <View style={s.centro}>
          <Text style={s.faseTit}>El territorio agradece</Text>
          <View style={s.retratos}>
            {RETRATOS.map((p, i) => (
              <Animated.View key={i} style={{ transform: [{ scale: persAnim[i] }] }}>
                <Medallon source={p.img} size={p.size} ring={p.color} halo={false} />
              </Animated.View>
            ))}
          </View>
        </View>
      )}

      {/* Fase 3 — mensaje del guía */}
      {fase === 3 && (
        <View style={s.centro}>
          <Animated.View style={[s.msgCard, { opacity: msgFade }]}>
            <View style={s.msgPill}>
              <Text style={s.msgPillTxt}>EL GUÍA</Text>
            </View>
            <Text style={s.msgTxt}>
              {nombre}, recorriste las alturas, la chagra, la comunidad, el hogar y el agua.{'\n\n'}
              Cada palabra abre una nueva oportunidad para aprender.{'\n\n'}
              Gracias por caminar con nosotros. Sigue explorando.
            </Text>
          </Animated.View>
        </View>
      )}

      {/* Fase 4 — cierre con estadísticas */}
      {fase === 4 && (
        <View style={s.centro}>
          <Medallon source={require('../../assets/images/personajes/kinti.jpg')} size={110} style={s.cierreFoco} />
          <Text style={s.cierreTit}>¡Camino completo, {nombre}!</Text>

          <View style={s.statsRow}>
            <View style={s.statBox}>
              <ContadorAnimado valor={estado.palabrasVistas.size} estilo={s.statN} duracion={1000} animarEntrada />
              <Text style={s.statL}>palabras</Text>
            </View>
            <View style={s.statBox}>
              <ContadorAnimado valor={estado.puntos} estilo={s.statN} duracion={1000} delay={150} animarEntrada />
              <Text style={s.statL}>puntos</Text>
            </View>
            <View style={s.statBox}>
              <Text style={s.statN}>5/5</Text>
              <Text style={s.statL}>medallas</Text>
            </View>
          </View>

          <View style={s.botones}>
            <TouchableOpacity style={s.btnPrim} onPress={salir} activeOpacity={0.85}>
              <Text style={s.btnPrimTxt}>Volver al territorio</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.btnFant} onPress={compartir} activeOpacity={0.7}>
              <Text style={s.btnFantTxt}>Compartir mi logro</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Overlay negro de apertura */}
      <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, s.fundido, { opacity: negro }]} />

      {/* Saltar */}
      {fase < 4 && (
        <TouchableOpacity style={s.saltar} onPress={saltar} activeOpacity={0.7}>
          <Text style={s.saltarTxt}>Saltar ›</Text>
        </TouchableOpacity>
      )}

      <Confeti activo={confeti} cantidad={40} />
    </View>
  );
}

const s = StyleSheet.create({
  cont:    { flex: 1, backgroundColor: colors.noche },
  fundido: { backgroundColor: '#000' },

  escTxt: { position: 'absolute', bottom: 70, left: 24, right: 24, alignItems: 'center', gap: 8 },
  escNom: { color: colors.cielo, fontSize: 28, fontFamily: fonts.extra, textShadowColor: 'rgba(0,0,0,0.6)', textShadowRadius: 8 },
  escSub: { ...ui.sub, fontSize: 14, textAlign: 'center' },

  centro:  { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  faseTit: { color: colors.doradoNeon, fontSize: 18, fontFamily: fonts.extra, marginBottom: 28, letterSpacing: 1 },
  retratos:{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, flexWrap: 'wrap' },

  msgCard: { ...ui.cardDestacada, padding: 28 },
  msgPill: { ...ui.pill, alignSelf: 'center', marginBottom: 16 },
  msgPillTxt: { ...ui.pillTxt },
  msgTxt:  { color: colors.cielo, fontSize: 18, fontFamily: fonts.semibold, textAlign: 'center', lineHeight: 27 },

  cierreFoco:  { marginBottom: 6 },
  cierreTit:   { color: colors.cielo, fontSize: 24, fontFamily: fonts.extra, textAlign: 'center', marginTop: 10, marginBottom: 28 },
  statsRow:    { flexDirection: 'row', gap: 14, marginBottom: 34 },
  statBox:     { ...ui.card, borderRadius: radii.md, alignItems: 'center', paddingVertical: 16, paddingHorizontal: 18, minWidth: 92 },
  statN:       { color: colors.doradoNeon, fontSize: 30, fontFamily: fonts.extra },
  statL:       { color: colors.turquesaSuave, fontSize: 11, fontFamily: fonts.medium, marginTop: 2 },

  botones:  { alignSelf: 'stretch', gap: 14, alignItems: 'center' },
  btnPrim:  { backgroundColor: colors.turquesa, borderRadius: 30, paddingVertical: 16, paddingHorizontal: 32, alignSelf: 'stretch', alignItems: 'center' },
  btnPrimTxt:{ color: colors.cielo, fontSize: 16, fontFamily: fonts.extra },
  btnFant:  { paddingVertical: 12, paddingHorizontal: 24 },
  btnFantTxt:{ color: colors.turquesaSuave, fontSize: 14, fontFamily: fonts.bold },

  saltar:   { position: 'absolute', top: 50, right: 16, backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(93,202,165,0.4)' },
  saltarTxt:{ color: colors.cielo, fontSize: 12, fontFamily: fonts.bold },
});
