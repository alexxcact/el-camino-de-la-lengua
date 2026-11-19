import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { ui, radii } from '../theme/ui';
import Acompanante from '../components/Acompanante';
import BotonGlow from '../components/BotonGlow';
import { RAICES, TIPOS_RAIZ } from '../data/raices';
import {
  rondaRaices, fichasDe, huecosIniciales, colocar, quitar, completos, esCorrecta, lecturaDerechaIzquierda,
} from '../data/raicesLogica';
import { useJuego } from '../context/JuegoContext';
import { sonar } from '../utils/sonidos';
import { vibrar } from '../utils/feedback';

const POR_RONDA = 5;

const INTRO = 'En la lengua pasto las palabras se arman con raíces, y se leen de derecha a izquierda. Une las piezas para formar la palabra que te digo.';

export default function RaicesScreen({ navigation, route }) {
  const { estado, marcarRaizArmada, verificarLogros } = useJuego();
  const [semillaBase] = useState(() => route?.params?.semilla ?? Date.now());
  const [ronda, setRonda] = useState(0);
  const lista = useMemo(
    () => rondaRaices(RAICES, estado?.raicesArmadas || [], POR_RONDA, semillaBase + ronda),
    // La ronda se fija al empezar: armar palabras no la reordena.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ronda],
  );
  const [idx, setIdx] = useState(0);
  const [aciertos, setAciertos] = useState(0);
  const [intentos, setIntentos] = useState(0);
  const item = lista[idx];
  const fichas = useMemo(() => (item ? fichasDe(item, RAICES, 2, semillaBase + ronda * 31 + idx) : []), [item]);
  const [huecos, setHuecos] = useState(() => (item ? huecosIniciales(item) : []));
  const [resultado, setResultado] = useState(null); // null | 'bien' | 'otra'

  const total = RAICES.length;
  const armadas = (estado?.raicesArmadas || []).filter(p => RAICES.some(r => r.palabra === p)).length;

  const iniciarItem = (nuevo) => {
    setHuecos(nuevo ? huecosIniciales(nuevo) : []);
    setResultado(null);
    setIntentos(0);
  };

  const revisar = (nuevos) => {
    if (!completos(nuevos)) return;
    if (esCorrecta(item, nuevos)) {
      setResultado('bien');
      if (intentos === 0) setAciertos(a => a + 1);
      marcarRaizArmada(item.palabra);
      sonar.acierto(); vibrar.exito();
    } else {
      setResultado('otra');
      setIntentos(n => n + 1);
      sonar.error(); vibrar.error();
    }
  };

  const tocarFicha = (ficha) => {
    if (resultado === 'bien') return;
    const nuevos = colocar(huecos, ficha);
    // Sin hueco libre no cambia nada: no se vuelve a contar como intento.
    if (nuevos === huecos) return;
    sonar.pop();
    setHuecos(nuevos);
    setResultado(null);
    revisar(nuevos);
  };

  const tocarHueco = (i) => {
    if (resultado === 'bien') return;
    setHuecos(quitar(huecos, i));
    setResultado(null);
  };

  const reintentar = () => {
    setHuecos(huecosIniciales(item));
    setResultado(null);
  };

  const siguiente = () => {
    const n = idx + 1;
    setIdx(n);
    iniciarItem(lista[n]);
    if (n >= lista.length) verificarLogros();
  };

  const otraRonda = () => {
    const r = ronda + 1;
    const nueva = rondaRaices(RAICES, estado?.raicesArmadas || [], POR_RONDA, semillaBase + r);
    setRonda(r);
    setIdx(0);
    setAciertos(0);
    iniciarItem(nueva[0]);
  };

  // ── Fin de ronda ──
  if (!item) {
    return (
      <ScrollView style={s.container} contentContainerStyle={s.content}>
        <Acompanante
          personaje="taita-rimay"
          animo="feliz"
          mensaje={`Armaste ${aciertos} de ${lista.length} a la primera. Cada nombre de lugar guarda un pedacito de la lengua.`}
        />
        <View style={s.card}>
          <Text style={s.lbl}>PALABRAS ARMADAS</Text>
          <Text style={s.grande}>{armadas} de {total}</Text>
        </View>
        <View style={s.botones}>
          <BotonGlow texto="Otra ronda" onPress={otraRonda} variante="primario" tamano="lg" />
          <BotonGlow texto="Volver a Juegos" onPress={() => navigation.goBack()} variante="secundario" tamano="md" />
        </View>
      </ScrollView>
    );
  }

  const usadas = new Set(huecos.filter(Boolean).map(h => h.clave));
  const lectura = lecturaDerechaIzquierda(item);
  const mensaje = resultado === 'bien'
    ? `¡Eso es! ${item.palabra}: se lee de derecha a izquierda.`
    : resultado === 'otra'
      ? 'Casi. Recuerda que se lee de derecha a izquierda: lo primero que dice la frase suele ser la última pieza.'
      : idx === 0 && armadas === 0 ? INTRO : 'Busca las piezas cuyo significado forme la frase.';

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
      <View style={s.progRow}>
        {lista.map((_, i) => <View key={i} style={[s.dot, i < idx && s.dotHecho, i === idx && s.dotOn]} />)}
      </View>

      <Acompanante
        personaje="taita-rimay"
        animo={resultado === 'bien' ? 'feliz' : resultado === 'otra' ? 'pensativo' : 'neutral'}
        pulso={intentos + (resultado === 'bien' ? 100 : 0)}
        mensaje={mensaje}
        compacto
      />

      <View style={s.card}>
        <Text style={s.lbl}>{(TIPOS_RAIZ[item.tipo] || 'Palabra').toUpperCase()} QUE SIGNIFICA</Text>
        <Text style={s.traduccion}>«{item.traduccion}»</Text>
      </View>

      {/* Huecos donde se arma la palabra */}
      <View style={s.huecos} accessibilityLabel="Palabra que estás armando">
        {huecos.map((h, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => tocarHueco(i)}
            disabled={!h || h.fija || resultado === 'bien'}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel={h ? (h.fija ? `${h.t}, letra de enlace` : `${h.t}, toca para quitar`) : 'Hueco vacío'}
            style={[
              s.hueco,
              h && s.huecoLleno,
              h?.fija && s.huecoEnlace,
              resultado === 'bien' && s.huecoBien,
              resultado === 'otra' && h && !h.fija && s.huecoOtra,
            ]}
          >
            <Text style={[s.huecoTxt, h?.fija && s.enlaceTxt]}>{h ? h.t : ''}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {resultado === 'bien' ? (
        <View style={s.card}>
          <Text style={s.palabra}>{item.palabra}</Text>
          <View style={s.desglose}>
            {item.piezas.map((p, i) => (
              <View key={i} style={[s.pieza, p.enlace && s.piezaEnlace]}>
                <Text style={s.piezaT}>{p.t}</Text>
                <Text style={s.piezaSig}>{p.enlace ? 'enlace' : p.sig}</Text>
              </View>
            ))}
          </View>
          {lectura.length > 1 && (
            <Text style={s.lectura}>De derecha a izquierda: {lectura.join(' · ')} → {item.traduccion.toLowerCase()}</Text>
          )}
          <Text style={s.fuente}>Según {item.fuente}</Text>
          <View style={{ marginTop: 14 }}>
            <BotonGlow texto={idx + 1 < lista.length ? 'Siguiente palabra' : 'Terminar'} onPress={siguiente} variante="primario" tamano="md" />
          </View>
        </View>
      ) : (
        <>
          <Text style={s.lbl}>PIEZAS</Text>
          <View style={s.fichas}>
            {fichas.map(f => {
              const usada = usadas.has(f.clave);
              return (
                <TouchableOpacity
                  key={f.clave}
                  onPress={() => tocarFicha(f)}
                  disabled={usada}
                  activeOpacity={0.8}
                  accessibilityRole="button"
                  accessibilityLabel={`${f.t}: ${f.sig}`}
                  style={[s.ficha, usada && s.fichaUsada]}
                >
                  <Text style={s.fichaT}>{f.t}</Text>
                  <Text style={s.fichaSig}>{f.sig}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
          {resultado === 'otra' && (
            <BotonGlow texto="Empezar de nuevo" onPress={reintentar} variante="fantasma" tamano="sm" />
          )}
        </>
      )}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container:  { flex: 1, backgroundColor: colors.noche },
  content:    { padding: 16, paddingBottom: 40 },
  progRow:    { flexDirection: 'row', gap: 7, justifyContent: 'center', marginBottom: 10 },
  dot:        { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(93,202,165,0.25)' },
  dotOn:      { backgroundColor: colors.doradoNeon, width: 20 },
  dotHecho:   { backgroundColor: colors.turquesa },
  card:       { ...ui.card, padding: 16, marginTop: 12, marginBottom: 12 },
  lbl:        { fontSize: 10, color: colors.turquesaSuave, fontFamily: fonts.bold, letterSpacing: 3, marginBottom: 8 },
  traduccion: { color: colors.cielo, fontSize: 22, fontFamily: fonts.extra, lineHeight: 28 },
  grande:     { color: colors.doradoNeon, fontSize: 30, fontFamily: fonts.extra },

  huecos:     { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8, marginBottom: 18 },
  hueco:      {
    minWidth: 58, minHeight: 56, paddingHorizontal: 10, borderRadius: radii.md, borderWidth: 2,
    borderStyle: 'dashed', borderColor: 'rgba(93,202,165,0.45)', alignItems: 'center', justifyContent: 'center',
  },
  huecoLleno: { borderStyle: 'solid', borderColor: colors.turquesa, backgroundColor: 'rgba(29,158,117,0.18)' },
  huecoEnlace:{ minWidth: 34, borderColor: 'rgba(250,199,117,0.4)', backgroundColor: 'transparent' },
  huecoBien:  { borderColor: colors.doradoNeon, backgroundColor: 'rgba(250,199,117,0.16)' },
  huecoOtra:  { borderColor: colors.coral },
  huecoTxt:   { color: colors.cielo, fontSize: 22, fontFamily: fonts.extra },
  enlaceTxt:  { color: colors.doradoBrillo, fontSize: 18 },

  fichas:     { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 14 },
  ficha:      { ...ui.card, minWidth: 92, minHeight: 64, paddingVertical: 10, paddingHorizontal: 12, alignItems: 'center', justifyContent: 'center', flexGrow: 1 },
  fichaUsada: { opacity: 0.3 },
  fichaT:     { color: colors.cielo, fontSize: 20, fontFamily: fonts.extra },
  fichaSig:   { color: colors.turquesaSuave, fontSize: 12, fontFamily: fonts.medium, marginTop: 2, textAlign: 'center' },

  palabra:    { color: colors.doradoNeon, fontSize: 32, fontFamily: fonts.extra, textAlign: 'center' },
  desglose:   { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 6, marginTop: 10 },
  pieza:      { alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6, borderRadius: radii.sm || 10, backgroundColor: 'rgba(29,158,117,0.18)' },
  piezaEnlace:{ backgroundColor: 'transparent', borderWidth: 1, borderColor: 'rgba(250,199,117,0.4)' },
  piezaT:     { color: colors.cielo, fontSize: 17, fontFamily: fonts.bold },
  piezaSig:   { color: colors.turquesaSuave, fontSize: 11, fontFamily: fonts.medium },
  lectura:    { ...ui.body, fontSize: 14, marginTop: 12, textAlign: 'center' },
  fuente:     { ...ui.caption, color: colors.turquesaSuave, marginTop: 8, textAlign: 'center', fontStyle: 'italic' },
  botones:    { gap: 12, marginTop: 8 },
});
