import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { colors } from '../theme/colors';

const { width: W, height: H } = Dimensions.get('window');
const PALETA = [colors.doradoNeon, colors.turquesa, colors.verdeVivo, colors.coral, colors.turquesaSuave];

// Crea una partícula completa: su Animated.Value + sus datos visuales, JUNTOS.
const crearParticula = (mini) => ({
  prog:  new Animated.Value(0),
  left:  Math.random() * W,
  size:  (mini ? 6 : 8) + Math.random() * (mini ? 5 : 7),
  color: PALETA[Math.floor(Math.random() * PALETA.length)],
  delay: Math.random() * 250,
  drift: (Math.random() - 0.5) * 80,
  fall:  (mini ? H * 0.35 : H * 0.85) + Math.random() * 120,
  giro:  (Math.random() > 0.5 ? 1 : -1) * (360 + Math.random() * 360),
  redonda: Math.random() > 0.5,
});

/**
 * Lluvia de confeti para celebraciones. Sin dependencias externas.
 * Props:
 *  activo    bool  — al pasar a true dispara una ráfaga
 *  cantidad  número de partículas (default 26)
 *  mini      bool  — ráfaga corta y pequeña (aciertos de quiz)
 *  onDone    callback al terminar
 */
export default function Confeti({ activo, cantidad = 26, mini = false, onDone }) {
  const n = Math.max(1, mini ? Math.min(cantidad || 8, 8) : (cantidad || 26));
  const [visible, setVisible] = useState(false);

  // ÚNICA fuente de verdad: cada partícula incluye su propio Animated.Value.
  // Se regenera de forma atómica solo cuando cambia el tamaño/tipo, de modo que
  // el valor animado y sus datos NUNCA se desincronizan. Antes había dos arrays
  // (progresos por useRef + particulas por useMemo) que se desfasaban cuando `n`
  // cambiaba en una misma instancia (p.ej. al reconciliar el Confeti del duelo de
  // mini=8 a 32), dejando progresos[i] === undefined → crash en .interpolate.
  const ref = useRef({ n: null, mini: null, items: [] });
  if (ref.current.n !== n || ref.current.mini !== mini) {
    ref.current = { n, mini, items: Array.from({ length: n }, () => crearParticula(mini)) };
  }
  const particulas = ref.current.items;

  useEffect(() => {
    if (!activo) return;
    setVisible(true);
    const anims = particulas.map((pt) => {
      pt.prog.setValue(0);
      return Animated.timing(pt.prog, {
        toValue: 1,
        duration: mini ? 1300 : 1800,
        delay: pt.delay,
        useNativeDriver: true,
      });
    });
    const grupo = Animated.parallel(anims);
    grupo.start(({ finished }) => {
      if (finished) { setVisible(false); onDone?.(); }
    });
    return () => grupo.stop();
  }, [activo, n, mini]);

  if (!visible) return null;

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {particulas.map((pt, i) => {
        const translateY = pt.prog.interpolate({ inputRange: [0, 1], outputRange: [-20, pt.fall] });
        const translateX = pt.prog.interpolate({ inputRange: [0, 1], outputRange: [0, pt.drift] });
        const rotate     = pt.prog.interpolate({ inputRange: [0, 1], outputRange: ['0deg', `${pt.giro}deg`] });
        const opacity    = pt.prog.interpolate({ inputRange: [0, 0.7, 1], outputRange: [1, 1, 0] });
        return (
          <Animated.View
            key={i}
            style={{
              position: 'absolute',
              top: 0,
              left: pt.left,
              width: pt.size,
              height: pt.size,
              borderRadius: pt.redonda ? pt.size / 2 : 2,
              backgroundColor: pt.color,
              opacity,
              transform: [{ translateY }, { translateX }, { rotate }],
            }}
          />
        );
      })}
    </View>
  );
}
