import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { ui } from '../theme/ui';
import { CINEMATICAS, RELATOS, personajes } from '../data/datos';
import { imgMundoColor } from '../data/imagenes';
import { useJuego } from '../context/JuegoContext';
import { sonar } from '../utils/sonidos';
import { vibrar } from '../utils/feedback';
import { significadoDe } from '../data/personajesUtil';
import PersonajeVivo from '../components/PersonajeVivo';
import ChapaPalabra from '../components/ChapaPalabra';

const { width, height } = Dimensions.get('window');

const VEL_ESCRITURA = 28; // ms por carácter (máquina de escribir suave)
// Cuánto se mantiene "sorprendido" tras escribir una palabra: cubre el gesto de
// PersonajeVivo (400 ms), su pausa (700 ms) y el fundido de la decoración (400 ms).
const REACCION_MS = 1500;
// Altura de la figura del personaje, de pie en la parte baja de la escena.
const TAM_FIGURA = Math.round(Math.max(160, Math.min(210, height * 0.27)));

const PARTIR_PALABRAS = /([A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+)/;

// Posiciones (índice de fin, exclusivo) donde termina cada aparición completa de
// una entrada de `resaltar` dentro del texto. Usa el mismo troceo que el resaltado
// para no confundir Pa con Pas o Paskal.
function finesResaltados(texto, resaltar = []) {
  const fines = [];
  if (!resaltar.length) return fines;
  let pos = 0;
  for (const parte of texto.split(PARTIR_PALABRAS)) {
    pos += parte.length;
    if (resaltar.includes(parte)) fines.push({ fin: pos, palabra: parte });
  }
  return fines;
}

// Nombre + color de cabecera del personaje (cae en valores neutros si no se halla)
const infoPersonaje = (clave) => {
  const map = { taita_rimay: 'taita-rimay' };
  const p = personajes.find(x => x.id === (map[clave] || clave));
  return { nombre: p?.nombre || 'El guía', color: p?.color || colors.tierra };
};

// Parte un texto resaltando en dorado las entradas de vocabulario de `resaltar`.
function renderResaltado(texto, resaltar = []) {
  if (!resaltar.length) return texto;
  // Comparar palabras completas evita resaltar Pa dentro de Pas o Paskal.
  return texto.split(PARTIR_PALABRAS).map((parte, i) =>
    resaltar.includes(parte)
      ? <Text key={i} style={s.resalte}>{parte}</Text>
      : <Text key={i}>{parte}</Text>
  );
}

// ══════════════════════════════════════════════════════════════
// CINEMATICA — escenas narrativas entre mundos (reutilizable).
// Params: { clave: 'mundoN', mundoId, rever }
//  · 1ª vez: al terminar/Saltar marca como vista y reemplaza por el Mundo.
//  · rever=true: solo reproduce; al terminar vuelve atrás (no toca el Mundo).
// ══════════════════════════════════════════════════════════════
export default function CinematicaScreen({ route, navigation }) {
  const { clave, mundoId, rever = false } = route.params || {};
  const { marcarCinematicaVista } = useJuego();
  // Cinemáticas de entrada (mundoN) o relatos de los libros (relatoN).
  const esRelato = !CINEMATICAS[clave] && !!RELATOS?.[clave];
  const cine = CINEMATICAS[clave] || RELATOS?.[clave];

  const [idx, setIdx] = useState(0);
  const [mostrado, setMostrado] = useState('');
  const [completo, setCompleto] = useState(false);
  const intervalRef = useRef(null);
  // Reacción del personaje al terminar de escribir una palabra resaltada.
  const [reaccionando, setReaccionando] = useState(false);
  const [pulso, setPulso] = useState(0);
  const [chapa, setChapa] = useState(null); // { palabra, significado, clave }
  const timeoutRef = useRef(null);
  const contadorChapaRef = useRef(0);

  const limpiarReaccion = () => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
  };

  // Dispara el gesto sorprendido (~1,5 s), una vibración suave y la chapa de la palabra.
  const reaccionarA = (palabra) => {
    limpiarReaccion();
    contadorChapaRef.current += 1;
    setPulso(n => n + 1);
    setReaccionando(true);
    setChapa({ palabra, significado: significadoDe(palabra), clave: contadorChapaRef.current });
    vibrar.suave();
    timeoutRef.current = setTimeout(() => {
      timeoutRef.current = null;
      setReaccionando(false);
    }, REACCION_MS);
  };

  // Cierra la cinemática hacia su destino. Definida antes de los efectos para que
  // el caso defensivo (!cine) pueda invocarla sin caer en TDZ.
  const terminar = () => {
    clearInterval(intervalRef.current);
    limpiarReaccion();
    if (rever) {
      // Un relato cuenta como escuchado aunque se abra desde el mundo.
      if (esRelato) marcarCinematicaVista(clave);
      navigation.goBack();
    } else {
      marcarCinematicaVista(clave);
      navigation.replace('Mundo', { mundoId });
    }
  };

  // Sonido suave de mundo al iniciar la cinemática
  useEffect(() => { sonar.mundo(); }, []);

  // Si la clave no existe, sale al destino sin romper el flujo
  useEffect(() => {
    if (!cine) terminar();
  }, []);

  // Máquina de escribir para la escena actual (con cleanup del interval)
  useEffect(() => {
    if (!cine) return;
    const { texto, resaltar } = cine.escenas[idx];
    const fines = finesResaltados(texto, resaltar);
    setMostrado('');
    setCompleto(false);
    setReaccionando(false);
    let i = 0;
    intervalRef.current = setInterval(() => {
      i++;
      setMostrado(texto.slice(0, i));
      const hecho = fines.find(f => f.fin === i);
      if (hecho) reaccionarA(hecho.palabra);
      if (i >= texto.length) {
        clearInterval(intervalRef.current);
        setCompleto(true);
      }
    }, VEL_ESCRITURA);
    return () => {
      clearInterval(intervalRef.current);
      limpiarReaccion();
    };
  }, [idx, cine]);

  if (!cine) return <View style={s.container} />;

  const escena = cine.escenas[idx];
  const { nombre, color } = infoPersonaje(escena.personaje);
  const esUltima = idx === cine.escenas.length - 1;

  // Tap: si aún escribe, completa el texto; si ya está completo, avanza o termina
  const avanzar = () => {
    if (!completo) {
      clearInterval(intervalRef.current);
      setMostrado(escena.texto);
      setCompleto(true);
      // Decisión: al saltarse la escritura no se encadenan las reacciones de todas
      // las palabras pendientes (sería una ráfaga de chapas y vibraciones); solo se
      // muestra la chapa de la ÚLTIMA palabra resaltada del texto, que es la que
      // queda más cerca de donde el jugador estaba leyendo.
      const fines = finesResaltados(escena.texto, escena.resaltar);
      if (fines.length) reaccionarA(fines[fines.length - 1].palabra);
      return;
    }
    if (esUltima) terminar();
    else setIdx(idx + 1);
  };

  const fondoNum = typeof escena.fondo === 'number' ? escena.fondo : null;

  return (
    <TouchableOpacity style={s.container} activeOpacity={1} onPress={avanzar}>
      {/* Fondo: escenario en color o gradiente aurora */}
      {fondoNum ? (
        <ImageBackground source={imgMundoColor[fondoNum]} style={s.bg} resizeMode="cover">
          <LinearGradient colors={['rgba(11,31,42,0.55)', 'rgba(11,31,42,0.82)']} style={StyleSheet.absoluteFill} />
        </ImageBackground>
      ) : (
        <LinearGradient colors={colors.gradAurora} style={StyleSheet.absoluteFill} />
      )}

      {/* Saltar */}
      <TouchableOpacity style={s.saltarBtn} onPress={terminar} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
        <Text style={s.saltarTxt}>Saltar ›</Text>
      </TouchableOpacity>

      {/* Título de la cinemática */}
      <View style={s.tituloWrap}>
        <Text style={s.tituloTxt}>{cine.titulo}</Text>
        {esRelato && cine.fuente ? <Text style={s.fuenteTxt}>Según {cine.fuente}</Text> : null}
        {/* Puntitos de progreso (en el flujo, debajo del título y la fuente) */}
        <View style={s.progRow}>
          {cine.escenas.map((_, i) => (
            <View key={i} style={[s.progDot, i === idx && s.progDotOn, i < idx && s.progDotDone]} />
          ))}
        </View>
      </View>

      <View style={{ flex: 1 }} />

      {/* Personaje de pie en la escena (figura recortada, sin aro) */}
      <View style={s.figuraWrap}>
        <PersonajeVivo
          key={escena.personaje}
          personaje={escena.personaje}
          animo={reaccionando ? 'sorprendido' : 'neutral'}
          pulso={pulso}
          tamano={TAM_FIGURA}
          onPress={avanzar}
          accessibilityLabel={`${nombre}. ${completo ? 'Toca para continuar' : 'Toca para completar'}`}
        />
        <View style={[s.nombreTag, { backgroundColor: color }]}>
          <Text style={s.nombreTxt}>{nombre}</Text>
        </View>
      </View>

      {/* Chapa "palabra · significado" al terminar de escribirse una palabra resaltada */}
      <View style={s.chapaWrap} pointerEvents="none">
        {chapa ? <ChapaPalabra palabra={chapa.palabra} significado={chapa.significado} clave={chapa.clave} /> : null}
      </View>

      {/* Caja de texto (glass oscuro) */}
      <View style={s.cajaTexto}>
        <Text style={s.dialogo}>
          {completo ? renderResaltado(escena.texto, escena.resaltar) : mostrado}
        </Text>
        <Text style={s.tapHint}>{completo ? (esUltima ? 'Toca para entrar al mundo ›' : 'Toca para continuar ›') : 'Toca para completar'}</Text>
      </View>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.noche },
  bg:        { width, height, flex: 1 },

  saltarBtn: { position: 'absolute', top: 48, right: 16, zIndex: 10, backgroundColor: 'rgba(0,0,0,0.45)', paddingHorizontal: 14, paddingVertical: 9, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(93,202,165,0.4)' },
  saltarTxt: { color: colors.cielo, fontSize: 13, fontFamily: fonts.bold },

  tituloWrap: { position: 'absolute', top: 52, left: 16, right: 90, zIndex: 5 },
  fuenteTxt:  { color: colors.turquesaSuave, fontSize: 11, fontFamily: fonts.medium, marginTop: 2, textShadowColor: 'rgba(0,0,0,0.6)', textShadowRadius: 6 },
  tituloTxt:  { color: colors.doradoNeon, fontSize: 14, fontFamily: fonts.extra, textShadowColor: 'rgba(0,0,0,0.6)', textShadowRadius: 8 },

  progRow:    { flexDirection: 'row', gap: 7, marginTop: 14 },
  progDot:    { width: 22, height: 5, borderRadius: 3, backgroundColor: 'rgba(225,245,238,0.25)' },
  progDotOn:  { backgroundColor: colors.doradoNeon, width: 30 },
  progDotDone:{ backgroundColor: colors.turquesaClaro },

  figuraWrap:   { alignItems: 'center' },
  // La etiqueta del nombre se apoya en el suelo, a los pies del personaje.
  nombreTag:    { marginTop: -10, paddingHorizontal: 18, paddingVertical: 6, borderRadius: 20, borderWidth: 1.5, borderColor: 'rgba(250,199,117,0.5)' },
  nombreTxt:    { color: colors.crema, fontSize: 13, fontFamily: fonts.extra, letterSpacing: 0.5 },

  chapaWrap: { minHeight: 34, justifyContent: 'center', marginTop: 10 },
  cajaTexto: { ...ui.card, margin: 16, marginTop: 6, backgroundColor: 'rgba(8,26,34,0.9)', borderColor: 'rgba(93,202,165,0.5)', minHeight: 130 },
  dialogo:   { ...ui.bodyMed, fontSize: 16, lineHeight: 25, textAlign: 'center' },
  resalte:   { ...ui.pastoker, textShadowColor: 'rgba(250,199,117,0.5)', textShadowRadius: 8 },
  tapHint:   { ...ui.caption, fontSize: 12, textAlign: 'center', marginTop: 14 },
});
