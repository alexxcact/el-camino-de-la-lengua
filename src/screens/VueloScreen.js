import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Pressable, TouchableOpacity, ScrollView, AppState } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Circle, G, Rect } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { LAJA } from '../theme/pasto';
import { palabras } from '../data/datos';
import {
  bancoVuelo, nuevaRonda, eleccionEnPaso, velocidad, puntosDeVuelo, textoNube, VIDAS,
} from '../data/vueloLogica';
import { useJuego } from '../context/JuegoContext';
import FiguraPishku, { PishkuAlaDelantera, ALA_PIVOTE } from '../components/figuras/FiguraPishku';
import PalabraIlustrada from '../components/PalabraIlustrada';
import BotonGlow from '../components/BotonGlow';
import Confeti from '../components/Confeti';
import FondoSimbolos from '../components/FondoSimbolos';
import SelloApertura from '../components/pasto/SelloApertura';
import { simboloDeJuego } from '../theme/pasto';
import { sonar } from '../utils/sonidos';
import { vibrar } from '../utils/feedback';
import { decirPalabra } from '../utils/voz';

// ─────────────────────────────────────────────────────────────
// El vuelo de Auara: Auara, el ave mensajera, cruza el páramo. Arriba aparece
// una palabra pasta; hay que tocar la pantalla para aletear y atravesar la
// nube que trae su significado. Cada acierto acelera el vuelo; cada error
// cuesta una pluma (hay 3). El suelo no castiga: Auara rebota en los cerros.
// El movimiento corre en un bucle de requestAnimationFrame que solo mueve
// valores Animated (sin volver a dibujar la pantalla en cada cuadro).
// ─────────────────────────────────────────────────────────────

const AVE_W = 74;
const AVE_H = Math.round((AVE_W * 475) / 560);
const GRAVEDAD = 1000;    // px/s²
const IMPULSO = 380;      // px/s hacia arriba en cada toque
const CAIDA_MAX = 520;
// Mismo estilo que la barra de pestañas de App.js (se restaura al salir).
const TAB_BAR = { backgroundColor: colors.nocheHeader, borderTopWidth: 0, height: 68, paddingBottom: 10, paddingTop: 6, elevation: 0 };

