import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';
import Petroglifo from '../Petroglifo';

// Petroglifo tenue que aparece despacio en una esquina (p. ej. al abrir una
// palabra del diccionario). Solo decorativo: no recibe toques ni se lee.
export default function MarcaAgua({ id, tamano = 72, opacidad = 0.13, color = '#F4E6C8', style }) {
  const op = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const a = Animated.timing(op, { toValue: opacidad, duration: 500, useNativeDriver: true });
    a.start();
    return () => a.stop();
  }, [opacidad]);
  if (!id) return null;
  return (
    <Animated.View pointerEvents="none" accessible={false} importantForAccessibility="no-hide-descendants"
      style={[s.capa, style, { opacity: op }]}>
      <Petroglifo id={id} tamano={tamano} color={color} />
    </Animated.View>
  );
}

const s = StyleSheet.create({
  capa: { position: 'absolute', right: 6, bottom: 4 },
});
