import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { ui, radii } from '../theme/ui';
import { palabras, mundos } from '../data/datos';
import { useJuego } from '../context/JuegoContext';
import AvatarSVG from '../components/AvatarSVG';
import Medallon from '../components/Medallon';
import PishkuMascota from '../components/PishkuMascota';
import Confeti from '../components/Confeti';
import BotonGlow from '../components/BotonGlow';
import { sonar } from '../utils/sonidos';
import { vibrar } from '../utils/feedback';
import { decirPalabra, detenerVoz } from '../utils/voz';
import { bancoDuelo, filtrarBancoDuelo, generarPreguntaDuelo } from '../utils/duelo';

// ══════════════════════════════════════════════════════════════
// DUELO DE LA LENGUA — 2 jugadores por turnos en el MISMO dispositivo.
// 100% efímero: NO toca puntos, racha, misiones ni medallas. Lo único que
// persiste es el contador duelosJugados (para el logro "Espíritu competitivo"),
// que se registra una vez al terminar la partida.
// ══════════════════════════════════════════════════════════════

// Dos "equipos" con avatar y color propios (cosméticos; ignoran desbloqueos)
const EQUIPOS = [
  { def: 'Equipo Cóndor',  color: colors.turquesa,  emoji: '🦅', avatar: { piel: 1, ropa: 1, sombrero: 2, accesorio: 1 } },
  { def: 'Equipo Colibrí', color: colors.doradoNeon, emoji: '🐦', avatar: { piel: 2, ropa: 3, sombrero: 1, accesorio: 2 } },
];

const OPCIONES_RONDAS = [5, 7, 10];