export default function VueloScreen({ navigation }) {
  const { estado, registrarVuelo, registrarFallo, verificarLogros } = useJuego();
  const banco = useMemo(() => bancoVuelo(palabras, estado.palabrasVistas), []); // eslint-disable-line react-hooks/exhaustive-deps

  const [dims, setDims] = useState(null);           // tamaño del área de vuelo
  const [fase, setFase] = useState('inicio');       // 'inicio' | 'jugando' | 'fin'
  const [pausado, setPausado] = useState(false);
  const [ronda, setRonda] = useState(null);
  const [nubes, setNubes] = useState([null, null, null]); // null | 'ok' | 'mal' | 'apagada'
  const [aciertos, setAciertos] = useState(0);
  const [vidas, setVidas] = useState(VIDAS);
  const [volando, setVolando] = useState(false);
  const [resultado, setResultado] = useState(null); // { aciertos, record, historial }

  const faseRef = useRef(fase);
  faseRef.current = fase;

  // Valores que mueve el bucle (sin re-render)
  const aveY = useRef(new Animated.Value(0)).current;
  const aveRot = useRef(new Animated.Value(0)).current;
  const colX = useRef(new Animated.Value(1000)).current;
  const lejosX = useRef(new Animated.Value(0)).current;
  const cercaX = useRef(new Animated.Value(0)).current;
  const ala = useRef(new Animated.Value(0)).current;
  const masUno = useRef(new Animated.Value(0)).current;
  const g = useRef(null);
  const finRef = useRef(null);   // timeout que cierra la partida tras perder la última pluma

  // Si se sale de la pantalla en ese instante, la partida no se cierra a escondidas.
  useEffect(() => () => clearTimeout(finRef.current), []);

  // Geometría derivada del tamaño del área
  const geo = useMemo(() => {
    if (!dims) return null;
    const { W, H } = dims;
    const cielo = H * 0.86;
    const altoNube = cielo * 0.2;
    return {
      W, H, cielo, altoNube,
      anchoNube: Math.min(200, W * 0.46),
      centros: [0.19, 0.5, 0.81].map(f => cielo * f),
      aveX: W * 0.2,
      suelo: cielo - AVE_H * 0.35,
    };
  }, [dims]);

  // Pantalla completa: se oculta la barra de pestañas mientras se vuela.
  useEffect(() => {
    const tabs = navigation.getParent?.();
    tabs?.setOptions?.({ tabBarStyle: { display: 'none' } });
    return () => tabs?.setOptions?.({ tabBarStyle: TAB_BAR });
  }, [navigation]);

  // Aleteo continuo de colibrí
  useEffect(() => {
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(ala, { toValue: 1, duration: 90, useNativeDriver: true }),
      Animated.timing(ala, { toValue: 0, duration: 90, useNativeDriver: true }),
    ]));
    loop.start();
    return () => loop.stop();
  }, [ala]);

  // Pausa al salir de la pantalla o al mandar la app al fondo
  useFocusEffect(useCallback(() => () => { if (faseRef.current === 'jugando') setPausado(true); }, []));
  useEffect(() => {
    const sub = AppState.addEventListener?.('change', (st) => {
      if (st !== 'active' && faseRef.current === 'jugando') setPausado(true);
    });
    return () => sub?.remove?.();
  }, []);

  const siguienteRonda = () => {
    const G = g.current;
    const r = nuevaRonda(banco, palabras, G.recientes);
    G.recientes = [...G.recientes, r.objetivo.id].slice(-4);
    G.ronda = r;
    G.x = geo.W + 24;
    G.resuelta = false;
    colX.setValue(G.x);
    setRonda(r);
    setNubes([null, null, null]);
  };

  const empezar = () => {
    if (!geo) return;
    g.current = {
      y: geo.cielo * 0.45, vy: 0, x: geo.W + 24, dist: 0,
      aciertos: 0, vidas: VIDAS, vel: velocidad(0),
      resuelta: false, volando: false, terminando: false,
      recientes: [], historial: [], ronda: null,
    };
    setAciertos(0);
    setVidas(VIDAS);
    setVolando(false);
    setPausado(false);
    setResultado(null);
    siguienteRonda();
    setFase('jugando');
    sonar.pop();
  };

  const terminar = () => {
    const G = g.current;
    const record = registrarVuelo(G.aciertos);
    verificarLogros();
    if (record && G.aciertos > 0) sonar.mision();
    setResultado({ aciertos: G.aciertos, record: record && G.aciertos > 0, historial: G.historial });
    setFase('fin');
  };

  const impacto = (carril) => {
    const G = g.current;
    const r = G.ronda;
    const ok = carril === r.correcto;
    setNubes([0, 1, 2].map(i => (i === r.correcto ? 'ok' : i === carril ? 'mal' : 'apagada')));
    G.historial.push({ palabra: r.objetivo, ok });
    if (ok) {
      G.aciertos += 1;
      G.vel = velocidad(G.aciertos);
      setAciertos(G.aciertos);
      sonar.acierto();
      vibrar.suave?.();
      masUno.setValue(0);
      Animated.timing(masUno, { toValue: 1, duration: 700, useNativeDriver: true }).start();
    } else {
      G.vidas -= 1;
      setVidas(G.vidas);
      registrarFallo(r.objetivo.id);
      sonar.error();
      vibrar.error?.();
      if (G.vidas <= 0) {
        G.terminando = true;
        finRef.current = setTimeout(() => { if (faseRef.current === 'jugando') terminar(); }, 900);
      }
    }
  };

  // Bucle del juego
  useEffect(() => {
    if (fase !== 'jugando' || pausado || !geo || !g.current) return undefined;
    let raf;
    let previo = null;
    const paso = (t) => {
      const dt = previo == null ? 0 : Math.min(0.05, (t - previo) / 1000);
      previo = t;
      const G = g.current;
      if (G.volando) {
        G.vy = Math.min(CAIDA_MAX, G.vy + GRAVEDAD * dt);
        G.y += G.vy * dt;
        if (G.y > geo.suelo) { G.y = geo.suelo; G.vy = -IMPULSO * 0.7; }   // rebota en los cerros
        if (G.y < AVE_H * 0.4) { G.y = AVE_H * 0.4; G.vy = Math.max(0, G.vy); }
        G.x -= G.vel * dt;
        G.dist += G.vel * dt;
      } else {
        G.y = geo.cielo * 0.45 + Math.sin(t / 280) * 7;                      // espera el primer toque
        G.dist += 30 * dt;
      }

      if (G.volando && !G.resuelta && !G.terminando) {
        const c = eleccionEnPaso({
          x: G.x, ancho: geo.anchoNube, aveX: geo.aveX, y: G.y, centros: geo.centros, altoNube: geo.altoNube,
        });
        if (c !== null) { G.resuelta = true; impacto(c); }
      }
      if (G.volando && !G.terminando && G.x + geo.anchoNube < geo.aveX - 30) siguienteRonda();

      aveY.setValue(G.y - AVE_H / 2);
      aveRot.setValue(G.volando ? Math.max(-22, Math.min(35, G.vy / 14)) : 0);
      colX.setValue(G.x);
      lejosX.setValue(-((G.dist * 0.2) % geo.W));
      cercaX.setValue(-((G.dist * 0.55) % geo.W));
      raf = requestAnimationFrame(paso);
    };
    raf = requestAnimationFrame(paso);
    return () => cancelAnimationFrame(raf);
  }, [fase, pausado, geo]); // eslint-disable-line react-hooks/exhaustive-deps

  const tocar = () => {
    if (fase !== 'jugando' || !g.current) return;
    if (pausado) { setPausado(false); return; }
    const G = g.current;
    if (G.terminando) return;
    if (!G.volando) { G.volando = true; setVolando(true); }
    G.vy = -IMPULSO;
  };

  const rot = aveRot.interpolate({ inputRange: [-90, 90], outputRange: ['-90deg', '90deg'] });
  const masUnoY = masUno.interpolate({ inputRange: [0, 1], outputRange: [0, -40] });
  const masUnoOp = masUno.interpolate({ inputRange: [0, 0.15, 1], outputRange: [0, 1, 0] });

  return (
    <View style={s.bg}>
      <LinearGradient colors={['#0B1F2A', '#16404C', '#2A6670']} style={StyleSheet.absoluteFill} />
      <FondoSimbolos variante="escena" desvanecer={false} />
      <SelloApertura simbolo={simboloDeJuego('vuelo')} />

      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        {/* Barra superior: salir, palabra que se busca, aciertos y plumas */}
        <View style={s.hud}>
          <TouchableOpacity style={s.cerrar} onPress={() => navigation.goBack()} accessibilityRole="button" accessibilityLabel="Salir del juego" hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Ionicons name="close" size={22} color={colors.cielo} />
          </TouchableOpacity>
          <View style={s.busca}>
            {fase === 'jugando' && ronda ? (
              <>
                <Text style={s.buscaLbl}>¿QUÉ SIGNIFICA?</Text>
                <View style={s.buscaFila}>
                  <Text style={s.buscaPal} numberOfLines={1} adjustsFontSizeToFit>{ronda.objetivo.p}</Text>
                  <TouchableOpacity onPress={() => decirPalabra(ronda.objetivo.p)} accessibilityRole="button" accessibilityLabel={`Escuchar ${ronda.objetivo.p}`} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                    <Ionicons name="volume-high" size={18} color={colors.doradoNeon} />
                  </TouchableOpacity>
                </View>
              </>
            ) : <Text style={s.titulo}>El vuelo de Auara</Text>}
          </View>
          <View style={s.marcador}>
            <View style={s.aciertosFila}>
              <View style={s.rombito} />
              <Text style={s.aciertosTxt}>{aciertos}</Text>
            </View>
            <View style={s.plumas} accessibilityLabel={`${vidas} plumas`}>
              {Array.from({ length: VIDAS }, (_, i) => <Pluma key={i} llena={i < vidas} />)}
            </View>
          </View>
        </View>

        {/* Área de vuelo */}
        <Pressable
          style={s.area}
          onPressIn={tocar}
          onLayout={(e) => {
            const { width, height } = e.nativeEvent.layout;
            if (!dims || Math.abs(dims.W - width) > 1 || Math.abs(dims.H - height) > 1) setDims({ W: width, H: height });
          }}
          accessibilityRole="button"
          accessibilityLabel="Toca para que Auara aletee"
        >
          {geo && (
            <>
              <Estrellas W={geo.W} H={geo.cielo} />
              <Animated.View style={[s.capa, { width: geo.W * 2, transform: [{ translateX: lejosX }] }]}>
                <Cordillera W={geo.W} H={geo.H} />
              </Animated.View>
              <Animated.View style={[s.capa, { width: geo.W * 2, transform: [{ translateX: cercaX }] }]}>
                <Colinas W={geo.W} H={geo.H} />
              </Animated.View>

              {fase === 'jugando' && ronda && (
                <Animated.View style={[s.columna, { width: geo.anchoNube, height: geo.cielo, transform: [{ translateX: colX }] }]} pointerEvents="none">
                  {ronda.opciones.map((op, i) => (
                    <Nube key={`${op.id}-${i}`} op={op} estado={nubes[i]}
                      top={geo.centros[i] - geo.altoNube / 2} ancho={geo.anchoNube} alto={geo.altoNube} />
                  ))}
                </Animated.View>
              )}

              <Animated.View pointerEvents="none" style={[s.ave, { left: geo.aveX - AVE_W / 2, transform: [{ translateY: aveY }, { rotate: rot }] }]}>
                <Ave ala={ala} />
                <Animated.Text style={[s.masUno, { opacity: masUnoOp, transform: [{ translateY: masUnoY }] }]}>+1</Animated.Text>
              </Animated.View>

              {fase === 'jugando' && !volando && !pausado && (
                <View style={s.pista} pointerEvents="none">
                  <Ionicons name="hand-left-outline" size={30} color={colors.cielo} />
                  <Text style={s.pistaTxt}>Toca para aletear y cruza la nube correcta</Text>
                </View>
              )}
              {pausado && fase === 'jugando' && (
                <View style={s.pausa} pointerEvents="none">
                  <Text style={s.pausaTit}>En pausa</Text>
                  <Text style={s.pistaTxt}>Toca para seguir volando</Text>
                </View>
              )}
            </>
          )}
        </Pressable>
      </SafeAreaView>

      {fase === 'inicio' && <Inicio record={estado.vueloRecord || 0} onJugar={empezar} />}
      {fase === 'fin' && resultado && (
        <Fin resultado={resultado} record={estado.vueloRecord || 0} onOtra={empezar} onSalir={() => navigation.goBack()} />
      )}
    </View>
  );
}

