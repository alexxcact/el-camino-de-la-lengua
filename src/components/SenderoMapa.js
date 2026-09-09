import React, { useRef, useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Animated, useWindowDimensions, ScrollView } from 'react-native';
import Svg, { Path, Circle, G } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { TIPOS_MISION } from '../data/datos';
import { imgMundoColor, imgMundoGris } from '../data/imagenes';
import Confeti from './Confeti';
import MedallaPasto from './MedallaPasto';
import AvatarSVG from './AvatarSVG';
import PaisajeSendero from './PaisajeSendero';
import { sonar } from '../utils/sonidos';

const NODE = 100;
const ROW = 224;
const HEADER_H = 108;
const PAD_BOTTOM = 90;

const X_PCT = { 1: 0.30, 2: 0.70, 3: 0.30, 4: 0.70, 5: 0.50 };
const TURQ_OSCURO = '#357168';

const AnimatedPath = Animated.createAnimatedComponent(Path);

// Curva Bézier suave (en S) entre dos centros de nodo
const curva = (a, b) => {
  const midY = (a.cy + b.cy) / 2;
  return `M ${a.cx} ${a.cy} C ${a.cx} ${midY} ${b.cx} ${midY} ${b.cx} ${b.cy}`;
};
const lerp = (a, b, t) => ({ x: a.cx + (b.cx - a.cx) * t, y: a.cy + (b.cy - a.cy) * t });

