import React, { useRef, useEffect, useState, useMemo } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { colors } from '../theme/colors';

const { width: W, height: H } = Dimensions.get('window');
const PALETA = [colors.doradoNeon, colors.turquesa, colors.verdeVivo, colors.coral, colors.turquesaSuave];

/**
 * Lluvia de confeti para celebraciones. Sin dependencias externas.
 * Props:
 *  activo    bool  — al pasar a true dispara una ráfaga
 *  cantidad  número de partículas (default 26)
 *  mini      bool  — ráfaga corta y pequeña (aciertos de quiz)
 *  onDone    callback al terminar
 */
export default function Confeti({ activo, cantidad = 26, mini = false, onDone }) {
  const n = mini ? Math.min(cantidad, 8) : cantidad;
  const [visible, setVisible] = useState(false);
  const progresos = useRef([...Array(n)].map(() => new Animated.Value(0))).current;

  const particulas = useMemo(
    () => [...Array(n)].map(() => ({
      left: Math.random() * W,
      size: (mini ? 6 : 8) + Math.random() * (mini ? 5 : 7),
      color: PALETA[Math.floor(Math.random() * PALETA.length)],
      delay: Math.random() * 250,
      drift: (Math.random() - 0.5) * 80,
      fall: (mini ? H * 0.35 : H * 0.85) + Math.random() * 120,
      giro: (Math.random() > 0.5 ? 1 : -1) * (360 + Math.random() * 360),
      redonda: Math.random() > 0.5,
    })),
    [n, mini]
  );

  useEffect(() => {
    if (!activo) return;
    setVisible(true);
    const anims = progresos.map((p, i) => {
      p.setValue(0);
      return Animated.timing(p, {
        toValue: 1,
        duration: mini ? 1300 : 1800,
        delay: particulas[i].delay,
        useNativeDriver: true,
      });
    });
    const grupo = Animated.parallel(anims);
    grupo.start(({ finished }) => {
      if (finished) { setVisible(false); onDone?.(); }
    });
    return () => grupo.stop();
  }, [activo]);

  if (!visible) return null;

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {particulas.map((pt, i) => {
        const p = progresos[i];
        const translateY = p.interpolate({ inputRange: [0, 1], outputRange: [-20, pt.fall] });
        const translateX = p.interpolate({ inputRange: [0, 1], outputRange: [0, pt.drift] });
        const rotate = p.interpolate({ inputRange: [0, 1], outputRange: ['0deg', `${pt.giro}deg`] });
        const opacity = p.interpolate({ inputRange: [0, 0.7, 1], outputRange: [1, 1, 0] });
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