export default function DueloScreen({ navigation }) {
  const { estado, registrarDuelo, verificarLogros } = useJuego();

  // ── Banco base: palabras vistas; sin progreso, ofrece el Mundo 1 ──
  const vistas = palabras.filter(p => estado.palabrasVistas.has(p.id));
  const base = bancoDuelo(palabras, estado.palabrasVistas);
  const mundosDisponibles = mundos.filter(m => base.some(p => p.mundo === m.id));
  const catsDisponibles = [...new Set(base.map(p => p.cat))];

  // ── Configuración (efímera) ──
  const [nombres, setNombres] = useState([EQUIPOS[0].def, EQUIPOS[1].def]);
  const [modoCont, setModoCont] = useState('todo');   // 'todo' | 'mundo' | 'categoria'
  const [mundoSel, setMundoSel] = useState(mundosDisponibles[0]?.id ?? 1);
  const [catSel, setCatSel] = useState(catsDisponibles[0] ?? null);
  const [rondas, setRondas] = useState(5);
  const bancoSeleccionado = filtrarBancoDuelo(base, modoCont, mundoSel, catSel);

  // ── Partida ──
  const [fase, setFase] = useState('config');          // config | pase | pregunta | final
  const [pool, setPool] = useState([]);
  const [turno, setTurno] = useState(0);               // 0 .. 2*rondas-1
  const [pregunta, setPregunta] = useState(null);
  const [marcador, setMarcador] = useState([0, 0]);
  const [seleccion, setSeleccion] = useState(null);    // quiz/escucha: id elegido
  const [parPrimera, setParPrimera] = useState(null);  // relámpago: 1ª tile
  const [parSegunda, setParSegunda] = useState(null);  // relámpago: 2ª tile
  const [feedback, setFeedback] = useState(null);      // { acerto } cuando ya respondió
  const [flash, setFlash] = useState(false);

  const marcadorRef = useRef([0, 0]);  // espejo síncrono del marcador (evita closures viejas)
  const timeoutRef = useRef(null);

  const total = rondas * 2;
  const jugadorIdx = turno % 2;
  const rondaIdx = Math.floor(turno / 2);

  useEffect(() => () => { clearTimeout(timeoutRef.current); detenerVoz(); }, []);

  // En las preguntas de Escucha, pronuncia la palabra al empezar el turno
  useEffect(() => {
    if (fase !== 'pregunta' || !pregunta || pregunta.tipo !== 'escucha') return;
    const t = setTimeout(() => decirPalabra(pregunta.target.p), 350);
    return () => clearTimeout(t);
  }, [fase, turno]);

  // ── Construye el banco según la selección y arranca la partida ──
  const comenzar = () => {
    const p = bancoSeleccionado;
    if (p.length === 0) return;

    marcadorRef.current = [0, 0];
    setPool(p);
    setMarcador([0, 0]);
    iniciarTurno(0, p);
  };

  // Prepara un turno: genera su pregunta y muestra el "pase de teléfono"
  const iniciarTurno = (t, poolActual = pool) => {
    setTurno(t);
    setPregunta(generarPreguntaDuelo(poolActual));
    setSeleccion(null);
    setParPrimera(null);
    setParSegunda(null);
    setFeedback(null);
    setFase('pase');
  };

  // Resultado de la respuesta del turno → puntúa y avanza
  const registrarRespuesta = (acerto) => {
    if (acerto) {
      const n = [...marcadorRef.current];
      n[jugadorIdx] += 1;
      marcadorRef.current = n;
      setMarcador(n);
      setFlash(true);
      sonar.acierto(); vibrar.suave();
    } else {
      sonar.error(); vibrar.error();
    }
    setFeedback({ acerto });
    timeoutRef.current = setTimeout(() => {
      if (turno + 1 < total) iniciarTurno(turno + 1);
      else terminar();
    }, 1500);
  };

  const terminar = () => {
    setFase('final');
    registrarDuelo();      // único efecto global (contador para el logro)
    verificarLogros();
  };

  const revancha = () => {
    detenerVoz();
    clearTimeout(timeoutRef.current);
    marcadorRef.current = [0, 0];
    setMarcador([0, 0]);
    iniciarTurno(0, pool);
  };

  const salir = () => { detenerVoz(); clearTimeout(timeoutRef.current); navigation.goBack(); };

  // ── Interacciones de respuesta ──
  const elegirOpcion = (op) => {
    if (feedback) return;
    setSeleccion(op.id);
    registrarRespuesta(op.id === pregunta.target.id);
  };

  const tocarTile = (tile) => {
    if (feedback) return;
    if (!parPrimera) { setParPrimera(tile.key); sonar.pop(); return; }
    if (tile.key === parPrimera) return;               // ignora doble toque en la misma
    const primera = pregunta.tiles.find(t => t.key === parPrimera);
    const acerto = tile.id === primera.id && tile.lado !== primera.lado;
    setParSegunda(tile.key);
    registrarRespuesta(acerto);
  };

  // ════════════════════════════════════════════════════
  // RENDER
  // ════════════════════════════════════════════════════
  // Las vistas se invocan como funciones (no como <Componente/>) a propósito: así se
  // inlinan en el render del padre y no se remontan en cada cambio de estado (si fueran
  // componentes anidados, el TextInput de los nombres perdería el foco en cada tecla).
  if (fase === 'config')  return Config();
  if (fase === 'pase')    return PaseTelefono();
  if (fase === 'final')   return Final();
  return Pregunta();

  // ─── CONFIGURACIÓN ───
  function Config() {
    const puedeEmpezar = nombres[0].trim().length > 0 && nombres[1].trim().length > 0 && bancoSeleccionado.length > 0;
    return (
      <KeyboardAvoidingView style={s.bg} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={s.configContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <Text style={s.tituloGrande}>Duelo de la Lengua</Text>
          <Text style={s.subtitulo}>Dos jugadores, un mismo dispositivo. ¡Por turnos!</Text>

          {/* Nombres */}
          {[0, 1].map(i => (
            <View key={i} style={[s.nombreCard, { borderColor: EQUIPOS[i].color }]}>
              <View style={[s.nombreAvatar, { borderColor: EQUIPOS[i].color }]}>
                <AvatarSVG avatar={EQUIPOS[i].avatar} tamano={44} conFondo />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[s.nombreLbl, { color: EQUIPOS[i].color }]}>Jugador {i + 1}</Text>
                <TextInput
                  style={s.nombreInput}
                  value={nombres[i]}
                  onChangeText={(t) => setNombres(n => { const c = [...n]; c[i] = t.slice(0, 16); return c; })}
                  placeholder={EQUIPOS[i].def}
                  placeholderTextColor={colors.turquesaSuave}
                  maxLength={16}
                  autoCorrect={false}
                />
              </View>
            </View>
          ))}

          {/* Contenido */}
          <Text style={s.seccion}>¿CON QUÉ PALABRAS?</Text>
          <View style={s.chipRow}>
            {[['todo', 'Todo lo aprendido'], ['mundo', 'Por mundo'], ['categoria', 'Por categoría']].map(([val, lbl]) => (
              <TouchableOpacity key={val} style={[s.chip, modoCont === val && s.chipOn]} onPress={() => setModoCont(val)} activeOpacity={0.85}>
                <Text style={[s.chipTxt, modoCont === val && s.chipTxtOn]}>{lbl}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {modoCont === 'mundo' && (
            <View style={s.chipRow}>
              {mundosDisponibles.map(m => (
                <TouchableOpacity key={m.id} style={[s.chip, mundoSel === m.id && s.chipOn]} onPress={() => setMundoSel(m.id)} activeOpacity={0.85}>
                  <Text style={[s.chipTxt, mundoSel === m.id && s.chipTxtOn]}>{m.emoji} {m.titulo}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
          {modoCont === 'categoria' && (
            <View style={s.chipRow}>
              {catsDisponibles.map(c => (
                <TouchableOpacity key={c} style={[s.chip, catSel === c && s.chipOn]} onPress={() => setCatSel(c)} activeOpacity={0.85}>
                  <Text style={[s.chipTxt, catSel === c && s.chipTxtOn]}>{c}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
          {vistas.length === 0 && (
            <Text style={s.aviso}>Aún no hay palabras aprendidas: el duelo usará las del Mundo 1.</Text>
          )}
          {bancoSeleccionado.length === 1 && (
            <Text style={s.aviso}>Jugarán con una palabra: une su pareja en cada turno.</Text>
          )}
          {bancoSeleccionado.length === 0 && (
            <Text style={s.aviso}>No hay palabras para esta selección. Elige otro mundo o categoría.</Text>
          )}

          {/* Rondas */}
          <Text style={s.seccion}>RONDAS (PREGUNTAS POR JUGADOR)</Text>
          <View style={s.chipRow}>
            {OPCIONES_RONDAS.map(r => (
              <TouchableOpacity key={r} style={[s.chip, rondas === r && s.chipOn]} onPress={() => setRondas(r)} activeOpacity={0.85}>
                <Text style={[s.chipTxt, rondas === r && s.chipTxtOn]}>{r}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={{ marginTop: 22 }}>
            <BotonGlow texto="¡Comenzar duelo!" onPress={comenzar} variante="primario" tamano="lg" desactivado={!puedeEmpezar} />
          </View>
          <TouchableOpacity style={s.salirLink} onPress={salir} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Text style={s.salirTxt}>← Volver al mapa</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  // ─── PASE DE TELÉFONO ───
  function PaseTelefono() {
    const eq = EQUIPOS[jugadorIdx];
    const nom = nombres[jugadorIdx].trim() || eq.def;
    return (
      <TouchableOpacity style={[s.bg, s.paseWrap]} activeOpacity={1} onPress={() => setFase('pregunta')}>
        <LinearGradient colors={[colors.noche, colors.nocheCard]} style={StyleSheet.absoluteFill} />
        <Text style={s.paseRonda}>RONDA {rondaIdx + 1} DE {rondas}</Text>
        <Medallon size={132} ring={eq.color}>
          <AvatarSVG avatar={eq.avatar} tamano={120} conFondo />
        </Medallon>
        <Text style={s.paseTit}>Pasa el teléfono a</Text>
        <Text style={[s.paseNombre, { color: eq.color }]}>{nom}</Text>
        <View style={s.paseMarcadorRow}>
          <Text style={[s.paseMarcador, { color: EQUIPOS[0].color }]}>{marcador[0]}</Text>
          <Text style={s.paseGuion}>—</Text>
          <Text style={[s.paseMarcador, { color: EQUIPOS[1].color }]}>{marcador[1]}</Text>
        </View>
        <Text style={s.paseHint}>Toca la pantalla para empezar tu turno</Text>
      </TouchableOpacity>
    );
  }

  // ─── MARCADOR (cabecera de la pregunta) ───
  function Marcador() {
    return (
      <View style={s.marcadorBar}>
        {[0, 1].map(i => {
          const eq = EQUIPOS[i];
          const activo = i === jugadorIdx;
          const nom = nombres[i].trim() || eq.def;
          return (
            <View key={i} style={[s.marcEquipo, activo && { borderColor: eq.color, backgroundColor: 'rgba(255,255,255,0.04)' }]}>
              <View style={[s.marcAvatar, { borderColor: eq.color, opacity: activo ? 1 : 0.5 }]}>
                <AvatarSVG avatar={eq.avatar} tamano={30} conFondo />
              </View>
              <Text style={[s.marcNombre, activo && { color: colors.cielo }]} numberOfLines={1}>{nom}</Text>
              <Text style={[s.marcPuntos, { color: eq.color }]}>{marcador[i]}</Text>
            </View>
          );
        })}
      </View>
    );
  }

  // ─── PREGUNTA ───
  function Pregunta() {
    const eq = EQUIPOS[jugadorIdx];
    const nom = nombres[jugadorIdx].trim() || eq.def;
    return (
      <View style={s.bg}>
        {Marcador()}
        <ScrollView contentContainerStyle={{ padding: 14, paddingBottom: 30, flexGrow: 1 }} showsVerticalScrollIndicator={false}>
          <Text style={s.turnoLbl}>Ronda {rondaIdx + 1}/{rondas} · Turno de <Text style={{ color: eq.color }}>{nom}</Text></Text>

          {pregunta.tipo === 'relampago' ? Relampago() : QuizEscucha()}
        </ScrollView>
        <Confeti activo={flash} mini cantidad={8} onDone={() => setFlash(false)} />
      </View>
    );
  }

  // Quiz (ver pastoker → elegir español) y Escucha (oír → elegir dibujo)
  function QuizEscucha() {
    const esEscucha = pregunta.tipo === 'escucha';
    return (
      <View>
        {esEscucha ? (
          <View style={s.audioWrap}>
            <Text style={s.instruccion}>Escucha y elige el significado</Text>
            <TouchableOpacity onPress={() => decirPalabra(pregunta.target.p)} activeOpacity={0.85} style={s.audioBtn}>
              <Ionicons name="volume-high" size={52} color={colors.cielo} />
            </TouchableOpacity>
            <Text style={s.audioHint}>Toca para oír otra vez</Text>
          </View>
        ) : (
          <View style={s.qCard}>
            <Text style={s.qLabel}>¿QUÉ SIGNIFICA EN ESPAÑOL?</Text>
            <Text style={s.qEmoji}>{pregunta.target.emoji}</Text>
            <Text style={s.qPast}>{pregunta.target.p}</Text>
            <Text style={s.qFon}>[ {pregunta.target.fon} ]</Text>
          </View>
        )}

        <View style={s.opciones}>
          {pregunta.opciones.map(op => {
            const esCorr = op.id === pregunta.target.id;
            const elegida = seleccion === op.id;
            return (
              <TouchableOpacity
                key={op.id}
                style={[
                  s.op,
                  feedback && esCorr && s.opCorrecta,
                  feedback && elegida && !esCorr && s.opIncorrecta,
                  feedback && !esCorr && !elegida && s.opOff,
                ]}
                onPress={() => elegirOpcion(op)}
                disabled={!!feedback}
                activeOpacity={0.85}
              >
                <Text style={s.opEmoji}>{op.emoji}</Text>
                <Text style={s.opTxt}>{op.e}</Text>
                {feedback && esCorr && <Text style={s.opCheck}>✓</Text>}
                {feedback && elegida && !esCorr && <Ionicons name="close" size={22} color={colors.coral} />}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  }

  // Parejas-relámpago: encontrar 1 par entre las fichas del banco seleccionado
  function Relampago() {
    const primera = parPrimera ? pregunta.tiles.find(t => t.key === parPrimera) : null;
    return (
      <View>
        <Text style={s.instruccion}>Toca una palabra y su significado</Text>
        <View style={s.tilesGrid}>
          {pregunta.tiles.map(tile => {
            const sel = parPrimera === tile.key || parSegunda === tile.key;
            // Tras responder: marca el par correcto en verde; el 2º toque errado en rojo
            let estadoVisual = null;
            if (feedback) {
              if (primera && (tile.id === primera.id) && (tile.key === parPrimera || tile.key === parSegunda) && feedback.acerto)
                estadoVisual = 'ok';
              else if (tile.key === parSegunda && !feedback.acerto)
                estadoVisual = 'fail';
              else if (tile.key === parPrimera && !feedback.acerto)
                estadoVisual = 'fail';
            }
            return (
              <TouchableOpacity
                key={tile.key}
                style={[
                  s.tile,
                  sel && !feedback && s.tileSel,
                  estadoVisual === 'ok' && s.tileOk,
                  estadoVisual === 'fail' && s.tileFail,
                ]}
                onPress={() => tocarTile(tile)}
                disabled={!!feedback}
                activeOpacity={0.85}
              >
                {tile.lado === 'past' ? (
                  <>
                    <Text style={s.tileEmoji}>{tile.emoji}</Text>
                    <Text style={s.tilePast}>{tile.txt}</Text>
                  </>
                ) : (
                  <Text style={s.tileEsp}>{tile.txt}</Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  }

  // ─── FINAL ───
  function Final() {
    const [p1, p2] = marcadorRef.current;
    const empate = p1 === p2;
    const ganadorIdx = p1 > p2 ? 0 : 1;
    const eq = EQUIPOS[ganadorIdx];
    const nom = nombres[ganadorIdx].trim() || eq.def;
    return (
      <View style={s.bg}>
        <LinearGradient colors={colors.gradAurora} style={StyleSheet.absoluteFill} />
        <ScrollView contentContainerStyle={s.finalContent}>
          <PishkuMascota celebrando tamano={96} mensaje={empate ? '¡Pío! ¡Qué duelo tan parejo!' : `¡Pío pío! ¡${nom} gana!`} />

          {empate ? (
            <>
              <Text style={s.finalTit}>¡Empate!</Text>
              <Text style={s.finalSub}>Ambos son guardianes de la lengua</Text>
            </>
          ) : (
            <>
              <Text style={s.finalGanaLbl}>¡GANADOR!</Text>
              <Text style={[s.finalNombre, { color: eq.color }]}>{nom}</Text>
            </>
          )}

          <View style={s.finalMarcador}>
            {[0, 1].map(i => (
              <View key={i} style={s.finalEquipo}>
                <Medallon size={64} ring={EQUIPOS[i].color} halo={false}>
                  <AvatarSVG avatar={EQUIPOS[i].avatar} tamano={56} conFondo />
                </Medallon>
                <Text style={[s.finalPuntos, { color: EQUIPOS[i].color }]}>{marcadorRef.current[i]}</Text>
                <Text style={s.finalEqNom} numberOfLines={1}>{nombres[i].trim() || EQUIPOS[i].def}</Text>
              </View>
            ))}
          </View>

          <View style={{ gap: 10, alignSelf: 'stretch', marginTop: 8 }}>
            <BotonGlow texto="Revancha" onPress={revancha} variante="primario" tamano="lg" />
            <BotonGlow texto="Volver al mapa" onPress={salir} variante="fantasma" tamano="md" />
          </View>
        </ScrollView>
        <Confeti activo cantidad={32} />
      </View>
    );
  }
}

const s = StyleSheet.create({
  bg: { flex: 1, backgroundColor: colors.noche },

  // Config
  configContent: { padding: 18, paddingBottom: 40 },
  tituloGrande: { fontSize: 26, fontFamily: fonts.extra, color: colors.doradoNeon, textAlign: 'center', textShadowColor: 'rgba(250,199,117,0.4)', textShadowRadius: 12 },
  subtitulo: { fontSize: 13, color: colors.turquesaSuave, textAlign: 'center', marginTop: 4, marginBottom: 18, fontFamily: fonts.medium },

  nombreCard: { ...ui.card, flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: radii.md, padding: 12, marginBottom: 12 },
  nombreAvatar: { width: 50, height: 50, borderRadius: 25, overflow: 'hidden', borderWidth: 2 },
  nombreLbl: { fontSize: 11, fontFamily: fonts.bold, letterSpacing: 1 },
  nombreInput: { fontSize: 18, color: colors.cielo, fontFamily: fonts.bold, paddingVertical: 6, paddingHorizontal: 0, minHeight: 40 },

  seccion: { ...ui.pill, ...ui.pillTxt, overflow: 'hidden', marginTop: 18, marginBottom: 10 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 16, minHeight: 48, justifyContent: 'center', borderRadius: radii.pill, borderWidth: 1.5, borderColor: 'rgba(93,202,165,0.4)', backgroundColor: 'rgba(93,202,165,0.12)' },
  chipOn: { backgroundColor: colors.turquesa, borderColor: colors.turquesa },
  chipTxt: { fontSize: 14, color: colors.turquesaSuave, fontFamily: fonts.semibold },
  chipTxtOn: { color: colors.noche },
  aviso: { fontSize: 12, color: colors.doradoNeon, fontStyle: 'italic', marginTop: 10 },

  salirLink: { alignItems: 'center', marginTop: 18, paddingVertical: 10 },
  salirTxt: { color: colors.turquesaClaro, fontSize: 14, fontFamily: fonts.semibold },

  // Pase de teléfono
  paseWrap: { alignItems: 'center', justifyContent: 'center', padding: 28 },
  paseRonda: { ...ui.pill, ...ui.pillTxt, overflow: 'hidden', alignSelf: 'center', marginBottom: 26 },
  paseTit: { fontSize: 18, color: colors.cielo, fontFamily: fonts.semibold, marginTop: 16 },
  paseNombre: { fontSize: 32, fontFamily: fonts.extra, marginTop: 2, textAlign: 'center' },
  paseMarcadorRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 22 },
  paseMarcador: { fontSize: 30, fontFamily: fonts.extra },
  paseGuion: { fontSize: 24, color: colors.turquesaSuave },
  paseHint: { fontSize: 13, color: colors.turquesaSuave, fontStyle: 'italic', marginTop: 28 },

  // Marcador
  marcadorBar: { flexDirection: 'row', gap: 10, paddingHorizontal: 14, paddingTop: 12, paddingBottom: 4 },
  marcEquipo: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 10, paddingVertical: 8, borderRadius: radii.md, borderWidth: 1.5, borderColor: 'rgba(93,202,165,0.2)', backgroundColor: 'rgba(8,26,34,0.62)' },
  marcAvatar: { width: 34, height: 34, borderRadius: 17, overflow: 'hidden', borderWidth: 1.5 },
  marcNombre: { flex: 1, fontSize: 12, color: colors.turquesaSuave, fontFamily: fonts.semibold },
  marcPuntos: { fontSize: 22, fontFamily: fonts.extra },

  turnoLbl: { fontSize: 13, color: colors.turquesaSuave, fontFamily: fonts.semibold, textAlign: 'center', marginVertical: 12 },

  // Quiz / Escucha
  qCard: { ...ui.cardDestacada, alignItems: 'center', marginBottom: 16 },
  qLabel: { fontSize: 10, color: colors.turquesaSuave, fontFamily: fonts.bold, letterSpacing: 3, marginBottom: 10 },
  qEmoji: { fontSize: 56, marginBottom: 6 },
  qPast: { fontSize: 34, fontWeight: '900', color: colors.doradoNeon, fontFamily: 'serif', letterSpacing: 1, textShadowColor: 'rgba(250,199,117,0.5)', textShadowRadius: 12 },
  qFon: { fontSize: 12, color: colors.turquesaSuave, fontStyle: 'italic', marginTop: 4 },

  audioWrap: { alignItems: 'center', marginBottom: 18 },
  instruccion: { fontSize: 15, color: colors.turquesaSuave, fontFamily: fonts.semibold, marginBottom: 14, textAlign: 'center' },
  audioBtn: { width: 110, height: 110, borderRadius: 55, backgroundColor: colors.turquesa, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: colors.turquesaClaro, shadowColor: colors.turquesaClaro, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.7, shadowRadius: 16, elevation: 12 },
  audioIco: { fontSize: 52 },
  audioHint: { fontSize: 12, color: colors.turquesaSuave, fontStyle: 'italic', marginTop: 12 },

  opciones: { gap: 10 },
  op: { ...ui.card, flexDirection: 'row', alignItems: 'center', gap: 12, padding: 0, paddingHorizontal: 14, minHeight: 56, borderRadius: radii.md, borderColor: 'rgba(93,202,165,0.25)' },
  opCorrecta: { borderColor: colors.turquesa, borderWidth: 2, backgroundColor: 'rgba(29,158,117,0.15)' },
  opIncorrecta: { borderColor: colors.coral, borderWidth: 2, backgroundColor: 'rgba(242,120,92,0.12)' },
  opOff: { opacity: 0.4 },
  opEmoji: { fontSize: 26 },
  opTxt: { flex: 1, fontSize: 15, fontFamily: fonts.bold, color: colors.cielo },
  opCheck: { fontSize: 22, color: colors.turquesa, fontFamily: fonts.extra },
  opX: { fontSize: 22, color: colors.coral, fontFamily: fonts.extra },

  // Relámpago
  tilesGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  tile: { ...ui.card, width: '47%', minHeight: 84, alignItems: 'center', justifyContent: 'center', borderRadius: radii.md, marginBottom: 12, padding: 8, borderColor: 'rgba(93,202,165,0.25)' },
  tileSel: { borderColor: colors.doradoNeon, borderWidth: 2.5, backgroundColor: 'rgba(250,199,117,0.12)' },
  tileOk: { borderColor: colors.turquesa, borderWidth: 2.5, backgroundColor: 'rgba(29,158,117,0.18)' },
  tileFail: { borderColor: colors.coral, borderWidth: 2.5, backgroundColor: 'rgba(242,120,92,0.14)' },
  tileEmoji: { fontSize: 30 },
  tilePast: { fontSize: 18, fontWeight: '900', color: colors.doradoNeon, fontFamily: 'serif', marginTop: 4 },
  tileEsp: { fontSize: 16, color: colors.cielo, fontFamily: fonts.bold, textAlign: 'center' },

  // Final
  finalContent: { flexGrow: 1, padding: 24, justifyContent: 'center', alignItems: 'center' },
  finalTit: { fontSize: 30, fontFamily: fonts.extra, color: colors.doradoNeon, marginTop: 16, textAlign: 'center', textShadowColor: 'rgba(250,199,117,0.5)', textShadowRadius: 14 },
  finalSub: { fontSize: 15, color: colors.cielo, fontFamily: fonts.semibold, marginTop: 6, textAlign: 'center' },
  finalGanaLbl: { ...ui.pill, ...ui.pillTxt, overflow: 'hidden', alignSelf: 'center', marginTop: 20 },
  finalNombre: { fontSize: 36, fontFamily: fonts.extra, marginTop: 4, textAlign: 'center', textShadowColor: 'rgba(250,199,117,0.4)', textShadowRadius: 14 },
  finalMarcador: { ...ui.card, alignSelf: 'stretch', flexDirection: 'row', justifyContent: 'space-evenly', gap: 20, marginTop: 26, marginBottom: 8, paddingVertical: 18 },
  finalEquipo: { alignItems: 'center', width: 110 },
  finalPuntos: { fontSize: 44, fontFamily: fonts.extra, marginTop: 6 },
  finalEqNom: { fontSize: 13, color: colors.turquesaSuave, fontFamily: fonts.semibold, marginTop: 2, textAlign: 'center' },
});