// ── Auara con el ala que aletea sobre su hombro ──
const Ave = React.memo(function Ave({ ala }) {
  const px = (ALA_PIVOTE.x / 560) * AVE_W - AVE_W / 2;
  const py = (ALA_PIVOTE.y / 475) * AVE_H - AVE_H / 2;
  const giro = ala.interpolate({ inputRange: [0, 1], outputRange: ['10deg', '-34deg'] });
  return (
    <View style={{ width: AVE_W, height: AVE_H }}>
      <FiguraPishku width={AVE_W} height={AVE_H} animo="feliz" sinAlaDelantera />
      <Animated.View style={[StyleSheet.absoluteFill, { transform: [{ translateX: px }, { translateY: py }, { rotate: giro }, { translateX: -px }, { translateY: -py }] }]}>
        <PishkuAlaDelantera width={AVE_W} height={AVE_H} />
      </Animated.View>
    </View>
  );
});

// ── Nube con el dibujo y el significado ──
const Nube = React.memo(function Nube({ op, estado, top, ancho, alto }) {
  const ilus = Math.min(42, alto * 0.5);
  return (
    <View style={[s.nubeWrap, { top, width: ancho, height: alto }]}>
      <View style={[s.bulto, { left: ancho * 0.18, width: alto * 0.42, height: alto * 0.42, top: -alto * 0.14 }, estado && s[`bulto_${estado}`]]} />
      <View style={[s.bulto, { left: ancho * 0.44, width: alto * 0.52, height: alto * 0.52, top: -alto * 0.2 }, estado && s[`bulto_${estado}`]]} />
      <View style={[s.nube, estado === 'ok' && s.nubeOk, estado === 'mal' && s.nubeMal, estado === 'apagada' && s.nubeApagada]}>
        <PalabraIlustrada palabra={op} tamano={ilus} />
        <Text style={[s.nubeTxt, estado === 'apagada' && s.nubeTxtApagada]} numberOfLines={2} adjustsFontSizeToFit minimumFontScale={0.8}>{textoNube(op.e)}</Text>
      </View>
    </View>
  );
});

