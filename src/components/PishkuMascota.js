import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { useJuego } from '../context/JuegoContext';
import PersonajeVivo from './PersonajeVivo';
import { elegirLinea } from '../data/dialogos';
import { idPersonaje } from '../data/personajesUtil';

const frasesCon = (n) => [
  `¡Pío, ${n}! ¡Una palabra más viva!`,
  `¡Bien hecho, ${n}! ¡Lo lograste!`,
  `¡${n}, el territorio brilla otra vez!`,
  `¡Sigamos el camino, ${n}!`,
];

/**
 * Mascota que celebra los logros (por defecto el Ave mensajera).
 * Props:
 *  celebrando bool   — gesto feliz y muestra el globo (default true)
 *  mensaje    string — texto fijo del globo (si no, frase aleatoria)
 *  tamano     número — altura de la figura del personaje (default 96)
 *  personaje  string — id del personaje (default 'pishku')
 *  momento    string — si llega, el globo sale de elegirLinea({ personaje, momento, ctx })
 *  ctx        objeto — tokens para la línea ({nombre} se completa solo)
 */
export default function PishkuMascota({ celebrando = true, mensaje, tamano = 96, personaje = 'pishku', momento, ctx }) {
  const { estado } = useJuego();
  const id = idPersonaje(personaje);
  const nombre = estado.nombreJugador || 'Caminante';
  const [frase] = useState(() => {
    if (momento) {
      const linea = elegirLinea({ personaje: id, momento, ctx: { nombre, ...(ctx || {}) } });
      if (linea && linea.texto) return linea.texto;
    }
    if (mensaje) return mensaje;
    const fr = frasesCon(nombre);
    return fr[Math.floor(Math.random() * fr.length)];
  });

  return (
    <View style={s.wrap}>
      {celebrando && (
        <View style={s.bubble}>
          <Text style={s.bubbleTxt}>{frase}</Text>
          <View style={s.bubbleTail} />
        </View>
      )}
      <PersonajeVivo
        personaje={id}
        animo={celebrando ? 'feliz' : 'neutral'}
        tamano={tamano}
        style={{ marginTop: -Math.round(tamano * 0.06) }}
      />
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { alignItems: 'center' },
  bubble: {
    backgroundColor: colors.cielo,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 9,
    marginBottom: 8,
    maxWidth: 240,
    shadowColor: colors.doradoNeon,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 6,
  },
  bubbleTxt: { color: colors.noche, fontSize: 14, fontFamily: fonts.bold, textAlign: 'center' },
  bubbleTail: {
    position: 'absolute',
    bottom: -10, alignSelf: 'center',
    width: 0, height: 0,
    borderLeftWidth: 9, borderRightWidth: 9, borderTopWidth: 11,
    borderLeftColor: 'transparent', borderRightColor: 'transparent',
    borderTopColor: colors.cielo,
  },
});
