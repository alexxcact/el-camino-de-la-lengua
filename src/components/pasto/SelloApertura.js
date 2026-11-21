import React, { useEffect, useRef, useState } from 'react';
import { Animated, AccessibilityInfo, StyleSheet, useWindowDimensions } from 'react-native';
import Petroglifo from '../Petroglifo';

// Sello que aparece y se desvanece al abrir (o terminar) un juego: el
// petroglifo del juego o del mundo, grande y muy tenue, como si se estampara
// sobre la piedra. Dura poco más de un segundo, no bloquea toques y se omite
// si el teléfono tiene activado "reducir movimiento".
export default function SelloApertura({ simbolo, color = '#FAC775' }) {
  const { width: W } = useWindowDimensions();
  const op = useRef(new Animated.Value(0)).current;
  const escala = useRef(new Animated.Value(0.86)).current;
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let anim = null;
    let vivo = true;
    Promise.resolve(AccessibilityInfo?.isReduceMotionEnabled?.())
      .catch(() => false)
      .then((reducir) => {
        if (!vivo) return;
        if (reducir) { setVisible(false); return; }
        anim = Animated.parallel([
          Animated.sequence([
            Animated.timing(op, { toValue: 0.16, duration: 320, useNativeDriver: true }),
            Animated.delay(420),
            Animated.timing(op, { toValue: 0, duration: 700, useNativeDriver: true }),
          ]),
          Animated.timing(escala, { toValue: 1.04, duration: 1440, useNativeDriver: true }),
        ]);
        anim.start(({ finished }) => { if (finished && vivo) setVisible(false); });
      });
    return () => { vivo = false; anim?.stop(); };
  }, []);

  if (!visible || !simbolo) return null;
  return (
    <Animated.View
      pointerEvents="none"
      accessible={false}
      importantForAccessibility="no-hide-descendants"
      style={[s.capa, { opacity: op, transform: [{ scale: escala }] }]}
    >
      <Petroglifo id={simbolo} tamano={W * 0.62} color={color} />
    </Animated.View>
  );
}

const s = StyleSheet.create({
  capa: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center', zIndex: 20 },
});
