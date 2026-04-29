import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';
import { palabras, mundos, shuffle } from '../data/datos';
import { useJuego } from '../context/JuegoContext';
import Acompanante from '../components/Acompanante';
import Glass from '../components/Glass';
import BotonGlow from '../components/BotonGlow';
import { imgMundoColor, imgMundoGris } from '../data/imagenes';

// ══════════════════════════════════════════════════════════
// PAREJAS — Uma acompaña
// ══════════════════════════════════════════════════════════
export function ParejasScreen({ route, navigation }) {
  const { mundoId } = route.params || {};
  const mundo = mundos.find(m => m.id === mundoId);
  const { ganarPuntos, completarMision, sumarParejas, verificarLogros } = useJuego();

  const [tarjetas, setTarjetas] = useState([]);
  const [selec1, setSelec1] = useState(null);
  const [selec2, setSelec2] = useState(null);
  const [resueltas, setResueltas] = useState(new Set());
  const [intentos, setIntentos] = useState(0);
  const [erroneas, setErroneas] = useState([]);

  useEffect(() => {
    const pals = palabras.filter(p => mundo.palabrasIds.includes(p.id)).slice(0, 6);
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
        setTimeout(() => {
          const nuevas = new Set(resueltas);
          nuevas.add(tarjetas[selec1].grupo);
          setResueltas(nuevas);
          setSelec1(null);
          setSelec2(null);
          ganarPuntos(5);
          if (nuevas.size === 6) {
            completarMision(`parejas-${mundoId}`);
            sumarParejas();
            ganarPuntos(15);
            verificarLogros();
          }
        }, 600);
      } else {
        setErroneas([selec1, selec2]);
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

  const terminado = resueltas.size === 6;

  if (terminado) {
    return (
      <ImageBackground source={imgMundoColor[mundoId]} style={s.resBg} resizeMode="cover">
        <LinearGradient
          colors={['rgba(26,16,8,0.88)', 'rgba(26,16,8,0.60)']}
          style={StyleSheet.absoluteFill}
        />
        <View style={s.resContent}>
          <Text style={s.resEmoji}>🎉</Text>
          <Text style={s.resTit}>¡Parejas completadas!</Text>
          <Glass tipo="dorado" bordeBrillante style={s.resScoreGlass}>
            <Text style={s.resSub}>{intentos} intentos</Text>
          </Glass>
          <View style={{ height: 24 }} />
          <Acompanante
            personaje="uma"
            mensaje="Pas wawa... has unido las palabras como se unen los hilos en el chumbe. El tejido de la lengua vive en ti."
          />
          <BotonGlow
            texto="← Volver al mundo"
            onPress={() => navigation.goBack()}
            variante="primario"
            tamano="lg"
          />
        </View>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground source={imgMundoGris[mundoId]} style={s.bg} resizeMode="cover">
      <LinearGradient
        colors={['rgba(26,16,8,0.82)', 'rgba(26,16,8,0.58)']}
        style={StyleSheet.absoluteFill}
      />
      <ScrollView contentContainerStyle={{ padding: 14 }}>

        <Glass tipo="oscuro" intensidad={65} style={s.header}>
          <View style={s.headerBadge}>
            <Text style={s.headerBadgeTxt}>{mundo.emoji} {mundo.titulo}</Text>
          </View>
          <Text style={s.headerSub}>🃏 Une las parejas: pastoker ↔ español</Text>
          <Text style={s.headerInfo}>✓ {resueltas.size}/6 · {intentos} intentos</Text>
        </Glass>

        <View style={s.grid}>
          {tarjetas.map((t, i) => {
            const resuelta    = resueltas.has(t.grupo);
            const seleccionada = i === selec1 || i === selec2;
            const errada      = erroneas.includes(i);
            return (
              <TouchableOpacity
                key={t.id}
                style={[
                  s.tarjeta,
                  t.tipo === 'pastoker' && s.tarjetaPast,
                  seleccionada && s.tarjetaSel,
                  errada       && s.tarjetaError,
                  resuelta     && s.tarjetaResuelta,
                ]}
                onPress={() => elegir(i)}
                disabled={resuelta}
                activeOpacity={0.85}
              >
                <Text style={s.tarjEmoji}>{t.emoji}</Text>
                <Text style={[s.tarjTxt, t.tipo === 'pastoker' && s.tarjTxtPast]}>
                  {t.texto}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={{ marginTop: 10 }}>
          <Acompanante
            personaje="uma"
            mensaje="Pas wawa... toca primero una palabra dorada en pastoker y después su significado. Si aciertas, ambas se unen en el tejido."
          />
        </View>
      </ScrollView>
    </ImageBackground>
  );
}


// ══════════════════════════════════════════════════════════
// DICTADO — Taita Rimay acompaña
// ══════════════════════════════════════════════════════════
export function DictadoScreen({ route, navigation }) {
  const { mundoId } = route.params || {};
  const mundo = mundos.find(m => m.id === mundoId);
  const { ganarPuntos, completarMision, verificarLogros } = useJuego();

  const palabrasMundo = palabras.filter(p => mundo.palabrasIds.includes(p.id));
  const [listaDict] = useState(() => shuffle(palabrasMundo).slice(0, 5));
  const [idx, setIdx] = useState(0);
  const [texto, setTexto] = useState('');
  const [verif, setVerif] = useState(null);
  const [aciertos, setAciertos] = useState(0);
  const [fin, setFin] = useState(false);

  const pal = listaDict[idx];

  const verificar = () => {
    const correcto = texto.trim().toLowerCase() === pal.p.toLowerCase();
    setVerif(correcto ? 'ok' : 'err');
    if (correcto) {
      setAciertos(a => a + 1);
      ganarPuntos(8);
    }
    setTimeout(() => {
      if (idx + 1 < listaDict.length) {
        setIdx(idx + 1);
        setTexto('');
        setVerif(null);
      } else {
        setFin(true);
        const total = aciertos + (correcto ? 1 : 0);
        if (total >= 3) {
          completarMision(`dictado-${mundoId}`);
          ganarPuntos(20);
        }
        verificarLogros();
      }
    }, 1400);
  };

  if (fin) {
    const exito = aciertos >= 3;
    return (
      <ImageBackground
        source={exito ? imgMundoColor[mundoId] : imgMundoGris[mundoId]}
        style={s.resBg}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['rgba(26,16,8,0.88)', 'rgba(26,16,8,0.60)']}
          style={StyleSheet.absoluteFill}
        />
        <View style={s.resContent}>
          <Text style={s.resEmoji}>{exito ? '📜' : '💪'}</Text>
          <Text style={s.resTit}>{exito ? '¡Dictado completado!' : 'Sigue practicando'}</Text>
          <Glass tipo="dorado" bordeBrillante style={s.resScoreGlass}>
            <Text style={s.resSub}>{aciertos} / {listaDict.length}</Text>
          </Glass>
          <View style={{ height: 24 }} />
          <Acompanante
            personaje="taita_rimay"
            mensaje={exito
              ? 'Las palabras que escribes son piedras del camino, Kinti. Cada letra trae de regreso una memoria.'
              : 'No te desanimes, wawa. Cada intento es un paso más en el camino de la lengua.'}
          />
          <BotonGlow
            texto="← Volver al mundo"
            onPress={() => navigation.goBack()}
            variante="primario"
            tamano="lg"
          />
        </View>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground source={imgMundoGris[mundoId]} style={s.bg} resizeMode="cover">
      <LinearGradient
        colors={['rgba(26,16,8,0.82)', 'rgba(26,16,8,0.58)']}
        style={StyleSheet.absoluteFill}
      />
      <ScrollView contentContainerStyle={{ padding: 16, flexGrow: 1 }}>

        <Glass tipo="oscuro" intensidad={65} style={s.header}>
          <View style={s.headerBadge}>
            <Text style={s.headerBadgeTxt}>{mundo.emoji} {mundo.titulo}</Text>
          </View>
          <Text style={s.headerSub}>✍️ Escribe la palabra en pastoker</Text>
          <Text style={s.headerInfo}>{idx + 1} / {listaDict.length} · ✓ {aciertos} aciertos</Text>
        </Glass>

        <Glass tipo="claro" bordeBrillante style={s.qCard}>
          <Text style={s.qLabel}>¿CÓMO SE DICE EN PASTOKER?</Text>
          <Text style={s.qEmoji}>{pal.emoji}</Text>
          <Text style={s.qEsp}>{pal.e}</Text>
          <Text style={s.qCat}>{pal.cat}</Text>
        </Glass>

        <View style={[s.inputWrap, verif === 'ok' && s.inputWrapOk, verif === 'err' && s.inputWrapErr]}>
          <TextInput
            style={s.input}
            placeholder="Escribe aquí..."
            placeholderTextColor="rgba(90,70,50,0.5)"
            value={texto}
            onChangeText={setTexto}
            editable={verif === null}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {verif === 'ok' && (
          <Glass tipo="claro" style={s.msgWrap}>
            <Text style={s.msgOk}>✓ ¡Correcto! "{pal.p}"</Text>
          </Glass>
        )}
        {verif === 'err' && (
          <Glass tipo="claro" style={s.msgWrap}>
            <Text style={s.msgErr}>✗ La correcta era: "{pal.p}"</Text>
          </Glass>
        )}

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
    </ImageBackground>
  );
}


const s = StyleSheet.create({
  bg: { flex: 1 },

  // ─── Header compartido ───
  header:         { alignItems: 'center', marginBottom: 14, padding: 14, borderRadius: 18 },
  headerBadge:    { backgroundColor: colors.dorado, paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, marginBottom: 8 },
  headerBadgeTxt: { color: colors.negro, fontSize: 12, fontWeight: '900' },
  headerSub:      { color: colors.crema, fontSize: 14, fontWeight: '700' },
  headerInfo:     { color: colors.doradoBrillo, fontSize: 11, fontWeight: '700', marginTop: 4 },

  // ─── Parejas ───
  grid:           { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  tarjeta:        {
    width: '48%', minHeight: 80,
    backgroundColor: 'rgba(247,240,224,0.90)',
    borderRadius: 14, alignItems: 'center', justifyContent: 'center',
    padding: 10, borderWidth: 1.5, borderColor: colors.glassBorde,
    marginBottom: 8,
    shadowColor: colors.doradoBrillo, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15, shadowRadius: 6, elevation: 4,
  },
  tarjetaPast:    {
    backgroundColor: 'rgba(196,144,16,0.88)',
    borderColor: colors.doradoBrillo, borderWidth: 2,
  },
  tarjetaSel:     { borderColor: colors.verdeM, borderWidth: 3, transform: [{ scale: 0.96 }] },
  tarjetaError:   { borderColor: '#d04040', borderWidth: 3, backgroundColor: 'rgba(208,64,64,0.2)' },
  tarjetaResuelta:{ opacity: 0.35, borderColor: colors.verdeM },
  tarjEmoji:      { fontSize: 22, marginBottom: 4 },
  tarjTxt:        { fontSize: 13, fontWeight: '700', color: colors.negro, textAlign: 'center' },
  tarjTxtPast:    { color: colors.negro, fontSize: 15, fontWeight: '900' },

  // ─── Dictado ───
  qCard:          { padding: 20, alignItems: 'center', marginBottom: 14, borderRadius: 22 },
  qLabel:         { fontSize: 10, color: colors.gris, fontWeight: '900', letterSpacing: 3, marginBottom: 4 },
  qEmoji:         { fontSize: 54, marginVertical: 8 },
  qEsp:           { fontSize: 26, fontWeight: '900', color: colors.negro },
  qCat:           { fontSize: 11, color: colors.dorado, fontStyle: 'italic', marginTop: 4, letterSpacing: 2 },

  inputWrap:      {
    backgroundColor: 'rgba(247,240,224,0.92)',
    borderRadius: 14, borderWidth: 2, borderColor: colors.glassBorde,
    marginBottom: 8, overflow: 'hidden',
    shadowColor: colors.doradoBrillo, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2, shadowRadius: 8, elevation: 4,
  },
  inputWrapOk:    { borderColor: colors.verdeM },
  inputWrapErr:   { borderColor: '#d04040' },
  input:          { padding: 14, fontSize: 18, color: colors.negro, textAlign: 'center', fontWeight: '700' },

  msgWrap:        { padding: 10, marginBottom: 10, borderRadius: 12 },
  msgOk:          { color: colors.verdeM, fontSize: 14, fontWeight: '900', textAlign: 'center' },
  msgErr:         { color: '#d04040', fontSize: 14, fontWeight: '900', textAlign: 'center' },

  // ─── Resultados (compartidos) ───
  resBg:          { flex: 1 },
  resContent:     { flex: 1, padding: 20, justifyContent: 'center' },
  resEmoji:       { fontSize: 72, textAlign: 'center' },
  resTit:         {
    fontSize: 24, fontWeight: '900', color: colors.doradoBrillo,
    textAlign: 'center', marginTop: 8, letterSpacing: 0.5,
    textShadowColor: 'rgba(245,200,66,0.3)', textShadowRadius: 8,
  },
  resScoreGlass:  { alignItems: 'center', padding: 18, marginTop: 12, borderRadius: 18 },
  resSub:         { fontSize: 22, fontWeight: '900', color: colors.tierra },
});