// ── Plumas (vidas) ──
function Pluma({ llena }) {
  return (
    <Svg width={16} height={20} viewBox="0 0 16 20">
      <Path d="M8 1C12 4 14 9 11.5 14L8 19 4.5 14C2 9 4 4 8 1Z" fill={llena ? colors.doradoNeon : 'none'} stroke={colors.doradoNeon} strokeWidth={1.3} opacity={llena ? 1 : 0.45} />
      <Path d="M8 4V18" stroke={llena ? colors.noche : colors.doradoNeon} strokeWidth={1} opacity={llena ? 0.6 : 0.45} />
    </Svg>
  );
}

// ── Paisaje del páramo (capas que se repiten cada W) ──
const Estrellas = React.memo(function Estrellas({ W, H }) {
  const pts = [[0.08, 0.06], [0.22, 0.14], [0.35, 0.04], [0.52, 0.11], [0.66, 0.05], [0.81, 0.13], [0.93, 0.07], [0.45, 0.2], [0.74, 0.24]];
  return (
    <Svg width={W} height={H} style={StyleSheet.absoluteFill} pointerEvents="none">
      {pts.map(([x, y], i) => <Circle key={i} cx={x * W} cy={y * H} r={i % 3 ? 1.2 : 1.8} fill="#F4E6C8" opacity={0.5} />)}
    </Svg>
  );
});

