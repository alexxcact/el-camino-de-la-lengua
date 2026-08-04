import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { ui, radii } from '../theme/ui';
import { palabras, mundos, shuffle } from '../data/datos';
import { useJuego } from '../context/JuegoContext';
import Acompanante from '../components/Acompanante';
import BotonGlow from '../components/BotonGlow';
import Confeti from '../components/Confeti';
import { sonar } from '../utils/sonidos';
import { vibrar } from '../utils/feedback';

// ══════════════════════════════════════════════════════════
// PAREJAS — Uma acompaña
// ══════════════════════════════════════════════════════════
export function ParejasScreen({ route, navigation }) {
  const { mundoId, palabrasPractica, modoPractica = false } = route.params || {};
  const mundo = mundoId ? mundos.find(m => m.id === mundoId) : null;
  const { estado, ganarPuntos, completarMision, sumarParejas, verificarLogros, completarPractica } = useJuego();
  const nombre = estado.nombreJugador || 'Caminante';

  const premiar = (n) => ganarPuntos(modoPractica ? Math.max(1, Math.round(n / 2)) : n);
  const fuente = modoPractica
    ? (palabrasPractica || [])
    : palabras.filter(p => mundo.palabrasIds.includes(p.id));
  const totalPares = Math.min(6, fuente.length);

  const [tarjetas, setTarjetas] = useState([]);
  const [selec1, setSelec1] = useState(null);
  const [selec2, setSelec2] = useState(null);
  const [resueltas, setResueltas] = useState(new Set());
  const [intentos, setIntentos] = useState(0);
  const [erroneas, setErroneas] = useState([]);
  const [aciertoFlash, setAciertoFlash] = useState([]);

  useEffect(() => {
    const pals = fuente.slice(0, totalPares);
    const cartas = [];
    pals.forEach((p, i) => {
      cartas.push({ id: `past-${i}`, grupo: i, texto: p.p, tipo: 'pastoker', emoji: p.emoji });
      cartas.push({ id: `esp-${i}`,  grupo: i, texto: p.e, tipo: 'español',  emoji: p.emoji });
    });
    setTarjetas(shuffle(cartas));
  }, []);

  useEffect(() => {
    if (selec1 !== null && selec2 !== null) {
      setIntentos(i => i + 1);
      if (tarjetas[selec1].grupo === tarjetas[selec2].grupo) {
        setAciertoFlash([selec1, selec2]);
        sonar.acierto(); vibrar.suave();
        setTimeout(() => {
          const nuevas = new Set(resueltas);
          nuevas.add(tarjetas[selec1].grupo);
          setResueltas(nuevas);
          setSelec1(null);
          setSelec2(null);
          setAciertoFlash([]);
          premiar(5);
          if (nuevas.size === totalPares) {
            if (!modoPractica) {
              completarMision(`parejas-${mundoId}`);
              sumarParejas();
              ganarPuntos(15);
            } else {
              completarPractica();
            }
            verificarLogros();
            sonar.mision(); vibrar.exito();
          }
        }, 600);
      } else {
        setErroneas([selec1, selec2]);
        sonar.error(); vibrar.error();
        setTimeout(() => {
          setSelec1(null);
          setSelec2(null);
          setErroneas([]);
        }, 800);
      }
    }
  }, [selec2]);

  const elegir = (idx) => {
    if (resueltas.has(tarjetas[idx].grupo)) return;
    if (erroneas.length > 0) return;
    if (selec1 === idx || selec2 !== null) return;
    if (selec1 === null) setSelec1(idx);
    else setSelec2(idx);
  };

  const terminado = totalPares > 0 && resueltas.size === totalPares;

  if (terminado) {
    return (
      <View style={s.resBg}>
        <LinearGradient colors={colors.gradAurora} style={StyleSheet.absoluteFill} />
        <ScrollView contentContainerStyle={s.resContent}>
          <Text style={s.resTit}>¡Muy bien, {nombre}!</Text>
          <View style={s.resScoreCard}>
            <Text style={s.resSub}>{intentos} intentos</Text>
          </View>
          <View style={{ height: 20 }} />
          <Acompanante
            personaje="uma"
            mensaje={`Pas wawa ${nombre}... has unido las palabras como se unen los hilos en el chumbe. El tejido de la lengua vive en ti.`}
          />
          <BotonGlow texto={modoPractica ? '← Volver a practicar' : '← Volver al mundo'} onPress={() => navigation.goBack()} variante="primario" tamano="lg" />
        </ScrollView>
        <Confeti activo cantidad={28} />
      </View>
    );
  }

  return (
    <View style={s.bg}>
      <ScrollView contentContainerStyle={{ padding: 14 }} showsVerticalScrollIndicator={false}>

        <View style={s.header}>
          <View style={s.headerTop}>
            <View style={s.headerPill}>
              <Text style={s.headerPillTxt}>{modoPractica ? 'Práctica libre' : mundo.titulo}</Text>
            </View>
            <Text style={s.headerInfo}>✓ {resueltas.size}/{totalPares} · {intentos}</Text>
          </View>
          <Text style={s.headerSub}>Une las parejas: pastoker ↔ español</Text>
        </View>

        <View style={s.grid}>
          {tarjetas.map((t, i) => {
            const resuelta     = resueltas.has(t.grupo);
            const seleccionada = i === selec1 || i === selec2;
            const errada       = erroneas.includes(i);
            const acertada     = aciertoFlash.includes(i);
            const esPast       = t.tipo === 'pastoker';
            return (
              <TouchableOpacity
                key={t.id}
                style={[
                  s.tarjeta,
                  esPast ? s.tarjetaPast : s.tarjetaEsp,
                  seleccionada && s.tarjetaSel,
                  acertada     && s.tarjetaAcierto,
                  errada       && s.tarjetaError,
                  resuelta     && s.tarjetaResuelta,
                ]}
                onPress={() => elegir(i)}
                disabled={resuelta}
                activeOpacity={0.85}
              >
                <Text style={s.tarjEmoji}>{t.emoji}</Text>
                <Text style={[s.tarjTxt, esPast && s.tarjTxtPast]}>{t.texto}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={{ marginTop: 12 }}>
          <Acompanante
            personaje="uma"
            mensaje="Pas wawa... toca primero una palabra dorada en pastoker y después su significado. Si aciertas, ambas se unen en el tejido."
          />
        </View>
      </ScrollView>
    </View>
  );
}


// ══════════════════════════════════════════════════════════
// DICTADO — Taita Rimay acompaña
// ══════════════════════════════════════════════════════════
export function DictadoScreen({ route, navigation }) {
  const { mundoId, palabrasPractica, modoPractica = false, nPreguntas } = route.params || {};
  const mundo = mundoId ? mundos.find(m => m.id === mundoId) : null;
  const { estado, ganarPuntos, completarMision, verificarLogros, completarPractica } = useJuego();
  const nombre = estado.nombreJugador || 'Caminante';

  const premiar = (n) => ganarPuntos(modoPractica ? Math.max(1, Math.round(n / 2)) : n);
  const palabrasMundo = modoPractica
    ? (palabrasPractica || [])
    : palabras.filter(p => mundo.palabrasIds.includes(p.id));
  const [listaDict] = useState(() => shuffle(palabrasMundo).slice(0, nPreguntas || 5));
  const [idx, setIdx] = useState(0);
  const [texto, setTexto] = useState('');
  const [verif, setVerif] = useState(null);
  const [aciertos, setAciertos] = useState(0);
  const [fin, setFin] = useState(false);
  const [foco, setFoco] = useState(false);

  const pal = listaDict[idx];

  const verificar = () => {
    const correcto = texto.trim().toLowerCase() === pal.p.toLowerCase();
    setVerif(correcto ? 'ok' : 'err');
    if (correcto) {
      setAciertos(a => a + 1);
      premiar(8);
      sonar.acierto(); vibrar.suave();
    } else {
      sonar.error(); vibrar.error();
    }
    setTimeout(() => {
      if (idx + 1 < listaDict.length) {
        setIdx(idx + 1);
        setTexto('');
        setVerif(null);
      } else {
        setFin(true);
        const total = aciertos + (correcto ? 1 : 0);
        if (!modoPractica) {
          if (total >= 3) {
            completarMision(`dictado-${mundoId}`);
            ganarPuntos(20);
            sonar.mision(); vibrar.exito();
          }
        } else {
          completarPractica();
          if (total >= 3) { sonar.mision(); vibrar.exito(); }
        }
        verificarLogros();
      }
    }, 1400);
  };

  if (fin) {
    const exito = aciertos >= 3;
    return (
      <View style={s.resBg}>
        <LinearGradient
          colors={exito ? colors.gradAurora : ['#0B1F2A', '#0E2730', '#11353F']}
          style={StyleSheet.absoluteFill}
        />
        <ScrollView contentContainerStyle={s.resContent}>
          <Text style={s.resTit}>{exito ? `¡Muy bien, ${nombre}!` : `Sigue intentando, ${nombre}`}</Text>
          <View style={s.resScoreCard}>
            <Text style={s.resSub}>{aciertos} / {listaDict.length}</Text>
          </View>
          <View style={{ height: 20 }} />
          <Acompanante
            personaje="taita_rimay"
            mensaje={exito
              ? `Las palabras que escribes son piedras del camino, ${nombre}. Cada letra trae de regreso una memoria.`
              : 'No te desanimes, wawa. Cada intento es un paso más en el camino de la lengua.'}
          />
          <BotonGlow texto={modoPractica ? '← Volver a practicar' : '← Volver al mundo'} onPress={() => navigation.goBack()} variante="primario" tamano="lg" />
        </ScrollView>
        {exito && <Confeti activo cantidad={28} />}
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={s.bg}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={{ padding: 16, flexGrow: 1 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

        <View style={s.header}>
          <View style={s.headerTop}>
            <View style={s.headerPill}>
              <Text style={s.headerPillTxt}>{modoPractica ? 'Práctica libre' : mundo.titulo}</Text>
            </View>
            <Text style={s.headerInfo}>{idx + 1}/{listaDict.length} · ✓ {aciertos}</Text>
          </View>
          <Text style={s.headerSub}>Escribe la palabra en pastoker</Text>
        </View>

        <View style={s.qCard}>
          <Text style={s.qLabel}>¿CÓMO SE DICE EN PASTOKER?</Text>
          <Text style={s.qEmoji}>{pal.emoji}</Text>
          <Text style={s.qEsp}>{pal.e}</Text>
          <Text style={s.qCat}>{pal.cat}</Text>
        </View>

        <View style={[
          s.inputWrap,
          foco && s.inputWrapFoco,
          verif === 'ok' && s.inputWrapOk,
          verif === 'err' && s.inputWrapErr,
        ]}>
          <TextInput
            style={s.input}
            placeholder="Escribe aquí..."
            placeholderTextColor={colors.turquesaSuave}
            value={texto}
            onChangeText={setTexto}
            onFocus={() => setFoco(true)}
            onBlur={() => setFoco(false)}
            editable={verif === null}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {verif === 'ok'  && <Text style={s.msgOk}>✓ ¡Correcto! "{pal.p}"</Text>}
        {verif === 'err' && <Text style={s.msgErr}><Ionicons name="close" size={14} color={colors.coral} /> La correcta era: "{pal.p}"</Text>}

        <BotonGlow
          texto="Verificar"
          onPress={verificar}
          variante="primario"
          tamano="lg"
          desactivado={!texto.trim() || verif !== null}
        />

        <View style={{ marginTop: 14 }}>
          <Acompanante
            personaje="taita_rimay"
            mensaje={verif === null
              ? `Recuerda: "${pal.e}" en español. ¿Cuál es la palabra en pastoker?`
              : verif === 'ok' ? '¡Muy bien, wawa!' : 'No te preocupes. Prueba la siguiente.'}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}


const s = StyleSheet.create({
  bg: { flex: 1, backgroundColor: colors.noche },

  // ─── Header compartido ───
  header:        { ...ui.card, padding: 14, marginBottom: 14 },
  headerTop:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  headerPill:    { ...ui.pill, flexShrink: 1 },
  headerPillTxt: { ...ui.pillTxt },
  headerInfo:    { color: colors.doradoNeon, fontSize: 12, fontFamily: fonts.bold },
  headerSub:     { ...ui.sub, fontFamily: fonts.semibold },

  // ─── Parejas ───
  grid:    { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  tarjeta: {
    width: '48%', minHeight: 84,
    borderRadius: radii.md, alignItems: 'center', justifyContent: 'center',
    padding: 10, borderWidth: 1.5, marginBottom: 10,
  },
  tarjetaPast:     { backgroundColor: 'rgba(250,199,117,0.20)', borderColor: ui.ringDorado, borderWidth: 2 },
  tarjetaEsp:      { backgroundColor: 'rgba(8,26,34,0.62)', borderColor: 'rgba(93,202,165,0.35)' },
  tarjetaSel:      { borderColor: colors.turquesaClaro, borderWidth: 3, transform: [{ scale: 0.96 }] },
  tarjetaAcierto:  { borderColor: colors.turquesa, borderWidth: 3, backgroundColor: 'rgba(29,158,117,0.30)' },
  tarjetaError:    { borderColor: colors.coral, borderWidth: 3, backgroundColor: 'rgba(242,120,92,0.18)' },
  tarjetaResuelta: { opacity: 0.3, borderColor: colors.turquesa },
  tarjEmoji:       { fontSize: 24, marginBottom: 4 },
  tarjTxt:         { fontSize: 13, fontFamily: fonts.semibold, color: colors.cielo, textAlign: 'center' },
  tarjTxtPast:     { ...ui.pastoker, fontSize: 15, fontFamily: fonts.extra },

  // ─── Dictado ───
  qCard:  { ...ui.cardDestacada, alignItems: 'center', marginBottom: 14 },
  qLabel: { ...ui.caption, fontSize: 10, fontFamily: fonts.bold, letterSpacing: 3, marginBottom: 4, opacity: 1 },
  qEmoji: { fontSize: 56, marginVertical: 8 },
  qEsp:   { fontSize: 28, fontFamily: fonts.extra, color: colors.cielo },
  qCat:   { fontSize: 11, color: colors.doradoNeon, fontFamily: fonts.medium, marginTop: 4, letterSpacing: 2 },

  inputWrap:     { backgroundColor: colors.nocheProfundo, borderRadius: radii.md, borderWidth: 2, borderColor: 'rgba(93,202,165,0.3)', marginBottom: 10, height: 52, justifyContent: 'center' },
  inputWrapFoco: { borderColor: colors.turquesa, shadowColor: colors.turquesa, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.6, shadowRadius: 10, elevation: 6 },
  inputWrapOk:   { borderColor: colors.turquesa, shadowColor: colors.turquesa, shadowOpacity: 0.6, shadowRadius: 10, elevation: 6 },
  inputWrapErr:  { borderColor: colors.coral },
  input:         { paddingHorizontal: 16, fontSize: 18, color: colors.cielo, textAlign: 'center', fontFamily: fonts.bold },

  msgOk:  { color: colors.turquesaClaro, fontSize: 14, fontFamily: fonts.bold, textAlign: 'center', marginBottom: 10 },
  msgErr: { color: colors.coral, fontSize: 14, fontFamily: fonts.bold, textAlign: 'center', marginBottom: 10 },

  // ─── Resultados (compartidos) ───
  resBg:        { flex: 1 },
  resContent:   { flexGrow: 1, padding: 22, justifyContent: 'center' },
  resEmoji:     { fontSize: 72, textAlign: 'center' },
  resTit:       { fontSize: 24, fontFamily: fonts.extra, color: colors.doradoNeon, textAlign: 'center', marginTop: 8, textShadowColor: 'rgba(250,199,117,0.4)', textShadowRadius: 10 },
  resScoreCard: { ...ui.cardDestacada, alignItems: 'center', padding: 18, marginTop: 14, alignSelf: 'center', paddingHorizontal: 40 },
  resSub:       { fontSize: 24, fontFamily: fonts.extra, color: colors.cielo },
});