// ── Nodo individual ──
function NodoMundo({ data, pop, onPress, onBloqueado, avatar }) {
  const { mundo, estado, misionesDone } = data;
  const glow  = useRef(new Animated.Value(0)).current;
  const shake = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (estado !== 'activo') return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(glow, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(glow, { toValue: 0, duration: 800, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [estado]);

  const sacudir = () => {
    Animated.sequence([
      Animated.timing(shake, { toValue: 1,  duration: 50, useNativeDriver: true }),
      Animated.timing(shake, { toValue: -1, duration: 50, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 1,  duration: 50, useNativeDriver: true }),
      Animated.timing(shake, { toValue: -1, duration: 50, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 0,  duration: 50, useNativeDriver: true }),
    ]).start();
  };

  const completado = estado === 'completado';
  const activo     = estado === 'activo';
  const bloqueado  = estado === 'bloqueado';

  const scaleActivo = activo ? glow.interpolate({ inputRange: [0, 1], outputRange: [1, 1.025] }) : 1;
  const translateX  = shake.interpolate({ inputRange: [-1, 1], outputRange: [-6, 6] });

  const handlePress = () => {
    if (bloqueado) { sacudir(); sonar.error(); onBloqueado(); }
    else { sonar.pop(); onPress(); }
  };

  const total = TIPOS_MISION.length;
  const sublabel = completado ? '✓ Completado' : bloqueado ? 'Por descubrir' : `${misionesDone} de ${total} misiones`;
  const frac = misionesDone / total;

  return (
    <View style={[s.nodoWrap, { left: data.cx - NODE / 2, top: data.cy - NODE / 2 }]}>
      {/* El jugador (su avatar) parado sobre el nodo activo */}
      {activo && (
        <View style={s.jugadorParado}>
          <AvatarSVG avatar={avatar} tamano={36} conFondo />
        </View>
      )}

      <TouchableOpacity
        activeOpacity={bloqueado ? 1 : 0.85}
        onPress={handlePress}
        style={s.nodoTouch}
        accessibilityRole="button"
        accessibilityLabel={`${mundo.titulo}, ${mundo.subtitulo}. ${bloqueado ? 'Bloqueado. Completa el mundo anterior.' : sublabel}`}
        accessibilityHint={bloqueado ? undefined : 'Abre este mundo'}
      >
        <Animated.View style={{ transform: [{ translateX }, { scale: scaleActivo }, { scale: pop || 1 }] }}>
          <View style={[
            s.nodo,
            completado && s.nodoCompletado,
            activo && s.nodoActivo,
            bloqueado && s.nodoBloqueado,
          ]}>
            <View style={s.escenaMarco}>
              <Image source={bloqueado ? imgMundoGris[mundo.id] : imgMundoColor[mundo.id]} style={s.escena} resizeMode="cover" accessible={false} />
              {bloqueado && (
                <View style={s.escenaBloqueada}>
                  <View style={s.candado}>
                    <Ionicons name="lock-closed" size={22} color={colors.cielo} />
                  </View>
                </View>
              )}
            </View>
            {/* Anillo de progreso (nodo activo con misiones parciales) */}
            {activo && misionesDone > 0 && (
              <Svg width={NODE} height={NODE} style={StyleSheet.absoluteFill}>
                <G rotation={-90} origin={`${NODE / 2}, ${NODE / 2}`}>
                  <Circle cx={NODE / 2} cy={NODE / 2} r={NODE / 2 - 3} stroke="rgba(255,255,255,0.12)" strokeWidth={3} fill="none" />
                  <Circle
                    cx={NODE / 2} cy={NODE / 2} r={NODE / 2 - 3}
                    stroke={colors.doradoNeon} strokeWidth={3} fill="none"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * (NODE / 2 - 3)}
                    strokeDashoffset={2 * Math.PI * (NODE / 2 - 3) * (1 - frac)}
                  />
                </G>
              </Svg>
            )}

            <View style={[s.numeroMundo, bloqueado && s.numeroBloqueado]}>
              <Text style={s.numeroTxt} maxFontSizeMultiplier={1.2}>{mundo.id}</Text>
            </View>
            {completado && (
              <View style={s.medallaBadge}>
                <MedallaPasto mundoId={mundo.id} ganada tamano={30} />
              </View>
            )}
          </View>
        </Animated.View>
      </TouchableOpacity>

      <View style={s.nodoEtiqueta}>
        <Text style={[s.nodoTit, bloqueado && s.nodoTitOff]} numberOfLines={2}>{mundo.titulo}</Text>
        <Text style={s.nodoLugar} numberOfLines={2}>{mundo.subtitulo}</Text>
        <Text style={[s.nodoSub, (completado || activo) && s.nodoSubDone]}>{sublabel}</Text>
      </View>
    </View>
  );
}

// ── Sendero completo ──
export default function SenderoMapa({ mundos, estado, saludo, nombre, onSelect, cabecera }) {
  const { width: windowW, height: H, fontScale } = useWindowDimensions();
  const [anchoDisponible, setAnchoDisponible] = useState(windowW);
  const [altoDisponible, setAltoDisponible] = useState(H);
  const W = Math.min(anchoDisponible, 640);
  const rowHeight = Math.max(ROW, Math.round(ROW * fontScale));
  const headerHeight = Math.max(HEADER_H, Math.round(HEADER_H * fontScale));
  const scrollRef = useRef(null);
  const prevCompletados = useRef(null);
  const celebAnim = useRef(new Animated.Value(1)).current;
  const [celeb, setCeleb] = useState(null);       // { seg, node } o null
  const [confeti, setConfeti] = useState(false);
  const [aviso, setAviso] = useState(false);
  const [cabeceraH, setCabeceraH] = useState(0);  // alto medido de la cabecera (palabra del día)

  const ROWS = mundos.length;
  const canvasH = headerHeight + ROWS * rowHeight + PAD_BOTTOM;

  // Orden visual: mundo 5 arriba, mundo 1 abajo
  const orden = [...mundos].sort((a, b) => b.id - a.id);

  const nodos = {};
  orden.forEach((mundo, k) => {
    const completado = estado.mundosCompletados.has(mundo.id);
    const abierto    = mundo.id === 1 || estado.mundosCompletados.has(mundo.id - 1);
    const est        = completado ? 'completado' : abierto ? 'activo' : 'bloqueado';
    const misionesDone = TIPOS_MISION
      .filter(t => estado.misionesCompletadas.has(`${t}-${mundo.id}`)).length;
    nodos[mundo.id] = {
      mundo, estado: est, misionesDone,
      cx: X_PCT[mundo.id] * W,
      cy: headerHeight + k * rowHeight + rowHeight / 2,
    };
  });

  const activoId = mundos.find(m => nodos[m.id].estado === 'activo')?.id;

  // Usa el espacio del sendero, descontando HUD y navegación. Deja sitio para
  // el nombre y estado bajo el nodo, también con el texto del sistema ampliado.
  useEffect(() => {
    const target = (activoId ? nodos[activoId].cy : canvasH) + cabeceraH;
    const espacioEtiqueta = NODE / 2 + 100 * fontScale;
    const posicionVisible = Math.max(NODE / 2 + 24, Math.min(altoDisponible * 0.55, altoDisponible - espacioEtiqueta));
    const y = Math.max(0, Math.min(canvasH + cabeceraH - altoDisponible, target - posicionVisible));
    const t = setTimeout(() => scrollRef.current?.scrollTo({ y, animated: false }), 0);
    return () => clearTimeout(t);
  }, [cabeceraH, W, altoDisponible, rowHeight, headerHeight, activoId]);

  // Celebración al volver tras completar un mundo
  useEffect(() => {
    const size = estado.mundosCompletados.size;
    if (prevCompletados.current === null) { prevCompletados.current = size; return; }
    if (size > prevCompletados.current) {
      const N = size;                            // mundo recién completado
      const seg = N < ROWS ? N : null;           // tramo N→N+1 que se enciende
      const node = (N + 1 <= ROWS) ? N + 1 : N;  // nodo recién desbloqueado
      setCeleb({ seg, node });
      setConfeti(true);
      celebAnim.setValue(0);
      Animated.timing(celebAnim, { toValue: 1, duration: 800, useNativeDriver: false }).start();
    }
    prevCompletados.current = size;
  }, [estado.mundosCompletados.size]);

  const mostrarAviso = () => {
    setAviso(true);
    setTimeout(() => setAviso(false), 1600);
  };

  // Segmentos del sendero
  const segmentos = [];
  for (let i = 1; i < ROWS; i++) {
    const a = nodos[i], b = nodos[i + 1];
    if (!a || !b) continue;
    segmentos.push({ i, a, b, gold: estado.mundosCompletados.has(i) });
  }

  // Decoraciones (rombos) cerca de cada tramo
  const deco = [];
  segmentos.forEach(seg => {
    [0.35, 0.65].forEach((t, j) => {
      const p = lerp(seg.a, seg.b, t);
      deco.push({ key: `${seg.i}-${j}`, x: p.x + (j ? 16 : -16), y: p.y, gold: seg.gold });
    });
  });

  const popScale = celebAnim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.6, 1.1, 1] });

  return (
    <View style={{ flex: 1 }} onLayout={({ nativeEvent: { layout } }) => {
      setAnchoDisponible(layout.width);
      setAltoDisponible(layout.height);
    }}>
      <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false} contentContainerStyle={s.scrollContenido}>
        {cabecera != null && (
          <View style={{ width: W }} onLayout={(e) => setCabeceraH(e.nativeEvent.layout.height)}>
            {cabecera}
          </View>
        )}
        <View style={{ height: canvasH, width: W }}>

          {/* Cabecera */}
          <View style={[s.header, { height: headerHeight }]}>
            <Text style={s.saludo}>{saludo}, {nombre}!</Text>
            <Text style={s.label}>Tu camino por el territorio</Text>
            <Text style={s.headerSub}>{estado.mundosCompletados.size} de {ROWS} mundos completados</Text>
          </View>

          <PaisajeSendero ancho={W} alto={canvasH} nodos={Object.values(nodos)} />

          {/* Capa SVG: línea del sendero */}
          <Svg width={W} height={canvasH} style={StyleSheet.absoluteFill} pointerEvents="none">
            {/* tramos pendientes */}
            {segmentos.filter(s => !s.gold).map(seg => (
              <Path key={`p${seg.i}`} d={curva(seg.a, seg.b)} stroke={TURQ_OSCURO} strokeWidth={3}
                strokeDasharray="2 10" strokeLinecap="round" fill="none" />
            ))}
            {/* tramos recorridos (dorado) */}
            {segmentos.filter(s => s.gold).map(seg => (
              celeb && celeb.seg === seg.i ? (
                <AnimatedPath key={`g${seg.i}`} d={curva(seg.a, seg.b)} stroke={colors.doradoNeon} strokeWidth={4}
                  strokeDasharray="2 9" strokeLinecap="round" fill="none" opacity={celebAnim} />
              ) : (
                <Path key={`g${seg.i}`} d={curva(seg.a, seg.b)} stroke={colors.doradoNeon} strokeWidth={4}
                  strokeDasharray="2 9" strokeLinecap="round" fill="none" />
              )
            ))}
          </Svg>

          {/* Decoraciones rómbicas */}
          {deco.map(d => (
            <View key={d.key} pointerEvents="none"
              style={[s.rombo, { left: d.x - 4, top: d.y - 4, opacity: d.gold ? 0.5 : 0.15 }]} />
          ))}

          {/* Nodos */}
          {mundos.map(m => (
            <NodoMundo
              key={m.id}
              data={nodos[m.id]}
              pop={celeb && celeb.node === m.id ? popScale : undefined}
              onPress={() => onSelect(m.id)}
              onBloqueado={mostrarAviso}
              avatar={estado.avatar}
            />
          ))}
        </View>

        <View style={s.footer}>
          <Text style={s.footNeg}>PUMA-MAKI</Text>
          <Text style={s.footSub}>Pueblo Pasto · Resguardo de Muellamués · Nariño</Text>
        </View>
      </ScrollView>

      {/* Aviso de bloqueado */}
      {aviso && (
        <View style={s.avisoWrap} pointerEvents="none">
          <Text style={s.avisoTxt}>Completa el mundo anterior</Text>
        </View>
      )}

      <Confeti activo={confeti} mini cantidad={10} onDone={() => setConfeti(false)} />
    </View>
  );
}