function perfil(W, H, alturas) {
  // Línea de cumbres que empieza y termina a la misma altura: se puede repetir.
  const paso = W / (alturas.length - 1);
  return alturas.map((a, i) => `${i ? 'L' : 'M'}${(i * paso).toFixed(1)} ${(a * H).toFixed(1)}`).join(' ');
}

const Cordillera = React.memo(function Cordillera({ W, H }) {
  const alturas = [0.62, 0.5, 0.58, 0.4, 0.55, 0.46, 0.62];
  const cumbres = perfil(W, H, alturas);
  const d = `${cumbres} L${W} ${H} L0 ${H} Z`;
  const paso = W / (alturas.length - 1);
  const pico = [3 * paso, alturas[3] * H];
  const lado = (i, f) => [pico[0] + (i * paso - pico[0]) * f, pico[1] + (alturas[i] * H - pico[1]) * f];
  const [i1, i2, i3] = [lado(2, 0.3), lado(2, 0.16), lado(4, 0.3)];
  const nieve = `M${pico[0]} ${pico[1]} L${i3[0]} ${i3[1]} L${pico[0] + 5} ${pico[1] + 9} L${pico[0] - 4} ${pico[1] + 6} L${i2[0]} ${i2[1] + 4} L${i1[0]} ${i1[1]} Z`;
  return (
    <Svg width={W * 2} height={H}>
      {[0, W].map(x => (
        <G key={x} transform={`translate(${x} 0)`}>
          <Path d={d} fill="#123540" />
          {/* Volcán nevado: la nieve sigue las laderas de la cumbre más alta */}
          <Path d={nieve} fill="#F4E6C8" opacity={0.55} />
        </G>
      ))}
    </Svg>
  );
});

const Colinas = React.memo(function Colinas({ W, H }) {
  const cumbres = perfil(W, H, [0.84, 0.78, 0.82, 0.76, 0.8, 0.84]);
  const d = `${cumbres} L${W} ${H} L0 ${H} Z`;
  const frailejones = [0.12, 0.31, 0.58, 0.79];
  return (
    <Svg width={W * 2} height={H}>
      {[0, W].map(x => (
        <G key={x} transform={`translate(${x} 0)`}>
          <Path d={d} fill="#0C2830" />
          {frailejones.map((f, i) => {
            const fx = f * W;
            const base = H * 0.86;
            const alto = 34 + (i % 2) * 12;
            return (
              <G key={i}>
                <Rect x={fx - 2.5} y={base - alto} width={5} height={alto} rx={2} fill="#2B5A4A" />
                {[-1, 0, 1].map(k => (
                  <Path key={k} d={`M${fx} ${base - alto} q${k * 9 - 4} -10 ${k * 12} -14 q${2 - k * 3} 8 ${-k * 12} 14Z`} fill="#3F7A5C" />
                ))}
              </G>
            );
          })}
          <Rect x={0} y={H * 0.86} width={W} height={H * 0.14} fill="#0C2730" />
        </G>
      ))}
    </Svg>
  );
});

