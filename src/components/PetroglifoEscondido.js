import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { radii } from '../theme/ui';
import Petroglifo from './Petroglifo';
import { petroglifoDelLugar } from '../data/petroglifos';
import { useJuego } from '../context/JuegoContext';
import { sonar } from '../utils/sonidos';
import { vibrar } from '../utils/feedback';

const CREMA = '#F4E6C8';

// Petroglifo escondido en un lugar del juego ('mundo1'…'mundo5', 'juegos',
// 'mapa'). Se ve apenas, como tallado en la piedra; al tocarlo se enciende,
// queda en "La piedra de los petroglifos" (Progreso) y da puntos una vez.
export default function PetroglifoEscondido({ lugar, tamano = 56, style }) {
  const p = petroglifoDelLugar(lugar);
  const { estado, descubrirPetroglifo } = useJuego();
  const encontrado = !!p && (estado?.petroglifosEncontrados || []).includes(p.id);
  const brillo = useRef(new Animated.Value(encontrado ? 1 : 0)).current;
  const [aviso, setAviso] = useState(false);

  useEffect(() => {
    if (!aviso) return undefined;
    const t = setTimeout(() => setAviso(false), 2600);
    return () => clearTimeout(t);
  }, [aviso]);

  if (!p) return null;

  const tocar = () => {
    if (encontrado) return;
    descubrirPetroglifo(p.id);
    sonar.acierto();
    vibrar.exito();
    setAviso(true);
    brillo.setValue(0);
    Animated.spring(brillo, { toValue: 1, friction: 4, tension: 70, useNativeDriver: true }).start();
  };

  const escala = brillo.interpolate({ inputRange: [0, 0.5, 1], outputRange: [1, 1.35, 1] });

  return (
    <View style={[s.wrap, style]} pointerEvents="box-none">
      <TouchableOpacity
        onPress={tocar}
        disabled={encontrado}
        activeOpacity={0.7}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        accessibilityRole="button"
        accessibilityLabel={encontrado ? `Petroglifo encontrado: ${p.nombre}` : 'Algo está tallado en la piedra'}
      >
        <Animated.View style={{ transform: [{ scale: escala }] }}>
          <Petroglifo
            id={p.id}
            tamano={tamano}
            color={encontrado ? colors.doradoNeon : CREMA}
            opacity={encontrado ? (p.capas ? 1 : 0.85) : 0.22}
            enColor={encontrado}
          />
        </Animated.View>
      </TouchableOpacity>
      {aviso && (
        <View style={s.aviso} pointerEvents="none" accessibilityLiveRegion="polite">
          <Text style={s.avisoTit}>¡Encontraste un petroglifo!</Text>
          <Text style={s.avisoSub}>{p.nombre} · +5 puntos</Text>
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  wrap:     { alignItems: 'center' },
  aviso:    {
    // Alineado al borde derecho de la figura: casi siempre está en una esquina
    // derecha y así el aviso no se sale de la pantalla.
    position: 'absolute', top: '100%', right: 0, marginTop: 6, width: 220, paddingHorizontal: 12, paddingVertical: 8,
    borderRadius: radii.md, backgroundColor: 'rgba(8,26,34,0.94)', borderWidth: 1.5, borderColor: colors.doradoNeon, alignItems: 'center',
  },
  avisoTit: { color: colors.doradoNeon, fontSize: 13, fontFamily: fonts.extra },
  avisoSub: { color: colors.cielo, fontSize: 12, fontFamily: fonts.medium, marginTop: 1 },
});
