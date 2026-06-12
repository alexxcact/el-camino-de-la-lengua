import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';
import { sonar } from '../utils/sonidos';

/**
 * Botón con gradiente y efecto glow dorado.
 * Props:
 *  texto     string
 *  onPress   función
 *  variante  'primario' | 'secundario' | 'fantasma'  (default 'primario')
 *  icono     string (emoji opcional al inicio)
 *  tamano    'sm' | 'md' | 'lg'                      (default 'md')
 *  desactivado bool
 */
export default function BotonGlow({
  texto,
  onPress,
  variante = 'primario',
  icono,
  tamano = 'md',
  desactivado = false,
}) {
  const padding  = tamano === 'sm' ? 10 : tamano === 'lg' ? 18 : 14;
  const fontSize = tamano === 'sm' ? 13 : tamano === 'lg' ? 17 : 15;

  const press = () => { sonar.pop(); onPress && onPress(); };

  if (variante === 'fantasma') {
    return (
      <TouchableOpacity
        onPress={press}
        disabled={desactivado}
        style={[s.fantasma, { paddingVertical: padding }, desactivado && s.off]}
        activeOpacity={0.7}
      >
        {icono && <Text style={[s.icono, { fontSize: fontSize + 2 }]}>{icono}</Text>}
        <Text style={[s.txtFantasma, { fontSize }]}>{texto}</Text>
      </TouchableOpacity>
    );
  }

  const gradiente = variante === 'primario' ? colors.gradDorado : colors.gradHero;

  return (
    <TouchableOpacity
      onPress={press}
      disabled={desactivado}
      activeOpacity={0.85}
      style={[s.wrap, desactivado && s.off]}
    >
      <View style={s.glowOuter} />
      <LinearGradient
        colors={gradiente}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[s.boton, { paddingVertical: padding }]}
      >
        {icono && <Text style={[s.icono, { fontSize: fontSize + 2 }]}>{icono}</Text>}
        <Text style={[
          s.txt,
          { fontSize, color: variante === 'primario' ? colors.negro : colors.crema },
        ]}>
          {texto}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  wrap: { position: 'relative', borderRadius: 30 },
  glowOuter: {
    position: 'absolute',
    top: -2, left: -2, right: -2, bottom: -2,
    borderRadius: 32,
    backgroundColor: colors.doradoBrillo,
    opacity: 0.3,
  },
  boton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    borderRadius: 30,
    gap: 8,
    shadowColor: colors.doradoBrillo,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  fantasma: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    borderRadius: 30,
    gap: 8,
    borderWidth: 1.5,
    borderColor: colors.glassBorde,
    backgroundColor: colors.glassDorado,
  },
  icono:      { color: colors.negro },
  txt:        { fontWeight: '900', letterSpacing: 0.5 },
  txtFantasma:{ color: colors.dorado, fontWeight: '700', letterSpacing: 0.5 },
  off:        { opacity: 0.4 },
});