// ── Pantallas de inicio y de fin ──
function Inicio({ record, onJugar }) {
  return (
    <View style={s.velo}>
      <View style={s.tarjeta}>
        <FiguraPishku width={150} height={Math.round((150 * 475) / 560)} animo="feliz" />
        <Text style={s.tTit}>El vuelo de Auara</Text>
        <Text style={s.tSub}>Auara lleva mensajes por el páramo. ¡Ayúdala a encontrar el significado de cada palabra!</Text>
        <Regla icono="hand-left-outline" texto="Toca la pantalla para aletear" />
        <Regla icono="cloud-outline" texto="Cruza la nube que dice lo que significa la palabra" />
        <Regla pluma texto="Tienes 3 plumas: cada nube equivocada cuesta una" />
        {record > 0 && <Text style={s.record}>Tu récord: {record} palabras</Text>}
        <View style={{ height: 14 }} />
        <BotonGlow texto="¡A volar!" onPress={onJugar} variante="primario" tamano="lg" />
      </View>
    </View>
  );
}

function Regla({ icono, pluma, texto }) {
  return (
    <View style={s.regla}>
      <View style={s.reglaIcono}>{pluma ? <Pluma llena /> : <Ionicons name={icono} size={18} color={colors.doradoNeon} />}</View>
      <Text style={s.reglaTxt}>{texto}</Text>
    </View>
  );
}

function Fin({ resultado, record, onOtra, onSalir }) {
  const { aciertos, historial } = resultado;
  return (
    <View style={s.velo}>
      <ScrollView contentContainerStyle={s.finScroll} showsVerticalScrollIndicator={false}>
        <View style={s.tarjeta}>
          <FiguraPishku width={120} height={Math.round((120 * 475) / 560)} animo={aciertos > 0 ? 'feliz' : 'pensativo'} />
          <Text style={s.tTit}>{resultado.record ? '¡Nuevo récord!' : aciertos > 0 ? '¡Buen vuelo!' : '¡Otra vez!'}</Text>
          <Text style={s.finNum}>{aciertos}</Text>
          <Text style={s.finLbl}>{aciertos === 1 ? 'palabra encontrada' : 'palabras encontradas'}</Text>
          {aciertos > 0 && <Text style={s.finPuntos}>+{puntosDeVuelo(aciertos)} puntos</Text>}
          <Text style={s.record}>Récord: {record}</Text>

          {historial.length > 0 && (
            <View style={s.repaso}>
              <Text style={s.repasoTit}>LO QUE VOLASTE</Text>
              {historial.slice(-8).map((h, i) => (
                <View key={i} style={s.repasoFila}>
                  <View style={[s.repasoMarca, { backgroundColor: h.ok ? colors.turquesaClaro : colors.coral || '#E26D5A' }]}>
                    <Ionicons name={h.ok ? 'checkmark' : 'close'} size={12} color={colors.noche} />
                  </View>
                  <Text style={s.repasoPal}>{h.palabra.p}</Text>
                  <Text style={s.repasoSig} numberOfLines={1}>{h.palabra.e}</Text>
                </View>
              ))}
            </View>
          )}

          <View style={{ height: 14 }} />
          <BotonGlow texto="Volver a volar" onPress={onOtra} variante="primario" tamano="lg" />
          <View style={{ height: 10 }} />
          <BotonGlow texto="Salir" onPress={onSalir} variante="fantasma" tamano="md" />
        </View>
      </ScrollView>
      {resultado.record && <Confeti activo cantidad={30} />}
    </View>
  );
}

