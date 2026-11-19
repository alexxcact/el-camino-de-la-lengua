import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { colors } from '../theme/colors';
import Glass from './Glass';
import PersonajeVivo from './PersonajeVivo';
import FiguraMini from './FiguraMini';
import { datosPersonaje, idPersonaje } from '../data/personajesUtil';

// Altura de la figura de pie junto al bocadillo.
const ALTO_FIGURA = 100;
// Relleno opaco del bocadillo (la colita se superpone al borde sin dobles transparencias).
const FONDO_GLOBO = '#0E2730';
const BORDE_GLOBO = 'rgba(250,199,117,0.55)';

/**
 * Personaje que acompaña de pie, al costado, con un bocadillo de cómic.
 * Props:
 *  personaje  id ('taita-rimay') o clave de asset ('taita_rimay'); default 'pishku'
 *  mensaje    texto del globo
 *  lado       'izq' | 'der' (dónde queda el personaje; la colita apunta hacia él)
 *  compacto   versión pequeña: busto sin animación junto al texto
 *  animo      (opcional) neutral | feliz | pensativo | sorprendido | travieso
 *  pulso      (opcional) número; al cambiar re-dispara el gesto del personaje
 */
export default function Acompanante({
  personaje = 'pishku', mensaje = '', lado = 'izq', compacto = false,
  animo = 'neutral', pulso = 0,
}) {
  const id = idPersonaje(personaje);
  const datos = datosPersonaje(id) || datosPersonaje('pishku');
  const nom = datos ? datos.nombre : '';
  const color = datos ? datos.color : colors.doradoBrillo;
  const fadeIn = useRef(new Animated.Value(0)).current;

  // El globo aparece suave cada vez que cambia el personaje o el mensaje.
  useEffect(() => {
    fadeIn.setValue(0);
    const anim = Animated.timing(fadeIn, { toValue: 1, duration: 400, useNativeDriver: true });
    anim.start();
    return () => anim.stop();
  }, [id, mensaje]);

  if (compacto) {
    return (
      <View style={s.compactWrap}>
        <FiguraMini personaje={id} ancho={44} alto={52} sombra={false} />
        <Glass tipo="claro" intensidad={55} style={s.compactGlass}>
          <Text style={[s.compactNom, { color }]}>{nom}</Text>
          <Text style={s.compactMsg}>{mensaje}</Text>
        </Glass>
      </View>
    );
  }

  const der = lado === 'der';

  return (
    <View style={[s.wrap, der && s.wrapDer]}>
      <PersonajeVivo
        key={id}
        personaje={id}
        animo={animo}
        pulso={pulso}
        tamano={ALTO_FIGURA}
        style={s.figura}
      />
      <Animated.View style={[s.bubbleWrap, der ? s.bubbleWrapDer : s.bubbleWrapIzq, { opacity: fadeIn }]}>
        <View style={s.bubble}>
          <Text style={s.nombre}>{nom}</Text>
          <Text style={s.mensaje} accessibilityLiveRegion="polite">{mensaje}</Text>
        </View>
        {/* Colita del bocadillo: borde + relleno, apuntando al personaje */}
        <View style={[s.colaBorde, der ? s.colaBordeDer : s.colaBordeIzq]} />
        <View style={[s.colaRelleno, der ? s.colaRellenoDer : s.colaRellenoIzq]} />
      </Animated.View>
    </View>
  );
}

const COLA_ABAJO = 18;

const s = StyleSheet.create({
  // Alineado abajo: el personaje se apoya en la fila; el globo queda a la altura del hombro.
  wrap:         { flexDirection: 'row', alignItems: 'flex-end', marginVertical: 6 },
  wrapDer:      { flexDirection: 'row-reverse' },
  // La caja de PersonajeVivo deja un margen para decoraciones; se recupera en parte.
  figura:       { marginHorizontal: -8 },

  bubbleWrap:   { flex: 1, marginBottom: 26 },
  bubbleWrapIzq:{ marginLeft: 12 },
  bubbleWrapDer:{ marginRight: 12 },
  bubble:       {
    paddingVertical: 10, paddingHorizontal: 13, borderRadius: 16,
    borderWidth: 1.5, borderColor: BORDE_GLOBO, backgroundColor: FONDO_GLOBO,
  },
  nombre:       { color: colors.doradoBrillo, fontSize: 11, fontWeight: '900', letterSpacing: 1, marginBottom: 3 },
  mensaje:      { color: colors.crema, fontSize: 13, lineHeight: 18, fontStyle: 'italic' },

  // Triángulos con bordes: el de borde asoma 1.5 px alrededor del de relleno.
  colaBorde:    {
    position: 'absolute', bottom: COLA_ABAJO, width: 0, height: 0,
    borderTopWidth: 9, borderBottomWidth: 9,
    borderTopColor: 'transparent', borderBottomColor: 'transparent',
  },
  colaBordeIzq: { left: -12, borderRightWidth: 13, borderRightColor: BORDE_GLOBO },
  colaBordeDer: { right: -12, borderLeftWidth: 13, borderLeftColor: BORDE_GLOBO },
  colaRelleno:  {
    position: 'absolute', bottom: COLA_ABAJO + 2, width: 0, height: 0,
    borderTopWidth: 7, borderBottomWidth: 7,
    borderTopColor: 'transparent', borderBottomColor: 'transparent',
  },
  colaRellenoIzq: { left: -8.5, borderRightWidth: 10.5, borderRightColor: FONDO_GLOBO },
  colaRellenoDer: { right: -8.5, borderLeftWidth: 10.5, borderLeftColor: FONDO_GLOBO },

  compactWrap:  { flexDirection: 'row', alignItems: 'flex-end', gap: 6, marginVertical: 6 },
  compactGlass: { flex: 1, padding: 8, borderRadius: 10 },
  compactNom:   { fontSize: 10, fontWeight: '900', letterSpacing: 1, marginBottom: 2 },
  compactMsg:   { fontSize: 11, color: colors.crema, fontStyle: 'italic', lineHeight: 15 },
});
