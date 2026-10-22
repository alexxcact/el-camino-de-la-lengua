import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { ui, radii } from '../theme/ui';
import PishkuMascota from './PishkuMascota';

// Tutorial de bienvenida que se muestra UNA vez sobre el Mapa (gated por
// estado.onboardingVisto). Explica el sendero, las misiones y el ciclo diario.
const pasosDe = (nombre) => [
  { t: `¡Hola, ${nombre}! Soy Pishku`, d: 'Te acompaño en este camino para descubrir las palabras del pueblo Pasto.' },
  { t: 'Tu sendero', d: 'Baja en el Mapa y toca un mundo para empezar a aprender sus palabras.' },
  { t: 'Las misiones', d: 'Cada mundo tiene 5 retos: quiz, parejas, dictado, escucha y memoria. Complétalos para encender el mundo.' },
  { t: 'Vuelve cada día', d: 'La Palabra de Hoy y el Reto del día hacen crecer tu racha. ¡Pequeños pasos, gran camino!' },
];

export default function Onboarding({ nombre, onTerminar }) {
  const pasos = pasosDe(nombre || 'Caminante');
  const [i, setI] = useState(0);
  const ultimo = i === pasos.length - 1;
  const paso = pasos[i];
  const siguiente = () => (ultimo ? onTerminar() : setI(i + 1));

  return (
    <View style={s.overlay} accessibilityViewIsModal>
      <View style={s.card}>
        <PishkuMascota tamano={96} />
        <Text style={s.titulo}>{paso.t}</Text>
        <Text style={s.desc}>{paso.d}</Text>

        <View style={s.dots}>
          {pasos.map((_, k) => <View key={k} style={[s.dot, k === i && s.dotOn]} />)}
        </View>

        <TouchableOpacity style={s.btn} onPress={siguiente} activeOpacity={0.85} accessibilityRole="button">
          <Text style={s.btnTxt}>{ultimo ? '¡A caminar!' : 'Siguiente'}</Text>
        </TouchableOpacity>

        {!ultimo && (
          <TouchableOpacity onPress={onTerminar} accessibilityRole="button" style={s.saltarBtn} hitSlop={{ top: 8, bottom: 8, left: 12, right: 12 }}>
            <Text style={s.saltar}>Saltar</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(7,18,24,0.94)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 26,
    zIndex: 50,
    elevation: 50,
  },
  card: {
    ...ui.cardDestacada,
    width: '100%',
    maxWidth: 420,
    alignItems: 'center',
    paddingVertical: 26,
    paddingHorizontal: 22,
    borderWidth: 2,
    borderColor: colors.doradoNeon,
  },
  titulo: { ...ui.h2, color: colors.doradoNeon, textAlign: 'center', marginTop: 10 },
  desc: { ...ui.body, color: colors.cielo, textAlign: 'center', marginTop: 10 },
  dots: { flexDirection: 'row', gap: 8, marginTop: 20 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(159,225,203,0.3)' },
  dotOn: { backgroundColor: colors.doradoNeon, width: 22 },
  btn: {
    marginTop: 22, alignSelf: 'stretch', alignItems: 'center',
    backgroundColor: colors.doradoNeon, borderRadius: radii.pill, paddingVertical: 14,
  },
  btnTxt: { color: colors.noche, fontSize: 16, fontFamily: fonts.extra, letterSpacing: 0.3 },
  saltarBtn: { marginTop: 12, paddingVertical: 4 },
  saltar: { color: colors.turquesaSuave, fontSize: 14, fontFamily: fonts.medium },
});
