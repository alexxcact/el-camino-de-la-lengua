import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ImageBackground, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { CINEMATICAS, personajes } from '../data/datos';
import { imgMundoColor } from '../data/imagenes';
import { useJuego } from '../context/JuegoContext';
import { sonar } from '../utils/sonidos';

const { width, height } = Dimensions.get('window');

const RETRATOS = {
  taita_rimay: require('../../assets/images/personajes/taita_rimay.jpg'),
  uma:         require('../../assets/images/personajes/uma.jpg'),
  pishku:      require('../../assets/images/personajes/pishku.jpg'),
  chutun:      require('../../assets/images/personajes/chutun.jpg'),
  kinti:       require('../../assets/images/personajes/kinti.jpg'),
};

const VEL_ESCRITURA = 28; // ms por carácter (máquina de escribir suave)

// Nombre + color de cabecera del personaje (cae en valores neutros si no se halla)
const infoPersonaje = (clave) => {
  const map = { taita_rimay: 'taita-rimay' };
  const p = personajes.find(x => x.id === (map[clave] || clave));
  return { nombre: p?.nombre || 'Taita Rimay', color: p?.color || colors.tierra };
};

// Parte un texto resaltando en dorado las palabras de `resaltar` (pastoker).
function renderResaltado(texto, resaltar = []) {
  if (!resaltar.length) return texto;
  const escapadas = resaltar.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const re = new RegExp(`(${escapadas.join('|')})`, 'g');
  return texto.split(re).map((parte, i) =>
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
  const cine = CINEMATICAS[clave];

  const [idx, setIdx] = useState(0);
  const [mostrado, setMostrado] = useState('');
  const [completo, setCompleto] = useState(false);
  const intervalRef = useRef(null);

  // Cierra la cinemática hacia su destino. Definida antes de los efectos para que
  // el caso defensivo (!cine) pueda invocarla sin caer en TDZ.
  const terminar = () => {
    clearInterval(intervalRef.current);
    if (rever) {
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
    const texto = cine.escenas[idx].texto;
    setMostrado('');
    setCompleto(false);
    let i = 0;
    intervalRef.current = setInterval(() => {
      i++;
      setMostrado(texto.slice(0, i));
      if (i >= texto.length) {
        clearInterval(intervalRef.current);
        setCompleto(true);
      }
    }, VEL_ESCRITURA);
    return () => clearInterval(intervalRef.current);
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
      </View>

      {/* Puntitos de progreso */}
      <View style={s.progRow}>
        {cine.escenas.map((_, i) => (
          <View key={i} style={[s.progDot, i === idx && s.progDotOn, i < idx && s.progDotDone]} />
        ))}
      </View>

      <View style={{ flex: 1 }} />

      {/* Retrato del personaje */}
      <View style={s.retratoWrap}>
        <View style={[s.retratoFrame, { borderColor: color, shadowColor: color }]}>
          <Image source={RETRATOS[escena.personaje] || RETRATOS.taita_rimay} style={s.retratoImg} />
        </View>
        <View style={[s.nombreTag, { backgroundColor: color }]}>
          <Text style={s.nombreTxt}>{nombre}</Text>
        </View>
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

  saltarBtn: { position: 'absolute', top: 48, right: 16, zIndex: 10, backgroundColor: 'rgba(0,0,0,0.45)', paddingHorizontal: 14, paddingVertical: 9, borderRadius: 20, borderWidth: 1, borderColor: colors.glassBorde },
  saltarTxt: { color: colors.crema, fontSize: 13, fontFamily: fonts.bold },

  tituloWrap: { position: 'absolute', top: 52, left: 16, right: 90, zIndex: 5 },
  tituloTxt:  { color: colors.doradoNeon, fontSize: 14, fontFamily: fonts.extra, textShadowColor: 'rgba(0,0,0,0.6)', textShadowRadius: 8 },

  progRow:    { position: 'absolute', top: 86, left: 16, flexDirection: 'row', gap: 7, zIndex: 5 },
  progDot:    { width: 22, height: 5, borderRadius: 3, backgroundColor: 'rgba(247,240,224,0.25)' },
  progDotOn:  { backgroundColor: colors.doradoNeon, width: 30 },
  progDotDone:{ backgroundColor: colors.turquesaClaro },

  retratoWrap:  { alignItems: 'center', marginBottom: 14 },
  retratoFrame: { width: 130, height: 130, borderRadius: 65, borderWidth: 4, overflow: 'hidden', shadowOpacity: 0.7, shadowRadius: 20, shadowOffset: { width: 0, height: 0 }, elevation: 16, backgroundColor: colors.noche },
  retratoImg:   { width: '100%', height: '100%' },
  nombreTag:    { position: 'absolute', bottom: -12, paddingHorizontal: 18, paddingVertical: 6, borderRadius: 20, borderWidth: 1.5, borderColor: colors.glassBorde },
  nombreTxt:    { color: colors.crema, fontSize: 13, fontFamily: fonts.extra, letterSpacing: 0.5 },

  cajaTexto: { margin: 16, marginTop: 6, padding: 20, borderRadius: 20, backgroundColor: 'rgba(11,31,42,0.88)', borderWidth: 1.5, borderColor: colors.turquesa, minHeight: 130 },
  dialogo:   { color: colors.cielo, fontSize: 16, lineHeight: 25, fontFamily: fonts.medium, textAlign: 'center' },
  resalte:   { color: colors.doradoNeon, fontWeight: '900', fontFamily: 'serif', textShadowColor: 'rgba(250,199,117,0.5)', textShadowRadius: 8 },
  tapHint:   { color: colors.turquesaSuave, fontSize: 12, fontStyle: 'italic', textAlign: 'center', marginTop: 14 },
});
