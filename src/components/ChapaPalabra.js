import React, { useEffect, useRef, useState } from 'react';
import { Text, StyleSheet, Animated, AccessibilityInfo } from 'react-native';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { radii } from '../theme/ui';

// Chapa dorada "Pa · sol": aparece cada vez que cambia `clave` y se desvanece sola
// en 1.6 s. Solo Animated (opacity/translateY con useNativeDriver).
//
// Props:
//   palabra      texto en pastoker (palabra.p)
//   significado  significado en español (minúscula)
//   clave        cualquier valor; cada cambio vuelve a mostrar la chapa
const DURACION_TOTAL = 1600;
const ENTRA = 220;
const SALE = 380;

export default function ChapaPalabra({ palabra, significado, clave }) {
  // Hooks arriba, antes de cualquier return.
  const opacidad = useRef(new Animated.Value(0)).current;
  const desplaza = useRef(new Animated.Value(8)).current;
  const animRef = useRef(null);
  const reduceRef = useRef(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let cancelado = false;
    try {
      const pr = AccessibilityInfo.isReduceMotionEnabled();
      if (pr && typeof pr.then === 'function') {
        pr.then((rm) => { if (!cancelado) reduceRef.current = !!rm; }, () => {});
      }
    } catch (e) {
      // sin información de accesibilidad: animación normal
    }
    return () => { cancelado = true; };
  }, []);

  useEffect(() => {
    if (animRef.current) {
      animRef.current.stop();
      animRef.current = null;
    }
    if (clave === undefined || clave === null || !palabra) {
      opacidad.setValue(0);
      setVisible(false);
      return undefined;
    }

    const rm = reduceRef.current;
    opacidad.setValue(0);
    desplaza.setValue(rm ? 0 : 8);
    setVisible(true);

    const anim = Animated.sequence([
      Animated.parallel([
        Animated.timing(opacidad, { toValue: 1, duration: ENTRA, useNativeDriver: true }),
        Animated.timing(desplaza, { toValue: 0, duration: rm ? 1 : ENTRA, useNativeDriver: true }),
      ]),
      Animated.delay(DURACION_TOTAL - ENTRA - SALE),
      Animated.parallel([
        Animated.timing(opacidad, { toValue: 0, duration: SALE, useNativeDriver: true }),
        Animated.timing(desplaza, { toValue: rm ? 0 : -6, duration: rm ? 1 : SALE, useNativeDriver: true }),
      ]),
    ]);
    animRef.current = anim;
    anim.start(({ finished }) => {
      if (finished) {
        animRef.current = null;
        setVisible(false);
      }
    });

    return () => {
      anim.stop();
      if (animRef.current === anim) animRef.current = null;
    };
    // Solo `clave` dispara la chapa; palabra/significado viajan con ella.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clave]);

  if (!visible || !palabra) return null;

  return (
    <Animated.View
      pointerEvents="none"
      accessibilityLiveRegion="polite"
      accessibilityLabel={significado ? `${palabra}, ${significado}` : String(palabra)}
      style={[s.chapa, { opacity: opacidad, transform: [{ translateY: desplaza }] }]}
    >
      <Text style={s.palabra}>{palabra}</Text>
      {significado ? (
        <>
          <Text style={s.punto}>·</Text>
          <Text style={s.significado} numberOfLines={1}>{significado}</Text>
        </>
      ) : null}
    </Animated.View>
  );
}

const s = StyleSheet.create({
  chapa: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '92%',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: radii.pill,
    backgroundColor: colors.doradoNeon,
    borderWidth: 1.5,
    borderColor: colors.sol,
    shadowColor: colors.doradoNeon,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 6,
  },
  palabra: { color: colors.noche, fontFamily: 'Georgia', fontWeight: '900', fontSize: 16 },
  punto: { color: colors.textoCarta, fontSize: 16, fontFamily: fonts.bold, marginHorizontal: 6 },
  significado: { color: colors.textoCarta, fontSize: 14, fontFamily: fonts.semibold, flexShrink: 1 },
});