const s = StyleSheet.create({
  bg: { flex: 1, backgroundColor: colors.noche },

  hud: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 12, paddingVertical: 8 },
  cerrar: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(8,26,34,0.6)', borderWidth: 1, borderColor: LAJA.borde },
  busca: {
    flex: 1, alignItems: 'center', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 14,
    backgroundColor: LAJA.fondo, borderWidth: 1.5, borderColor: 'rgba(250,199,117,0.45)', minHeight: 54, justifyContent: 'center',
  },
  buscaLbl: { color: colors.turquesaSuave, fontSize: 9, fontFamily: fonts.bold, letterSpacing: 1.5 },
  buscaFila: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  buscaPal: { color: colors.doradoNeon, fontSize: 24, fontFamily: fonts.extra, maxWidth: 170 },
  titulo: { color: colors.doradoNeon, fontSize: 17, fontFamily: fonts.extra },
  marcador: { alignItems: 'flex-end', gap: 4, minWidth: 58 },
  aciertosFila: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  rombito: { width: 11, height: 11, backgroundColor: colors.doradoNeon, transform: [{ rotate: '45deg' }] },
  aciertosTxt: { color: colors.cielo, fontSize: 20, fontFamily: fonts.extra },
  plumas: { flexDirection: 'row', gap: 2 },

  area: { flex: 1, overflow: 'hidden' },
  capa: { position: 'absolute', left: 0, top: 0, bottom: 0 },
  columna: { position: 'absolute', left: 0, top: 0 },
  ave: { position: 'absolute', top: 0, width: AVE_W, height: AVE_H },
  masUno: { position: 'absolute', top: -18, left: AVE_W * 0.35, color: colors.doradoNeon, fontSize: 20, fontFamily: fonts.extra },

  nubeWrap: { position: 'absolute', left: 0 },
  nube: {
    flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 10,
    borderRadius: 999, backgroundColor: '#F7F0E0', borderWidth: 2.5, borderColor: '#F7F0E0',
  },
  nubeOk: { borderColor: colors.turquesaClaro, backgroundColor: '#E3F6EC' },
  nubeMal: { borderColor: '#E26D5A', backgroundColor: '#F8E0D8' },
  bulto: { position: 'absolute', borderRadius: 999, backgroundColor: '#F7F0E0' },
  bulto_ok: { backgroundColor: '#E3F6EC' },
  bulto_mal: { backgroundColor: '#F8E0D8' },
  bulto_apagada: { backgroundColor: '#35565D' },
  nubeApagada: { backgroundColor: '#35565D', borderColor: '#35565D' },
  nubeTxtApagada: { color: '#8FB0B4' },
  nubeTxt: { flex: 1, color: '#16323A', fontSize: 14, fontFamily: fonts.extra, lineHeight: 17 },

  pista: { position: 'absolute', left: 0, right: 0, bottom: '22%', alignItems: 'center', gap: 6 },
  pistaTxt: { color: colors.cielo, fontSize: 14, fontFamily: fonts.bold, textAlign: 'center', paddingHorizontal: 30 },
  pausa: { position: 'absolute', left: 0, right: 0, top: '38%', alignItems: 'center', gap: 4 },
  pausaTit: { color: colors.doradoNeon, fontSize: 26, fontFamily: fonts.extra },

  velo: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(6,18,24,0.72)', justifyContent: 'center', padding: 20 },
  finScroll: { flexGrow: 1, justifyContent: 'center', paddingVertical: 30 },
  tarjeta: {
    alignItems: 'center', padding: 20, borderRadius: 22,
    backgroundColor: LAJA.fondo, borderWidth: 1.5, borderColor: 'rgba(250,199,117,0.45)',
  },
  tTit: { color: colors.doradoNeon, fontSize: 26, fontFamily: fonts.extra, marginTop: 6, textAlign: 'center' },
  tSub: { color: colors.cielo, fontSize: 14, fontFamily: fonts.medium, textAlign: 'center', marginTop: 4, marginBottom: 12, lineHeight: 20 },
  regla: { flexDirection: 'row', alignItems: 'center', gap: 10, alignSelf: 'stretch', marginTop: 8 },
  reglaIcono: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(250,199,117,0.1)' },
  reglaTxt: { flex: 1, color: colors.cielo, fontSize: 13, fontFamily: fonts.semibold },
  record: { color: colors.turquesaSuave, fontSize: 13, fontFamily: fonts.bold, marginTop: 12 },
  finNum: { color: colors.cielo, fontSize: 54, fontFamily: fonts.extra, lineHeight: 60, marginTop: 4 },
  finLbl: { color: colors.turquesaSuave, fontSize: 14, fontFamily: fonts.semibold },
  finPuntos: { color: colors.doradoNeon, fontSize: 15, fontFamily: fonts.extra, marginTop: 6 },
  repaso: { alignSelf: 'stretch', marginTop: 14, padding: 12, borderRadius: 14, backgroundColor: 'rgba(8,26,34,0.6)' },
  repasoTit: { color: colors.turquesaSuave, fontSize: 10, fontFamily: fonts.bold, letterSpacing: 2, marginBottom: 6 },
  repasoFila: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 3 },
  repasoMarca: { width: 18, height: 18, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  repasoPal: { color: colors.doradoNeon, fontSize: 14, fontFamily: fonts.extra, minWidth: 70 },
  repasoSig: { flex: 1, color: colors.cielo, fontSize: 13, fontFamily: fonts.medium },
});
