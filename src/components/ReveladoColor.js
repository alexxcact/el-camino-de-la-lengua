import React, { useRef, useState, useEffect } from 'react';
import { View, Image, Animated, Easing, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

/**
 * Revelado gris→color con onda circular que crece desde el centro.
 * Sin librerías nuevas: imagen color dentro de un círculo (overflow hidden)
 * cuyo tamaño crece animando width/height (animación puntual de 1.2s).
 *
 * Props:
 *  imagenGris   require() de la versión gris
 *  imagenColor  require() de la versión a color
 *  revelado     bool — ya completado: muestra color directo
 *  animarAhora  bool — dispara la onda
 *  onMedio      callback al 60% de la onda (confeti/háptica)
 *  onFin        callback al terminar
 *  style        dimensiones del contenedor (debe definir width/height)
 */
export default function ReveladoColor({ imagenGris, imagenColor, revelado = false, animarAhora = false, onMedio, onFin, style }) {
  const [dim, setDim] = useState({ w: 0, h: 0 });
  const prog = useRef(new Animated.Value(revelado && !animarAhora ? 1 : 0)).current;
  const medioRef = useRef(false);

  const baseEsColor = revelado && !animarAhora;

  useEffect(() => {
    if (!animarAhora || dim.w === 0) return;
    medioRef.current = false;
    prog.setValue(0);
    const id = prog.addListener(({ value }) => {
      if (!medioRef.current && value >= 0.6) { medioRef.current = true; onMedio && onMedio(); }
    });
    const a = Animated.timing(prog, {
      toValue: 1, duration: 1200, easing: Easing.out(Easing.quad), useNativeDriver: false,
    });
    a.start(({ finished }) => { if (finished) onFin && onFin(); });
    return () => { prog.removeListener(id); a.stop(); };
  }, [animarAhora, dim.w]);

  const onLayout = (e) => {
    const { width, height } = e.nativeEvent.layout;
    if (width && height && (width !== dim.w || height !== dim.h)) setDim({ w: width, h: height });
  };

  if (baseEsColor) {
    return (
      <View style={[s.cont, style]}>
        <Image source={imagenColor} style={s.fill} resizeMode="cover" />
      </View>
    );
  }

  const { w, h } = dim;
  const D = Math.sqrt(w * w + h * h) * 1.06;
  const size = prog.interpolate({ inputRange: [0, 1], outputRange: [0, D] });
  const left = prog.interpolate({ inputRange: [0, 1], outputRange: [w / 2, w / 2 - D / 2] });
  const top  = prog.interpolate({ inputRange: [0, 1], outputRange: [h / 2, h / 2 - D / 2] });
  const imgL = prog.interpolate({ inputRange: [0, 1], outputRange: [-w / 2, (D - w) / 2] });
  const imgT = prog.interpolate({ inputRange: [0, 1], outputRange: [-h / 2, (D - h) / 2] });
  const radio = prog.interpolate({ inputRange: [0, 1], outputRange: [0, D / 2] });

  return (
    <View style={[s.cont, style]} onLayout={onLayout}>
      <Image source={imagenGris} style={s.fill} resizeMode="cover" />
      {w > 0 && (
        <Animated.View style={[s.onda, { width: size, height: size, left, top, borderRadius: radio }]}>
          <Animated.Image
            source={imagenColor}
            resizeMode="cover"
            style={{ position: 'absolute', width: w, height: h, left: imgL, top: imgT }}
          />
        </Animated.View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  cont: { overflow: 'hidden' },
  fill: { width: '100%', height: '100%' },
  onda: {
    position: 'absolute', overflow: 'hidden',
    borderWidth: 3, borderColor: colors.doradoNeon,
    shadowColor: colors.doradoNeon, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 12, elevation: 10,
  },
});