const s = StyleSheet.create({
  scrollContenido: { alignItems: 'center' },
  header: { height: HEADER_H, paddingHorizontal: 18, paddingTop: 14, justifyContent: 'center' },
  saludo: { color: colors.cielo, fontSize: 20, fontFamily: fonts.extra },
  label:  { color: colors.turquesaSuave, fontSize: 16, fontFamily: fonts.semibold, marginTop: 2 },
  headerSub: { color: colors.turquesaSuave, fontSize: 13, fontFamily: fonts.regular, marginTop: 2 },

  rombo: {
    position: 'absolute', width: 8, height: 8,
    backgroundColor: colors.doradoNeon, transform: [{ rotate: '45deg' }],
  },

  nodoWrap: { position: 'absolute', width: NODE, alignItems: 'center' },
  nodoTouch: { width: NODE, height: NODE },
  nodo: {
    width: NODE, height: NODE, borderRadius: NODE / 2,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.nocheCard, borderWidth: 3, borderColor: 'rgba(93,202,165,0.25)',
  },
  nodoCompletado: { borderColor: colors.doradoNeon },
  nodoActivo: { borderColor: colors.doradoNeon,
    shadowColor: colors.doradoNeon, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.25, shadowRadius: 10, elevation: 4 },
  nodoBloqueado: { backgroundColor: colors.nocheProfundo, borderColor: '#357168' },
  escenaMarco: { width: NODE - 12, height: NODE - 12, borderRadius: (NODE - 12) / 2, overflow: 'hidden' },
  escena: { width: '100%', height: '100%' },
  escenaBloqueada: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(11,31,42,0.3)', alignItems: 'center', justifyContent: 'center' },
  candado: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(11,31,42,0.8)', alignItems: 'center', justifyContent: 'center' },
  numeroMundo: { position: 'absolute', bottom: -5, left: -4, width: 28, height: 28, borderRadius: 14, backgroundColor: colors.crema, borderWidth: 2, borderColor: colors.noche, alignItems: 'center', justifyContent: 'center' },
  numeroBloqueado: { backgroundColor: '#BED0C6' },
  numeroTxt: { fontSize: 15, fontFamily: fonts.extra, color: colors.noche },

  jugadorParado: {
    position: 'absolute', top: -22, alignSelf: 'center', zIndex: 5,
    width: 36, height: 36, borderRadius: 18, overflow: 'hidden',
    borderWidth: 2, borderColor: colors.doradoNeon,
  },
  medallaBadge: { position: 'absolute', top: -8, right: -8 },

  nodoEtiqueta: { width: 164, alignItems: 'center', marginTop: 10, paddingHorizontal: 4, paddingBottom: 3, borderRadius: 10, backgroundColor: colors.noche },
  nodoTit:    { color: colors.cielo, fontSize: 16, lineHeight: 20, fontFamily: fonts.extra, textAlign: 'center', width: 156 },
  nodoTitOff: { color: colors.turquesaSuave },
  nodoLugar: { color: colors.turquesaSuave, fontSize: 13, lineHeight: 17, fontFamily: fonts.regular, textAlign: 'center', width: 156 },
  nodoSub:    { color: colors.turquesaSuave, fontSize: 13, fontFamily: fonts.semibold, marginTop: 3, textAlign: 'center', width: 156 },
  nodoSubDone:{ color: colors.doradoNeon },

  footer:  { alignItems: 'center', paddingVertical: 20, paddingHorizontal: 20 },
  footNeg: { fontSize: 16, fontFamily: fonts.extra, color: colors.turquesaClaro, letterSpacing: 3 },
  footSub: { fontSize: 12, fontFamily: fonts.regular, color: colors.turquesaSuave, marginTop: 2, textAlign: 'center' },

  avisoWrap: { position: 'absolute', top: 16, alignSelf: 'center', backgroundColor: colors.nocheProfundo, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, borderWidth: 1, borderColor: colors.doradoNeon },
  avisoTxt:  { color: colors.cielo, fontSize: 13, fontFamily: fonts.semibold },
});
